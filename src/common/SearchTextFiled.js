import {StyleSheet, TextInput} from 'react-native';
import React from 'react';

const SearchTextFiled = ({value, handleTextSearch}) => {
  return (
    <TextInput
      placeholder="Search Here.."
      placeholderTextColor="black"
      value={value}
      onChangeText={handleTextSearch}
      style={styles.searchTextDiv}
    />
  );
};

export default SearchTextFiled;

const styles = StyleSheet.create({
  searchTextDiv: {
    width: '65%',
    marginHorizontal: 20,
    paddingLeft: 10,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 6,
    paddingVertical: 5,
    color: 'black',
    marginVertical: 2,
  },
});
