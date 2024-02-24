import {StyleSheet} from 'react-native';
import React from 'react';
import 'react-native-gesture-handler';
import AppNavigator from './AppNavigator';
import {NativeBaseProvider, ToastProvider} from 'native-base';

const App = () => {
  return (
    <>
      <NativeBaseProvider>
        <ToastProvider>
          <AppNavigator />
        </ToastProvider>
      </NativeBaseProvider>
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
