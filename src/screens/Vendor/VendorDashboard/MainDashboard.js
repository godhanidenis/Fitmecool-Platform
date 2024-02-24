import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loadVendorShopDetailsStart} from '../../../redux/vendorShopDetailsSlice/ShopDetailSlice';
import DrawerVendor from '../../../DrawerNavigation/DrawerVendor';
import {loadProductsStart} from '../../../redux/ProductSlice/ProductSlice';
import {changeAppliedProductsFilters} from '../../../redux/ProductFilter/ProductFilterSlice';
import {loadShopConfigurationsStart} from '../../../redux/ShopConfigurationsSlice/ShopConfigurationsSlice';

const MainDashboard = () => {
  const dispatch = useDispatch();
  const useProfileData = useSelector(state => state?.user.userProfile);
  const {vendorShopDetails} = useSelector(state => state?.shopDetail);

  const {productPageSkip, PaginationProductLimit} = useSelector(
    state => state?.productsData,
  );

  const {appliedProductsFilters, sortFilters} = useSelector(
    state => state.productsFiltersReducer,
  );

  const getAllProducts = () => {
    dispatch(
      loadProductsStart({
        pageData: {
          skip: productPageSkip,
          limit: PaginationProductLimit,
        },
        filter: {
          category_id: appliedProductsFilters?.categoryId?.selectedValue,
          product_color: appliedProductsFilters?.productColor?.selectedValue,
          product_price: {
            min: appliedProductsFilters.productPrice.selectedValue.min,
            max: appliedProductsFilters.productPrice.selectedValue.max,
          },
          product_listing_type:
            appliedProductsFilters?.productListingType.selectedValue,
        },
        shopId: appliedProductsFilters?.shopId?.selectedValue,
        sort: sortFilters?.sortType?.selectedValue,
        search: appliedProductsFilters?.searchBarData?.selectedValue,
        forDashboard: true,
      }),
    );
  };

  useEffect(() => {
    if (vendorShopDetails?.id) {
      dispatch(
        changeAppliedProductsFilters({
          key: 'shopId',
          value: {
            selectedValue: [vendorShopDetails?.id],
          },
        }),
      );
    }
  }, [dispatch, vendorShopDetails?.id]);

  useEffect(() => {
    if (appliedProductsFilters?.shopId?.selectedValue?.length > 0) {
      getAllProducts();
    }
  }, [dispatch, appliedProductsFilters, sortFilters, productPageSkip]);

  useEffect(() => {
    if (useProfileData?.userCreatedShopId) {
      dispatch(loadVendorShopDetailsStart(useProfileData?.userCreatedShopId));
    }
  }, [useProfileData]);

  useEffect(() => {
    if (useProfileData?.userCreatedShopId) {
      dispatch(loadShopConfigurationsStart());
    }
  }, [useProfileData]);

  return (
    <View style={{flex: 1}}>
      <DrawerVendor vendorShopDetails={vendorShopDetails} />
    </View>
  );
};

export default MainDashboard;

const styles = StyleSheet.create({});
