import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {capitalizeString} from '../../../common/CapitalizeString';
import {RadioButton} from 'react-native-paper';

const priceFilterData = [
  {
    label: 'Under ₹1000',
    value: {
      min: 0,
      max: 1000,
    },
  },
  {
    label: '₹1,001 - ₹5,000',
    value: {
      min: 1001,
      max: 5000,
    },
  },
  {
    label: '₹5,001 - ₹10,000',
    value: {
      min: 5001,
      max: 10000,
    },
  },
  {
    label: '₹10,001 - ₹20,000',
    value: {
      min: 10001,
      max: 20000,
    },
  },
  {
    label: 'Over ₹20,000',
    value: {
      min: 20001,
      max: 0,
    },
  },
];

const ProductPriceTab = ({selectedPriceData, setSelectedPriceData}) => {
  const OnChangePrice = value => {
    setSelectedPriceData(value);
  };

  return (
    <View>
      {priceFilterData &&
        priceFilterData?.map((itm, index) => (
          <View key={index}>
            <RadioButton.Group
              onValueChange={newValue => OnChangePrice(newValue)}
              value={selectedPriceData}>
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

export default ProductPriceTab;

const styles = StyleSheet.create({
  radioMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {},
});
