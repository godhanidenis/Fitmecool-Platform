import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import CustomButton from '../../../common/CustomButton';
import CustomTextInput from '../../../common/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import Icon from 'react-native-vector-icons/FontAwesome';

const NewPassWordScreen = ({setActiveScreen}) => {
  const navigation = useNavigation();
  const {
    control: newPassWordControl,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm();

  const [passwordHide, setPasswordHide] = useState(true);
  const [confirmPasswordHide, setConfirmPasswordHide] = useState(true);

  const onSubmit = data => {
    console.log('pppppppp', data);
    if (data) {
      navigation.navigate('Login');
    }
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.forgotText}>Update Password</Text>
        <Text style={styles.desOneText}>Update Your New Password</Text>
        <View style={{width: '100%', marginVertical: 0, position: 'relative'}}>
          <CustomTextInput
            control={newPassWordControl}
            label={'New PassWord'}
            mode="outlined"
            name="password"
            rules={{
              required: 'Password is required *',
            }}
            secureTextEntry={passwordHide}
            activeOutlineColor="#151827"
            outlineStyle={{borderRadius: 12}}
          />
          <TouchableOpacity
            onPress={() => setPasswordHide(!passwordHide)}
            style={{position: 'absolute', right: 18, top: 20, zIndex: 1}}>
            <Icon
              name={passwordHide ? 'eye-slash' : 'eye'}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
          {errors?.password && (
            <Text style={{color: 'red', marginTop: 4}}>
              {errors.password.message}
            </Text>
          )}
        </View>
        <View style={{width: '100%', marginVertical: 20, position: 'relative'}}>
          <CustomTextInput
            control={newPassWordControl}
            label={'Confirm PassWord'}
            mode="outlined"
            name="confirmPassword"
            rules={{
              required: 'Confirmed Password is required *',
              validate: value => {
                const {password} = getValues();
                return password === value || 'Passwords do not match!';
              },
            }}
            secureTextEntry={confirmPasswordHide}
            activeOutlineColor="#151827"
            outlineStyle={{borderRadius: 12}}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordHide(!confirmPasswordHide)}
            style={{position: 'absolute', right: 18, top: 20, zIndex: 1}}>
            <Icon
              name={confirmPasswordHide ? 'eye-slash' : 'eye'}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
          {errors?.confirmPassword && (
            <Text style={{color: 'red', marginTop: 4}}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>
        <View style={{width: '100%', marginBottom: 15}}>
          <CustomButton
            name="Update"
            color="#FFFFFF"
            backgroundColor="#151827"
            onPress={handleSubmit(onSubmit)}
            //   loading={loading}
          />
        </View>
      </View>
    </View>
  );
};

export default NewPassWordScreen;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  cardContainer: {
    backgroundColor: 'white',
    width: '90%',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    elevation: 5,
    borderRadius: 10,
  },
  appName: {
    color: 'black',
    fontSize: 28,
    fontWeight: '400',
    paddingBottom: 10,
  },
  forgotText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '600',
    paddingBottom: 10,
  },
  desOneText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    paddingBottom: 10,
    textAlign: 'center',
  },
});
