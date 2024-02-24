import {
  Image,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BackGroundStyle, FontStyle} from '../../../CommonStyle';
import CustomButton from '../../common/CustomButton';
import CustomTextInput from '../../common/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useForm} from 'react-hook-form';
import {googleSignUp, signUp} from '../../graphql/mutations/authMutations';
import {loadUserProfileStart} from '../../redux/LoginUserProfileSlice/userSlice';
import {useDispatch} from 'react-redux';
import {useToast} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {facebookIcon, googleIcon} from '../../common/AllLiveImageLink';
import {NEXT_PUBLIC_GOOGLE_CLIENT_ID} from '@env';

GoogleSignin.configure({
  webClientId: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  showPlayServicesUpdateDialog: true, // Add this line to always show the dialog
});

const SignUp = () => {
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm();

  const onError = errors => console.log('Errors Occurred !! :', errors);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loginType, setLoginType] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordHide, setPasswordHide] = useState(true);
  const [confirmPasswordHide, setConfirmPasswordHide] = useState(true);

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('loginType');
      if (value !== null) {
        setLoginType(value);
      } else {
        console.log('Value not found in storage.');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const handleAfterSignUpResponse = async (userId, token, message) => {
    setLoading(false);
    dispatch(loadUserProfileStart());
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userId', userId);
    toast.show({
      title: message,
      placement: 'top',
      backgroundColor: 'green.600',
      variant: 'solid',
    });
    if (loginType === 'vendor') {
      setTimeout(() => {
        navigation.navigate('VendorMain');
      }, 1000);
    } else if (loginType === 'customer') {
      setTimeout(() => {
        navigation.navigate('CustomerMain');
      }, 1000);
    }
  };

  const handleAfterSignUpError = message => {
    setLoading(false);
    toast.show({
      title: message,
      placement: 'top',
      backgroundColor: 'red.600',
      variant: 'solid',
    });
  };

  const onSubmit = data => {
    setLoading(true);
    signUp(
      loginType === 'vendor'
        ? {
            first_name: data.first_name,
            last_name: data.last_name,
            user_contact: data.user_contact,
            user_password: data.user_password,
            user_type: 'vendor',
            user_email: data.user_email,
          }
        : {
            first_name: data.first_name,
            last_name: data.last_name,
            user_contact: data.user_contact,
            user_password: data.user_password,
            user_type: 'customer',
          },
    ).then(
      async res => {
        handleAfterSignUpResponse(
          res.data.signUp.user,
          res.data.signUp.token,
          res.data.signUp.message,
        );
      },
      error => {
        console.log('eeeee', error);
        handleAfterSignUpError(error.message);
      },
    );
  };

  useEffect(() => {
    retrieveData();
  }, []);

  const GoogleSignUPPress = async () => {
    GoogleSignin.signOut();

    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();

      googleSignUp({
        first_name: userInfo?.user?.name.split(' ')[0] || '',
        last_name: userInfo?.user?.name.split(' ')[1] || '',
        user_type: loginType === 'vendor' ? 'vendor' : 'customer',
        user_email: userInfo?.user?.email,
      }).then(
        res =>
          handleAfterSignUpResponse(
            res.data.googleSignUp.user,
            res.data.googleSignUp.token,
            res.data.googleSignUp.message,
          ),
        error => {
          console.log('eeeeeee', error);
          handleAfterSignUpError(error.message);
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{flex: 1, backgroundColor: BackGroundStyle, position: 'relative'}}>
      <View style={styles.headerMain}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.appNameText}>FitMeCool</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.main}>
        <Text style={styles.joinText}>
          Create an account As{' '}
          <Text style={{color: '#29977E'}}>
            {loginType === 'vendor' ? 'Seller' : 'Customer'}
          </Text>
        </Text>
        <View style={{marginBottom: 16, width: '100%'}}>
          <TouchableOpacity
            onPress={() => GoogleSignUPPress()}
            style={styles.socialBtnMain}>
            <Image source={{uri: googleIcon}} style={{width: 20, height: 20}} />
            <Text style={styles.socialText}>Continue to Google</Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '100%'}}>
          <TouchableOpacity style={styles.socialBtnMain}>
            <Image
              source={{uri: facebookIcon}}
              style={{width: 22, height: 22}}
            />
            <Text style={styles.socialText}>Continue to Facebook</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.orText}>OR</Text>

        <View style={{marginTop: 0}}>
          <CustomTextInput
            activeOutlineColor="#151827"
            label="First Name"
            mode="outlined"
            name="first_name"
            control={control}
            rules={{required: 'First Name is required *'}}
            outlineStyle={{borderRadius: 12}}
          />
          {errors?.first_name && (
            <Text style={{color: 'red', marginTop: 4}}>
              {errors.first_name.message}
            </Text>
          )}
        </View>
        <View style={{marginTop: 10}}>
          <CustomTextInput
            outlineStyle={{borderRadius: 12}}
            activeOutlineColor="#151827"
            label="Last Name"
            mode="outlined"
            name="last_name"
            control={control}
            rules={{required: 'Last Name is required *'}}
          />
          {errors?.last_name && (
            <Text style={{color: 'red', marginTop: 4}}>
              {errors.last_name.message}
            </Text>
          )}
        </View>
        <View style={{marginTop: 10}}>
          <CustomTextInput
            outlineStyle={{borderRadius: 12}}
            activeOutlineColor="#151827"
            label="Contact Number"
            mode="outlined"
            keyboardType="phone-pad"
            name="user_contact"
            control={control}
            rules={{
              required: 'Contact Number is required *',
              minLength: {
                value: 10,
                message: 'Contact Number must be 10 numbers',
              },
              maxLength: {
                value: 10,
                message: 'Contact Number must be 10 numbers',
              },
            }}
          />
          {errors?.user_contact && (
            <Text style={{color: 'red', marginTop: 4}}>
              {errors.user_contact.message}
            </Text>
          )}
        </View>
        {loginType === 'vendor' && (
          <View style={{marginTop: 10}}>
            <CustomTextInput
              outlineStyle={{borderRadius: 12}}
              activeOutlineColor="#151827"
              label="Email"
              mode="outlined"
              name="user_email"
              control={control}
              rules={{
                required: 'Email is required *',
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Please enter a valid email',
                },
              }}
            />
            {errors?.user_email && (
              <Text style={{color: 'red', marginTop: 4}}>
                {errors.user_email.message}
              </Text>
            )}
          </View>
        )}

        <View style={{marginTop: 10, position: 'relative'}}>
          <CustomTextInput
            outlineStyle={{borderRadius: 12}}
            activeOutlineColor="#151827"
            label="Password"
            mode="outlined"
            name="user_password"
            control={control}
            secureTextEntry={passwordHide}
            rules={{required: 'Password is required *'}}
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
          {errors?.user_password && (
            <Text style={{color: 'red', marginTop: 4}}>
              {errors.user_password.message}
            </Text>
          )}
        </View>
        <View style={{marginTop: 10, position: 'relative'}}>
          <CustomTextInput
            outlineStyle={{borderRadius: 12}}
            activeOutlineColor="#151827"
            label="Confirmed Password"
            mode="outlined"
            name="confirm_password"
            control={control}
            secureTextEntry={confirmPasswordHide}
            rules={{
              required: 'Confirmed Password is required *',
              validate: value => {
                const {user_password} = getValues();
                return user_password === value || 'Passwords do not match!';
              },
            }}
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
          {errors?.confirm_password && (
            <Text style={{color: 'red', marginTop: 4}}>
              {errors.confirm_password.message}
            </Text>
          )}
        </View>

        <View style={styles.buttonMainContainer}>
          <View style={{width: '100%'}}>
            <CustomButton
              name="Sign Up"
              color="#FFFFFF"
              backgroundColor="#151827"
              onPress={handleSubmit(onSubmit, onError)}
              loading={loading}
            />
          </View>
          <Text style={styles.bottomText}>
            Already have an account?
            <Text
              onPress={() => navigation.navigate('Login')}
              style={{color: '#151827', fontWeight: '600'}}>
              {' '}
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 20,
  },
  buttonMainContainer: {
    bottom: 0,
    width: '100%',
    paddingTop: 30,
  },

  joinText: {
    color: '#151827',
    fontFamily: FontStyle,
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '700',
    paddingVertical: 20,
  },
  childText: {
    color: 'rgba(21, 24, 39, 0.56)',
    fontFamily: FontStyle,
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginTop: 16,
    marginBottom: 20,
  },
  orText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FontStyle,
    color: '#31333E',
    marginVertical: 10,
  },
  bottomText: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 50,
    fontFamily: FontStyle,
    color: 'rgba(21, 24, 39, 0.56)',
    fontSize: 16,
    fontWeight: '400',
  },
  headerMain: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    margin: 20,
  },
  appNameText: {
    textTransform: 'uppercase',
    color: '#151827',
    fontFamily: FontStyle,
    fontSize: 25,
    fontStyle: 'normal',
    fontWeight: '700',
  },

  socialBtnMain: {
    backgroundColor: '#FAFCFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#151827',
    display: 'flex',
    gap: 10,
    flexDirection: 'row',
  },
  socialText: {
    paddingVertical: 9,
    color: '#151827',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontStyle,
  },
});
