import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Slider} from 'native-base';

const ShopRatingsFilter = ({selectedRatingData, setSelectedRatingData}) => {
  return (
    <View style={styles.mainSliderDiv}>
      <Slider
        defaultValue={selectedRatingData}
        colorScheme="green"
        maxValue={5}
        onChange={v => {
          setSelectedRatingData(Math.floor(v));
        }}>
        <Slider.Track>
          <Slider.FilledTrack />
        </Slider.Track>
        <Slider.Thumb />
      </Slider>
    </View>
  );
};

export default ShopRatingsFilter;

const styles = StyleSheet.create({
  mainSliderDiv: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
});
