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

  const [loading, setLoading] = useState(false);
  const [passwordHide, setPasswordHide] = useState(true);

  const onError = errors => console.log('Errors Occurred !! :', errors);

  const handleAfterSignInResponse = async (user, token, message) => {
    setLoading(false);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('loginType', 'customer');
    await AsyncStorage.setItem('userId', user.id);
    await AsyncStorage.setItem('userHaveAnyShop', user.userHaveAnyShop ?? '');
    toast.show({
      title: message,
      placement: 'top',
      backgroundColor: 'green.600',
      variant: 'solid',
    });
    navigation.navigate('Splash')
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
    })
      .then(
        async res => {
        console.log('Response :-', res.data.signIn.user)
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

  const GoogleSignInPress = async () => {
    GoogleSignin.signOut();

    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      googleSignIn({
        username: userInfo?.user?.email
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
          <View style={styles.backMain}>
            <TouchableOpacity
              style={{backgroundColor:'#151827', paddingHorizontal:10, paddingVertical:5, borderRadius:10}}
              onPress={() => navigation.goBack()}>
              <Icon name="angle-left" size={40} color="white" />
            </TouchableOpacity>
          </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.main}>


        <View style={{marginTop:20}}>
        <Text style={styles.loginText}>Login</Text>
        <Text style={styles.loginSubText}>Please sign in to continue.</Text>

        <View style={{marginVertical: 10, width: '100%'}}>
                          <TouchableOpacity
                            onPress={() => GoogleSignInPress()}
                            style={styles.socialBtnMain}>
                            <Image source={{uri: googleIcon}} style={{width: 20, height: 20}} />
                            <Text style={styles.socialText}>Continue To Google</Text>
                          </TouchableOpacity>
                        </View>

                         <Text style={styles.orText}>OR</Text>
          <CustomTextInput
            label={'Email/Contact Number'}
            mode="outlined"
            name="username"
            control={control}
            rules={{required: 'Email/Contact Number is required *'}}
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
              name="Login"
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
              style={{color: '#29977E', fontWeight: '700', }}>
              {' '}
              Register
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
    backMain: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      width: '75%',
    },
    headerMain: {
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
    },
    loginText:{
    fontFamily: FontStyle,
    fontWeight:'700',
    color: '#151827',
    fontSize: 24,
    },
    loginSubText:{
        fontFamily: FontStyle,
        fontWeight:'700',
        color: 'grey',
        fontSize: 14,
        marginBottom:10
    },
  buttonMainContainer: {
    width: '100%',
    paddingTop: 20,
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
    marginTop: 8,
  },
  orText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FontStyle,
    color: '#29977E',
    marginBottom: 5,
  },
  bottomText: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 50,
    fontFamily: FontStyle,
    color: 'rgba(21, 24, 39, 0.56)',
    fontSize: 16,
    fontWeight: '400',
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
    paddingVertical: 12,
    color: '#151827',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontStyle,
  },
    main: {
      marginHorizontal: 20,
    },
});
