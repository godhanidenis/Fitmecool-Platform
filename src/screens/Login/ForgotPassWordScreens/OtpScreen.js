import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState, useRef} from 'react';
import CustomButton from '../../../common/CustomButton';

const OtpScreen = ({setActiveScreen}) => {
  const inputRefs = Array(4)
    .fill(null)
    .map(() => useRef(null));

  const [otp, setOTP] = useState(Array(4).fill(''));
  const mergedString = otp.join('');

  const [error, setError] = useState('');

  const onSubmit = () => {
    if (mergedString?.length === 4) {
      setActiveScreen(3);
      setError('');
    } else {
      setError('Please Enter Valid OTP *');
    }
  };

  const handleChangeText = (text, index) => {
    setError('');

    if (/^[0-9]*$/.test(text)) {
      const newOTP = [...otp];
      newOTP[index] = text;
      setOTP(newOTP);
      if (text === '' && index > 0) {
        inputRefs[index - 1].current.focus();
      } else if (text.length === 1 && index < 4 - 1) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleBackspace = index => {
    if (index > 0) {
      const newOTP = [...otp];
      newOTP[index] = '';
      setOTP(newOTP);
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.forgotText}>Verification</Text>
        <Text style={styles.desOneText}>Enter Your OTP Code Number</Text>
        <Text style={styles.desOneText}>
          We will send you a One Time PassWord on your email
        </Text>
        <View style={{width: '100%', marginBottom: 16, position: 'relative'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {otp?.map((value, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.input}
                onChangeText={text => handleChangeText(text, index)}
                onKeyPress={({nativeEvent}) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleBackspace(index);
                  }
                }}
                value={value}
                maxLength={1}
                keyboardType="numeric"
              />
            ))}
          </View>
          {error !== '' && (
            <Text style={{color: 'red', marginTop: 4, alignSelf: 'center'}}>
              {error}
            </Text>
          )}
        </View>

        <View style={{width: '80%', marginBottom: 15}}>
          <CustomButton
            name="Verify"
            color="#FFFFFF"
            backgroundColor="#151827"
            onPress={onSubmit}
            //   loading={loading}
          />
        </View>
      </View>
    </View>
  );
};

export default OtpScreen;

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
  input: {
    borderWidth: 1,
    borderColor: 'black',
    width: 40,
    height: 40,
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },
});
