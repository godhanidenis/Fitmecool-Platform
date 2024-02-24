import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import CustomerHeader from '../../components/CustomerHeader';
import {BackGroundStyle} from '../../../CommonStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import ProductCard from '../../components/ProductCard/ProductCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeProductCurrentPage,
  changeProductDataLimit,
  loadMoreProductsStart,
  loadProductsStart,
} from '../../redux/ProductSlice/ProductSlice';
import UpperFilter from '../../common/Customer/UpperFilter';
import {
  changeShopCurrentPage,
  changeShopDataLimit,
  loadMoreShopStart,
  loadShopsStart,
} from '../../redux/ShopSlice/ShopSlice';
import ShopCard from '../../components/ShopCard/ShopCard';
import FilterDrawerModel from '../../common/FilterDrawerModel';
import {
  clothIMG,
  landingBanner4,
  landingBanner5,
  landingBanner6,
  store_Icon,
} from '../../common/AllLiveImageLink';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {shopProductButtonChange} from '../../redux/ShopFilter/ShopFilterSlice';
import FastImage from 'react-native-fast-image';
import CustomSwitch from '../../components/CustomSwitch';

const HomePage = () => {
  const dispatch = useDispatch();

  const {width: screenWidth} = Dimensions.get('window');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const autoplayConfig = {
    autoplay: true,
    autoplayInterval: 2000,
    loop: true,
  };
  const carouselRef = useRef(null);
  const TopCarouselData = [
    {image: landingBanner4},
    {image: landingBanner5},
    {image: landingBanner6},
  ];

  const productsFiltersReducer = useSelector(
    state => state.productsFiltersReducer,
  );
  const shopsFiltersReducer = useSelector(state => state?.shopsFiltersReducer);

  const {
    productsCount,
    numOfPages,
    productCurrentPage,
    productDataLimit,
    productsData,
    productLoading,
  } = useSelector(state => state.productsData);

  const {
    shopsCount,
    numOfPages: shopNumOfPages,
    shopCurrentPage,
    shopDataLimit,
    shopsData,
    loading: shopLoading,
  } = useSelector(state => state?.shops);

  const {appliedCityFilter} = useSelector(state => state?.cityFiltersReducer);

  const {byShop} = useSelector(state => state?.shopsFiltersReducer);

  const [showBottomLoader, setShowBottomLoader] = useState(false);
  const [filterModelOpen, setFilterModelOpen] = useState(false);

  const pageProductLimit = 12;
  const pageShopLimit = 12;

  const getAllMoreProducts = () => {
    dispatch(
      loadMoreProductsStart({
        pageData: {
          skip: productDataLimit,
          limit: pageProductLimit,
        },
        filter: {
          category_id:
            productsFiltersReducer.appliedProductsFilters.categoryId
              .selectedValue,
          product_color:
            productsFiltersReducer.appliedProductsFilters.productColor
              .selectedValue,
          product_price: {
            min: productsFiltersReducer?.appliedProductsFilters.productPrice
              .selectedValue.min,
            max: productsFiltersReducer?.appliedProductsFilters.productPrice
              .selectedValue.max,
          },
          product_listing_type:
            productsFiltersReducer.appliedProductsFilters.productListingType
              .selectedValue,
        },
        shopId:
          productsFiltersReducer.appliedProductsFilters.shopId.selectedValue,
        sort: productsFiltersReducer.sortFilters.sortType.selectedValue,
        search:
          productsFiltersReducer.appliedProductsFilters.searchBarData
            .selectedValue,
        city: appliedCityFilter?.city?.selectedValue,
      }),
    );
  };

  const getAllProducts = () => {
    dispatch(
      loadProductsStart({
        pageData: {
          skip: 0,
          limit: pageProductLimit,
        },
        filter: {
          category_id:
            productsFiltersReducer.appliedProductsFilters.categoryId
              .selectedValue,
          product_color:
            productsFiltersReducer.appliedProductsFilters.productColor
              .selectedValue,
          product_price: {
            min: productsFiltersReducer?.appliedProductsFilters.productPrice
              .selectedValue.min,
            max: productsFiltersReducer?.appliedProductsFilters.productPrice
              .selectedValue.max,
          },
          product_listing_type:
            productsFiltersReducer.appliedProductsFilters.productListingType
              .selectedValue,
        },
        shopId:
          productsFiltersReducer.appliedProductsFilters.shopId.selectedValue,
        sort: productsFiltersReducer.sortFilters.sortType.selectedValue,
        search:
          productsFiltersReducer.appliedProductsFilters.searchBarData
            .selectedValue,
        city: appliedCityFilter?.city?.selectedValue,
      }),
    );
  };

  // useFocusEffect(React.useCallback(() => {}, []));

  const handleProductScroll = event => {
    setShowBottomLoader(true);
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const isEndReached =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (!byShop) {
      if (isEndReached && !productLoading) {
        if (productCurrentPage < numOfPages) {
          dispatch(changeProductCurrentPage(productCurrentPage + 1));
          dispatch(changeProductDataLimit(productDataLimit + pageProductLimit));
        }
      }
    } else {
      if (isEndReached && !shopLoading) {
        if (shopCurrentPage < shopNumOfPages) {
          dispatch(changeShopCurrentPage(shopCurrentPage + 1));
          dispatch(changeShopDataLimit(shopDataLimit + pageShopLimit));
        }
      }
    }
  };

  const getAllMoreShops = () => {
    dispatch(
      loadMoreShopStart({
        pageData: {
          skip: shopDataLimit,
          limit: pageShopLimit,
        },
        area: shopsFiltersReducer?.appliedShopsFilters?.locations?.selectedValue?.map(
          itm => itm.pin,
        ),
        sort: shopsFiltersReducer.sortFilters.sortType.selectedValue,
        stars: shopsFiltersReducer.appliedShopsFilters.stars.selectedValue,
        city: appliedCityFilter?.city?.selectedValue,
      }),
    );
  };
  const getAllShops = () => {
    dispatch(
      loadShopsStart({
        pageData: {
          skip: 0,
          limit: pageShopLimit,
        },
        area: shopsFiltersReducer?.appliedShopsFilters?.locations?.selectedValue?.map(
          itm => itm.pin,
        ),
        sort: shopsFiltersReducer.sortFilters.sortType.selectedValue,
        stars: shopsFiltersReducer.appliedShopsFilters.stars.selectedValue,
        city: appliedCityFilter?.city?.selectedValue,
      }),
    );
  };

  useEffect(() => {
    dispatch(changeShopCurrentPage(0));
    dispatch(changeShopDataLimit(0));
    getAllShops();
  }, [
    dispatch,
    shopsFiltersReducer.appliedShopsFilters,
    shopsFiltersReducer.sortFilters,
    appliedCityFilter?.city?.selectedValue,
  ]);

  useEffect(() => {
    if (shopDataLimit > 0) {
      getAllMoreShops();
    }
  }, [dispatch, shopDataLimit]);

  useEffect(() => {
    dispatch(changeProductCurrentPage(0));
    dispatch(changeProductDataLimit(0));
    getAllProducts();
  }, [
    dispatch,
    productsFiltersReducer.appliedProductsFilters,
    productsFiltersReducer.sortFilters,
    productsFiltersReducer.searchBarData,
    appliedCityFilter?.city?.selectedValue,
  ]);

  useEffect(() => {
    if (productDataLimit > 0) {
      getAllMoreProducts();
    }
  }, [dispatch, productDataLimit]);

  const CarouselRenderItem = ({item}) => (
    <View style={styles.sliderMainView}>
      <View style={{width: '100%'}}>
        <FastImage
          style={{
            height: '100%',
            width: '100%',
          }}
          source={{
            uri: item?.image,
            cache: FastImage.cacheControl.web,
          }}
          resizeMode="stretch"
        />
      </View>
    </View>
  );

  const onChangeLeftSwitch = () => {
    dispatch(shopProductButtonChange(false));
  };
  const onChangeRightSwitch = () => {
    dispatch(shopProductButtonChange(true));
  };

  const handleRefresh = () => {
    dispatch(changeProductCurrentPage(0));
    dispatch(changeProductDataLimit(0));
    getAllProducts();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <View style={{flex: 1, backgroundColor: BackGroundStyle}}>
      <FilterDrawerModel
        filterModelOpen={filterModelOpen}
        handleFilterModelClose={() => setFilterModelOpen(false)}
        setShowBottomLoader={setShowBottomLoader}
      />
      <View style={{position: 'relative'}}>
        <CustomerHeader homeScreen={true} />
      </View>

      <View style={styles.FilterBtnMain}>
        <TouchableOpacity
          onPress={() => setFilterModelOpen(true)}
          style={styles.filterButton}>
          <Icon name="filter" size={18} color="white" />
          <Text style={styles.filterBtnText}>Filters</Text>
        </TouchableOpacity>
        <CustomSwitch
          homePage={true}
          onClickLeft={() => onChangeLeftSwitch()}
          onClickRight={() => onChangeRightSwitch()}
          imgLeftIcon={clothIMG}
          imgRightIcon={store_Icon}
          switchVisibility={byShop}
        />
      </View>

      <View style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          onScroll={handleProductScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <View>
            <Carousel
              ref={carouselRef}
              data={TopCarouselData}
              renderItem={CarouselRenderItem}
              sliderWidth={screenWidth}
              itemWidth={screenWidth}
              onSnapToItem={index => setActiveSlide(index)}
              {...autoplayConfig}
            />
            <Pagination
              dotsLength={TopCarouselData?.length}
              activeDotIndex={activeSlide}
              containerStyle={{
                paddingTop: 10,
                paddingBottom: 0,
              }}
            />
          </View>
          <View style={styles.mainContainer}>
            <View>
              <UpperFilter
                byShop={byShop}
                setShowBottomLoader={setShowBottomLoader}
                showOnlyShopDetailPage={false}
                shopsCount={shopsCount}
                productsCount={productsCount}
              />
            </View>
            <View style={{position: 'relative'}}>
              {!byShop ? (
                productLoading && productsData?.length === 0 ? (
                  <View style={styles.loaderDiv}>
                    <ActivityIndicator color="green" />
                  </View>
                ) : productsData?.length > 0 ? (
                  <View style={[styles.productCardMain]}>
                    {productsData?.map((product, index) => (
                      <ProductCard key={product?.id} product={product} />
                    ))}
                    {productLoading &&
                      productsData?.length > 0 &&
                      productCurrentPage !== numOfPages &&
                      showBottomLoader && (
                        <View style={styles.loaderBottomDiv}>
                          <ActivityIndicator color="green" />
                        </View>
                      )}
                    {productLoading &&
                      productsData?.length > 0 &&
                      !showBottomLoader && (
                        <View style={styles.loaderFilterDiv}>
                          <ActivityIndicator color="green" />
                        </View>
                      )}

                    {productLoading &&
                      productsData?.length > 0 &&
                      !showBottomLoader && (
                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: '#fffdfd82',
                            top: 0,
                            width: '100%',
                            height: '100%',
                          }}></View>
                      )}
                  </View>
                ) : (
                  <Text style={styles.noDataText}>No Product Available</Text>
                )
              ) : shopLoading && shopsData?.length === 0 ? (
                <View style={styles.loaderDiv}>
                  <ActivityIndicator color="green" />
                </View>
              ) : shopsData?.length > 0 ? (
                <View style={[styles.productCardMain]}>
                  {shopsData?.map((shop, index) => (
                    <ShopCard key={shop?.id} shop={shop} />
                  ))}
                  {shopLoading &&
                    shopsData?.length > 0 &&
                    shopCurrentPage !== shopNumOfPages &&
                    showBottomLoader && (
                      <View style={styles.loaderBottomDiv}>
                        <ActivityIndicator color="green" />
                      </View>
                    )}
                  {shopLoading &&
                    shopsData?.length > 0 &&
                    !showBottomLoader && (
                      <View style={styles.loaderFilterDiv}>
                        <ActivityIndicator color="green" />
                      </View>
                    )}

                  {shopLoading &&
                    shopsData?.length > 0 &&
                    !showBottomLoader && (
                      <View
                        style={{
                          position: 'absolute',
                          backgroundColor: '#fffdfd82',
                          top: 0,
                          width: '100%',
                          height: '100%',
                        }}></View>
                    )}
                </View>
              ) : (
                <Text style={styles.noDataText}>No Shop Available</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 15,
  },
  productText: {
    color: '#151827',
    fontWeight: '600',
    fontSize: 20,
  },

  productCardMain: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
    marginTop: 4,
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '100%',
    position: 'relative',
  },
  loaderDiv: {
    marginVertical: 100,
  },
  loaderBottomDiv: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
    position: 'absolute',
    bottom: 30,
  },
  loaderFilterDiv: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
    position: 'absolute',
    top: 150,
  },
  FilterBtnMain: {
    position: 'absolute',
    bottom: 10,
    zIndex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#29977E',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
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
  sliderMainView: {
    width: '100%',
    height: 150,
    flexDirection: 'row',
  },
  noDataText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '400',
    alignSelf: 'center',
    marginTop: 100,
  },
});
