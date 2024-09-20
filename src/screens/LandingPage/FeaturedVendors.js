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
                      objectFit: 'cover',
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
                        objectFit: 'cover',
                      }}
                      source={{
                        uri: shopBackgroundCover3,
                        cache: FastImage.cacheControl.web,
                      }}
                    />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                disabled
                style={{
                  position: 'absolute',
                  top: 75,
                  width: '100%',
                }}>
                {shop?.shop_logo?.medium ? (
                    <View
                        style={{
                          width: 80,
                          height: 80,
                          position: 'relative',
                          alignSelf: 'center',
                          marginBottom: 10,
                        }}>
                            <FastImage
                                source={{
                                  uri: shop?.shop_logo?.medium,
                                  cache: FastImage.cacheControl.web,
                                }}
                                style={{
                                  width: 80,
                                  height: 80,
                                  borderRadius: 50,
                                  objectFit:'cover'
                                }}
                              />
                    </View>
                ) : (
                <View
                    style={{
                      width: 80,
                      height: 80,
                      position: 'relative',
                      alignSelf: 'center',
                      marginBottom: 10,
                    }}>
                        <FastImage
                          source={{
                            uri: shopBackgroundCover3,
                            cache: FastImage.cacheControl.web,
                          }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 50,
                            alignSelf: 'center',
                          }}
                        />
                </View>

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
    fontSize: 30,
    fontWeight: '700',
    fontFamily: FontStyle,
    paddingBottom: 10,
    paddingTop: 10,
    textDecorationLine: 'underline',
  },

  featuredMain: {
    flexDirection: 'column',
    width: '80%',
    marginTop: 10,
    alignSelf:'center'
  },

  mainContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: 250,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 20,
    position: 'relative',
  },
  shopNameText: {
    color: '#151827',
    fontWeight: '700',
    fontSize: 20,
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
    color: '#fff',
      fontWeight: '600',
      fontSize: 18,
      backgroundColor:'#29977E',
      borderRadius:10,
      paddingVertical:10,
      paddingHorizontal:10,
      textAlign:'center',
      width:100,
      alignSelf:'center'
  },
  noDataText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '400',
    alignSelf: 'center',
    marginVertical: 35,
  },
});
