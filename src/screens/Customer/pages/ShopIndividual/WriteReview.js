import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BackGroundStyle, FontStyle} from '../../../../../CommonStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation, useRoute} from '@react-navigation/native';
import StarRating from 'react-native-star-rating-widget';
import {TextArea, useToast} from 'native-base';
import CustomButton from '../../../../common/CustomButton';
import {useSelector} from 'react-redux';
import {shopReview} from '../../../../graphql/mutations/shops';

const WriteReview = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const route = useRoute();
  const {shopDetails} = route?.params?.state;
  const {shopReviews} = route?.params?.state;

  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState('');
  const [loadingSubmitReview, setLoadingSubmitReview] = useState(false);
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  const {userProfile, isAuthenticate} = useSelector(state => state?.user);

  const OnSubmitReview = () => {
    if (!submitButtonDisable) {
      if (isAuthenticate) {
        if (stars > 0 && message !== '') {
          setLoadingSubmitReview(true);
          shopReview({
            shopInfo: {
              message: message,
              shop_id: shopDetails?.id,
              stars: stars,
              user_id: userProfile?.id,
            },
          }).then(
            res => {
              toast.show({
                title: 'Review Submitted Successfully!!',
                placement: 'top',
                backgroundColor: 'green.600',
                variant: 'solid',
              });
              setLoadingSubmitReview(false);
              setTimeout(() => {
                navigation.goBack();
              }, 1000);
            },
            error => {
              setLoadingSubmitReview(false);
              toast.show({
                title: 'Review not Submitted!!',
                placement: 'top',
                backgroundColor: 'red.600',
                variant: 'solid',
              });
            },
          );
        } else {
          toast.show({
            title: 'Please Select Review Fields!!',
            placement: 'top',
            backgroundColor: 'red.600',
            variant: 'solid',
          });
        }
      } else {
        navigation.navigate('LoginMainScreen');
      }
    }
  };

  useEffect(() => {
    const reviewedShopsByUser = shopReviews?.find(
      itm => itm?.user_id === userProfile?.id,
    );
    reviewedShopsByUser
      ? setSubmitButtonDisable(true)
      : setSubmitButtonDisable(false);
  }, [shopDetails?.id, userProfile?.id, shopReviews]);

  return (
    <View style={{flex: 1, backgroundColor: BackGroundStyle}}>
      <View style={styles.mainTopHeader}>
        <TouchableOpacity
          style={{width: 25, height: 25}}
          onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.hederTitleText}>Rate & Review Vendor</Text>
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.reviewShopNameText}>
          Review {shopDetails?.shop_name} Shop
        </Text>
        <Text style={styles.rateOurText}>Rate Our Of 5*</Text>
        <View style={{marginLeft: -10, paddingBottom: 15}}>
          <StarRating
            enableHalfStar={false}
            starSize={40}
            starStyle={{marginRight: 5}}
            rating={stars}
            maxStars={5}
            emptyColor="#CCCFD2"
            onChange={value => setStars(value)}
          />
        </View>
        <View style={{paddingBottom: 20}}>
          <Text style={styles.yourRevText}>Your Review*</Text>
          <TextArea
            style={{backgroundColor: 'white', fontSize: 16}}
            h={150}
            placeholder="Tell us about experience"
            w="100%"
            onChangeText={value => setMessage(value)}
          />
        </View>
        <View
          style={{
            width: '40%',
            marginTop: 20,
            opacity: submitButtonDisable ? 0.5 : 1,
            alignSelf: 'flex-end',
          }}>
          <CustomButton
            name="Submit Review"
            color="#FFFFFF"
            backgroundColor="#151827"
            borderColor="#151827"
            onPress={() => OnSubmitReview()}
            loading={loadingSubmitReview}
          />
        </View>
      </View>
    </View>
  );
};

export default WriteReview;

const styles = StyleSheet.create({
  mainTopHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 28,
    marginLeft: 20,
  },
  hederTitleText: {
    color: '#151827',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: FontStyle,
  },
  mainContainer: {
    padding: 20,
  },
  reviewShopNameText: {
    color: '#181725',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: FontStyle,
    paddingBottom: 15,
  },
  rateOurText: {
    color: '#31333E',
    fontWeight: '600',
    fontSize: 16,
    paddingBottom: 8,
  },
  yourRevText: {
    color: '#31333E',
    fontWeight: '600',
    fontSize: 16,
    paddingBottom: 16,
  },
});
