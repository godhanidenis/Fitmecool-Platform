import {StyleSheet, View} from 'react-native';
import React from 'react';
import DrawerCustomer from '../../DrawerNavigation/DrawerCustomer';
import {checkInternetConnectivity} from '../../config/CheckInternetConnectivity';
import NoInternetScreen from '../NoInternetScreen';
import {useRoute} from '@react-navigation/native';

const CustomerMain = () => {
  const route = useRoute();
  const loginToken = route?.params?.data?.key;

  const checkInternetStatus = checkInternetConnectivity();

  return checkInternetStatus ? (
    <View style={{flex: 1}}>
      <DrawerCustomer loginToken={!!loginToken} />
      {/* <CustomerTab /> */}
    </View>
  ) : (
    <NoInternetScreen />
  );
};

export default CustomerMain;

const styles = StyleSheet.create({});
