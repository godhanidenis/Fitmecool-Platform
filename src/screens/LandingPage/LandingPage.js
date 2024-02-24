import {
  LogBox,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {BackGroundStyle, FontStyle} from '../../../CommonStyle';
import CustomerHeader from '../../components/CustomerHeader';
import {Image} from 'react-native';
import MenCollection from './MenCollection';
import WomenCollection from './WomenCollection';
import FeaturedVendors from './FeaturedVendors';
import {useSelector} from 'react-redux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Dimensions} from 'react-native';
import {
  landingBanner1,
  landingBanner2,
  landingBanner3,
  store1,
  store2,
  store3,
  store4,
  store5,
} from '../../common/AllLiveImageLink';
import VersionAppModel from '../AppVersionModel/VersionApp';
import FastImage from 'react-native-fast-image';

const LandingPage = () => {
  const {versionData} = useSelector(state => state?.appVersion);
  const [activeTab, setActiveTab] = useState('customer');
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const {width: screenWidth} = Dimensions.get('window');

  const TopCarouselData = [
    {image: landingBanner1},
    {image: landingBanner2},
    {image: landingBanner3},
  ];

  const autoplayConfig = {
    autoplay: true,
    autoplayInterval: 2000,
    loop: true,
  };

  useEffect(() => {
    LogBox.ignoreLogs([
      'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
    ]);
  }, []);

  const CarouselRenderItem = ({item}) => (
    <View style={styles.sliderMainView}>
      <View style={{width: '100%'}}>
        <FastImage
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 8,
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

  return (
    <View style={{flex: 1, backgroundColor: BackGroundStyle}}>
      <CustomerHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View>
            <Carousel
              ref={carouselRef}
              data={TopCarouselData}
              renderItem={CarouselRenderItem}
              sliderWidth={screenWidth - 30}
              itemWidth={screenWidth - 30}
              onSnapToItem={index => setActiveSlide(index)}
              {...autoplayConfig}
            />
            <Pagination
              dotsLength={TopCarouselData?.length}
              activeDotIndex={activeSlide}
              containerStyle={{paddingTop: 10}}
            />
          </View>
          <View style={styles.worksMain}>
            <Text style={styles.worksH1Text}>How It Works</Text>
          </View>
          <View>
            <View style={styles.tabMain}>
              <TouchableOpacity
                onPress={() => setActiveTab('customer')}
                style={[
                  styles.cusTextMain,
                  activeTab === 'customer' && styles.bottomGreenTab,
                ]}>
                <Text style={styles.TextTab}>Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('vendor')}
                style={[
                  styles.venTextMain,
                  activeTab === 'vendor' && styles.bottomGreenTab,
                ]}>
                <Text style={styles.TextTab}>Seller</Text>
              </TouchableOpacity>
            </View>
            {activeTab === 'customer' ? (
              <View style={styles.tabBottomMainDiv}>
                <View style={styles.tabBottomInnerLeftMainDiv}>
                  <Image
                    source={{uri: store1}}
                    style={{width: 40, height: 40, alignSelf: 'center'}}
                  />
                  <View style={{alignSelf: 'center'}}>
                    <Text style={styles.chooseText}>
                      Choose Your Clothes For Rent/Buy
                    </Text>
                    <Text style={styles.chooseDesText}>
                      Choose Your Outfit From Different Collection
                    </Text>
                  </View>
                </View>
                <View style={styles.tabBottomInnerRightMainDiv}>
                  <Image
                    source={{uri: store2}}
                    style={{width: 40, height: 40, alignSelf: 'center'}}
                  />
                  <View style={{alignSelf: 'center'}}>
                    <Text style={styles.chooseText}>Connect With Sellers</Text>
                    <Text style={styles.chooseDesText}>
                      After Choosing Your Desired Clothing Reach Out To The
                      Seller Directly Through Whatsapp OR Direct Phone Call To
                      Inquire About Pricing, Availibity And Other T&C.
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.tabBottomVendorMain}>
                <View style={styles.tabBottomVendorInnerMainDiv}>
                  <View style={styles.tabBottomInnerLeftMainDiv}>
                    <Image
                      source={{uri: store3}}
                      style={{width: 40, height: 40, alignSelf: 'center'}}
                    />
                    <View style={{alignSelf: 'center'}}>
                      <Text style={styles.chooseText}>
                        Create Your Own Shop
                      </Text>
                      <Text style={styles.chooseDesText}>
                        Create your personalized experience by setting up your
                        own shop
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tabBottomInnerRightMainDiv}>
                    <Image
                      source={{uri: store4}}
                      style={{width: 40, height: 40, alignSelf: 'center'}}
                    />
                    <View style={{alignSelf: 'center'}}>
                      <Text style={styles.chooseText}>Upload Products</Text>
                      <Text style={styles.chooseDesText}>
                        Upload Products For Rent/ Sell
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.tabBottomVendorInnerBottom}>
                  <Image
                    source={{uri: store5}}
                    style={{width: 40, height: 40, alignSelf: 'center'}}
                  />
                  <View style={{alignSelf: 'center'}}>
                    <Text style={styles.chooseText}>Get Inquiries</Text>
                    <Text style={styles.chooseDesText}>
                      Wait Patiently For Inquires To Arrive Via Whatsapp OR
                      Direct Phone Call
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
          <MenCollection />
          <WomenCollection />
          <FeaturedVendors />
        </View>
      </ScrollView>
      <VersionAppModel
        modalVisible={versionData?.versionModelVisible}
        versionData={versionData}
      />
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
  },
  sliderMainView: {
    width: '100%',
    height: 150,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 8,
    flexDirection: 'row',
  },
  sliderRightMain: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderH1Text: {
    color: '#181725',
    fontSize: 18,
    fontWeight: '700',
    paddingBottom: 8,
    fontFamily: FontStyle,
  },
  sliderH2Text: {
    color: 'rgba(24, 23, 37, 0.80)',
    fontFamily: FontStyle,
    fontSize: 16,
    fontWeight: '500',
    paddingBottom: 8,
  },
  worksMain: {
    marginBottom: 15,
    width: '90%',
    alignSelf: 'center',
  },
  worksH1Text: {
    alignSelf: 'center',
    color: '#181725',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: FontStyle,
    paddingBottom: 8,
  },
  worksH2Text: {
    textAlign: 'center',
    color: 'rgba(24, 23, 37, 0.56)',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FontStyle,
  },
  tabMain: {
    width: '100%',
    flexDirection: 'row',
    borderBottomColor: 'rgba(24, 23, 37, 0.04)',
    borderBottomWidth: 2,
    marginBottom: 16,
  },
  cusTextMain: {
    width: '50%',
    paddingVertical: 12,
  },
  venTextMain: {
    width: '50%',
    paddingVertical: 12,
  },
  TextTab: {
    color: '#181725',
    fontWeight: '600',
    fontSize: 18,
    alignSelf: 'center',
  },
  bottomGreenTab: {
    borderBottomColor: '#29977E',
    borderBottomWidth: 3,
  },
  tabBottomMainDiv: {
    backgroundColor: '#FFF',
    width: '100%',
    elevation: 5,
    borderRadius: 8,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 25,
    paddingHorizontal: 18,
  },
  tabBottomInnerLeftMainDiv: {
    width: '50%',
  },
  tabBottomInnerRightMainDiv: {
    width: '50%',
  },
  chooseText: {
    color: '#181725',
    fontWeight: '700',
    fontSize: 20,
    paddingVertical: 10,
    alignSelf: 'center',
    textAlign: 'center',
  },
  chooseDesText: {
    color: 'rgba(24, 23, 37, 0.56)',
    fontWeight: '400',
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center',
  },
  tabBottomVendorInnerMainDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tabBottomVendorMain: {
    backgroundColor: '#FFF',
    elevation: 5,
    borderRadius: 8,
    marginBottom: 40,
    paddingVertical: 25,
    paddingHorizontal: 18,
    width: '100%',
  },
  tabBottomVendorInnerBottom: {
    marginTop: 25,
  },
});
