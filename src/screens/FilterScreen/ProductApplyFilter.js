import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native';
import MenWomenTabs from './ProductFilterSubTab/MenWomenTabs';
import CustomButton from '../../common/CustomButton';
import ProductByShopFilter from './ProductFilterSubTab/ProductByShopFilter';
import ProductColorFilter from './ProductFilterSubTab/ProductColorFilter';
import {changeAppliedProductsFilters} from '../../redux/ProductFilter/ProductFilterSlice';
import {Button} from 'react-native-paper';
import {arraysHaveSameValues} from '../../utils';
import ProductTypeTab from './ProductFilterSubTab/ProductTypeTab';
import ProductPriceTab from './ProductFilterSubTab/ProductPriceTab';
import {changeAppliedShopProductsFilters} from '../../redux/ShopProductFilter/ShopProductFilterSlice';

const ProductApplyFilter = ({
  handleFilterModelClose,
  setShowBottomLoader,
  showOnlyShopDetailPage,
}) => {
  const dispatch = useDispatch();
  const AllCateGory = ['Types', 'Men', 'Women', 'Shops', 'Color', 'Price'];

  const {categories} = useSelector(state => state.categories);
  const productsFiltersReducer = useSelector(
    state => state?.productsFiltersReducer,
  );

  const shopProductsFiltersReducer = useSelector(
    state => state?.shopProductsFiltersReducer,
  );

  const selectedFilter = showOnlyShopDetailPage
    ? shopProductsFiltersReducer?.appliedShopProductsFilters
    : productsFiltersReducer?.appliedProductsFilters;

  const [selectedCategory, setSelectedCategory] = useState('Types');

  const [selectedMenCat, setSelectedMenCat] = useState([]);
  const [selectedWomenCat, setSelectedWomenCat] = useState([]);

  const [menSelectedData, setMenSelectedData] = useState([]);
  const [womenSelectedData, setWomenSelectedData] = useState([]);

  const [categoryId, setCategoryId] = useState([]);

  const [selectedShopData, setSelectedShopData] = useState([]);

  const [selectedColorData, setSelectedColorData] = useState([]);

  const [selectedTypeData, setSelectedTypeData] = useState('');

  const priceDefaultData = {
    min: 0,
    max: 0,
  };
  const [selectedPriceData, setSelectedPriceData] = useState(priceDefaultData);

  const [clearTextShow, setClearTextShow] = useState(false);
  const [clearAllBtnShow, setClearAllBtnShow] = useState(false);

  const [applyBtnDisable, setApplyBtnDisable] = useState(false);

  useEffect(() => {
    const typeMatch = arraysHaveSameValues(
      [selectedTypeData],
      [selectedFilter?.productListingType.selectedValue],
    );

    const categoriesMatch = arraysHaveSameValues(
      categoryId,
      selectedFilter?.categoryId?.selectedValue,
    );

    const shopMatch = arraysHaveSameValues(
      selectedShopData,
      productsFiltersReducer?.appliedProductsFilters?.shopId?.selectedValue,
    );

    const colorsMatch = arraysHaveSameValues(
      selectedColorData,
      selectedFilter?.productColor.selectedValue,
    );
    const priceMatch = areObjectsEqual(
      selectedPriceData,
      selectedFilter?.productPrice.selectedValue,
    );

    if (showOnlyShopDetailPage) {
      const areArraysEqual =
        categoriesMatch && colorsMatch && typeMatch && priceMatch;
      setApplyBtnDisable(areArraysEqual);
    } else {
      const areArraysEqual =
        categoriesMatch && colorsMatch && typeMatch && priceMatch && shopMatch;
      setApplyBtnDisable(areArraysEqual);
    }
  }, [
    categoryId,
    selectedShopData,
    selectedColorData,
    selectedTypeData,
    selectedPriceData,
  ]);

  function areObjectsEqual(objA, objB) {
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (objA[key] !== objB[key]) return false;
    }

    return true;
  }

  useEffect(() => {
    if (selectedCategory === 'Men') {
      if (selectedMenCat?.length > 0) {
        setClearTextShow(true);
      } else {
        setClearTextShow(false);
      }
    } else if (selectedCategory === 'Women') {
      if (selectedWomenCat?.length > 0) {
        setClearTextShow(true);
      } else {
        setClearTextShow(false);
      }
    } else if (selectedCategory === 'Shops') {
      if (selectedShopData?.length > 0) {
        setClearTextShow(true);
      } else {
        setClearTextShow(false);
      }
    } else if (selectedCategory === 'Color') {
      if (selectedColorData?.length > 0) {
        setClearTextShow(true);
      } else {
        setClearTextShow(false);
      }
    } else if (selectedCategory === 'Types') {
      if (selectedTypeData) {
        setClearTextShow(true);
      } else {
        setClearTextShow(false);
      }
    } else if (selectedCategory === 'Price') {
      if (areObjectsEqual(selectedPriceData, priceDefaultData)) {
        setClearTextShow(false);
      } else {
        setClearTextShow(true);
      }
    }
  }, [
    selectedMenCat,
    selectedWomenCat,
    selectedShopData,
    selectedColorData,
    selectedCategory,
    selectedTypeData,
    selectedPriceData,
  ]);

  useEffect(() => {
    if (
      selectedMenCat?.length > 0 ||
      selectedWomenCat?.length > 0 ||
      (!showOnlyShopDetailPage && selectedShopData?.length > 0) ||
      selectedColorData?.length > 0 ||
      selectedTypeData ||
      !areObjectsEqual(selectedPriceData, priceDefaultData)
    ) {
      setClearAllBtnShow(true);
    } else {
      setClearAllBtnShow(false);
    }
  }, [
    selectedMenCat,
    selectedWomenCat,
    selectedShopData,
    selectedColorData,
    selectedCategory,
    selectedTypeData,
    selectedPriceData,
  ]);

  const ClearParticularTab = () => {
    if (selectedCategory === 'Men') {
      setSelectedMenCat([]);
      setMenSelectedData([]);
    } else if (selectedCategory === 'Women') {
      setSelectedWomenCat([]);
      setWomenSelectedData([]);
    } else if (selectedCategory === 'Shops') {
      setSelectedShopData([]);
    } else if (selectedCategory === 'Color') {
      setSelectedColorData([]);
    } else if (selectedCategory === 'Types') {
      setSelectedTypeData('');
    } else if (selectedCategory === 'Price') {
      setSelectedPriceData(priceDefaultData);
    }
  };
  const clearAllFilter = () => {
    setSelectedMenCat([]);
    setMenSelectedData([]);
    setSelectedWomenCat([]);
    setWomenSelectedData([]);
    !showOnlyShopDetailPage && setSelectedShopData([]);
    setSelectedColorData([]);
    setSelectedTypeData('');
    setSelectedPriceData(priceDefaultData);
  };

  const handleCloseProductFilter = () => {
    setShowBottomLoader(false);
    handleFilterModelClose();
  };

  const handleApplyProductFilter = () => {
    const changeFiltersAction = showOnlyShopDetailPage
      ? changeAppliedShopProductsFilters
      : changeAppliedProductsFilters;

    [
      {name: 'categoryId', value: categoryId},
      {name: 'productColor', value: selectedColorData},
      {name: 'shopId', value: selectedShopData},
      {name: 'productListingType', value: selectedTypeData},
      {name: 'productPrice', value: selectedPriceData},
    ]?.map(item =>
      dispatch(
        changeFiltersAction({
          key: item?.name,
          value: {
            selectedValue: item?.value,
          },
        }),
      ),
    );
    handleCloseProductFilter();
  };

  useEffect(() => {
    selectedFilter &&
      setSelectedMenCat(
        selectedFilter?.categoryId?.selectedValue
          .map(itm => categories?.find(i => i.id === itm))
          .filter(ele => ele.category_type === 'Men')
          .map(i => i?.category_name),
      );
    setMenSelectedData(
      selectedFilter?.categoryId?.selectedValue
        .map(itm => categories?.find(i => i.id === itm))
        .filter(ele => ele.category_type === 'Men')
        .map(i => i?.id),
    );

    setSelectedWomenCat(
      selectedFilter?.categoryId?.selectedValue
        .map(itm => categories?.find(i => i.id === itm))
        .filter(ele => ele.category_type === 'Women')
        .map(i => i?.category_name),
    );
    setWomenSelectedData(
      selectedFilter?.categoryId?.selectedValue
        .map(itm => categories?.find(i => i.id === itm))
        .filter(ele => ele.category_type === 'Women')
        .map(i => i?.id),
    );
  }, [categories, selectedFilter]);

  useEffect(() => {
    setCategoryId([...menSelectedData, ...womenSelectedData]);
  }, [menSelectedData, setCategoryId, womenSelectedData]);

  useEffect(() => {
    selectedFilter && setSelectedShopData(selectedFilter?.shopId.selectedValue);
  }, [selectedFilter]);

  useEffect(() => {
    selectedFilter &&
      setSelectedTypeData(selectedFilter.productListingType.selectedValue);
  }, [selectedFilter]);

  useEffect(() => {
    selectedFilter &&
      setSelectedPriceData(selectedFilter.productPrice.selectedValue);
  }, [selectedFilter]);

  useEffect(() => {
    selectedFilter &&
      setSelectedColorData(selectedFilter?.productColor.selectedValue);
  }, [selectedFilter]);

  return (
    <View style={{position: 'relative'}}>
      <View style={[styles.mainListContainer]}>
        <View style={styles.mainLeftList}>
          {AllCateGory?.map(
            (cate, index) =>
              (!showOnlyShopDetailPage || cate !== 'Shops') && (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedCategory(cate)}
                  style={
                    selectedCategory === cate
                      ? styles.catSelNameMain
                      : styles.catNameMain
                  }>
                  <Text
                    style={
                      selectedCategory === cate
                        ? styles.selCatName
                        : styles.CatName
                    }>
                    {cate}
                  </Text>
                </TouchableOpacity>
              ),
          )}
        </View>
        <View style={styles.mainRightList}>
          <View style={styles.chooseMain}>
            {clearTextShow && (
              <TouchableOpacity onPress={() => ClearParticularTab()}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{marginTop: 10, paddingBottom: 55, height: '95%'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedCategory === 'Types' && (
                <ProductTypeTab
                  selectedTypeData={selectedTypeData}
                  setSelectedTypeData={setSelectedTypeData}
                />
              )}

              {(selectedCategory === 'Men' || selectedCategory === 'Women') && (
                <MenWomenTabs
                  categories={categories}
                  selectedCategory={selectedCategory}
                  selectedMenCat={selectedMenCat}
                  setSelectedMenCat={setSelectedMenCat}
                  selectedWomenCat={selectedWomenCat}
                  setSelectedWomenCat={setSelectedWomenCat}
                  setMenSelectedData={setMenSelectedData}
                  setWomenSelectedData={setWomenSelectedData}
                />
              )}
              {!showOnlyShopDetailPage && selectedCategory === 'Shops' && (
                <ProductByShopFilter
                  selectedShopData={selectedShopData}
                  setSelectedShopData={setSelectedShopData}
                />
              )}

              {selectedCategory === 'Color' && (
                <ProductColorFilter
                  productsFiltersReducer={productsFiltersReducer}
                  selectedColorData={selectedColorData}
                  setSelectedColorData={setSelectedColorData}
                />
              )}
              {selectedCategory === 'Price' && (
                <ProductPriceTab
                  selectedPriceData={selectedPriceData}
                  setSelectedPriceData={setSelectedPriceData}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </View>
      <View style={styles.bottomButtonMain}>
        <View style={{width: '36%'}}>
          {clearAllBtnShow && (
            <CustomButton
              name="Clear all"
              color="black"
              borderColor="gray"
              backgroundColor="#FFF"
              onPress={() => clearAllFilter()}
            />
          )}
        </View>
        <View style={{width: '60%'}}>
          <TouchableOpacity disabled={applyBtnDisable ? true : false}>
            <Button
              disabled={applyBtnDisable ? true : false}
              style={{
                backgroundColor: !applyBtnDisable
                  ? '#29977E'
                  : 'rgba(21, 24, 39, 0.10)',
                borderRadius: 8,
                paddingVertical: 1,
              }}
              labelStyle={{fontSize: 16}}
              onPress={() => handleApplyProductFilter()}
              mode="contained">
              Apply
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductApplyFilter;

const styles = StyleSheet.create({
  mainListContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  mainLeftList: {
    width: '35%',
    backgroundColor: 'rgba(21, 24, 39, 0.10)',
  },
  mainRightList: {
    width: '65%',
    paddingBottom: 17,
    paddingHorizontal: 20,
    position: 'relative',
  },
  catSelNameMain: {
    paddingVertical: 17,
    paddingLeft: 17,
    borderLeftWidth: 3,
    borderLeftColor: '#29977E',
    backgroundColor: '#FFF',
  },
  selCatName: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  catNameMain: {
    paddingVertical: 17,
    paddingLeft: 20,
  },
  CatName: {
    color: '#rgba(0, 0, 0, 0.80)',
    fontWeight: '400',
    fontSize: 16,
  },
  chooseMain: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 18,
    zIndex: 1,
  },

  clearText: {
    color: '#181725',
    fontWeight: '500',
    fontSize: 16,
    textDecorationLine: 'underline',
    color: 'blue',
  },
  bottomButtonMain: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderTopColor: 'rgba(24, 23, 37, 0.10)',
    borderTopWidth: 1,
    backgroundColor: '#FFF',
    paddingVertical: 15,
  },
});
