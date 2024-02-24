import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import ShopSetUp from './shopSetup/ShopSetUp';
import MainDashboard from './VendorDashboard/MainDashboard';
import {checkInternetConnectivity} from '../../config/CheckInternetConnectivity';
import NoInternetScreen from '../NoInternetScreen';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';
import {loadUserProfileStart} from '../../redux/LoginUserProfileSlice/userSlice';
import {loadImageVariantsStart} from '../../redux/ImageVariantsSlice/ImageVariantsSlice';

const VendorMain = () => {
  const dispatch = useDispatch();
  const checkInternetStatus = checkInternetConnectivity();
  const {userProfile} = useSelector(state => state?.user);

  useEffect(() => {
    dispatch(loadUserProfileStart());
  }, []);

  useEffect(() => {
    dispatch(loadImageVariantsStart());
  }, [userProfile]);

  return checkInternetStatus ? (
    userProfile?.userHaveAnyShop ? (
      <MainDashboard />
    ) : userProfile?.userHaveAnyShop === undefined ? (
      <View style={styles.activityStyle}>
        <ActivityIndicator color="#29977E" />
      </View>
    ) : (
      <ShopSetUp />
    )
  ) : (
    <NoInternetScreen />
  );
};

export default VendorMain;

const styles = StyleSheet.create({
  activityStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
