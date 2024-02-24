import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {CheckBox} from 'react-native-elements';
import {capitalizeString} from '../../../common/CapitalizeString';
import SearchTextFiled from '../../../common/SearchTextFiled';

const ProductByShopFilter = ({selectedShopData, setSelectedShopData}) => {
  const {allShopsLists} = useSelector(state => state?.shops);
  const [searchText, setSearchText] = useState('');

  const onChangeShopSelected = ShopID => {
    const updatedSelection = selectedShopData?.includes(ShopID)
      ? selectedShopData?.filter(id => id !== ShopID)
      : [...selectedShopData, ShopID];
    setSelectedShopData(updatedSelection);
  };

  return (
    <View>
      <SearchTextFiled
        value={searchText}
        handleTextSearch={value => setSearchText(value.toLowerCase())}
      />
      {(searchText !== ''
        ? allShopsLists?.data?.filter(item =>
            item?.shop_name.toLowerCase().includes(searchText),
          )
        : allShopsLists?.data
      )?.map((itm, index) => (
        <View key={index}>
          <CheckBox
            title={capitalizeString(itm.shop_name)}
            checked={selectedShopData?.includes(itm?.id)}
            onPress={() => onChangeShopSelected(itm?.id)}
            containerStyle={{
              backgroundColor: 'transparent',
              borderWidth: 0,
              margin: 0,
            }}
            checkedColor="#29977E"
          />
        </View>
      ))}
    </View>
  );
};

export default ProductByShopFilter;

const styles = StyleSheet.create({});
