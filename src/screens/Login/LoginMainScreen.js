import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {BackGroundStyle, FontStyle} from '../../../CommonStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../../common/CustomButton';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fitMeCoolBlackLogo,
  shop_vendorIcon,
} from '../../common/AllLiveImageLink';
import {capitalizeString} from '../../common/CapitalizeString';
import FastImage from 'react-native-fast-image';

const LoginMainScreen = () => {
  const [loginType, setLoginType] = useState('customer');
  const navigation = useNavigation();

  const LoginPageNavigate = async () => {
    try {
      await AsyncStorage.setItem('loginType', loginType);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: BackGroundStyle}}>
      <View style={styles.main}>
        <FastImage
          style={{width: '60%', height: '7%', alignSelf: 'center'}}
          source={{
            uri: fitMeCoolBlackLogo,
            // cache: FastImage.cacheControl.web,
          }}
          resizeMode="stretch"
        />
        <View style={{alignSelf: 'center', width: '90%'}}>
          <Text style={styles.joinText}>How you would like to join us ?</Text>
          <Text style={styles.childText}>
            Unlock Fashion Possibilities – Where Customers and Shop Owners
            Connect, on StyleSwap, Your Trusted Clothing Rental Platform!
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
            alignSelf: 'center',
          }}>
          <View
            style={[
              styles.customerMain,
              {
                borderColor:
                  loginType === 'customer'
                    ? '#29977E'
                    : 'rgba(21, 24, 39, 0.10)',
              },
            ]}>
            <TouchableOpacity onPress={() => setLoginType('customer')}>
              <View style={styles.icons}>
                <Icon
                  name="users"
                  size={20}
                  color={loginType === 'customer' ? '#29977E' : 'gray'}
                />
                {loginType === 'customer' && (
                  <Icon name="check-circle" size={25} color="#29977E" />
                )}
              </View>
              <View style={styles.bottomMain}>
                <Text style={styles.customerText}>Customer</Text>
                <Text style={styles.customerTextChild}>
                  Continue As a Customer
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.businessMain,
              {
                borderColor:
                  loginType === 'vendor' ? '#29977E' : 'rgba(21, 24, 39, 0.10)',
              },
            ]}>
            <TouchableOpacity onPress={() => setLoginType('vendor')}>
              <View style={styles.icons}>
                <Image
                  source={{uri: shop_vendorIcon}}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: loginType === 'vendor' ? '#29977E' : 'gray',
                  }}
                />
                {loginType === 'vendor' && (
                  <Icon name="check-circle" size={25} color="#29977E" />
                )}
              </View>
              <View style={styles.bottomMain}>
                <Text style={styles.customerText}>Seller</Text>
                <Text style={styles.customerTextChild}>
                  Continue As a Seller
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginTop: 65, alignSelf: 'center', width: '90%'}}>
          <View style={{marginBottom: 16, width: '100%'}}>
            <CustomButton
              name={capitalizeString(
                `Continue as ${
                  loginType === 'customer' ? 'Customer' : 'Seller'
                }`,
              )}
              color="#FFFFFF"
              backgroundColor="#151827"
              borderColor="#151827"
              onPress={() => LoginPageNavigate()}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginMainScreen;

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 20,
    justifyContent: 'center',
    display: 'flex',
    height: '100%',
  },
  joinText: {
    color: '#151827',
    fontFamily: FontStyle,
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '700',
    marginTop: 20,
  },
  childText: {
    color: 'rgba(21, 24, 39, 0.56)',
    fontFamily: FontStyle,
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginTop: 16,
    marginBottom: 40,
  },
  customerMain: {
    width: '47%',
    height: 104,
    borderWidth: 1,
    borderRadius: 16,
  },
  businessMain: {
    width: '47%',
    height: 104,
    borderWidth: 1,
    borderRadius: 16,
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 15,
  },
  customerText: {
    color: '#151827',
    fontSize: 14,
    fontFamily: FontStyle,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  customerTextChild: {
    color: 'rgba(21, 24, 39, 0.56)',
    fontSize: 10,
    fontFamily: FontStyle,
    fontStyle: 'normal',
    fontWeight: '500',
  },
  bottomMain: {
    marginLeft: 20,
    marginVertical: 15,
  },
});
