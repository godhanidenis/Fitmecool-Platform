import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomSwitch = ({
  onClickLeft,
  onClickRight,
  homePage,
  imgLeftIcon,
  imgRightIcon,
  switchVisibility,
  switchIcon,
  IconLeft,
  IconRight,
  textName,
  textLeft,
  textRight,
}) => {
  return (
    <View style={styles.shopProMain}>
      <TouchableOpacity
        onPress={onClickLeft}
        style={[
          styles.filterButtonShop,
          {backgroundColor: switchVisibility ? 'lightgrey' : '#29977E'},
        ]}>
        {homePage && (
          <Image
            source={{uri: imgLeftIcon}}
            style={{
              width: 18,
              height: 18,
              tintColor: switchVisibility ? 'black' : 'white',
            }}
          />
        )}
        {switchIcon && (
          <Icon
            name={IconLeft}
            size={18}
            color={switchVisibility ? 'black' : 'white'}
          />
        )}
        {textName && (
          <Text
            style={[
              styles.textStyle,
              {color: switchVisibility ? 'black' : 'white'},
            ]}>
            {textLeft}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onClickRight}
        style={[
          styles.filterButtonPro,
          {backgroundColor: switchVisibility ? '#29977E' : 'lightgrey'},
        ]}>
        {homePage && (
          <Image
            source={{uri: imgRightIcon}}
            style={{
              width: 18,
              height: 18,
              tintColor: switchVisibility ? 'white' : 'black',
            }}
          />
        )}
        {switchIcon && (
          <Icon
            name={IconRight}
            size={18}
            color={switchVisibility ? 'white' : 'black'}
          />
        )}
        {textName && (
          <Text
            style={[
              styles.textStyle,
              {color: switchVisibility ? 'white' : 'black'},
            ]}>
            {textRight}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  shopProMain: {
    flexDirection: 'row',
  },
  filterButtonShop: {
    backgroundColor: 'lightgrey',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  filterButtonPro: {
    backgroundColor: '#151827',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  textStyle: {
    fontSize: 14,
    fontWeight: '500',
  },
});
