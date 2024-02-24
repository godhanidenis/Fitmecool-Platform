import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {capitalizeString} from '../../../common/CapitalizeString';
import {RadioButton} from 'react-native-paper';

const productListingTypeFilterData = [
  {
    label: 'Rent',
    value: 'rent',
  },
  {
    label: 'Sell',
    value: 'sell',
  },
];

const ProductTypeTab = ({selectedTypeData, setSelectedTypeData}) => {
  const OnChangeTypes = value => {
    setSelectedTypeData(value);
  };

  return (
    <View>
      {productListingTypeFilterData &&
        productListingTypeFilterData?.map((itm, index) => (
          <View key={index}>
            <RadioButton.Group
              onValueChange={newValue => OnChangeTypes(newValue)}
              value={selectedTypeData}>
              <View style={styles.radioMain}>
                <RadioButton color="#29977E" value={itm?.value} />
                <Text
                  style={[
                    styles.radioText,
                    {
                      color: '#151827',
                    },
                  ]}>
                  {capitalizeString(itm?.label)}
                </Text>
              </View>
            </RadioButton.Group>
          </View>
        ))}
    </View>
  );
};

export default ProductTypeTab;

const styles = StyleSheet.create({
  radioMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {},
});
