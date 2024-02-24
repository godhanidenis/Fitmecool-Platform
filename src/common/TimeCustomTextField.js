import {StyleSheet} from 'react-native';
import React from 'react';
import {DefaultTheme, TextInput} from 'react-native-paper';

const TimeCustomTextField = ({value, label, editable}) => {
  const customStyle = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FAFCFC',
    },
  };
  return (
    <TextInput
      value={value}
      label={label}
      editable={editable}
      mode="outlined"
      outlineColor="rgba(21, 24, 39, 0.10)"
      activeOutlineColor="#29977E"
      theme={customStyle}
      style={{fontSize: 12, fontWeight: '700', paddingLeft: 2}}
      textColor={
        value === 'Open 24 hours'
          ? 'green'
          : value === 'Closed'
          ? 'red'
          : 'black'
      }
    />
  );
};

export default TimeCustomTextField;

const styles = StyleSheet.create({});
