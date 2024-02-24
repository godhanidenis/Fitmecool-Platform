import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BackGroundStyle} from '../../../../CommonStyle';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../../common/CustomButton';
import {loadCategoriesStart} from '../../../redux/CategorySlice/CategoryListSlice';
import ProductListing from './AddEditProduct/ProductListing';
import {useNavigation} from '@react-navigation/native';
import VendorHeader from '../../../components/VendorHeader';
import FilterDrawerModel from '../../../common/FilterDrawerModel';
import Icon from 'react-native-vector-icons/FontAwesome';

const Product = () => {
  const navigation = useNavigation();
  const {userProfile} = useSelector(state => state?.user);
  const [filterModelOpen, setFilterModelOpen] = useState(false);
  const [, setShowBottomLoader] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCategoriesStart());
  }, [dispatch, userProfile]);

  return (
    <View style={{flex: 1}}>
      <VendorHeader />
      <FilterDrawerModel
        filterModelOpen={filterModelOpen}
        handleFilterModelClose={() => setFilterModelOpen(false)}
        setShowBottomLoader={setShowBottomLoader}
        showOnlyShopDetailPage={true}
      />
      <View style={styles.FilterBtnMain}>
        <TouchableOpacity
          onPress={() => setFilterModelOpen(true)}
          style={styles.filterButton}>
          <Icon name="filter" size={18} color="white" />
          <Text style={styles.filterBtnText}>Filters</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: BackGroundStyle}}>
        <View style={{width: '90%', marginHorizontal: 22, marginTop: 20}}>
          <CustomButton
            name="Add Product"
            color="#29977E"
            backgroundColor="#FAFCFC"
            borderColor="#29977E"
            onPress={() => navigation.navigate('VendorAddEditProduct')}
            icon={true}
            iconName="plus"
          />
        </View>
        <ProductListing />
      </ScrollView>
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 22,
    marginVertical: 30,
  },
  FilterBtnMain: {
    position: 'absolute',
    bottom: 10,
    zIndex: 1,
    width: '100%',
  },
  filterButton: {
    backgroundColor: '#29977E',
    width: '30%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  filterBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
