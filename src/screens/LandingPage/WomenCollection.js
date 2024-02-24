import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {FontStyle} from '../../../CommonStyle';
import {useSelector} from 'react-redux';
import {capitalizeString} from '../../common/CapitalizeString';
import {getProducts} from '../../graphql/queries/productQueries';
import ProductCard from '../../components/ProductCard/ProductCard';
import {useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';

const WomenCollection = () => {
  const navigation = useNavigation();
  const {categories} = useSelector(state => state.categories);
  const [woMenCategoryLabel, setWoMenCategoryLabel] = useState([]);
  const [selectedWomenCat, setSelectedWomenCat] = useState([]);
  const [woMenSelectedData, setWoMenProductData] = useState([]);
  const [loading, setLoading] = useState(false);

  const carouselRef = useRef(null);
  const autoplayConfig = {
    autoplay: true,
    autoplayInterval: 2000,
    loop: true,
  };

  useEffect(() => {
    const filterMenData = categories.filter(
      itm => itm?.category_type === 'Women',
    );

    setWoMenCategoryLabel(filterMenData);
    setSelectedWomenCat([filterMenData[0]?.id]);
  }, [categories]);

  const getWoMenProduct = async () => {
    setLoading(true);
    await getProducts({
      pageData: {
        skip: 0,
        limit: 5,
      },
      filter: {
        category_id: selectedWomenCat,
        product_color: [],
      },
      shopId: [],
      sort: 'new',
      search: '',
    })
      .then(response => {
        setLoading(false);
        setWoMenProductData(response?.data?.productList?.data);
      })
      .catch(err => setLoading(false));
  };

  useEffect(() => {
    selectedWomenCat.length > 0 && getWoMenProduct();
  }, [selectedWomenCat]);

  return (
    <View style={{marginBottom: 40}}>
      <Text style={styles.headingText}>Women’s Collection</Text>
      <Text style={styles.descriptionText}>
        Take A Browse Through Our Fabulous Selection Of Women's Fashion.
      </Text>

      <View style={styles.menSlideColMain}>
        <View style={styles.leftMain}>
          {woMenCategoryLabel?.map((item, index) => {
            if (index < 6) {
              return (
                <TouchableOpacity
                  key={item?.id}
                  onPress={() => setSelectedWomenCat([item?.id])}>
                  <Text
                    style={
                      selectedWomenCat[0] === item?.id
                        ? styles.activeColText
                        : styles.inActiveColText
                    }>
                    {capitalizeString(item?.category_name)}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          <TouchableOpacity
            onPress={() => navigation.navigate('CustomerHomePage')}>
            <Text
              style={[styles.viewAllBtn, {textDecorationLine: 'underline'}]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightSliderMain}>
          {loading ? (
            <ActivityIndicator />
          ) : woMenSelectedData?.length > 0 ? (
            <Carousel
              ref={carouselRef}
              data={woMenSelectedData}
              renderItem={product => (
                <ProductCard
                  product={product.item}
                  landingPageCardWith={true}
                />
              )}
              sliderWidth={200}
              itemWidth={200}
              {...autoplayConfig}
            />
          ) : (
            <Text style={styles.noDataText}>No Data</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default WomenCollection;

const styles = StyleSheet.create({
  headingText: {
    alignSelf: 'center',
    color: '#181725',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: FontStyle,
    paddingBottom: 5,
  },
  descriptionText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'rgba(24, 23, 37, 0.56)',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FontStyle,
    paddingBottom: 30,
    width: '80%',
  },
  menSlideColMain: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  leftMain: {
    width: '30%',
  },
  activeColText: {
    color: '#181725',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: FontStyle,
    paddingBottom: 10,
  },
  inActiveColText: {
    color: 'rgba(24, 23, 37, 0.56)',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: FontStyle,
    paddingBottom: 10,
  },
  viewAllBtn: {
    color: '#29977E',
    fontWeight: '600',
    fontSize: 18,
    paddingBottom: 10,
  },
  rightSliderMain: {
    alignItems: 'center',
    width: '70%',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '400',
  },
});
