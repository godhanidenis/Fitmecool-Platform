import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CheckBox} from 'react-native-elements';
import {capitalizeString} from '../../../common/CapitalizeString';

const MenWomenTabs = ({
  categories,
  selectedCategory,
  selectedMenCat,
  setSelectedMenCat,
  selectedWomenCat,
  setSelectedWomenCat,
  setMenSelectedData,
  setWomenSelectedData,
}) => {
  const [menCategoryLabel, setMenCategoryLabel] = useState([]);
  const [womenCategoryLabel, setWomenCategoryLabel] = useState([]);

  const handleMenCheckboxChange = selectedItm => {
    const updatedSelection = selectedMenCat?.includes(selectedItm)
      ? selectedMenCat?.filter(cat => cat !== selectedItm)
      : [...selectedMenCat, selectedItm];
    setSelectedMenCat(updatedSelection);

    setMenSelectedData(
      updatedSelection?.map(
        item => categories?.find(ele => ele?.category_name === item)?.id,
      ),
    );
  };
  const handleWoMenCheckboxChange = selectedItm => {
    const updatedSelection = selectedWomenCat?.includes(selectedItm)
      ? selectedWomenCat?.filter(cat => cat !== selectedItm)
      : [...selectedWomenCat, selectedItm];
    setSelectedWomenCat(updatedSelection);

    setWomenSelectedData(
      updatedSelection?.map(
        item => categories?.find(ele => ele?.category_name === item)?.id,
      ),
    );
  };

  useEffect(() => {
    setMenCategoryLabel(
      categories
        .filter(itm => itm?.category_type === 'Men')
        .map(i => i?.category_name),
    );
    setWomenCategoryLabel(
      categories
        .filter(itm => itm?.category_type === 'Women')
        .map(i => i?.category_name),
    );
  }, [categories]);

  return (
    <View>
      {selectedCategory === 'Men' ? (
        <View>
          {menCategoryLabel?.map((val, index) => (
            <View key={index}>
              <CheckBox
                title={capitalizeString(val)}
                checked={selectedMenCat?.includes(val)}
                onPress={() => handleMenCheckboxChange(val)}
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  margin: 0,
                }}
                checkedColor="#29977E"
              />
            </View>
          ))}
        </View>
      ) : (
        <View>
          {womenCategoryLabel?.map((val, index) => (
            <View key={index} style={{marginBottom: 0}}>
              <CheckBox
                title={capitalizeString(val)}
                checked={selectedWomenCat?.includes(val)}
                onPress={() => handleWoMenCheckboxChange(val)}
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  margin: 0,
                }}
                checkedColor="#29977E"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default MenWomenTabs;

const styles = StyleSheet.create({});
