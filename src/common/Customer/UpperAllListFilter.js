import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {changeAppliedProductsFilters} from '../../redux/ProductFilter/ProductFilterSlice';
import {changeAppliedShopsFilters} from '../../redux/ShopFilter/ShopFilterSlice';
import {changeAppliedShopProductsFilters} from '../../redux/ShopProductFilter/ShopProductFilterSlice';

const UpperAllListFilter = ({showOnlyShopDetailPage, setShowBottomLoader}) => {
  const dispatch = useDispatch();

  const productsFiltersReducer = useSelector(
    state => state?.productsFiltersReducer,
  );

  const shopProductsFiltersReducer = useSelector(
    state => state?.shopProductsFiltersReducer,
  );

  const {categories} = useSelector(state => state?.categories);
  const {allShopsLists} = useSelector(state => state?.shops);
  const {byShop} = useSelector(state => state?.shopsFiltersReducer);
  const shopsFiltersReducer = useSelector(state => state?.shopsFiltersReducer);
  const {areaLists} = useSelector(state => state?.areaLists);

  const [selectedProductFilters, setSelectedProductFilters] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedShops, setSelectedShops] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedProductListingType, setSelectedProductListingType] = useState(
    [],
  );
  const [searchProducts, setSearchProducts] = useState([]);

  const [selectedShopFilters, setSelectedShopFilters] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const passValueForSingleProduct = itm => {
    const selectedFilter = showOnlyShopDetailPage
      ? shopProductsFiltersReducer?.appliedShopProductsFilters
      : productsFiltersReducer?.appliedProductsFilters;

    if (itm.type === 'searchBarData' || itm.type === 'productListingType') {
      return '';
    } else if (itm.type === 'productPrice') {
      return {min: 0, max: 0};
    } else {
      return selectedFilter[itm.type]?.selectedValue?.filter(
        item => item !== itm.value,
      );
    }
  };

  const handleDeleteParticularFilterBadge = itm => {
    !showOnlyShopDetailPage && setShowBottomLoader(false);
    if (byShop && !showOnlyShopDetailPage) {
      dispatch(
        changeAppliedShopsFilters({
          key: itm.type,
          value: {
            selectedValue:
              itm.type === 'stars'
                ? '0'
                : shopsFiltersReducer?.appliedShopsFilters[
                    itm?.type
                  ].selectedValue?.filter(item => item?.pin !== itm.value),
          },
        }),
      );
    } else {
      const changeFiltersAction = showOnlyShopDetailPage
        ? changeAppliedShopProductsFilters
        : changeAppliedProductsFilters;
      dispatch(
        changeFiltersAction({
          key: itm.type,
          value: {
            selectedValue: passValueForSingleProduct(itm),
          },
        }),
      );
    }
  };

  useEffect(() => {
    setSelectedProductFilters([
      ...selectedCategories,
      ...selectedShops,
      ...selectedColors,
      ...selectedPrices,
      ...selectedProductListingType,
      ...searchProducts,
    ]);
  }, [
    searchProducts,
    selectedCategories,
    selectedPrices,
    selectedProductListingType,
    selectedColors,
    selectedShops,
    showOnlyShopDetailPage,
  ]);

  useEffect(() => {
    const selectedCategoryIds = showOnlyShopDetailPage
      ? shopProductsFiltersReducer?.appliedShopProductsFilters?.categoryId
          ?.selectedValue
      : productsFiltersReducer?.appliedProductsFilters?.categoryId
          ?.selectedValue;

    const selectedCategories = categories?.filter(category =>
      selectedCategoryIds?.includes(category?.id),
    );

    const mappedCategories = selectedCategories?.map(category => ({
      type: 'categoryId',
      label: category?.category_name,
      value: category?.id,
    }));

    setSelectedCategories(mappedCategories);
  }, [
    showOnlyShopDetailPage,
    categories,
    shopProductsFiltersReducer?.appliedShopProductsFilters?.categoryId
      ?.selectedValue,
    productsFiltersReducer?.appliedProductsFilters?.categoryId?.selectedValue,
  ]);

  useEffect(() => {
    const selectedShopIds = showOnlyShopDetailPage
      ? []
      : productsFiltersReducer?.appliedProductsFilters?.shopId?.selectedValue;

    const selectedShopsData = allShopsLists?.data.filter(shop =>
      selectedShopIds?.includes(shop.id),
    );

    const mappedShops = selectedShopsData?.map(shop => ({
      type: 'shopId',
      label: shop?.shop_name,
      value: shop?.id,
    }));

    setSelectedShops(mappedShops);
  }, [
    productsFiltersReducer?.appliedProductsFilters?.shopId?.selectedValue,
    allShopsLists?.data,
    showOnlyShopDetailPage,
  ]);

  useEffect(() => {
    setSelectedColors(
      (showOnlyShopDetailPage
        ? shopProductsFiltersReducer?.appliedShopProductsFilters.productColor
            .selectedValue
        : productsFiltersReducer?.appliedProductsFilters.productColor
            .selectedValue
      )?.map(color => ({
        type: 'productColor',
        label: color,
        value: color,
      })),
    );
  }, [
    productsFiltersReducer?.appliedProductsFilters?.productColor?.selectedValue,
    shopProductsFiltersReducer?.appliedShopProductsFilters.productColor
      .selectedValue,
    showOnlyShopDetailPage,
  ]);

  const priceFilterLabel = price => {
    if (price.min > 0 && price.max === 0) {
      return `Price: Over ${price.min}`;
    } else {
      return `Price: ${price.min} - ${price.max}`;
    }
  };

  useEffect(() => {
    const selectedValue = showOnlyShopDetailPage
      ? shopProductsFiltersReducer?.appliedShopProductsFilters.productPrice
          .selectedValue
      : productsFiltersReducer?.appliedProductsFilters.productPrice
          .selectedValue;

    const minPrice = selectedValue.min;
    const maxPrice = selectedValue.max;

    if (minPrice === 0 && maxPrice === 0) {
      setSelectedPrices([]);
    } else {
      setSelectedPrices([
        {
          type: 'productPrice',
          label: priceFilterLabel(selectedValue),
          value: selectedValue,
        },
      ]);
    }
  }, [
    shopProductsFiltersReducer?.appliedShopProductsFilters.productPrice
      .selectedValue,
    productsFiltersReducer?.appliedProductsFilters.productPrice.selectedValue,
    showOnlyShopDetailPage,
  ]);

  useEffect(() => {
    const selectedValue = showOnlyShopDetailPage
      ? shopProductsFiltersReducer?.appliedShopProductsFilters
          .productListingType.selectedValue
      : productsFiltersReducer?.appliedProductsFilters.productListingType
          .selectedValue;

    if (selectedValue === '') {
      setSelectedProductListingType([]);
    } else {
      setSelectedProductListingType([
        {
          type: 'productListingType',
          label: `Type: ${selectedValue}`,
          value: selectedValue,
        },
      ]);
    }
  }, [
    productsFiltersReducer?.appliedProductsFilters.productListingType
      .selectedValue,
    shopProductsFiltersReducer?.appliedShopProductsFilters.productListingType
      .selectedValue,
    showOnlyShopDetailPage,
  ]);

  useEffect(() => {
    const selectedValue = showOnlyShopDetailPage
      ? shopProductsFiltersReducer?.appliedShopProductsFilters.searchBarData
          .selectedValue
      : productsFiltersReducer?.appliedProductsFilters.searchBarData
          .selectedValue;

    if (selectedValue && selectedValue !== '') {
      setSearchProducts([
        {
          type: 'searchBarData',
          label: selectedValue,
          value: selectedValue,
        },
      ]);
    } else {
      setSearchProducts([]);
    }
  }, [
    shopProductsFiltersReducer?.appliedShopProductsFilters.searchBarData
      .selectedValue,
    productsFiltersReducer?.appliedProductsFilters.searchBarData.selectedValue,
    showOnlyShopDetailPage,
  ]);

  useEffect(() => {
    setSelectedShopFilters([...selectedLocations, ...selectedRatings]);
  }, [selectedLocations, selectedRatings]);

  useEffect(() => {
    const selectedLocationPins =
      shopsFiltersReducer?.appliedShopsFilters?.locations?.selectedValue;

    const selectedLocations = areaLists?.filter(area =>
      selectedLocationPins.some(
        item => item.area === area.area && item.pin === area.pin,
      ),
    );

    const mappedLocations = selectedLocations?.map(location => ({
      type: 'locations',
      label: location.area,
      value: location.pin,
    }));

    setSelectedLocations(mappedLocations);
  }, [
    areaLists,
    shopsFiltersReducer?.appliedShopsFilters.locations.selectedValue,
  ]);

  useEffect(() => {
    shopsFiltersReducer?.appliedShopsFilters?.stars?.selectedValue &&
    shopsFiltersReducer?.appliedShopsFilters?.stars?.selectedValue !== '0'
      ? setSelectedRatings([
          {
            type: 'stars',
            label:
              shopsFiltersReducer?.appliedShopsFilters?.stars?.selectedValue,
            value:
              shopsFiltersReducer?.appliedShopsFilters?.stars?.selectedValue,
          },
        ])
      : setSelectedRatings([]);
  }, [shopsFiltersReducer?.appliedShopsFilters?.stars?.selectedValue]);

  return (
    <View>
      {(byShop && !showOnlyShopDetailPage
        ? selectedShopFilters
        : selectedProductFilters
      )?.length > 0 && (
        <View
          style={{
            marginTop: 6,
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
          }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{
              flexDirection: 'row',
              gap: 6,
              alignItems: 'center',
            }}>
            {(byShop && !showOnlyShopDetailPage
              ? selectedShopFilters
              : selectedProductFilters
            )?.map((item, index) => (
              <View key={index} style={styles.filterListMain}>
                <Text style={styles.filterItemText}>{item?.label}</Text>
                <TouchableOpacity
                  onPress={() => handleDeleteParticularFilterBadge(item)}>
                  <Icon name="close" size={15} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              !showOnlyShopDetailPage && setShowBottomLoader(false);
              const passValueForProduct = itm => {
                if (itm === 'searchBarData' || itm === 'productListingType') {
                  return '';
                } else if (itm === 'productPrice') {
                  return {min: 0, max: 0};
                } else {
                  return [];
                }
              };
              if (byShop && !showOnlyShopDetailPage) {
                ['locations', 'stars']?.map(itm =>
                  dispatch(
                    changeAppliedShopsFilters({
                      key: itm,
                      value: {
                        selectedValue: itm === 'stars' ? '0' : [],
                      },
                    }),
                  ),
                );
              } else {
                const changeFiltersAction = showOnlyShopDetailPage
                  ? changeAppliedShopProductsFilters
                  : changeAppliedProductsFilters;
                [
                  'categoryId',
                  'productColor',
                  'productPrice',
                  'productListingType',
                  ...(showOnlyShopDetailPage ? [] : ['shopId']),
                  'searchBarData',
                ]?.map(itm =>
                  dispatch(
                    changeFiltersAction({
                      key: itm,
                      value: {
                        selectedValue: passValueForProduct(itm),
                      },
                    }),
                  ),
                );
              }
            }}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default UpperAllListFilter;

const styles = StyleSheet.create({
  filterListMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#29977E',
    padding: 6,
    borderRadius: 20,
  },
  filterItemText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    // paddingBottom: 4,
  },
  clearAllText: {
    textDecorationLine: 'underline',
    color: '#151827',
    fontWeight: '700',
    fontSize: 14,
  },
});
