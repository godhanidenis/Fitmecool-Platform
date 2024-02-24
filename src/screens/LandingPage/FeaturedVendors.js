import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontStyle} from '../../../CommonStyle';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getShops} from '../../graphql/queries/shopQueries';
import {shopProductButtonChange} from '../../redux/ShopFilter/ShopFilterSlice';
import {useDispatch} from 'react-redux';
import {
  locationIcon,
  shopBackgroundCover3,
} from '../../common/AllLiveImageLink';
import {Avatar} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {capitalizeString} from '../../common/CapitalizeString';

const FeaturedVendors = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [ShopImagesModelShow, setShopImagesModelShow] = useState(false);
  const [shopData, setShopData] = useState([]);

  const GoToShopList = () => {
    dispatch(shopProductButtonChange(true));
    navigation.navigate('CustomerHomePage');
  };

  const getAllShops = async () => {
    const response = await getShops({
      pageData: {
        skip: 0,
        limit: 4,
      },
      area: [],
      sort: 'new',
      stars: '',
    });
    setShopData(response?.data?.shopList?.data);
  };

  useEffect(() => {
    getAllShops();
    dispatch(shopProductButtonChange(false));
  }, []);
  return (
    <View style={{marginBottom: 10}}>
      <Text style={styles.worksH1Text}>Featured Sellers</Text>
      <Text style={styles.worksH2Text}>
        Explore Incredible Individual sellers OR Browse Through Trendy Boutiques
        For The Latest In Fashion.
      </Text>

      {shopData?.length > 0 ? (
        <View style={styles.featuredMain}>
          {shopData?.map((shop, index) => (
            <TouchableOpacity
              key={shop?.id}
              onPress={() =>
                navigation.navigate('ShopIndividual', {
                  state: {shopId: shop?.id},
                })
              }
              style={styles.mainContainer}>
              <TouchableOpacity
                disabled
                onPress={() => setShopImagesModelShow(!ShopImagesModelShow)}>
                {shop?.shop_images[0]?.links?.large ? (
                  <FastImage
                    style={{
                      height: 120,
                      width: '100%',
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      objectFit: 'fill',
                    }}
                    source={{
                      uri: shop?.shop_images[0]?.links?.large,
                      cache: FastImage.cacheControl.web,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: '100%',
                      height: 120,
                      position: 'relative',
                    }}>
                    <FastImage
                      style={{
                        width: '100%',
                        height: 120,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                      source={{
                        uri: shopBackgroundCover3,
                        cache: FastImage.cacheControl.web,
                      }}
                      resizeMode="stretch"
                    />
                    <View
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        width: '100%',
                        height: 120,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        position: 'absolute',
                        top: 0,
                      }}></View>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                disabled
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                }}>
                {shop?.shop_logo?.medium ? (
                  <FastImage
                    source={{
                      uri: shop?.shop_logo?.medium,
                      cache: FastImage.cacheControl.web,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      alignSelf: 'center',
                      marginBottom: 10,
                    }}
                  />
                ) : (
                  <Avatar.Text
                    style={{
                      alignSelf: 'center',
                      marginBottom: 10,
                    }}
                    size={50}
                    label={shop?.shop_name?.charAt(0)}
                    backgroundColor="#29977E"
                  />
                )}
                <View>
                  <Text style={styles.shopNameText} numberOfLines={1}>
                    {capitalizeString(shop?.shop_name)}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 2,
                      alignSelf: 'center',
                      width: '100%',
                      paddingHorizontal: 15,
                    }}>
                    <Image
                      source={{uri: locationIcon}}
                      style={{width: 12, height: 12}}
                    />
                    <Text style={styles.addressNameText} numberOfLines={1}>
                      {shop?.branch_info?.length > 1
                        ? shop?.branch_info?.map(
                            itm =>
                              itm.branch_type === 'main' && itm.branch_address,
                          )
                        : shop?.branch_info[0]?.branch_address}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBottomDivMain}>
                  <View style={styles.ratingMain}>
                    <Icon name="star" size={19} color="#F9A23B" />
                    <Text style={styles.ratingParentText}>
                      {shop.shop_rating}{' '}
                      <Text style={styles.ratingChildText}>
                        ({shop?.shopReviewCount})
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.ratingMain}>
                    <Icon name="user" size={18} color="black" />
                    <Text style={styles.ratingParentText}>
                      {`${shop?.shopFollowerCount}`}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>No Data</Text>
      )}

      <View>
        <TouchableOpacity onPress={() => GoToShopList()}>
          <Text style={styles.viewAllBtn}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeaturedVendors;

const styles = StyleSheet.create({
  worksH1Text: {
    alignSelf: 'center',
    color: '#181725',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: FontStyle,
    paddingBottom: 8,
  },
  worksH2Text: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'rgba(24, 23, 37, 0.56)',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FontStyle,
    width: '80%',
  },

  featuredMain: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  mainContainer: {
    backgroundColor: 'white',
    width: '47%',
    height: 230,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 20,
    position: 'relative',
  },
  shopNameText: {
    color: '#151827',
    fontWeight: '600',
    fontSize: 14,
    paddingBottom: 5,
    alignSelf: 'center',
  },
  addressNameText: {
    color: 'rgba(21, 24, 39, 0.40)',
    fontWeight: '600',
    fontSize: 14,
  },
  shopMain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 10,
  },
  cardBottomDivMain: {
    paddingVertical: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 20,
  },
  ratingMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingParentText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 15,
  },
  ratingChildText: {
    color: 'black',
    fontWeight: '300',
  },
  viewAllBtn: {
    color: '#29977E',
    fontWeight: '600',
    fontSize: 18,
    paddingBottom: 10,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  noDataText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '400',
    alignSelf: 'center',
    marginVertical: 35,
  },
});
