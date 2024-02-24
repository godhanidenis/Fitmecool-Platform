import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './src/screens/Splash';
import LoginMainScreen from './src/screens/Login/LoginMainScreen';
import Login from './src/screens/Login/Login';
import SignUp from './src/screens/Login/SignUp';
import VendorMain from './src/screens/Vendor/VendorMain';
import MainDashboard from './src/screens/Vendor/VendorDashboard/MainDashboard';
import AddEditProduct from './src/screens/Vendor/VendorDashboard/AddEditProduct/AddEditProduct';
import HomePage from './src/screens/Customer/HomePage';
import CustomerMain from './src/screens/Customer/CustomerMain';
import ProductDetail from './src/screens/Customer/pages/ProductDetail';
import ShopIndividual from './src/screens/Customer/pages/ShopIndividual/ShopIndividual';
import ShopReviewAll from './src/screens/Customer/pages/ShopIndividual/ShopReviewAll';
import Branches from './src/screens/Customer/pages/ShopIndividual/Branches';
import WriteReview from './src/screens/Customer/pages/ShopIndividual/WriteReview';
import FilterScreen from './src/screens/FilterScreen/FilterScreen';
import LandingPage from './src/screens/LandingPage/LandingPage';
import ForgotPassword from './src/screens/Login/ForgotPassword';

const AppNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CustomerMain"
          component={CustomerMain}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="CustomerHomePage"
          component={HomePage}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="LoginMainScreen"
          component={LoginMainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VendorMain"
          component={VendorMain}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainDashboard"
          component={MainDashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VendorAddEditProduct"
          component={AddEditProduct}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ShopIndividual"
          component={ShopIndividual}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ShopReviewAll"
          component={ShopReviewAll}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Branches"
          component={Branches}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WriteReview"
          component={WriteReview}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
