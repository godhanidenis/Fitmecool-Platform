import {
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {BackGroundStyle, FontStyle} from '../../../../../CommonStyle';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {Skeleton, useToast} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../../../../common/CustomButton';
import ProductCard from '../../../../components/ProductCard/ProductCard';
import {
  getShopDetails,
  getShopFollowers,
  getShopReviews,
} from '../../../../graphql/queries/shopQueries';
import ShopAllReviewSection from '../../../../components/ShopAllReviewSection';
import UpperFilter from '../../../../common/Customer/UpperFilter';
import FilterDrawerModel from '../../../../common/FilterDrawerModel';
import TablePagination from '../../../../components/TablePagination';
import {
  locationIcon,
  shopBackgroundCover3,
} from '../../../../common/AllLiveImageLink';
import {Avatar} from 'react-native-paper';
import FollowConfirmationModel from '../../../../common/Customer/FollowConfirmationModel';
import {shopFollow} from '../../../../graphql/mutations/shops';
import {shopFollowToggle} from '../../../../redux/LoginUserProfileSlice/userSlice';
import FastImage from 'react-native-fast-image';
import {
  changeAppliedShopProductsFilters,
  emptyShopProductFilter,
} from '../../../../redux/ShopProductFilter/ShopProductFilterSlice';
import {
  changeShopProductPageSkip,
  loadShopProductsStart,
} from '../../../../redux/ShopProductSlice/ShopProductSlice';

const ShopIndividual = () => {
  const route = useRoute();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {shopId} = route?.params?.state ?? route?.params?.state;

  const {
    productsCount,
    numOfPages,
    productsData,
    PaginationProductLimit,
    productPageSkip,
    productLoading,
  } = useSelector(state => state?.shopProductsData);

  const {userProfile, isAuthenticate} = useSelector(state => state?.user);

  const shopProductsFiltersReducer = useSelector(
    state => state?.shopProductsFiltersReducer,
  );

  const [shopDetails, setShopDetails] = useState({});
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [shopReviews, setShopReviews] = useState([]);
  const [shopFollowByUser, setShopFollowByUser] = useState(false);
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [, setShowBottomLoader] = useState(false);
  const [filterModelOpen, setFilterModelOpen] = useState(false);
  const scrollViewRef = useRef(null);
  const reviewSectionRef = useRef(null);

  const handleScrollToReviewClick = () => {
    if (scrollViewRef.current && reviewSectionRef.current) {
      reviewSectionRef.current.measureLayout(
        scrollViewRef.current.getInnerViewNode(),
        (x, y, width, height) => {
          scrollViewRef.current.scrollTo({y, animated: true});
        },
      );
    }
  };

  const getAllFollowers = () => {
    getShopFollowers({id: shopId}).then(res =>
      setTotalFollowers(res?.data?.shopFollower?.length),
    );
  };

  const getAllReviews = () => {
    getShopReviews({id: shopId}).then(res =>
      setShopReviews(res.data.shopReview),
    );
  };

  const getShopDetailFromApi = async () => {
    const shopDetails = await getShopDetails({id: shopId});
    setShopDetails(shopDetails?.data?.shop);
  };

  const getAllProducts = () => {
    dispatch(
      loadShopProductsStart({
        pageData: {
          skip: productPageSkip,
          limit: PaginationProductLimit,
        },
        filter: {
          category_id:
            shopProductsFiltersReducer?.appliedShopProductsFilters.categoryId
              .selectedValue,
          product_color:
            shopProductsFiltersReducer?.appliedShopProductsFilters.productColor
              .selectedValue,
          product_price: {
            min: shopProductsFiltersReducer?.appliedShopProductsFilters
              .productPrice.selectedValue.min,
            max: shopProductsFiltersReducer?.appliedShopProductsFilters
              .productPrice.selectedValue.max,
          },
          product_listing_type:
            shopProductsFiltersReducer?.appliedShopProductsFilters
              .productListingType.selectedValue,
        },
        shopId:
          shopProductsFiltersReducer?.appliedShopProductsFilters.shopId
            .selectedValue,
        sort: shopProductsFiltersReducer?.shopSortFilters?.sortType
          .selectedValue,
        search:
          shopProductsFiltersReducer?.appliedShopProductsFilters.searchBarData
            .selectedValue,
      }),
    );
  };

  const handlePageChange = pageNumber => {
    const newSkip = (pageNumber - 1) * PaginationProductLimit;
    dispatch(changeShopProductPageSkip(newSkip));
  };

  const shareContent = async () => {
    try {
      await Share.share({
        message: `https://www.fitmecool.com/shop/${shopDetails?.shop_name?.replaceAll(
          ' ',
          '-',
        )}/${shopId}/`,
      });
    } catch (error) {
      console.error('Error sharing content:', error.message);
    }
  };

  const clickedByFollow = () => {
    if (isAuthenticate) {
      shopFollow({
        shopInfo: {
          shop_id: shopDetails?.id,
          user_id: userProfile?.id,
        },
      }).then(
        res => {
          dispatch(
            !shopFollowByUser
              ? shopFollowToggle({
                  shopInfo: {
                    key: 'follow',
                    value: res?.data?.shopFollower?.data,
                  },
                })
              : shopFollowToggle({
                  shopInfo: {
                    key: 'unFollow',
                    value: shopDetails?.id,
                  },
                }),
          );
          toast.show({
            title: res?.data?.shopFollower?.message,
            placement: 'top',
            backgroundColor: 'green.600',
            variant: 'solid',
          });
        },
        error => {
          toast.show({
            title: error.message,
            placement: 'top',
            backgroundColor: 'red.600',
            variant: 'solid',
          });
        },
      );
    } else {
      navigation.navigate('LoginMainScreen');
    }
  };

  useEffect(() => {
    if (!isAuthenticate) {
      setShopFollowByUser(false);
    }

    const followedShopsByUser = userProfile?.shop_follower_list?.find(
      itm => itm?.shop_id === shopId,
    );

    followedShopsByUser
      ? setShopFollowByUser(true)
      : setShopFollowByUser(false);
  }, [isAuthenticate, shopId, userProfile]);

  useEffect(() => {
    shopId && getShopDetailFromApi();
  }, [shopId]);

  useEffect(() => {
    dispatch(emptyShopProductFilter());
    shopId &&
      dispatch(
        changeAppliedShopProductsFilters({
          key: 'shopId',
          value: {
            selectedValue: [shopId],
          },
        }),
      );
  }, [dispatch, shopId]);

  useEffect(() => {
    getAllReviews();
    getAllFollowers();
  }, [dispatch, userProfile, isFocused]);

  useEffect(() => {
    if (
      shopProductsFiltersReducer?.appliedShopProductsFilters?.shopId
        ?.selectedValue?.length > 0 &&
      shopProductsFiltersReducer?.appliedShopProductsFilters?.shopId
        ?.selectedValue[0] === shopId
    ) {
      getAllProducts();
    }
  }, [
    dispatch,
    shopProductsFiltersReducer?.appliedShopProductsFilters,
    shopProductsFiltersReducer.shopSortFilters,
    productPageSkip,
  ]);
  return (
    <View style={{flex: 1, backgroundColor: BackGroundStyle}}>
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
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <View style={{position: 'relative'}}>
          {shopDetails?.shop_cover_image?.large ? (
            <FastImage
              style={{width: '100%', height: 160}}
              source={{
                uri: shopDetails?.shop_cover_image?.large,
                // cache: FastImage.cacheControl.web,
              }}
              resizeMode="stretch"
            />
          ) : (
            <View
              style={{
                width: '100%',
              }}>
              {/* <Skeleton
                startColor="#00000031"
                endColor="gray.200"
                height={160}
              /> */}
              <FastImage
                style={{width: '100%', height: 160}}
                source={{
                  uri: shopBackgroundCover3,
                  cache: FastImage.cacheControl.web,
                }}
                resizeMode="stretch"
              />
            </View>
          )}

          <TouchableOpacity
            style={{position: 'absolute', top: 10, left: 14}}
            onPress={() =>
              navigation.navigate('CustomerHomePage', {
                state: {resetFilter: true},
              })
            }>
            <Icon name="angle-left" size={30} color="black" />
          </TouchableOpacity>
          <View style={{marginTop: -30}}>
            <View style={styles.mainHeaderContainer}>
              <View style={styles.shopLogoMainDiv}>
                {shopDetails?.shop_logo?.medium ? (
                  <FastImage
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: 'rgba(255,255,255,0.5)',
                    }}
                    source={{
                      uri: shopDetails?.shop_logo?.medium,
                      // cache: FastImage.cacheControl.web,
                    }}
                    resizeMode="cover"
                  />
                ) : shopDetails?.shop_name ? (
                  <Avatar.Text
                    size={64}
                    label={shopDetails?.shop_name?.charAt(0)}
                    backgroundColor="#29977E"
                  />
                ) : (
                  <Skeleton
                    startColor="#29977E"
                    endColor="#00000031"
                    height={100}
                    width={100}
                    borderRadius={50}
                  />
                )}
              </View>
              <View style={styles.topInnerMain}>
                <View style={{width: '70%'}}>
                  <Text numberOfLines={2} style={styles.firstText}>
                    {shopDetails?.shop_name}
                  </Text>
                  <Text numberOfLines={2} style={styles.secText}>
                    {
                      "Let's be Effortlessly Cool: Embrace Your Signature Style with Us"
                    }
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={{uri: locationIcon}}
                      style={{
                        width: 10,
                        height: 10,
                        tintColor: 'red',
                        marginTop: 4,
                      }}
                    />
                    <Text numberOfLines={2} style={styles.thirdText}>
                      {shopDetails?.branch_info?.map(
                        itm =>
                          itm?.branch_type === 'main' && itm?.branch_address,
                      )}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Branches', {
                        state: {shopDetails: shopDetails},
                      })
                    }>
                    <Text style={styles.seeBranchLink}>See Branches</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.followBtnMain}>
                  <View style={{width: '100%'}}>
                    <CustomButton
                      name={shopFollowByUser ? 'Following' : 'Follow'}
                      color="white"
                      backgroundColor="#29977E"
                      borderColor="#29977E"
                      onPress={() => {
                        shopFollowByUser
                          ? setFollowModalVisible(true)
                          : clickedByFollow();
                      }}
                      icon={!shopFollowByUser && true}
                      iconName="plus"
                    />
                  </View>
                  {followModalVisible && (
                    <FollowConfirmationModel
                      followModalVisible={followModalVisible}
                      setFollowModalVisible={setFollowModalVisible}
                      shopFollowByUser={shopFollowByUser}
                      shopDetails={shopDetails}
                    />
                  )}
                </View>
              </View>
              <View style={styles.cardBottomMain}>
                <View style={styles.bottomItemDiv}>
                  <Text style={styles.bottomTitleText}>
                    <Icon name="shopping-cart" size={16} color="white" />{' '}
                    Product
                  </Text>
                  <Text style={styles.numText}>{productsCount}</Text>
                </View>
                <View style={styles.bottomItemDiv}>
                  <Text style={styles.bottomTitleText}>
                    <Icon name="user-o" size={16} color="white" /> Followers
                  </Text>
                  <Text style={styles.numText}>{totalFollowers}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleScrollToReviewClick()}
                  style={styles.bottomItemDiv}>
                  <Text style={styles.bottomTitleText}>
                    <Icon name="pencil-square-o" size={16} color="white" />{' '}
                    Reviews
                  </Text>
                  <Text style={styles.numText}>{shopReviews?.length}</Text>
                </TouchableOpacity>
                <View style={styles.bottomItemDiv}>
                  <TouchableOpacity onPress={() => shareContent()}>
                    <Text style={styles.bottomTitleText}>
                      <Icon name="share" size={16} color="white" /> Share
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.mainContainer}>
              <View style={{}}>
                <UpperFilter
                  byShop={false}
                  showOnlyShopDetailPage={true}
                  productsCount={productsCount}
                />
              </View>

              {productLoading && productsData?.length === 0 ? (
                <View style={{marginVertical: 35}}>
                  <ActivityIndicator />
                </View>
              ) : productsData?.length > 0 ? (
                <View style={[styles.productCardMain]}>
                  {productsData?.map((product, index) => (
                    <ProductCard product={product} key={product?.id} />
                  ))}
                  {productLoading && productsData?.length > 0 && (
                    <View style={styles.loaderFilterDiv}>
                      <ActivityIndicator color="green" />
                    </View>
                  )}
                  {productLoading && productsData?.length > 0 && (
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
                <Text style={styles.noProductText}>No Product Available</Text>
              )}

              <View>
                {productsCount > PaginationProductLimit && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginBottom: 15,
                    }}>
                    <TablePagination
                      // totalItems={productsCount}
                      // itemsPerPage={2}
                      numOfPages={numOfPages}
                      onPageChange={handlePageChange}
                    />
                  </View>
                )}
              </View>

              <View ref={reviewSectionRef}>
                <ShopAllReviewSection
                  shopReviews={shopReviews}
                  viewAllBtn={false}
                  shopDetails={shopDetails}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopIndividual;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    marginTop: 2,
  },
  mainHeaderContainer: {
    width: '94%',
    backgroundColor: '#151827',
    borderRadius: 20,
    alignSelf: 'center',
  },
  shopLogoMainDiv: {
    position: 'absolute',
    top: '-18%',
    zIndex: 1,
    alignSelf: 'center',
  },
  topInnerMain: {
    marginHorizontal: 15,
    marginVertical: 15,
    flexDirection: 'row',
    paddingTop: 45,
    gap: 6,
  },
  firstText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: FontStyle,
    paddingBottom: 3,
  },
  secText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: FontStyle,
    width: 230,
    paddingBottom: 3,
  },
  thirdText: {
    color: 'rgba(255, 255, 255, 0.64)',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: FontStyle,
    width: 190,
  },

  followBtnMain: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    width: '27%',
  },
  cardBottomMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1F2233',
    borderRadius: 20,
  },
  bottomTitleText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '400',
  },
  numText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomItemDiv: {
    alignItems: 'center',
  },
  productTitleDiv: {
    color: '#151827',
    fontWeight: '600',
    fontSize: 18,
  },

  productCardMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    position: 'relative',
    alignSelf: 'center',
    width: '100%',
    marginTop: 6,
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
  loaderFilterDiv: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
    position: 'absolute',
    top: 150,
  },
  seeBranchLink: {
    color: '#3ac1a8',
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 5,
  },
  noProductText: {
    color: '#151827',
    fontSize: 16,
    fontWeight: '400',
    alignSelf: 'center',
    paddingVertical: 120,
  },
});
