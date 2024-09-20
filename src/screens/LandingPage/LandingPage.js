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
  store1,
  store2,
  store3,
  store4,
  store5,
} from '../../common/AllLiveImageLink';
import VersionAppModel from '../AppVersionModel/VersionApp';
import FastImage from 'react-native-fast-image';

const CarouselRenderItem = ({item}) => (
    <View style={{width: '100%', height:180}}>
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

const LandingPage = () => {
  const {versionData} = useSelector(state => state?.appVersion);
  const [activeTab, setActiveTab] = useState('customer');
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const {width: screenWidth} = Dimensions.get('window');

  const topCarouselData = [
    {image: landingBanner1},
    {image: landingBanner2},
  ];

  const autoplayConfig = {
    autoplay: true,
    autoplayInterval: 5000,
    loop: true,
  };

  useEffect(() => {
    LogBox.ignoreLogs([
      'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
    ]);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: BackGroundStyle}}>
      <CustomerHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View>
            <Carousel
              ref={carouselRef}
              data={topCarouselData}
              renderItem={CarouselRenderItem}
              sliderWidth={screenWidth}
              itemWidth={screenWidth}
              onSnapToItem={index => setActiveSlide(index)}
              {...autoplayConfig}
            />
            <Pagination
              dotsLength={topCarouselData?.length}
              activeDotIndex={activeSlide}
              containerStyle={{paddingTop: 10, paddingBottom:15}}
            />
          </View>
          <View>
            <Text style={styles.worksTitle}>How It Works</Text>
          </View>
          <View>
            <View style={styles.tabWrapper}>
              <TouchableOpacity
                onPress={() => setActiveTab('customer')}
                style={[
                  styles.tabTitleWrapper,
                  activeTab === 'customer' && styles.activeTabIndicator,
                  activeTab === 'vendor' &&  styles.inActiveTabIndicator,
                ]}>
                <Text style={[styles.tabTitleText,
                              activeTab === 'customer' && styles.activeTabText,
                              activeTab === 'vendor' && styles.inActiveTabText]}>
                              Customer
                              </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('vendor')}
                style={[
                  styles.tabTitleWrapper,
                  activeTab === 'vendor' && styles.activeTabIndicator,
                  activeTab === 'customer' &&  styles.inActiveTabIndicator,
                ]}>
                <Text style={[styles.tabTitleText,
                              activeTab === 'vendor' && styles.activeTabText,
                              activeTab === 'customer' && styles.inActiveTabText]}>
                              Seller
                              </Text>
              </TouchableOpacity>
            </View>
            {activeTab === 'customer' ? (
              <View style={styles.tabContentCard}>
                <View>
                  <Image
                    source={{uri: store1}}
                    style={{width: 50, height: 50, alignSelf: 'center'}}
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
                    style={{width: 50, height: 50, alignSelf: 'center'}}
                  />
                  <View style={{alignSelf: 'center'}}>
                    <Text style={styles.chooseText}>Connect With Sellers</Text>
                    <Text style={styles.chooseDesText}>
                      Reach Out To Seller Via Whatsapp OR Direct Phone Call To
                      Inquire More About Pricing, Availability And Other T&C.
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.tabContentCard}>
                  <View>
                    <Image
                      source={{uri: store3}}
                      style={{width: 50, height: 50, alignSelf: 'center'}}
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
                  <View>
                    <Image
                      source={{uri: store4}}
                      style={{width: 50, height: 50, alignSelf: 'center'}}
                    />
                    <View style={{alignSelf: 'center'}}>
                      <Text style={styles.chooseText}>Upload Products</Text>
                      <Text style={styles.chooseDesText}>
                        Upload Products For Rent/ Sell
                      </Text>
                    </View>
                  </View>
                <View>
                  <Image
                    source={{uri: store5}}
                    style={{width: 50, height: 50, alignSelf: 'center'}}
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
  worksTitle: {
    alignSelf: 'center',
    color: '#181725',
    fontSize: 30,
    fontWeight: '700',
    fontFamily: FontStyle,
    paddingBottom: 20,
    paddingTop: 10,
    textDecorationLine: 'underline',
  },
  tabWrapper: {
    width: '80%',
    flexDirection: 'row',
    marginBottom: 16,
    alignSelf:'center'
  },
  tabTitleWrapper: {
    width: '50%',
    paddingVertical: 12,
  },
  tabTitleText: {
    fontWeight: '600',
    fontSize: 18,
    alignSelf: 'center',
  },
  tabContentCard: {
      width: '80%',
      marginBottom: 40,
      flexDirection: 'column',
      alignSelf:'center',
      gap:20
  },
  inActiveTabIndicator: {
    backgroundColor:'#fff',
    borderRadius:3
  },
  activeTabIndicator: {
    backgroundColor:'#29977E',
    color:'#fff',
    borderRadius:3
  },
  inActiveTabText: {
    color:'#181725',
  },
  activeTabText: {
    color:'#fff',
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
    fontWeight: '700',
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
  }
});
