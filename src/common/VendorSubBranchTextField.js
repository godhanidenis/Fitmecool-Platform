import {StyleSheet} from 'react-native';
import React from 'react';
import {DefaultTheme, TextInput} from 'react-native-paper';

const VendorSubBranchTextField = ({
  label,
  mode,
  keyboardType,
  secureTextEntry,
  name,
  activeOutlineColor,
  disabled,
  onChange,
  value,
}) => {
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FAFCFC',
    },
  };

  return (
    <TextInput
      onChangeText={onChange}
      value={value}
      label={label}
      mode={mode}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      outlineColor="rgba(21, 24, 39, 0.10)"
      activeOutlineColor={activeOutlineColor}
      theme={customTheme}
      disabled={disabled}
      style={{fontSize: 14}}
    />
  );
};

export default VendorSubBranchTextField;

const styles = StyleSheet.create({});
