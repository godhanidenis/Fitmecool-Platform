import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import ProductApplyFilter from './ProductApplyFilter';
import ShopApplyFilter from './ShopApplyFilter';

const FilterScreen = ({
  handleFilterModelClose,
  setShowBottomLoader,
  showOnlyShopDetailPage,
}) => {
  const {byShop} = useSelector(state => state?.shopsFiltersReducer);

  return (
    <View
      style={{backgroundColor: '#FFF', height: '100%', position: 'relative'}}>
      <View style={[styles.headerMain, {height: '10%'}]}>
        <View style={styles.innerHeaderLeft}>
          <Text style={styles.filterHeaderText}>Filters</Text>
        </View>
        <TouchableOpacity onPress={() => handleFilterModelClose()}>
          <Icon name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{height: '90%'}}>
        {!byShop || showOnlyShopDetailPage ? (
          <ProductApplyFilter
            handleFilterModelClose={handleFilterModelClose}
            setShowBottomLoader={setShowBottomLoader}
            showOnlyShopDetailPage={showOnlyShopDetailPage}
          />
        ) : (
          <ShopApplyFilter
            handleFilterModelClose={handleFilterModelClose}
            setShowBottomLoader={setShowBottomLoader}
          />
        )}
      </View>
    </View>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomColor: 'rgba(24, 23, 37, 0.10)',
    borderBottomWidth: 1,
  },
  innerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterHeaderText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 22,
  },
  toggleSwitchMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
