import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import EmailScreen from './ForgotPassWordScreens/EmailScreen';
import OtpScreen from './ForgotPassWordScreens/OtpScreen';
import NewPassWordScreen from './ForgotPassWordScreens/NewPassWordScreen';
import {logoImage} from '../../common/AllLiveImageLink';

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
        <Image
          source={{uri: logoImage}}
          style={{width: '70%', height: 50, alignSelf: 'center'}}
        />
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
});
