import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {BackGroundStyle} from '../../../../CommonStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import VendorHeader from '../../../components/VendorHeader';
import VersionAppModel from '../../AppVersionModel/VersionApp';

const Home = () => {
  const navigation = useNavigation();
  const {vendorShopDetails} = useSelector(state => state?.shopDetail);
  const {versionData} = useSelector(state => state?.appVersion);
  const {productsCount} = useSelector(state => state?.productsData);

  useEffect(() => {
    const handleBackButton = () => {
      navigation.navigate('Splash');
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <VendorHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: BackGroundStyle}}>
        <View style={{marginTop: 40}}>
          <View style={{paddingBottom: 15}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Product')}
              style={styles.boxMain}>
              <View>
                <Text style={styles.totalText}>Total Products</Text>
                <Text style={styles.TotalNumberText}>{productsCount}</Text>
              </View>
              <View style={styles.iconParent}>
                <Icon name="shopping-cart" color="black" size={22} />
              </View>
            </TouchableOpacity>

            <View style={styles.boxMain}>
              <View>
                <Text style={styles.totalText}>Followers</Text>
                <Text style={styles.TotalNumberText}>
                  {vendorShopDetails?.shopFollowerCount}
                </Text>
              </View>
              <View style={styles.iconParent}>
                <Icon name="user" color="black" size={22} />
              </View>
            </View>

            <View style={styles.boxMain}>
              <View>
                <Text style={styles.totalText}>Reviews</Text>
                <Text style={styles.TotalNumberText}>
                  {vendorShopDetails?.shopReviewCount}
                </Text>
              </View>
              <View style={styles.iconParent}>
                <Icon name="edit" color="black" size={22} />
              </View>
            </View>
          </View>
        </View>
        <VersionAppModel
          modalVisible={versionData?.versionModelVisible}
          versionData={versionData}
        />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  boxMain: {
    width: 280,
    height: 75,
    borderRadius: 8,
    backgroundColor: '#FFF',
    elevation: 4,
    alignSelf: 'center',
    marginBottom: 16,
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalText: {
    color: 'rgba(49, 51, 62, 0.56)',
    fontWeight: '700',
    fontSize: 16,
  },
  TotalNumberText: {
    color: '#151827',
    fontWeight: '700',
    fontSize: 18,
  },
  iconParent: {
    backgroundColor: '#F3F6F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
