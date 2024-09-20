import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BackGroundStyle, FontStyle} from '../../../../CommonStyle';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating-widget';
import ProductCard from '../../../components/ProductCard/ProductCard';
import {getProductDetails} from '../../../graphql/queries/productQueries';
import RenderHTML from 'react-native-render-html';
import {useDispatch, useSelector} from 'react-redux';
import {
  productContactInquiry,
  productLike,
  productWhatsappInquiry,
} from '../../../graphql/mutations/products';
import {
  productLikeToggle,
  shopFollowToggle,
} from '../../../redux/LoginUserProfileSlice/userSlice';
import {Skeleton, useToast} from 'native-base';
import {shopFollow} from '../../../graphql/mutations/shops';
import {Modal} from 'react-native';
import {Share} from 'react-native';
import {Avatar, Divider} from 'react-native-paper';
import {locationIcon} from '../../../common/AllLiveImageLink';
import FastImage from 'react-native-fast-image';
// import Carousel, {Pagination} from 'react-native-snap-carousel';
import Carousel from 'react-native-reanimated-carousel';
import Video from 'react-native-video';

const ProductDetail = () => {
  const route = useRoute();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {productId} = route?.params?.state ?? route?.params?.state;
  const [productDetails, setProductDetails] = useState({});
  const [productLikeByUser, setProductLikeByUser] = useState(false);
  const [shopFollowByUser, setShopFollowByUser] = useState(false);
  const {userProfile, isAuthenticate} = useSelector(state => state?.user);
  const [showContactModalOpen, setShowContactModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [shopOldDate, setShopOldDate] = useState('');
  const {width: screenWidth} = Dimensions.get('window');

  const finalPrice =
    productDetails?.data?.product?.data?.product_price -
    productDetails?.data?.product?.data?.product_price *
      (productDetails?.data?.product?.data?.product_discount / 100);
  const getProductDetail = async () => {
    const productDetails = await getProductDetails({id: productId});
    setProductDetails(productDetails);
  };

  const clickedByFollow = () => {
    if (isAuthenticate) {
      shopFollow({
        shopInfo: {
          shop_id: productDetails?.data?.product?.data?.branchInfo?.shop_id,
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
                    value:
                      productDetails?.data?.product?.data?.branchInfo?.shop_id,
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
      navigation.navigate('Login');
    }
  };

  const shopCreateDate = new Date(
    Number(
      productDetails?.data?.product?.data.branchInfo?.shop_info?.createdAt,
    ),
  );
  useEffect(() => {
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - shopCreateDate;
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (24 * 60 * 60 * 1000),
    );
    setShopOldDate(differenceInDays);
  }, [shopCreateDate]);

  useEffect(() => {
    if (!isAuthenticate) {
      setShopFollowByUser(false);
    }

    const followedShopsByUser = userProfile?.shop_follower_list?.find(
      itm =>
        itm?.shop_id ===
        productDetails?.data?.product?.data?.branchInfo?.shop_id,
    );

    followedShopsByUser
      ? setShopFollowByUser(true)
      : setShopFollowByUser(false);
  }, [
    isAuthenticate,
    productDetails?.data?.product?.data?.branchInfo?.shop_id,
    productDetails.data?.product?.data?.id,
    userProfile,
  ]);

  const clickedByLike = () => {
    if (isAuthenticate) {
      productLike({
        productInfo: {
          product_id: productId,
          user_id: userProfile?.id,
        },
      }).then(
        res => {
          dispatch(
            !productLikeByUser
              ? productLikeToggle({
                  productInfo: {
                    key: 'like',
                    value: res.data.productLike.data,
                  },
                })
              : productLikeToggle({
                  productInfo: {
                    key: 'disLike',
                    value: productId,
                  },
                }),
          );
          toast.show({
            title: res?.data?.productLike?.message,
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
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    if (!isAuthenticate) {
      setProductLikeByUser(false);
    }

    const likedProductByUser = userProfile?.product_like_list?.find(
      itm => itm?.id === productId,
    );

    likedProductByUser
      ? setProductLikeByUser(true)
      : setProductLikeByUser(false);
  }, [isAuthenticate, productId, userProfile]);

  useEffect(() => {
    getProductDetail();
  }, [route, productId]);

  const TopCarouselData = [
    {
      image: productDetails?.data?.product?.data?.product_image?.front?.large,
      type: 'image',
    },
    {
      image: productDetails?.data?.product?.data?.product_image?.back?.large,
      type: 'image',
    },
    {
      image: productDetails?.data?.product?.data?.product_image?.side?.large,
      type: 'image',
    },
  ];

  if (productDetails?.data?.product?.data?.product_video) {
    TopCarouselData.push({
      // video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      video: productDetails?.data?.product?.data?.product_video,
      type: 'video',
    });
  }

  const autoplayConfig = {
    autoplay: false,
    // autoplayInterval: 3000,
    loop: false,
  };

  const CarouselRenderItem = ({item}) => (
    <View style={styles.sliderMainView}>
      <View style={{width: '100%'}}>
        {item?.type === 'image' ? (
          <FastImage
            style={{
              height: '100%',
              width: '100%',
              // borderRadius: 8,
            }}
            source={{
              uri: item?.image,
              cache: FastImage.cacheControl.web,
            }}
            resizeMode="cover"
          />
        ) : (
          item?.video && (
            <Video
              source={{
                uri: item?.video,
              }}
              style={{width: '100%', height: '100%', borderRadius: 6}}
              controls={true}
              autoplay={false}
              resizeMode="cover"
            />
          )
        )}
      </View>
    </View>
  );

  const shareContent = async () => {
    try {
      await Share.share({
        message: `https://www.fitmecool.com/product/${productDetails?.data?.product?.data?.product_name?.replaceAll(
          ' ',
          '-',
        )}/${productId}/`,
      });
    } catch (error) {
      console.error('Error sharing content:', error.message);
    }
  };

  const openWhatsAppChat = async () => {
    productWhatsappInquiry({
      id: productDetails?.data?.product?.data.id,
    });

    const productLink = `https://www.fitmecool.com/product/${productDetails?.data?.product?.data?.product_name?.replaceAll(
      ' ',
      '-',
    )}/${productId}/`;

    const message = `Hello there 🙂,\n\nI'm interested in this product.\n\n${productLink}\n\nInquire via FitMeCool 🎉`;

    const phoneNumber = `+91${productDetails?.data?.product?.data?.branchInfo?.manager_contact}`;
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    Linking.openURL(url);
  };

  return (
    <View style={{flex: 1, backgroundColor: BackGroundStyle}}>
      <View style={styles.productHeaderMain}>
        <View style={styles.leftMainDiv}>
          <TouchableOpacity
            style={{
              width: 26,
              height: 26,
              paddingLeft: 5,
            }}
            onPress={() => navigation.goBack()}>
            <Icon name="angle-left" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ShopIndividual', {
                state: {
                  shopId:
                    productDetails?.data?.product?.data?.branchInfo?.shop_id,
                },
              })
            }>
            {productDetails?.data?.product?.data?.branchInfo?.shop_info
              .shop_logo?.small ? (
              <FastImage
                source={{
                  uri: productDetails?.data?.product?.data?.branchInfo
                    ?.shop_info.shop_logo?.small,
                  cache: FastImage.cacheControl.web,
                }}
                style={{width: 42, height: 42, borderRadius: 22}}
              />
            ) : productDetails?.data?.product?.data?.branchInfo?.shop_info
                ?.shop_name ? (
              <Avatar.Text
                size={42}
                label={productDetails?.data?.product?.data?.branchInfo?.shop_info?.shop_name?.charAt(
                  0,
                )}
                backgroundColor="#29977E"
              />
            ) : (
              <Skeleton
                startColor="#00000031"
                endColor="gray.200"
                height={42}
                width={42}
                borderRadius={22}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={() =>
              navigation.navigate('ShopIndividual', {
                state: {
                  shopId:
                    productDetails?.data?.product?.data?.branchInfo?.shop_id,
                },
              })
            }>
            <Text style={styles.productHeadNameText}>
              {
                productDetails?.data?.product?.data?.branchInfo?.shop_info
                  ?.shop_name
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <StarRating
            starSize={17}
            starStyle={{marginHorizontal: 0}}
            rating={Math.round(
              productDetails?.data?.product?.data?.branchInfo?.shop_info
                ?.shop_rating,
            )}
            maxStars={5}
            emptyColor="#CCCFD2"
            onChange={() => {}}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
            }}>
            <Image
              source={{uri: locationIcon}}
              style={{width: 12, height: 12, tintColor: 'white'}}
            />
            <Text numberOfLines={1} style={styles.locationText}>
              {productDetails?.data?.product?.data?.branchInfo?.branch_address}
            </Text>
          </View>
        </View>
        <View style={styles.rightMainDiv}>
          <TouchableOpacity
            onPress={() => clickedByFollow()}
            style={styles.followBtn}>
            {!shopFollowByUser && <Icon name="plus" size={14} color="white" />}
            {shopFollowByUser && <Icon name="minus" size={14} color="white" />}
            <Text style={styles.followBtnText}>
              {shopFollowByUser ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{position: 'relative'}}>
          <View style={styles.carouselMain}>
            <View style={{position: 'relative'}}>
              {productDetails?.data?.product?.data?.product_image?.front ? (
                // <Carousel
                //   data={TopCarouselData}
                //   renderItem={CarouselRenderItem}
                //   sliderWidth={screenWidth}
                //   itemWidth={screenWidth}
                //   onSnapToItem={index => setActiveSlide(index)}
                //   {...autoplayConfig}
                // />
                <Carousel
                  loop
                  width={300}
                  height={200}
                  data={TopCarouselData}
                  renderItem={CarouselRenderItem}
                />
              ) : (
                <Skeleton
                  startColor="#00000031"
                  endColor="gray.200"
                  height={460}
                />
              )}
              {/* <View style={styles.sliderPagination}>
                <Pagination
                  dotsLength={TopCarouselData?.length}
                  activeDotIndex={activeSlide}
                />
              </View> */}
            </View>
            <View style={styles.threeIconMain}>
              <TouchableOpacity
                onPress={() => clickedByLike()}
                style={styles.iconBG}>
                <Icon
                  name={productLikeByUser ? 'heart' : 'heart-o'}
                  size={25}
                  color={productLikeByUser ? 'red' : '#29977E'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => shareContent()}
                style={styles.iconBG}>
                <Icon name="share-alt" size={25} color="#29977E" />
              </TouchableOpacity>
            </View>
            {productDetails?.data?.product?.data?.product_listing_type && (
              <View
                style={[
                  styles.rentSellRebinMain,
                  {
                    backgroundColor:
                      productDetails?.data?.product?.data
                        ?.product_listing_type === 'rent'
                        ? '#ff3b3b'
                        : '#29977E',
                  },
                ]}>
                <Text style={styles.rebinText}>
                  {productDetails?.data?.product?.data?.product_listing_type}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.mainContainer}>
            <View style={styles.proNameMain}>
              <Text style={styles.proNameText}>
                {productDetails?.data?.product?.data?.product_name}
              </Text>
              <TouchableOpacity onPress={() => clickedByLike()}>
                <Icon
                  name={productLikeByUser ? 'heart' : 'heart-o'}
                  size={30}
                  color={productLikeByUser ? 'red' : 'black'}
                />
              </TouchableOpacity>
            </View>
            <Divider bold={true} style={{marginVertical: 8}} />

            {productDetails?.data?.product?.data?.product_price_visible && (
              <View style={styles.priceMainDiv}>
                <Text style={styles.finalPriceText}>
                  ₹{Math.round(finalPrice)}
                </Text>

                <Text style={styles.productPriceText}>
                  ₹
                  {Math.round(
                    productDetails?.data?.product?.data?.product_price,
                  )}
                </Text>
                <Text style={styles.percentageText}>
                  (
                  {Math.round(
                    productDetails?.data?.product?.data?.product_discount,
                  )}
                  % off)
                </Text>
              </View>
            )}

            <Text style={[styles.aboutNameText, {paddingBottom: 0}]}>
              About
            </Text>
            <View style={{width: '100%', marginBottom: 10}}>
              <RenderHTML
                contentWidth={300}
                source={{
                  html: productDetails?.data?.product?.data
                    ?.product_description,
                }}
                tagsStyles={{
                  p: {color: 'rgba(21, 24, 39, 0.56)', fontSize: 20},
                  span: {color: 'rgba(21, 24, 39, 0.56)', fontSize: 20},
                  div: {color: 'rgba(21, 24, 39, 0.56)', fontSize: 20},
                  h1: {color: 'rgba(21, 24, 39, 0.56)', fontSize: 20},
                  h2: {color: 'rgba(21, 24, 39, 0.56)', fontSize: 20},
                  h3: {color: 'rgba(21, 24, 39, 0.56)', fontSize: 20},
                  li: {color: 'rgba(21, 24, 39, 0.56)', fontSize: 20},
                  ul: {color: 'rgba(21, 24, 39, 0.56)', fontSize: 20},
                  b: {color: 'rgba(21, 24, 39, 0.56)', fontSize: 20},
                }}
              />
            </View>
            <Text style={styles.aboutNameText}>Item Details</Text>
            <Text style={[styles.aboutText, {paddingBottom: 6}]}>
              Category :{' '}
              <Text style={{color: '#151827', fontWeight: 700}}>
                {
                  productDetails?.data?.product?.data?.categoryInfo
                    ?.category_name
                }
              </Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingBottom: 30,
              }}>
              <Text style={[styles.aboutText]}>Color :</Text>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 12,
                  backgroundColor:
                    productDetails?.data?.product?.data?.product_color,
                }}></View>
            </View>

            <View style={styles.btnMainDev}>
              <View style={{width: '48%'}}>
                <TouchableOpacity
                  style={styles.wpSendBtnMain}
                  onPress={openWhatsAppChat}>
                  <Icon name="whatsapp" size={25} color="#FFFFFF" />
                  <Text style={styles.wpSendBtnText}>Send Message</Text>
                </TouchableOpacity>
              </View>
              <View style={{width: '48%'}}>
                <TouchableOpacity
                  style={styles.showConBtnMain}
                  onPress={() => {
                    productContactInquiry({
                      id: productDetails?.data?.product?.data?.id,
                    });
                    setShowContactModalOpen(true);
                  }}>
                  <Icon name="user-circle-o" size={25} color="#151827" />
                  <Text style={styles.showConBtnText}>Show Contact</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.aboutNameText, {paddingBottom: 0}]}>
              Similar Products
            </Text>
            <View style={styles.productCardMain}>
              {productDetails?.data?.product?.related &&
                productDetails?.data?.product?.related?.map(
                  (product, index) => (
                    <ProductCard product={product} key={product?.id} />
                  ),
                )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showContactModalOpen}
        onRequestClose={() => {
          setShowContactModalOpen(!showContactModalOpen);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setShowContactModalOpen(false)}
              style={styles.modelClose}>
              <Icon name="close" size={24} color="black" />
            </TouchableOpacity>
            <View style={{padding: 20}}>
              <View style={{flexDirection: 'row', gap: 15, marginBottom: 18}}>
                {productDetails?.data?.product?.data?.branchInfo?.shop_info
                  ?.shop_logo?.small ? (
                  <FastImage
                    source={{
                      uri: productDetails?.data?.product?.data?.branchInfo
                        ?.shop_info?.shop_logo?.small,
                      cache: FastImage.cacheControl.web,
                    }}
                    style={{width: 50, height: 50, borderRadius: 25}}
                  />
                ) : (
                  <Avatar.Text
                    size={50}
                    label={
                      productDetails?.data?.product?.data?.branchInfo?.shop_info?.shop_name
                        ?.split(' ')[0]
                        ?.charAt(0)
                        ?.toUpperCase() +
                      productDetails?.data?.product?.data?.branchInfo?.shop_info?.shop_name
                        ?.split(' ')[1]
                        ?.charAt(0)
                        ?.toUpperCase()
                    }
                    backgroundColor="#29977E"
                  />
                )}
                <View>
                  <Text style={styles.modelTitleName}>
                    {
                      productDetails?.data?.product?.data?.branchInfo?.shop_info
                        ?.shop_name
                    }
                  </Text>
                  <Text
                    style={{
                      color: 'rgba(21, 24, 39, 0.56)',
                      width: 200,
                      fontSize: 18,
                    }}>
                    {
                      productDetails?.data?.product?.data?.branchInfo
                        ?.branch_address
                    }
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', gap: 15}}>
                <Avatar.Text
                  size={50}
                  label={
                    productDetails?.data?.product?.data?.branchInfo?.manager_name
                      ?.split(' ')[0]
                      ?.charAt(0)
                      ?.toUpperCase() +
                    productDetails?.data?.product?.data?.branchInfo?.manager_name
                      ?.split(' ')[1]
                      ?.charAt(0)
                      ?.toUpperCase()
                  }
                  backgroundColor="#29977E"
                />
                <View>
                  <Text style={styles.modelTitleName}>
                    {
                      productDetails?.data?.product?.data?.branchInfo
                        ?.manager_name
                    }
                  </Text>

                  <Text style={{color: 'rgba(21, 24, 39, 0.56)', fontSize: 18}}>
                    {
                      productDetails?.data?.product?.data?.branchInfo
                        ?.manager_contact
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  productHeaderMain: {
    backgroundColor: '#151827',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 15,
  },
  leftMainDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rightMainDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 20,
    marginRight: 10,
  },
  productHeadNameText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FontStyle,
    width: 85,
  },
  dayText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '400',
    fontFamily: FontStyle,
  },
  locationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '400',
    fontFamily: FontStyle,
    width: 70,
  },
  followBtn: {
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 8,
  },
  followBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
  },
  carouselMain: {
    position: 'relative',
  },
  sliderMainView: {
    width: '100%',
    height: 460,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  sliderPagination: {
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
    zIndex: 1,
  },
  threeIconMain: {
    position: 'absolute',
    right: 20,
    top: 20,
    gap: 10,
    alignItems: 'center',
  },
  iconBG: {
    backgroundColor: 'white',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    elevation: 3,
  },
  shareMainContent: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 3,
    padding: 10,
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#FAFCFC',
    width: '100%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  proNameText: {
    color: '#29977E',
    fontSize: 30,
    fontWeight: '700',
    fontFamily: FontStyle,
    width: '90%',
  },
  proNameMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  aboutNameText: {
    color: '#151827',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: FontStyle,
    paddingBottom: 10,
  },
  aboutText: {
    color: 'rgba(21, 24, 39, 0.56)',
    fontWeight: 300,
    fontSize: 20,
    fontFamily: FontStyle,
  },
  btnMainDev: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  productCardMain: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '100%',
    marginTop: 15,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    width: '80%',
  },
  modelTitleName: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    width: 200,
  },
  modelClose: {
    alignItems: 'flex-end',
    paddingTop: 15,
    paddingRight: 15,
  },

  wpSendBtnMain: {
    backgroundColor: '#29977E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#29977E',
    display: 'flex',
    gap: 10,
    flexDirection: 'row',
  },
  wpSendBtnText: {
    paddingVertical: 15,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FontStyle,
  },
  showConBtnMain: {
    backgroundColor: 'rgba(21, 24, 39, 0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(21, 24, 39, 0.10)',
    display: 'flex',
    gap: 10,
    flexDirection: 'row',
  },
  showConBtnText: {
    paddingVertical: 15,
    color: '#151827',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: FontStyle,
  },

  priceMainDiv: {
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  finalPriceText: {
    color: 'black',
    fontSize: 30,
    fontWeight: '600',
  },
  productPriceText: {
    color: '#9d9d9d',
    fontSize: 20,
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  percentageText: {
    color: '#29977E',
    fontSize: 20,
    fontWeight: '600',
  },
  rentSellRebinMain: {
    height: 30,
    width: 55,
    position: 'absolute',
    top: 15,
    left: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rebinText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
