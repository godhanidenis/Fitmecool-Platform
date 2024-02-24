import {StyleSheet, Image, View, LogBox} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {whiteLogoSmall} from '../common/AllLiveImageLink';
import DeviceInfo from 'react-native-device-info';
import {getAppVersionLists} from '../graphql/queries/appVersionQueries';
import {useDispatch, useSelector} from 'react-redux';
import {appVersionAction} from '../redux/AppVersionSlice/AppVersionSlice';
import {checkInternetConnectivity} from '../config/CheckInternetConnectivity';
import NoInternetScreen from './NoInternetScreen';
import {changeAppliedCityFilters} from '../redux/CityFilterSlice/CityFilterSlice';
import {loadAreaListsStart} from '../redux/AreaSlice/AreaListSlice';
import {loadAllShopsListsStart} from '../redux/ShopSlice/ShopSlice';
import {loadCategoriesStart} from '../redux/CategorySlice/CategoryListSlice';
import {loadCityListsStart} from '../redux/CityListSlice/CityListSlice';

const Splash = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const currVersion = DeviceInfo.getVersion();
  const [netWarningShow, setNetWarningShow] = useState(false);

  const isConnected = checkInternetConnectivity();

  const {appliedCityFilter} = useSelector(state => state.cityFiltersReducer);

  const AreaListApiCall = async () => {
    const storedLocation = await AsyncStorage.getItem('selected_city');
    if (storedLocation) {
      if (storedLocation !== appliedCityFilter?.city?.selectedValue) {
        dispatch(
          changeAppliedCityFilters({
            key: 'city',
            value: {
              selectedValue: storedLocation,
            },
          }),
        );
      }
      dispatch(loadAreaListsStart(storedLocation));
    } else {
      dispatch(loadAreaListsStart());
    }
  };

  useEffect(() => {
    dispatch(
      loadAllShopsListsStart({city: appliedCityFilter?.city?.selectedValue}),
    );
  }, [appliedCityFilter?.city?.selectedValue, dispatch]);

  useEffect(() => {
    AreaListApiCall();
  }, [appliedCityFilter?.city?.selectedValue, dispatch]);

  useEffect(() => {
    dispatch(loadCategoriesStart());
    dispatch(loadCityListsStart());
  }, [dispatch]);

  const retrieveLocalData = async () => {
    if (isConnected) {
      const dataQuery = await getAppVersionLists();
      const data = dataQuery?.data?.appVersionList[0];
      const loginType = await AsyncStorage.getItem('loginType');
      const Token = await AsyncStorage.getItem('token');
      setNetWarningShow(false);
      if (loginType === 'vendor' && Token) {
        setTimeout(() => {
          if (currVersion !== data?.version) {
            dispatch(appVersionAction({...data, versionModelVisible: true}));
            navigation.navigate('VendorMain');
          } else {
            dispatch(appVersionAction({...data, versionModelVisible: false}));
            navigation.navigate('VendorMain');
          }
        }, 1000);
      } else {
        setTimeout(() => {
          const loginAccessToken = {
            key: Token,
          };
          if (currVersion !== data?.version) {
            dispatch(appVersionAction({...data, versionModelVisible: true}));
            navigation.navigate('CustomerMain', {data: loginAccessToken});
          } else {
            dispatch(appVersionAction({...data, versionModelVisible: false}));
            navigation.navigate('CustomerMain', {data: loginAccessToken});
          }
        }, 1500);
      }
    } else {
      setTimeout(() => {
        setNetWarningShow(true);
      }, 1500);
    }
  };

  useEffect(() => {
    LogBox.ignoreLogs([
      'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
    ]);
  }, []);

  useEffect(() => {
    retrieveLocalData();
  }, [isConnected, isFocused]);

  // useEffect(() => {
  //   updateVersionData(currVersion);
  // }, []);

  return netWarningShow ? (
    <NoInternetScreen />
  ) : (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#151827',
      }}>
      <View style={{padding: 20}}>
        <Image
          source={{
            uri: whiteLogoSmall,
          }}
          width={210}
          height={160}
        />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
