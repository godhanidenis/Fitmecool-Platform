import {StyleSheet} from 'react-native';
import React from 'react';
import {DefaultTheme, TextInput} from 'react-native-paper';
import {Controller} from 'react-hook-form';

const CustomTextInput = ({
  label,
  mode,
  keyboardType,
  secureTextEntry,
  name,
  rules,
  control,
  activeOutlineColor,
  disabled,
  outlineStyle,
  onChangeTextPrice,
  multiline,
  numberOfLines,
}) => {
  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FAFCFC',
    },
  };

  return (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => (
        <TextInput
          onChangeText={onChange}
          value={value}
          label={label}
          mode={mode}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          outlineColor="rgba(21, 24, 39, 0.10)"
          outlineStyle={outlineStyle}
          activeOutlineColor={activeOutlineColor}
          theme={customTheme}
          disabled={disabled}
          onChange={onChangeTextPrice}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      )}
      name={name}
      rules={rules}
    />
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({});
