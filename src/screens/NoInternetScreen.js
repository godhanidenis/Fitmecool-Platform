import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import CustomButton from '../common/CustomButton';

const NoInternetScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Image
        source={require('../images/noNetImg.jpg')}
        style={{width: 200, height: 200}}
      />
      <Text style={styles.intText}>OOPS !</Text>
      <Text style={styles.intText}>NO INTERNET</Text>
      <Text style={styles.intPlzText}>
        Please check your network connection
      </Text>
      <View style={{width: '50%', marginTop: 25}}>
        <CustomButton
          name="TRY AGAIN"
          color="#FFFFFF"
          backgroundColor="#151827"
          borderColor="#151827"
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  intText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 22,
    paddingVertical: 5,
  },
  intPlzText: {
    color: 'black',
    fontWeight: '400',
    fontSize: 18,
    paddingVertical: 5,
  },
});
