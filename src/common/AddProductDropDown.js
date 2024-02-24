import {StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Controller} from 'react-hook-form';
import {NativeBaseProvider, Select} from 'native-base';

const AddProductDropDown = ({
  label,
  name,
  rules,
  control,
  listData,
  setProductType,
  AllowGetProductType,
}) => {
  const [changeValue, setChangeValue] = useState('');
  useEffect(() => {
    if (changeValue) {
      if (AllowGetProductType) {
        setProductType(changeValue);
      }
    }
  }, [changeValue]);

  return (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => {
        {
          AllowGetProductType && setChangeValue(value);
        }
        return (
          <NativeBaseProvider>
            <Select
              selectedValue={value}
              minWidth="200"
              height="50"
              accessibilityLabel={label}
              placeholder={label}
              _selectedItem={{
                bg: 'green.200',
              }}
              mt={1}
              style={{fontSize: 16}}
              onValueChange={onChange}>
              {listData?.map((item, index) => (
                <Select.Item key={index} label={item} value={item} />
              ))}
            </Select>
          </NativeBaseProvider>
        );
      }}
      name={name}
      rules={rules}
    />
  );
};

export default AddProductDropDown;

const styles = StyleSheet.create({});
