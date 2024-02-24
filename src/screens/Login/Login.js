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
import {googleSignIn, signIn} from '../../graphql/mutations/authMutations';
import {useDispatch} from 'react-redux';
import {loadUserProfileStart} from '../../redux/LoginUserProfileSlice/userSlice';
import {useToast} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {facebookIcon, googleIcon} from '../../common/AllLiveImageLink';
import {NEXT_PUBLIC_GOOGLE_CLIENT_ID} from '@env';

GoogleSignin.configure({
  webClientId: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  showPlayServicesUpdateDialog: true,
});

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const [loginType, setLoginType] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordHide, setPasswordHide] = useState(true);

  const onError = errors => console.log('Errors Occurred !! :', errors);

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

  const handleAfterSignInResponse = async (userId, token, message) => {
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

  const handleAfterSignInError = message => {
    setLoading(false);
    toast.show({
      title: message,
      placement: 'top',
      backgroundColor: 'red.600',
      variant: 'solid',
    });
  };

  const onSubmit = async data => {
    setLoading(true);
    signIn({
      username: data.username,
      password: data.password,
      type: loginType === 'vendor' ? 'vendor' : 'customer',
    })
      .then(
        async res => {
          handleAfterSignInResponse(
            res.data.signIn.user,
            res.data.signIn.token,
            res.data.signIn.message,
          );
        },
        error => {
          handleAfterSignInError(error.message);
        },
      )
      .catch(error => {
        handleAfterSignInError(error.message);
      });
  };

  useEffect(() => {
    retrieveData();
  }, []);

  const GoogleSignInPress = async () => {
    GoogleSignin.signOut();

    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      googleSignIn({
        username: userInfo?.user?.email,
        type: loginType === 'vendor' ? 'vendor' : 'customer',
      }).then(
        res =>
          handleAfterSignInResponse(
            res.data.googleSignIn.user,
            res.data.googleSignIn.token,
            res.data.googleSignIn.message,
          ),
        error => handleAfterSignInError(error.message),
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
          Login As{' '}
          <Text style={{color: '#29977E'}}>
            {loginType === 'vendor' ? 'Seller' : 'Customer'}
          </Text>{' '}
          !
        </Text>
        <View style={{marginBottom: 16, width: '100%'}}>
          <TouchableOpacity
            onPress={() => GoogleSignInPress()}
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

        <View>
          <CustomTextInput
            label={
              loginType === 'customer'
                ? 'Contact Number'
                : 'Email/Contact Number'
            }
            mode="outlined"
            keyboardType={
              loginType === 'customer' ? 'phone-pad' : 'email-address'
            }
            name="username"
            control={control}
            rules={{required: 'Username is required *'}}
            activeOutlineColor="#151827"
            outlineStyle={{borderRadius: 12}}
          />
          {errors?.username && (
            <Text style={{color: 'red', marginTop: 4}}>
              {errors.username.message}
            </Text>
          )}
        </View>
        <View style={{marginTop: 10, position: 'relative'}}>
          <CustomTextInput
            label="Password"
            mode="outlined"
            name="password"
            secureTextEntry={passwordHide}
            control={control}
            rules={{required: 'Password is required *'}}
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

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.fpText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.buttonMainContainer}>
          <View style={{width: '100%'}}>
            <CustomButton
              name="Sign In"
              color="#FFFFFF"
              backgroundColor="#151827"
              onPress={handleSubmit(onSubmit, onError)}
              loading={loading}
            />
          </View>
          <Text style={styles.bottomText}>
            Don’t have an account?
            <Text
              onPress={() => navigation.navigate('SignUp')}
              style={{color: '#151827', fontWeight: '600'}}>
              {' '}
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 20,
  },
  buttonMainContainer: {
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
  fpText: {
    alignSelf: 'flex-end',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: FontStyle,
    color: 'rgba(21, 24, 39, 0.56)',
    marginTop: 15,
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
