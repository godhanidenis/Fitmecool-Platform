import {StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Vendor/VendorDashboard/Home';
import ShopDetail from '../screens/Vendor/VendorDashboard/ShopDetail';
import Product from '../screens/Vendor/VendorDashboard/Product';
import SubscriptionTab from '../screens/Vendor/VendorDashboard/Subscription/SubscriptionTab';
import CustomVendorTabBar from './CustomVendorTabBar';

const VendorTab = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      tabBar={props => <CustomVendorTabBar {...props} />}
      initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIconName: 'home',
          tabBarLabel: 'Home',
          // unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        name="ShopDetail"
        component={ShopDetail}
        options={{
          headerShown: false,
          tabBarIconName: 'shopping-cart',
          tabBarLabel: 'Shop',
        }}
      />
      <Tab.Screen
        name="Product"
        component={Product}
        options={{
          headerShown: false,
          tabBarIconName: 'list-alt',
          tabBarLabel: 'Product',
        }}
      />
      <Tab.Screen
        name="SubscriptionTab"
        component={SubscriptionTab}
        options={{
          headerShown: false,
          tabBarIconName: 'archive',
          tabBarLabel: 'Subscription',
        }}
      />
    </Tab.Navigator>
  );
};

export default VendorTab;

const styles = StyleSheet.create({});
