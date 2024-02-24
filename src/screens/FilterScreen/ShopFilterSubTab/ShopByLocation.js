import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {CheckBox} from 'react-native-elements';
import {capitalizeString} from '../../../common/CapitalizeString';
import SearchTextFiled from '../../../common/SearchTextFiled';
import {TouchableOpacity} from 'react-native';

const ShopByLocation = ({
  areaLists,
  selectedLocationData,
  setSelectedLocationData,
  displayLimit,
  fetching,
}) => {
  const [searchText, setSearchText] = useState('');
  const [displayedItems, setDisplayedItems] = useState([]);

  const handleMenCheckboxChange = itm => {
    const updatedSelection = selectedLocationData?.some(
      item => item.area === itm.area && item.pin === itm.pin,
    )
      ? selectedLocationData?.filter(val => val.pin !== itm.pin)
      : [...selectedLocationData, {area: itm.area, pin: itm.pin}];

    setSelectedLocationData(updatedSelection);
  };

  useEffect(() => {
    setDisplayedItems(areaLists?.slice(0, displayLimit));
  }, [areaLists, displayLimit]);

  const FilterDataAll = areaLists?.filter(data =>
    data?.area?.toLowerCase().includes(searchText),
  );

  return (
    <View style={{position: 'relative'}}>
      <SearchTextFiled
        value={searchText}
        handleTextSearch={value => setSearchText(value.toLowerCase())}
      />
      {(searchText !== ''
        ? FilterDataAll?.slice(0, displayLimit)
        : displayedItems
      )?.map((itm, index) => (
        <View key={index}>
          <CheckBox
            title={capitalizeString(itm?.area)}
            checked={selectedLocationData?.some(
              item => item.area === itm.area && item.pin === itm.pin,
            )}
            onPress={() => handleMenCheckboxChange(itm)}
            containerStyle={{
              backgroundColor: 'transparent',
              borderWidth: 0,
              margin: 0,
            }}
            checkedColor="#29977E"
          />
        </View>
      ))}
      {fetching && (
        <View style={styles.activityIndiCator}>
          <ActivityIndicator color="#29977E" />
        </View>
      )}
    </View>
  );
};

export default ShopByLocation;

const styles = StyleSheet.create({
  activityIndiCator: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
});
