import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  userLogout,
} from '../redux/LoginUserProfileSlice/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useToast} from 'native-base';
import {Divider} from 'react-native-paper';
import {Avatar} from 'react-native-paper';
import {whiteLogoSmall} from '../common/AllLiveImageLink';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FastImage from 'react-native-fast-image';

const VendorHeader = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const useProfileData = useSelector(state => state?.user.userProfile);
  const {vendorShopDetails} = useSelector(state => state?.shopDetail);
  const [isLogoutTooltipVisible, setLogoutTooltipVisible] = useState(false);

  const logoName = `${useProfileData?.first_name
    ?.charAt(0)
    .toUpperCase()}${useProfileData?.last_name?.charAt(0)?.toUpperCase()}`;

  const clearGoogleSignInCaches = async () => {
    await GoogleSignin.signOut();
  };

  const LogOut = async () => {
    clearGoogleSignInCaches();
    AsyncStorage.clear();
    setLogoutTooltipVisible(false);
    dispatch(userLogout());

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

  const switchLoginType = async () => {
      await AsyncStorage.setItem('loginType', 'customer');
      navigation.navigate('Splash');
      setLogoutTooltipVisible(false);
  }

  return (
    <View style={styles.mainDiv}>
      <View style={styles.innerMain}>
        <View style={styles.leftMainDiv}>
          {useProfileData?.userCreatedShopId &&
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Icon name="bars" size={22} color="white" />
                          </TouchableOpacity>}
          <FastImage
            style={{width: 80, height: 50, alignSelf: 'center'}}
            source={{
              uri: whiteLogoSmall,
              // cache: FastImage.cacheControl.web,
            }}
            resizeMode="stretch"
          />
        </View>
        {useProfileData?.userCreatedShopId && vendorShopDetails && (
          <Text style={styles.centerText}>
            Available Product :{' '}
            {vendorShopDetails?.productLimit -
              vendorShopDetails?.balanceProduct || 0}
          </Text>
        )}
        <View>
          <TouchableOpacity
            onPress={() => setLogoutTooltipVisible(!isLogoutTooltipVisible)}>
            <Avatar.Text size={50} label={logoName} backgroundColor="#29977E" />
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
                      size={40}
                      label={logoName}
                      backgroundColor="#29977E"
                    />
                  </View>
                  <Text style={[styles.fullName]}>
                    {useProfileData?.first_name} {useProfileData?.last_name}
                  </Text>
                <Text
                  onPress={() => switchLoginType()}
                  style={[styles.switchText, {paddingHorizontal: 25}]}>
                  Switch To Customer
                </Text>
                  <Text
                    onPress={() => LogOut()}
                    style={[styles.logoutText, {paddingHorizontal: 25}]}>
                    <Icon name="power-off" size={14} color="#fff" size={18} /> {''}
                    Logout
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default VendorHeader;

const styles = StyleSheet.create({
  mainDiv: {
    backgroundColor: '#151827',
    width: '100%',
    paddingVertical: 10,
    justifyContent: 'center',
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
    marginHorizontal: 26,
  },
  leftText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  centerText: {
    color: '#f6c915',
    fontSize: 15,
    fontWeight: '500',
  },
  fullName: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 10,
    borderBottomColor: 'light-grey',
    borderBottomWidth: 0.5,
  },
  switchText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
      paddingVertical: 10,
      backgroundColor:'red',
      borderRadius:6,
      marginVertical:8,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 10,
    backgroundColor:'#29977E',
    borderRadius:6,
    marginVertical:10,
  },
  modelLogoutMain: {
    width: '60%',
    position: 'absolute',
    top: 70,
    right:5,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 2,
    alignItems: 'center',
  },
});
