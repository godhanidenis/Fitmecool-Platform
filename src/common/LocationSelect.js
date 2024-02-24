import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {Controller} from 'react-hook-form';

const LocationSelect = ({
  control,
  name,
  rules,
  placeholder,
  arrayListItem,
  stateField,
  cityField,
  pinCodeField,
  onChangeValue,
  subBranchSelect,
  defaultValue,
}) => {
  const LabelFunction = item => {
    if (stateField) {
      return item.state;
    } else if (cityField) {
      return item.city;
    } else if (pinCodeField) {
      return `${item.area} - ${item.pin}`;
    }
  };

  const ValueFunction = item => {
    if (stateField) {
      return item.state;
    } else if (cityField) {
      return item.city;
    } else if (pinCodeField) {
      return item.pin;
    }
  };

  const areaListsWithCombinedLabels = arrayListItem?.map(item => ({
    ...item,
    label: LabelFunction(item),
    value: ValueFunction(item),
  }));

  const [branchText, setBranchText] = useState(null);

  return subBranchSelect ? (
    <View style={styles.container}>
      <Dropdown
        itemTextStyle={{
          color: 'black',
        }}
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        labelField={'label'}
        valueField="value"
        data={areaListsWithCombinedLabels}
        search
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={branchText || defaultValue}
        onChange={item => {
          setBranchText(item.value);
          onChangeValue(item.value);
        }}
      />
    </View>
  ) : (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => (
        <View style={styles.container}>
          <Dropdown
            itemTextStyle={{
              color: 'black',
            }}
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            labelField={'label'}
            valueField="value"
            data={areaListsWithCombinedLabels}
            search
            placeholder={placeholder}
            searchPlaceholder="Search..."
            value={value || defaultValue}
            onChange={item => {
              onChange(item.value);
              onChangeValue(item.value);
            }}
          />
        </View>
      )}
      name={name}
      rules={rules}
    />
  );
};

export default LocationSelect;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdown: {
    height: 50,
    width: '100%',
    borderColor: 'rgba(21, 24, 39, 0.20)',
    borderWidth: 0.5,
    borderRadius: 6,
    paddingHorizontal: 8,
  },

  label: {
    position: 'absolute',
    top: 0,
    paddingHorizontal: 8,
    fontSize: 14,
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
});
