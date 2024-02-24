import {StyleSheet, Text, View, Image, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  loadUserProfileStart,
  userLogout,
} from '../redux/LoginUserProfileSlice/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useToast} from 'native-base';
import {Dropdown} from 'react-native-element-dropdown';
import {Divider} from 'react-native-paper';
import {TouchableWithoutFeedback} from 'react-native';
import {Avatar} from 'react-native-paper';
import {locationIcon, whiteLogoSmall} from '../common/AllLiveImageLink';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {changeAppliedShopsFilters} from '../redux/ShopFilter/ShopFilterSlice';
import {changeAppliedCityFilters} from '../redux/CityFilterSlice/CityFilterSlice';
import {
  changeShopCurrentPage,
  changeShopDataLimit,
} from '../redux/ShopSlice/ShopSlice';
import {
  changeProductCurrentPage,
  changeProductDataLimit,
} from '../redux/ProductSlice/ProductSlice';
import FastImage from 'react-native-fast-image';

const CustomerHeader = ({homeScreen}) => {
  const toast = useToast();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {userProfile} = useSelector(state => state?.user);

  const {cityLists} = useSelector(state => state.cityLists);

  const [isLogoutTooltipVisible, setLogoutTooltipVisible] = useState(false);
  const [AccessToken, setAccessToken] = useState('');

  const logoName = `${userProfile?.first_name
    ?.charAt(0)
    .toUpperCase()}${userProfile?.last_name?.charAt(0).toUpperCase()}`;

  const clearGoogleSignInCaches = async () => {
    await GoogleSignin.signOut();
  };

  const LogOut = async () => {
    clearGoogleSignInCaches();
    AsyncStorage.clear();
    setLogoutTooltipVisible(false);
    dispatch(userLogout());
    setAccessToken('');
    toast.show({
      title: 'Logout Successfully ! ',
      placement: 'top',
      backgroundColor: 'green.600',
      variant: 'solid',
    });
    setTimeout(() => {
      navigation.navigate('Splash');
    }, 1000);
  };

  const retrieveLocalData = async () => {
    const Token = await AsyncStorage.getItem('token');
    setAccessToken(Token);
  };

  useEffect(() => {
    retrieveLocalData();
  }, [isFocused]);

  const CallUserProfile = async () => {
    (await AsyncStorage.getItem('userId')) && dispatch(loadUserProfileStart());
  };

  useEffect(() => {
    CallUserProfile();
  }, [isFocused]);

  const [selectedLocation, setSelectedLocation] = useState('');

  const {appliedCityFilter} = useSelector(state => state.cityFiltersReducer);
  useEffect(() => {
    appliedCityFilter &&
      setSelectedLocation(appliedCityFilter.city.selectedValue);
  }, [appliedCityFilter]);

  const renderLocationLabel = () => {
    return (
      <Text style={[styles.label]}>
        <Image
          source={{uri: locationIcon}}
          style={{width: 12, height: 12, tintColor: 'white'}}
        />{' '}
        Location
      </Text>
    );
  };

  const onChangeSelectedCity = async city => {
    console.log('city', city);
    await AsyncStorage.setItem('selected_city', city);
    setSelectedLocation(city);

    dispatch(changeShopCurrentPage(0));
    dispatch(changeShopDataLimit(0));

    dispatch(changeProductCurrentPage(0));
    dispatch(changeProductDataLimit(0));

    dispatch(
      changeAppliedShopsFilters({
        key: 'locations',
        value: {selectedValue: []},
      }),
    );

    if (city === 'All City') {
      AsyncStorage.removeItem('selected_city');
    }

    dispatch(
      changeAppliedCityFilters({
        key: 'city',
        value: {
          selectedValue: city === 'All City' ? '' : city,
        },
      }),
    );
  };

  return (
    <View style={homeScreen ? styles.mainDiv : styles.mainDivOther}>
      <View style={styles.innerMain}>
        <View style={styles.leftMainDiv}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name="bars" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('LandingPage')}>
            <FastImage
              style={{width: 80, height: 50, alignSelf: 'center'}}
              source={{
                uri: whiteLogoSmall,
                // cache: FastImage.cacheControl.web,
              }}
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {renderLocationLabel()}
          <Dropdown
            itemTextStyle={{color: '#151827'}}
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            labelField="city"
            valueField="city"
            data={cityLists}
            search
            placeholder={'Select item'}
            searchPlaceholder="Search..."
            value={selectedLocation === '' ? 'All City' : selectedLocation}
            onChange={item => {
              onChangeSelectedCity(item.city);
            }}
          />
        </View>
        {AccessToken ? (
          <View>
            <TouchableOpacity
              onPress={() => setLogoutTooltipVisible(!isLogoutTooltipVisible)}>
              <Avatar.Text
                size={35}
                label={logoName}
                backgroundColor="#29977E"
              />
            </TouchableOpacity>
            <Modal
              transparent={true}
              visible={isLogoutTooltipVisible}
              animationType="fade"
              onRequestClose={() => setLogoutTooltipVisible(false)}>
              <TouchableWithoutFeedback
                onPress={() => setLogoutTooltipVisible(false)}>
                <View style={{flex: 1, position: 'relative'}}>
                  <View style={styles.modelLogoutMain}>
                    <View
                      style={{
                        marginTop: 15,
                      }}>
                      <Avatar.Text
                        size={35}
                        label={logoName}
                        backgroundColor="#29977E"
                      />
                    </View>
                    <Text style={[styles.logoutText]}>
                      {userProfile?.first_name} {userProfile?.last_name}
                    </Text>
                    <Divider bold={true} />
                    <Text
                      onPress={() => LogOut()}
                      style={[styles.logoutText, {paddingHorizontal: 25}]}>
                      <Icon name="power-off" size={14} color="#151827" /> {''}
                      Logout
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginMainScreen')}>
            <Icon name="user-plus" size={22} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomerHeader;

const styles = StyleSheet.create({
  mainDiv: {
    backgroundColor: '#151827',
    width: '100%',
    paddingVertical: 10,
    position: 'relative',
  },
  mainDivOther: {
    backgroundColor: '#151827',
    width: '100%',
    paddingVertical: 10,
    position: 'relative',
  },
  leftMainDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  innerMain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  leftText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  modelLogoutMain: {
    width: '35%',
    position: 'absolute',
    top: 52,
    right: 5,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  locationMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },

  container: {
    position: 'relative',
  },
  dropdown: {
    height: 45,
    width: 150,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    paddingHorizontal: 8,
  },

  label: {
    position: 'absolute',
    top: 0,
    paddingHorizontal: 8,
    fontSize: 14,
    color: 'white',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
    paddingTop: 15,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
    paddingTop: 15,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
});
