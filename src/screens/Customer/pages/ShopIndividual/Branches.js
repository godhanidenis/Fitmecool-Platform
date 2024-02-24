import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {BackGroundStyle} from '../../../../../CommonStyle';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BranchMultiDropDown from '../../../../components/BranchMultiDropDown';
import CustomButton from '../../../../common/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar} from 'react-native-paper';
import FollowConfirmationModel from '../../../../common/Customer/FollowConfirmationModel';
import {shopFollow} from '../../../../graphql/mutations/shops';
import {shopFollowToggle} from '../../../../redux/LoginUserProfileSlice/userSlice';
import {useToast} from 'native-base';
import FastImage from 'react-native-fast-image';

const Branches = () => {
  const toast = useToast();
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {shopDetails} = route?.params?.state ?? route?.params?.state;
  const [shopFollowByUser, setShopFollowByUser] = useState(false);
  const [followModalVisible, setFollowModalVisible] = useState(false);
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
        },
      );
    } else {
      navigation.navigate('LoginMainScreen');
    }
  };

  useEffect(() => {
    if (!isAuthenticate) {
      setShopFollowByUser(false);
    }

    const followedShopsByUser = userProfile?.shop_follower_list?.find(
      itm => itm?.shop_id === shopDetails?.id,
    );

    followedShopsByUser
      ? setShopFollowByUser(true)
      : setShopFollowByUser(false);
  }, [isAuthenticate, shopDetails, userProfile]);

  return (
    <View style={{flex: 1, backgroundColor: BackGroundStyle}}>
      <View style={styles.headerMain}>
        <View style={styles.backMain}>
          <TouchableOpacity
            style={{padding: 10}}
            onPress={() => navigation.goBack()}>
            <Icon name="angle-left" size={24} color="white" />
          </TouchableOpacity>
          {shopDetails?.shop_logo?.small ? (
            <FastImage
              style={{width: 45, height: 45, borderRadius: 24}}
              source={{
                uri: shopDetails?.shop_logo?.small,
                cache: FastImage.cacheControl.web,
              }}
              resizeMode="cover"
            />
          ) : (
            <Avatar.Text
              size={45}
              label={shopDetails?.shop_name?.charAt(0)}
              backgroundColor="#29977E"
            />
          )}

          <View>
            <Text numberOfLines={2} style={styles.shopNameText}>
              {shopDetails?.shop_name}
            </Text>
            <Text style={{color: 'white'}}>
              {shopDetails?.branch_info?.length} Branches
            </Text>
          </View>
        </View>
        <View style={{width: '25%'}}>
          <CustomButton
            name={shopFollowByUser ? 'Following' : 'Follow'}
            color="white"
            backgroundColor="#151827"
            borderColor="white"
            onPress={() => {
              shopFollowByUser
                ? setFollowModalVisible(true)
                : clickedByFollow();
            }}
            icon={!shopFollowByUser && true}
            iconName="plus"
          />
        </View>
        <FollowConfirmationModel
          followModalVisible={followModalVisible}
          setFollowModalVisible={setFollowModalVisible}
          shopFollowByUser={shopFollowByUser}
          shopDetails={shopDetails}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.branchListContainer}>
          {shopDetails?.branch_info?.map((item, index) => (
            <BranchMultiDropDown
              key={item?.id}
              item={item}
              index={index}
              cardTitle={`Branch ${index + 1}`}
              bottomComponent={
                <View>
                  <View style={styles.listMain}>
                    <Text style={styles.titleLeftText}>Manager Name :</Text>
                    <Text style={styles.titleRightText}>
                      {item?.manager_name}
                    </Text>
                  </View>
                  <View style={styles.listMain}>
                    <Text style={styles.titleLeftText}>Phone Number :</Text>
                    <Text style={styles.titleRightText}>
                      {item?.manager_contact}
                    </Text>
                  </View>
                  <View style={styles.listMain}>
                    <Text style={styles.titleLeftText}>Branch Address :</Text>
                    <Text style={styles.titleRightText}>
                      {item?.branch_address}
                    </Text>
                  </View>
                  <View style={styles.listMain}>
                    <Text style={styles.titleLeftText}>City :</Text>
                    <Text style={styles.titleRightText}>
                      {item?.branch_city}
                    </Text>
                  </View>
                </View>
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Branches;

const styles = StyleSheet.create({
  backMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '75%',
  },
  headerMain: {
    paddingVertical: 15,
    backgroundColor: '#151827',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  shopNameText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 17,
    width: 150,
  },
  listMain: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
  },
  titleLeftText: {
    color: 'rgba(21, 24, 39, 0.56)',
    fontSize: 14,
    fontWeight: '600',
    width: '35%',
  },
  titleRightText: {
    color: '#151827',
    fontSize: 14,
    fontWeight: '600',
    width: '65%',
  },
  branchListContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
});
