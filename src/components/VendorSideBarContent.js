import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Divider} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {Avatar} from 'react-native-paper';
import {FontStyle} from '../../CommonStyle';
import FastImage from 'react-native-fast-image';

const VendorSideBarContent = ({vendorShopDetails}) => {
  const navigation = useNavigation();
  const {userProfile} = useSelector(state => state?.user);
  const logoName = `${userProfile?.first_name
    ?.charAt(0)
    .toUpperCase()}${userProfile?.last_name?.charAt(0)?.toUpperCase()}`;

  return (
    <View style={styles.sideMainContainer}>
      <View style={styles.authUserMain}>
        <Avatar.Text size={55} label={logoName} backgroundColor="#29977E" />
        <View>
          <Text style={styles.userNameText} numberOfLines={1}>
            {userProfile?.first_name} {userProfile?.last_name}
          </Text>
          <Text style={styles.userEmailText} numberOfLines={1}>
            {userProfile?.user_email || 'Undefined..'}
          </Text>
        </View>
      </View>
      <Divider bold={true} />
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.drawerHeader}>
        {vendorShopDetails?.shop_logo?.medium ? (
          <FastImage
            style={styles.logo}
            source={{
              uri: vendorShopDetails?.shop_logo?.medium,
              cache: FastImage.cacheControl.web,
            }}
            resizeMode="cover"
          />
        ) : (
          <Avatar.Text
            size={120}
            label={vendorShopDetails?.shop_name?.charAt(0)?.toUpperCase()}
            backgroundColor="#29977E"
          />
        )}
        <Text style={styles.heading}>{vendorShopDetails?.shop_name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VendorSideBarContent;

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    padding: 16,
    marginTop: 50,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  heading: {
    color: '#151827',
    fontWeight: '700',
    fontSize: 22,
    fontFamily: FontStyle,
    textAlign: 'center',
    paddingTop: 25,
    textTransform: 'capitalize',
  },
  sideMainContainer: {},
  authUserMain: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  userNameText: {
    fontSize: 18,
    color: '#151827',
    fontWeight: '600',
    width: '75%',
  },
  userEmailText: {
    fontSize: 16,
    color: '#151827',
    fontWeight: '400',
    width: '60%',
  },
});
