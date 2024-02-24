import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomButton from '../common/CustomButton';
import {Divider, ProgressBar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating-widget';
import {useNavigation} from '@react-navigation/native';
import {formatDate, getReviewedTimeString} from '../utils';
import {Avatar} from 'react-native-paper';
import {capitalizeString} from '../common/CapitalizeString';

const ShopAllReviewSection = ({shopReviews, viewAllBtn, shopDetails}) => {
  const navigation = useNavigation();

  const displayReview = viewAllBtn ? 3 : shopReviews?.length;
  const [latestReview, setLatestReview] = useState(null);
  const [avgShopRating, setAvgShopRating] = useState(0);

  useEffect(() => {
    let rating = 0;
    shopReviews.map(itm =>
      setAvgShopRating(Math.round((rating += itm.stars) / shopReviews.length)),
    );
  }, [shopReviews]);

  useEffect(() => {
    if (shopReviews?.length > 0) {
      const sortedReviews = shopReviews
        ?.map(review => ({
          ...review,
          updatedAt: new Date(parseInt(review.updatedAt)),
        }))
        .sort((a, b) => b.updatedAt - a.updatedAt);
      const latest = sortedReviews[0];
      setLatestReview(latest);
    }
  }, [shopReviews]);

  return (
    <View>
      <View style={styles.reviewMainHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <Text style={styles.reText}>Reviews</Text>
          <Text
            style={[styles.fiveStarText, {color: 'rgba(21, 24, 39, 0.40)'}]}>
            ({shopReviews?.length} Reviews)
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('WriteReview', {
              state: {
                shopDetails: shopDetails,
                shopReviews: shopReviews,
              },
            })
          }>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
            <Icon name="edit" size={20} color="#29977E" />
            <Text style={styles.writeReText}>Write a Review</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.supMain}>
        <View style={styles.avgRatingMain}>
          <Text style={styles.avgRatingText}>{avgShopRating}</Text>
          <Text style={styles.avgTotalRatingText}>/5</Text>
        </View>
        <StarRating
          starSize={22}
          starStyle={{marginHorizontal: 0}}
          rating={avgShopRating}
          maxStars={5}
          emptyColor="#CCCFD2"
          onChange={() => {}}
        />
      </View>

      <View style={{marginTop: 8}}>
        <Text style={styles.DistributionText}>Rating Distribution</Text>
        {shopReviews?.length > 0
          ? [5, 4, 3, 2, 1]?.map?.((star, index) => (
              <View key={star} style={styles.progressBarMain}>
                <Text style={{color: '#31333E', fontWeight: '400'}}>
                  {star} {''} <Icon name="star" size={12} color="black" />
                </Text>
                <ProgressBar
                  style={{width: 220}}
                  progress={
                    shopReviews?.filter(itm => itm?.stars === star)?.length /
                    shopReviews?.length
                  }
                  color="green"
                />
                <Text style={{color: '#31333E', fontWeight: '400'}}>
                  {shopReviews?.filter(itm => itm.stars === star)?.length}{' '}
                  Reviews
                </Text>
              </View>
            ))
          : ''}
        {shopReviews?.length > 0 && (
          <Text style={styles.reBoText}>
            Last Review Updated on {formatDate(latestReview?.updatedAt)}
          </Text>
        )}
      </View>
      <Divider bold={true} style={{marginBottom: 20}} />

      {shopReviews?.length > 0 ? (
        <>
          {shopReviews?.slice(0, displayReview)?.map((review, index) => (
            <View key={index} style={styles.reviewCardContainer}>
              <View style={styles.cardTopDiv}>
                <Avatar.Text
                  size={50}
                  label={
                    review?.user_name?.split(' ')[0]?.charAt(0)?.toUpperCase() +
                    review?.user_name?.split(' ')[1]?.charAt(0)?.toUpperCase()
                  }
                  backgroundColor="#29977E"
                />
                <View>
                  <View style={{flexDirection: 'row', gap: 15}}>
                    <Text style={styles.reviewNameText}>
                      {capitalizeString(review?.user_name)}
                    </Text>
                    <View style={styles.countStarMain}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: '600',
                        }}>
                        <Icon name="star" size={16} color="white" />{' '}
                        {review?.stars}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: 'rgba(21, 24, 39, 0.56)',
                      fontWeight: '400',
                      fontSize: 14,
                    }}>
                    {getReviewedTimeString(review?.updatedAt)}
                  </Text>
                  <Text style={styles.revDesText}>{review?.message}</Text>
                </View>
              </View>
              <Divider style={{marginVertical: 20}} />
            </View>
          ))}
        </>
      ) : (
        <Text style={styles.noReviewText}>No Reviews Available</Text>
      )}

      {viewAllBtn && shopReviews?.length > 0 && (
        <View style={{width: '100%', paddingBottom: 30}}>
          <CustomButton
            name="View All Reviews"
            color="#151827"
            backgroundColor="#FAFCFC"
            onPress={() =>
              navigation.navigate('ShopReviewAll', {
                state: {shopReviews: shopReviews, shopDetails: shopDetails},
              })
            }
            borderColor="#151827"
          />
        </View>
      )}
    </View>
  );
};

export default ShopAllReviewSection;

const styles = StyleSheet.create({
  reviewMainHeader: {
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reText: {
    color: '#151827',
    fontWeight: '600',
    fontSize: 18,
  },
  reBoText: {
    color: 'rgba(21, 24, 39, 0.40)',
    fontWeight: '400',
    fontSize: 13,
    paddingBottom: 16,
  },
  writeReText: {
    color: '#29977E',
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'underline',
    paddingBottom: 2,
  },
  supMain: {
    marginTop: 2,
  },
  avgRatingMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    paddingLeft: 35,
  },
  avgRatingText: {
    color: 'black',
    fontSize: 32,
    fontWeight: '600',
  },
  avgTotalRatingText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '400',
  },
  fiveStarText: {
    color: '#151827',
    fontWeight: '600',
    fontSize: 14,
  },
  cardTopDiv: {
    flexDirection: 'row',
    gap: 20,
  },
  countStarMain: {
    backgroundColor: '#29977E',
    borderRadius: 5,
    width: 50,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewNameText: {
    color: '#151827',
    fontWeight: '600',
    fontSize: 18,
  },
  revDesText: {
    paddingTop: 18,
    color: 'rgba(21, 24, 39, 0.56)',
    fontWeight: '400',
    fontSize: 14,
  },
  DistributionText: {
    color: '#31333E',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBarMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noReviewText: {
    color: '#151827',
    fontSize: 16,
    fontWeight: '400',
    alignSelf: 'center',
    paddingBottom: 50,
  },
});
