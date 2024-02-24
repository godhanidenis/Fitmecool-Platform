import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Divider} from 'react-native-paper';
import CustomButton from '../CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {shopFollow} from '../../graphql/mutations/shops';
import {useNavigation} from '@react-navigation/native';
import {shopFollowToggle} from '../../redux/LoginUserProfileSlice/userSlice';
import {useToast} from 'native-base';

const FollowConfirmationModel = ({
  followModalVisible,
  setFollowModalVisible,
  shopFollowByUser,
  shopDetails,
}) => {
  const toast = useToast();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userProfile, isAuthenticate} = useSelector(state => state?.user);

  const clickedByFollow = () => {
    if (isAuthenticate) {
      shopFollow({
        shopInfo: {
          shop_id: shopDetails?.id,
          user_id: userProfile?.id,
        },
      }).then(
        res => {
          dispatch(
            !shopFollowByUser
              ? shopFollowToggle({
                  shopInfo: {
                    key: 'follow',
                    value: res?.data?.shopFollower?.data,
                  },
                })
              : shopFollowToggle({
                  shopInfo: {
                    key: 'unFollow',
                    value: shopDetails?.id,
                  },
                }),
            setFollowModalVisible(false),
          );
          toast.show({
            title: res?.data?.shopFollower?.message,
            placement: 'top',
            backgroundColor: 'green.600',
            variant: 'solid',
          });
        },
        error => {
          toast.show({
            title: error.message,
            placement: 'top',
            backgroundColor: 'red.600',
            variant: 'solid',
          });
          setFollowModalVisible(false);
        },
      );
    } else {
      setFollowModalVisible(false);
      navigation.navigate('LoginMainScreen');
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={followModalVisible}
        onRequestClose={() => {
          setFollowModalVisible(!followModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerMain}>
              <Text style={styles.modalHeaderText}>
                {shopFollowByUser ? 'Unfollow' : 'Follow'}
              </Text>
              <TouchableOpacity
                style={{
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setFollowModalVisible(false)}>
                <Icon name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <Divider bold={true} />
            <View>
              <Text style={styles.bodyText}>
                You are about to {shopFollowByUser ? 'Unfollow' : 'Follow'}{' '}
                {shopDetails?.shop_name}
              </Text>
            </View>
            <Divider bold={true} />
            <View style={styles.btnMain}>
              <View style={{width: '40%'}}>
                <CustomButton
                  name="Cancel"
                  color="#29977E"
                  backgroundColor="#FFFFFF"
                  onPress={() => setFollowModalVisible(false)}
                  borderColor="#29977E"
                />
              </View>
              <View style={{width: '40%'}}>
                <CustomButton
                  name={shopFollowByUser ? 'Unfollow' : 'Follow'}
                  color="#FFFFFF"
                  backgroundColor="#29977E"
                  onPress={() => clickedByFollow()}
                  borderColor="#29977E"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FollowConfirmationModel;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  modalHeaderText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  bodyText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    padding: 20,
  },
  btnMain: {
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'flex-end',
    gap: 10,
  },
});
