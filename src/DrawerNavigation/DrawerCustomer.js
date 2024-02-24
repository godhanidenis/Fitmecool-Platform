import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import CustomerTab from '../TabNavigation/CustomerTab';
import SideBarContent from '../common/Customer/SideBarContent';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userLogout} from '../redux/LoginUserProfileSlice/userSlice';
import {useDispatch} from 'react-redux';
import {useToast} from 'native-base';

const DrawerCustomer = ({loginToken}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();

  const Drawer = createDrawerNavigator();

  const isFocused = useIsFocused();
  const [AccessToken, setAccessToken] = useState('');

  const retrieveLocalData = async () => {
    const Token = await AsyncStorage.getItem('token');
    if (Token) {
      setAccessToken(Token);
    } else {
      setAccessToken('');
    }
  };

  const LogOut = async () => {
    AsyncStorage.clear();
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

  useEffect(() => {
    retrieveLocalData();
  }, [isFocused]);

  const CustomDrawerContent = props => {
    return (
      <View style={{height: '100%', position: 'relative'}}>
        <DrawerContentScrollView {...props}>
          <SideBarContent
            AccessToken={AccessToken}
            setAccessToken={setAccessToken}
          />
          {/* <DrawerItemList {...props} /> */}
        </DrawerContentScrollView>
        {AccessToken && (
          <TouchableOpacity onPress={() => LogOut()} style={styles.logoutMain}>
            <Icon name="power-off" size={20} color="#151827" />
            <Text style={styles.wishText}>logout</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
      <Drawer.Screen
        name="Dashboard"
        component={CustomerTab}
        options={{
          headerShown: false,
        }}
        initialParams={{loginToken: loginToken}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerCustomer;

const styles = StyleSheet.create({
  logoutMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 15,
    bottom: 0,
    position: 'absolute',
    borderTopWidth: 1,
    width: '100%',
  },
  wishText: {
    color: '#151827',
    fontWeight: '400',
    fontSize: 18,
  },
});
