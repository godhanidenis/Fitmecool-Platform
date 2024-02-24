import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {productLike} from '../../graphql/mutations/products';
import {useNavigation} from '@react-navigation/native';
import {useToast} from 'native-base';
import {productLikeToggle} from '../../redux/LoginUserProfileSlice/userSlice';
import {Avatar} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {capitalizeString} from '../../common/CapitalizeString';

const ProductCard = ({product, landingPageCardWith}) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userProfile, isAuthenticate} = useSelector(state => state?.user);

  const [productLikeByUser, setProductLikeByUser] = useState(false);

  const finalPrice =
    product?.product_price -
    product?.product_price * (product?.product_discount / 100);

  const clickedByLike = () => {
    if (isAuthenticate) {
      productLike({
        productInfo: {
          product_id: product?.id,
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
                    value: product?.id,
                  },
                }),
          );
          toast.show({
            title: res.data.productLike.message,
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
      setProductLikeByUser(false);
    }

    const likedProductByUser = userProfile?.product_like_list?.find(
      itm => itm?.id === product?.id,
    );

    likedProductByUser
      ? setProductLikeByUser(true)
      : setProductLikeByUser(false);
  }, [isAuthenticate, product?.id, userProfile]);

  return (
    <View
      style={{
        position: 'relative',
        width: landingPageCardWith ? 200 : '48%',
        // overflow: 'hidden',
      }}>
      {product?.product_listing_type && (
        <View
          style={[
            styles.rentSellRebinMain,
            {
              backgroundColor:
                product?.product_listing_type === 'rent'
                  ? '#ff3b3b'
                  : '#29977E',
            },
          ]}>
          <Text style={styles.rebinText}>{product?.product_listing_type}</Text>
        </View>
      )}

      <View style={[styles.mainContainer]}>
        <View style={{position: 'relative'}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductDetail', {
                state: {
                  productId: product?.id,
                },
              })
            }>
            <View style={{height: 210, width: '100%'}}>
              <FastImage
                source={{
                  uri: product?.product_image?.front?.large,
                  // cache: FastImage.cacheControl.web,
                }}
                style={{
                  height: '100%',
                  width: '100%',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
          <View style={styles.heartIcon}>
            <TouchableOpacity onPress={() => clickedByLike()}>
              <Icon
                name={productLikeByUser ? 'heart' : 'heart-o'}
                size={18}
                color={productLikeByUser ? 'red' : 'black'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductDetail', {
              state: {
                productId: product?.id,
              },
            })
          }>
          <Text style={styles.productNameText} numberOfLines={1}>
            {capitalizeString(product?.product_name)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ShopIndividual', {
              state: {shopId: product?.branchInfo?.shop_id},
            })
          }>
          <View style={styles.shopMain}>
            {product?.branchInfo?.shop_info?.shop_logo?.medium ? (
              <FastImage
                source={{
                  uri: product?.branchInfo?.shop_info?.shop_logo?.medium,
                  // cache: FastImage.cacheControl.web,
                }}
                style={{width: 25, height: 25, borderRadius: 12}}
                resizeMode="cover"
              />
            ) : (
              <Avatar.Text
                size={25}
                label={product?.branchInfo?.shop_info?.shop_name?.charAt(0)}
                backgroundColor="#29977E"
              />
            )}

            <Text style={styles.shopNameText} numberOfLines={1}>
              {capitalizeString(product?.branchInfo?.shop_info?.shop_name)}
            </Text>
          </View>
        </TouchableOpacity>
        {product?.product_price_visible ? (
          <View style={styles.priceMainDiv}>
            <Text style={styles.finalPriceText}>₹{Math.round(finalPrice)}</Text>
            <View style={styles.priceInnerDiv}>
              <Text style={styles.productPriceText}>
                ₹{Math.round(product?.product_price)}
              </Text>
              <Text style={styles.percentageText}>
                ({Math.round(product?.product_discount)}% off)
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noVisible}>No Price Visible !</Text>
        )}
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    // width: '47%',
    height: 335,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 15,
  },
  productNameText: {
    color: '#151827',
    fontWeight: '600',
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  shopNameText: {
    color: 'rgba(21, 24, 39, 0.40)',
    fontWeight: '600',
    fontSize: 14,
    width: 120,
  },
  shopMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 8,
    paddingVertical: 4,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(21, 24, 39, 0.16)',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  priceMainDiv: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  finalPriceText: {
    color: 'black',
    fontSize: 17,
    fontWeight: '600',
  },
  productPriceText: {
    color: '#9d9d9d',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  percentageText: {
    color: '#29977E',
    fontSize: 16,
    fontWeight: '600',
  },
  priceInnerDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  noVisible: {
    color: 'black',
    fontSize: 17,
    fontWeight: '500',
    alignSelf: 'center',
    paddingTop: 12,
  },
  rentSellRebinMain: {
    height: 25,
    width: 40,
    position: 'absolute',
    top: 10,
    left: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rebinText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
