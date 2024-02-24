import {Modal, StyleSheet, Text, View, Linking} from 'react-native';
import React from 'react';
import CustomButton from '../../common/CustomButton';

const VersionAppModel = ({modalVisible, versionData}) => {
  const openGooglePlayStore = () => {
    const playStoreLink =
      'https://play.google.com/store/apps/details?id=com.fot.fitmecool&pli=1';

    Linking.openURL(playStoreLink).catch(err =>
      console.error('An error occurred', err),
    );
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.newAppText}>
              New App Version {versionData?.version} available
            </Text>
            <Text style={styles.newFeatureText}>{versionData?.message}</Text>
            <View style={{width: 150}}>
              <CustomButton
                name="Update Now"
                color="#FFFFFF"
                backgroundColor="#29977E"
                onPress={() => openGooglePlayStore()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VersionAppModel;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 5,
  },

  newAppText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  newFeatureText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
});
