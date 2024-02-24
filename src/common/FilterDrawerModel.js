import {Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import FilterScreen from '../screens/FilterScreen/FilterScreen';

const FilterDrawerModel = ({
  filterModelOpen,
  handleFilterModelClose,
  setShowBottomLoader,
  showOnlyShopDetailPage,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModelOpen}
      onRequestClose={handleFilterModelClose}>
      <View style={[styles.modalContainer]}>
        <View style={[styles.bottomSheet]}>
          <FilterScreen
            handleFilterModelClose={handleFilterModelClose}
            setShowBottomLoader={setShowBottomLoader}
            showOnlyShopDetailPage={showOnlyShopDetailPage}
          />
        </View>
      </View>
    </Modal>
  );
};

export default FilterDrawerModel;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
});
