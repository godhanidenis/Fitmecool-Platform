import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import EmailScreen from './ForgotPassWordScreens/EmailScreen';
import OtpScreen from './ForgotPassWordScreens/OtpScreen';
import NewPassWordScreen from './ForgotPassWordScreens/NewPassWordScreen';
import {FontStyle} from '../../../CommonStyle';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [activeScreen, setActiveScreen] = useState(1);

  return (
    <View style={{flex: 1, backgroundColor: '#151827'}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.goBackIcon}>
        <Icon name="angle-left" color={'white'} size={30} />
      </TouchableOpacity>
      <ScrollView>
      <View style={{alignSelf:'center'}}><Text style={styles.appName}>FitMeCool</Text></View>

        {activeScreen === 1 && (
          <EmailScreen setActiveScreen={setActiveScreen} />
        )}
        {activeScreen === 2 && <OtpScreen setActiveScreen={setActiveScreen} />}
        {activeScreen === 3 && (
          <NewPassWordScreen setActiveScreen={setActiveScreen} />
        )}
      </ScrollView>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  goBackIcon: {
    padding: 20,
  },
  appName:{
  width: '100%',
  fontSize: 36,
  fontWeight: '700',
  fontFamily: FontStyle,
  color:'white'
  }
});
