import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {Divider} from 'react-native-paper';
import {changeAppliedProductsFilters} from '../../redux/ProductFilter/ProductFilterSlice';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar} from 'react-native-paper';
import {shopProductButtonChange} from '../../redux/ShopFilter/ShopFilterSlice';
import useDebounce from '../../components/UseDebounceSearch';

const SideBarContent = ({AccessToken}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector(
    state => state?.productsFiltersReducer,
  );
  const {userProfile} = useSelector(state => state?.user);
  const logoName = `${userProfile?.first_name
    ?.charAt(0)
    .toUpperCase()}${userProfile?.last_name?.charAt(0).toUpperCase()}`;
  const {byShop} = useSelector(state => state.shopsFiltersReducer);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const passValueForProduct = (itm, searchBarData) => {
    if (itm === 'searchBarData') {
      return searchBarData;
    } else if (itm === 'productPrice') {
      return {min: 0, max: 0};
    } else if (itm === 'productListingType') {
      return '';
    } else {
      return [];
    }
  };

  const handleSearch = searchData => {
    [
      'productColor',
      'shopId',
      'categoryId',
      'searchBarData',
      'productPrice',
      'productListingType',
    ]?.map(itm =>
      dispatch(
        changeAppliedProductsFilters({
          key: itm,
          value: {
            selectedValue: passValueForProduct(itm, searchData),
          },
        }),
      ),
    );

    byShop && dispatch(shopProductButtonChange(false));

    navigation.navigate('CustomerHomePage');
  };

  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setSearchTerm(
      productsFiltersReducer?.appliedProductsFilters.searchBarData
        .selectedValue,
    );
  }, [
    productsFiltersReducer?.appliedProductsFilters.searchBarData.selectedValue,
  ]);

  return (
    <View style={styles.sideMainContainer}>
      {AccessToken ? (
        <View style={styles.authUserMain}>
          <Avatar.Text size={55} label={logoName} backgroundColor="#29977E" />
          <View>
            <Text style={styles.userNameText} numberOfLines={1}>
              {userProfile?.first_name} {userProfile?.last_name}
            </Text>
            <Text style={styles.userEmailText} numberOfLines={1}>
              {userProfile?.user_email || 'Undefined..'}
            </Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.loginEventMain}
          onPress={() => navigation.navigate('LoginMainScreen')}>
          <Icon name="user-plus" size={22} color="#151827" />
          <Text style={styles.signInText}>SignIn/SignUp</Text>
        </TouchableOpacity>
      )}
      <Divider bold={true} />
      <View style={styles.searchTextMain}>
        <Icon name="search" size={18} color="black" />
        <TextInput
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          style={{width: '100%', color: 'black'}}
          placeholder="Search  Hear.."
          placeholderTextColor="rgba(21, 24, 39, 0.40)"
        />
      </View>
      <Divider bold={true} />
      <TouchableOpacity
        onPress={() => navigation.navigate('LikeScreen')}
        style={styles.wishMain}>
        <Icon name="heart-o" size={20} color="#151827" />
        <Text style={styles.wishText}>Wishlist (0)</Text>
      </TouchableOpacity>
      <Divider bold={true} />
    </View>
  );
};

export default SideBarContent;

const styles = StyleSheet.create({
  sideMainContainer: {
    // paddingHorizontal: 30,
  },
  loginEventMain: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  signInText: {
    color: '#151827',
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'underline',
    paddingVertical: 30,
  },
  authUserMain: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  userNameText: {
    fontSize: 18,
    color: '#151827',
    fontWeight: '600',
    width: '75%',
  },
  searchTextMain: {
    backgroundColor: '#FFF',
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    gap: 5,
    borderWidth: 0.5,
    marginHorizontal: 30,
    marginVertical: 30,
  },
  wishMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 30,
    marginVertical: 30,
  },
  logoutMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 30,
    marginVertical: 30,
    bottom: 0,
    position: 'absolute',
  },
  wishText: {
    color: '#151827',
    fontWeight: '400',
    fontSize: 18,
  },
  userEmailText: {
    fontSize: 16,
    color: '#151827',
    fontWeight: '400',
    width: '75%',
  },
});
