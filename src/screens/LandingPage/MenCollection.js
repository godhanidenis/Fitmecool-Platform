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

const MenCollection = () => {
  const navigation = useNavigation();
  const {categories} = useSelector(state => state.categories);
  const carouselRef = useRef(null);
  const autoplayConfig = {
    autoplay: true,
    autoplayInterval: 2000,
    loop: true,
  };
  const [menCategoryLabel, setMenCategoryLabel] = useState([]);
  const [selectedMenCat, setSelectedMenCat] = useState([]);
  const [menSelectedData, setMenProductData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filterMenData = categories.filter(
      itm => itm?.category_type === 'Men',
    );

    setMenCategoryLabel(filterMenData);
    setSelectedMenCat([filterMenData[0]?.id]);
  }, [categories]);

  const getMenProduct = async () => {
    setLoading(true);
    await getProducts({
      pageData: {
        skip: 0,
        limit: 5,
      },
      filter: {
        category_id: selectedMenCat,
        product_color: [],
      },
      shopId: [],
      sort: 'new',
      search: '',
    })
      .then(response => {
        setLoading(false);
        setMenProductData(response?.data?.productList?.data);
      })
      .catch(err => setLoading(false));
  };

  useEffect(() => {
    selectedMenCat.length > 0 && getMenProduct();
  }, [selectedMenCat]);

  return (
    <View style={{marginBottom: 20, alignSelf:'center'}}>
      <Text style={styles.headingText}>Men’s Collection</Text>
      <View style={styles.menSlideColMain}>
        <View style={styles.leftMain}>
          {menCategoryLabel?.map((item, index) => {
            if (index < 6) {
              return (
                <TouchableOpacity
                  key={item?.id}
                  onPress={() => setSelectedMenCat([item?.id])}>
                  <Text
                    style={
                      selectedMenCat[0] === item?.id
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
              style={[styles.viewAllBtn]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightSliderMain}>
          {loading ? (
            <ActivityIndicator />
          ) : menSelectedData && menSelectedData?.length > 0 ? (
            <Carousel
              ref={carouselRef}
              data={menSelectedData}
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

export default MenCollection;

const styles = StyleSheet.create({
  headingText: {
    alignSelf: 'center',
    color: '#181725',
    fontSize: 30,
    fontWeight: '700',
    fontFamily: FontStyle,
    paddingBottom: 30,
    paddingTop: 10,
    textDecorationLine: 'underline',
  },
  menSlideColMain: {
    width: '90%',
    flexDirection: 'row',
    gap: 10,
  },
  leftMain: {
    width: '30%',
  },
  activeColText: {
    color: '#181725',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: FontStyle,
    paddingBottom: 10,
  },
  inActiveColText: {
    color: 'rgba(24, 23, 37, 0.56)',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: FontStyle,
    paddingBottom: 10,
  },
  viewAllBtn: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    backgroundColor:'#29977E',
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal:10,
    textAlign:'center'
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
