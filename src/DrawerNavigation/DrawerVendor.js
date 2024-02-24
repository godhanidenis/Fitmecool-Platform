import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import VendorTab from '../TabNavigation/VendorTab';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import VendorSideBarContent from '../components/VendorSideBarContent';
import {userLogout} from '../redux/LoginUserProfileSlice/userSlice';
import CustomButton from '../common/CustomButton';
import {Divider} from 'react-native-paper';
import {Modal} from 'react-native';
import {deleteAccount} from '../graphql/mutations/accountDelete';
import {BackGroundStyle} from '../../CommonStyle';
import {deleteObjectsInFolder} from '../wasabi';

const DrawerVendor = ({vendorShopDetails}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();

  const Drawer = createDrawerNavigator();
  const [accDelModalVisible, setAccDelModalVisible] = useState(false);
  const {userProfile, isAuthenticate} = useSelector(state => state?.user);

  const LogOut = async () => {
    AsyncStorage.clear();
    dispatch(userLogout());
    toast.show({
      title: 'Logout Successfully ! ',
      placement: 'top',
      backgroundColor: 'green.600',
      variant: 'solid',
    });
    setTimeout(() => {
      navigation.navigate('Splash');
    }, 500);
  };

  const CustomDrawerContent = props => {
    return (
      <View style={{height: '100%', position: 'relative'}}>
        <DrawerContentScrollView {...props}>
          <VendorSideBarContent vendorShopDetails={vendorShopDetails} />
          {/* <DrawerItemList {...props} /> */}
        </DrawerContentScrollView>
        <View style={styles.bottomMain}>
          <Divider bold={true} />

          <View style={{width: '60%', marginLeft: 30, paddingVertical: 10}}>
            <CustomButton
              name="Delete Account"
              iconName="trash"
              icon={true}
              color="red"
              backgroundColor="white"
              borderColor="red"
              onPress={() => setAccDelModalVisible(true)}
            />
          </View>
          <TouchableOpacity onPress={() => LogOut()} style={styles.logoutMain}>
            <Icon name="power-off" size={20} color="#151827" />
            <Text style={styles.wishText}>logout</Text>
          </TouchableOpacity>
        </View>
        <AccountDeleteModel
          userProfile={userProfile}
          accDelModalVisible={accDelModalVisible}
          setAccDelModalVisible={setAccDelModalVisible}
        />
      </View>
    );
  };

  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
      <Drawer.Screen
        name="Dashboard"
        component={VendorTab}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerVendor;

const styles = StyleSheet.create({
  bottomMain: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  logoutMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 15,
    // bottom: 0,
    // position: 'absolute',
    borderTopWidth: 1,
    width: '100%',
  },
  wishText: {
    color: '#151827',
    fontWeight: '400',
    fontSize: 18,
  },
});

const AccountDeleteModel = ({
  userProfile,
  accDelModalVisible,
  setAccDelModalVisible,
}) => {
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const HandleDeleteAccount = async () => {
    setLoading(true);
    await deleteAccount({id: userProfile?.id}).then(
      async res => {
        const folderStructure = `user_${userProfile?.id}`;
        await deleteObjectsInFolder(folderStructure);
        toast.show({
          title: 'Account Delete Sucessfully',
          placement: 'top',
          backgroundColor: 'green.600',
          variant: 'solid',
        });
        setLoading(false);
        setAccDelModalVisible(false);
        AsyncStorage.clear();
        dispatch(userLogout());
        setTimeout(() => {
          navigation.navigate('Splash');
        }, 500);
      },
      error => {
        toast.show({
          title: error.message,
          placement: 'top',
          backgroundColor: 'red.600',
          variant: 'solid',
        });
        setAccDelModalVisible(false);
      },
    );
  };
  return (
    <View style={deltyles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={accDelModalVisible}
        onRequestClose={() => {
          setAccDelModalVisible(!accDelModalVisible);
        }}>
        <View style={deltyles.centeredView}>
          <View style={deltyles.modalView}>
            <Text style={deltyles.titleText}>Delete Account</Text>
            <Text style={deltyles.modalText}>
              All of your records will get removed permanently. Be aware that
              this action is irreversible
            </Text>
            <View style={deltyles.bottomBtnMain}>
              <View style={{width: '40%'}}>
                <CustomButton
                  name="Delete"
                  color="#FFFFFF"
                  backgroundColor="red"
                  borderColor="red"
                  onPress={() => HandleDeleteAccount()}
                  loading={loading}
                />
              </View>
              <View style={{width: '40%'}}>
                <CustomButton
                  name="Cancel"
                  color="black"
                  backgroundColor="white"
                  borderColor="black"
                  onPress={() => setAccDelModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const deltyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // width: "70%",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: BackGroundStyle,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 10,
  },
  modalText: {
    marginBottom: 15,
    color: 'black',
    fontWeight: '400',
    fontSize: 14,
  },
  titleText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 18,
    paddingBottom: 5,
  },
  bottomBtnMain: {
    flexDirection: 'row',
    gap: 10,
  },
});
