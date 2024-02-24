import {Alert, Modal, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomButton from '../../../../common/CustomButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import BranchMultiDropDown from '../../../../components/BranchMultiDropDown';
import {FontStyle} from '../../../../../CommonStyle';
import {NativeBaseProvider, Select, useToast} from 'native-base';
import {
  createBranch,
  deleteBranch,
  updateBranch,
} from '../../../../graphql/mutations/branch';
import VendorSubBranchTextField from '../../../../common/VendorSubBranchTextField';
import LocationSelect from '../../../../common/LocationSelect';
import {
  getAreaByCityLists,
  getCityByStateLists,
} from '../../../../graphql/queries/areaListsQueries';

const SubBranchTab = ({
  vendorShopDetails,
  useProfileData,
  ownerInfoGetValue,
  mainBranchInfoGetValue,
  updateVendorShopDetailStore,
  stateDataLists,
}) => {
  const [subBranchList, setSubBranchList] = useState([]);
  const [branchDeleteModalOpen, setBranchDeleteModalOpen] = useState(false);
  const [deleteBranchId, setDeleteBranchId] = useState();
  const [subBranchModalOpen, setSubBranchModalOpen] = useState(false);
  const [editableBranchData, setEditableBranchData] = useState();

  useEffect(() => {
    if (vendorShopDetails) {
      const subBranches = vendorShopDetails?.branch_info?.filter(
        itm => itm.branch_type === 'sub',
      );
      setSubBranchList(subBranches);
    }
  }, [vendorShopDetails]);

  const onDeleteBranch = deleteItem => {
    setDeleteBranchId(deleteItem?.id);
    setBranchDeleteModalOpen(true);
  };
  const onEditBranch = editItem => {
    setEditableBranchData(editItem);
    setSubBranchModalOpen(true);
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.mainContainer}>
        {!subBranchModalOpen && (
          <View style={{width: '100%', marginBottom: 20}}>
            <CustomButton
              name="Add Sub Branch"
              color="#29977E"
              backgroundColor="#FAFCFC"
              borderColor="#29977E"
              onPress={() => setSubBranchModalOpen(true)}
              icon={true}
              iconName="plus"
            />
          </View>
        )}

        {subBranchModalOpen ? (
          <View>
            <SubBranchModal
              subBranchModalOpen={subBranchModalOpen}
              setSubBranchModalOpen={setSubBranchModalOpen}
              updateVendorShopDetailStore={updateVendorShopDetailStore}
              mainBranchInfoGetValue={mainBranchInfoGetValue}
              ownerInfoGetValue={ownerInfoGetValue}
              ShopId={useProfileData?.userCreatedShopId}
              editableBranchData={editableBranchData}
              setEditableBranchData={setEditableBranchData}
              stateDataLists={stateDataLists}
            />
          </View>
        ) : (
          subBranchList?.map((item, index) => (
            <BranchMultiDropDown
              key={index}
              item={item}
              index={index}
              cardTitle={`Branch ${index + 1}`}
              onDeleteBranch={onDeleteBranch}
              onEditBranch={onEditBranch}
              onEditDelShow={true}
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
                    <Text style={styles.titleLeftText}>State :</Text>
                    <Text style={styles.titleRightText}>
                      {item?.branch_state}
                    </Text>
                  </View>
                  <View style={styles.listMain}>
                    <Text style={styles.titleLeftText}>City :</Text>
                    <Text style={styles.titleRightText}>
                      {item?.branch_city}
                    </Text>
                  </View>
                  <View style={styles.listMain}>
                    <Text style={styles.titleLeftText}>Pin Code :</Text>
                    <Text style={styles.titleRightText}>
                      {item?.branch_pinCode}
                    </Text>
                  </View>
                </View>
              }
            />
          ))
        )}
      </View>
      <BranchDeleteModel
        setBranchDeleteModalOpen={setBranchDeleteModalOpen}
        branchDeleteModalOpen={branchDeleteModalOpen}
        deleteBranchId={deleteBranchId}
        updateVendorShopDetailStore={updateVendorShopDetailStore}
      />
    </View>
  );
};

export default SubBranchTab;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 22,
    marginVertical: 30,
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
  addBranchHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  addBranchText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
});

const delModelStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    color: 'black',
    fontFamily: FontStyle,
  },
});

const BranchDeleteModel = ({
  branchDeleteModalOpen,
  setBranchDeleteModalOpen,
  deleteBranchId,
  updateVendorShopDetailStore,
}) => {
  const toast = useToast();
  return (
    <View style={delModelStyles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={branchDeleteModalOpen}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setBranchDeleteModalOpen(!branchDeleteModalOpen);
        }}>
        <View style={delModelStyles.centeredView}>
          <View style={delModelStyles.modalView}>
            <View>
              <Text style={delModelStyles.modalText}>
                Are you sure delete this branch
              </Text>
              <Text style={[delModelStyles.modalText, {fontWeight: '700'}]}>
                {deleteBranchId}.
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 20,
                gap: 10,
              }}>
              <View style={{width: '40%'}}>
                <CustomButton
                  name="Cancel"
                  color="#29977E"
                  backgroundColor="white"
                  borderColor="#29977E"
                  onPress={() => setBranchDeleteModalOpen(false)}
                />
              </View>
              <View style={{width: '40%'}}>
                <CustomButton
                  name="Delete"
                  color="white"
                  backgroundColor="#dc2626"
                  borderColor="#dc2626"
                  onPress={() => {
                    deleteBranch({id: deleteBranchId}).then(
                      res => {
                        toast.show({
                          title: res.data.deleteBranch,
                          placement: 'top',
                          backgroundColor: 'green.600',
                          variant: 'solid',
                        });
                        updateVendorShopDetailStore();
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
                    setBranchDeleteModalOpen(false);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AddEditModelStyles = StyleSheet.create({
  addBranchHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  addBranchText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  subTextFieldTwoMain: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonMain: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

const SubBranchModal = ({
  subBranchModalOpen,
  setSubBranchModalOpen,
  updateVendorShopDetailStore,
  ShopId,
  editableBranchData,
  setEditableBranchData,
  ownerInfoGetValue,
  mainBranchInfoGetValue,
  stateDataLists,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [managerValue, setManagerValue] = useState('');
  const [subManagerAddress, setSubManagerAddress] = useState('');
  const [subManagerState, setSubManagerState] = useState('');
  const [subManagerCity, setSubManagerCity] = useState('');
  const [subManagerPinCode, setSubManagerPinCode] = useState('');

  const [subManagerFirstName, setSubManagerFirstName] = useState('');
  const [subManagerLastName, setSubManagerLastName] = useState('');
  const [subManagerEmail, setSubManagerEmail] = useState('');
  const [subManagerPhone, setSubManagerPhone] = useState('');

  const [error, setError] = useState({
    subManagerAddressError: '',
    subManagerStateError: '',
    subManagerCityError: '',
    subManagerPinCodeError: '',
    subManagerFirstNameError: '',
    subManagerLastNameError: '',
    subManagerEmailError: '',
    subManagerPhoneError: '',
  });

  useEffect(() => {
    if (managerValue === 'Same as owner') {
      setSubManagerFirstName(ownerInfoGetValue('first_name'));
      setSubManagerLastName(ownerInfoGetValue('last_name'));
      setSubManagerEmail(ownerInfoGetValue('user_email'));
      setSubManagerPhone(ownerInfoGetValue('user_contact'));
      error.subManagerFirstNameError = '';
      error.subManagerLastNameError = '';
      error.subManagerEmailError = '';
      error.subManagerPhoneError = '';
    } else if (managerValue === 'same as main branch manager') {
      setSubManagerFirstName(mainBranchInfoGetValue('manager_first_name'));
      setSubManagerLastName(mainBranchInfoGetValue('manager_last_name'));
      setSubManagerEmail(mainBranchInfoGetValue('manager_user_email'));
      setSubManagerPhone(mainBranchInfoGetValue('manager_user_contact'));
      error.subManagerFirstNameError = '';
      error.subManagerLastNameError = '';
      error.subManagerEmailError = '';
      error.subManagerPhoneError = '';
    } else {
      if (editableBranchData) {
        setSubManagerFirstName(editableBranchData?.manager_name?.split(' ')[0]);
        setSubManagerLastName(editableBranchData?.manager_name?.split(' ')[1]);
        setSubManagerEmail(editableBranchData?.manager_email);
        setSubManagerPhone(editableBranchData?.manager_contact);
      } else {
        setSubManagerFirstName('');
        setSubManagerLastName('');
        setSubManagerEmail('');
        setSubManagerPhone('');
      }
    }
  }, [error, mainBranchInfoGetValue, managerValue, ownerInfoGetValue]);

  useEffect(() => {
    if (editableBranchData) {
      setSubManagerAddress(editableBranchData.branch_address);
      setSubManagerState(editableBranchData.branch_state);
      setSubManagerCity(editableBranchData.branch_city);
      setSubManagerPinCode(editableBranchData.branch_pinCode);
      setManagerValue(
        (editableBranchData?.same_as === 'owner' && 'Same as owner') ||
          (editableBranchData?.same_as === 'main_branch_manager' &&
            'same as main branch manager') ||
          '',
      );
    }
  }, [editableBranchData]);

  const subBranchSubmit = () => {
    let allError = {};
    if (!subManagerAddress) {
      allError.subManagerAddressError = 'Address is require';
    } else {
      allError.subManagerAddressError = '';
    }
    if (!subManagerState) {
      allError.subManagerStateError = 'State is require';
    } else {
      allError.subManagerStateError = '';
    }
    if (!subManagerCity) {
      allError.subManagerCityError = 'City is require';
    } else {
      allError.subManagerCityError = '';
    }

    if (!subManagerPinCode) {
      allError.subManagerPinCodeError = 'PinCode is require';
    } else {
      allError.subManagerPinCodeError = '';
    }

    if (!subManagerFirstName) {
      allError.subManagerFirstNameError = 'FirstName is require';
    } else {
      allError.subManagerFirstNameError = '';
    }
    if (!subManagerLastName) {
      allError.subManagerLastNameError = 'LastName is require';
    } else {
      allError.subManagerLastNameError = '';
    }
    if (!subManagerEmail) {
      allError.subManagerEmailError = 'Email is require';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(subManagerEmail)
    ) {
      allError.subManagerEmailError = 'Invalid Email address';
    } else {
      allError.subManagerEmailError = '';
    }
    if (!subManagerPhone) {
      allError.subManagerPhoneError = 'Phone is require';
    } else if (subManagerPhone.length != 10) {
      allError.subManagerPhoneError = 'Phone Number must be 10 numbers';
    } else {
      allError.subManagerPhoneError = '';
    }

    if (
      !subManagerAddress ||
      !subManagerState ||
      !subManagerCity ||
      !subManagerPinCode ||
      !subManagerFirstName ||
      !subManagerLastName ||
      !subManagerEmail ||
      !subManagerPhone
    ) {
      setError(allError);
    } else {
      setLoading(true);
      if (editableBranchData) {
        updateBranch({
          id: editableBranchData?.id,
          branchInfo: {
            branch_address: subManagerAddress,
            branch_state: subManagerState,
            branch_city: subManagerCity,
            branch_pinCode: subManagerPinCode,
            same_as:
              (managerValue === 'Same as owner' && 'owner') ||
              (managerValue === 'same as main branch manager' &&
                'main_branch_manager') ||
              'none',
            manager_name: subManagerFirstName + ' ' + subManagerLastName,
            manager_contact: subManagerPhone,
            manager_email: subManagerEmail,
            branch_type: 'sub',
            shop_id: ShopId,
          },
        }).then(
          res => {
            toast.show({
              title: res.data.updateBranch.message,
              placement: 'top',
              backgroundColor: 'green.600',
              variant: 'solid',
            });
            setLoading(false);
            updateVendorShopDetailStore();
            handleSubBranchModalClose();
          },
          error => {
            toast.show({
              title: error.message,
              placement: 'top',
              backgroundColor: 'red.600',
              variant: 'solid',
            });
            setLoading(false);
          },
        );
      } else {
        createBranch({
          branchInfo: {
            branch_address: subManagerAddress,
            branch_state: subManagerState,
            branch_city: subManagerCity,
            branch_pinCode: subManagerPinCode,
            same_as:
              (managerValue === 'Same as owner' && 'owner') ||
              (managerValue === 'same as main branch manager' &&
                'main_branch_manager') ||
              'none',
            manager_name: subManagerFirstName + ' ' + subManagerLastName,
            manager_contact: subManagerPhone,
            manager_email: subManagerEmail,
            branch_type: 'sub',
            shop_id: ShopId,
          },
        }).then(
          res => {
            toast.show({
              title: res.data.createBranch.message,
              placement: 'top',
              backgroundColor: 'green.600',
              variant: 'solid',
            });
            setLoading(false);
            updateVendorShopDetailStore();
            handleSubBranchModalClose();
          },
          error => {
            setLoading(false);
            toast.show({
              title: error.message,
              placement: 'top',
              backgroundColor: 'red.600',
              variant: 'solid',
            });
          },
        );
      }
    }
  };

  const handleSubBranchModalClose = () => {
    setSubBranchModalOpen(false);
    setSubManagerAddress('');
    setSubManagerState('');
    setSubManagerCity('');
    setSubManagerPinCode('');
    setSubManagerFirstName('');
    setSubManagerLastName('');
    setSubManagerEmail('');
    setManagerValue('');
    setSubManagerPhone('');
    setEditableBranchData();
    setLoading(false);

    setError({
      subManagerAddressError: '',
      subManagerStateError: '',
      subManagerCityError: '',
      subManagerPinCodeError: '',
      subManagerFirstNameError: '',
      subManagerLastNameError: '',
      subManagerEmailError: '',
      subManagerPhoneError: '',
    });
  };

  const [getCityData, setGetCityData] = useState([]);
  const [getAreaData, setGetAreaData] = useState([]);

  useEffect(() => {
    const getCityList = async () => {
      await getCityByStateLists(editableBranchData?.branch_state)
        .then(res => setGetCityData(res?.data?.cityByState))
        .catch(err => console.log('error', err));
    };
    if (editableBranchData?.branch_state) {
      getCityList();
    }
  }, [editableBranchData]);

  useEffect(() => {
    const getAreaList = async () => {
      await getAreaByCityLists(editableBranchData?.branch_city)
        .then(res => setGetAreaData(res?.data?.areaByCity))
        .catch(err => console.log('error', err));
    };
    if (editableBranchData?.branch_city) {
      getAreaList();
    }
  }, [editableBranchData]);

  const onChangeSubBranchState = async data => {
    setError({
      ...error,
      subManagerStateError: '',
    });

    await getCityByStateLists(data)
      .then(res => setGetCityData(res?.data?.cityByState))
      .catch(err => console.log('error', err));
    setSubManagerState(data);
  };
  const onChangeSubBranchCity = async data => {
    setError({
      ...error,
      subManagerCityError: '',
    });

    await getAreaByCityLists(data)
      .then(res => setGetAreaData(res?.data?.areaByCity))
      .catch(err => console.log('error', err));

    setSubManagerCity(data);
  };
  const onChangeSubBranchPinCode = data => {
    console.log('pincode', data);
    setSubManagerPinCode(data);
    setError({
      ...error,
      subManagerPinCodeError: '',
    });
  };

  return (
    <View>
      <View style={AddEditModelStyles.addBranchHeader}>
        <Icon
          onPress={() => handleSubBranchModalClose()}
          name="arrow-left"
          size={20}
          color="black"
        />
        <Text style={AddEditModelStyles.addBranchText}>
          Back To All Branches
        </Text>
      </View>
      <View>
        <View style={{marginBottom: 15}}>
          <VendorSubBranchTextField
            label="Address"
            mode="outlined"
            name="address"
            activeOutlineColor="#29977E"
            onChange={value => {
              setSubManagerAddress(value);
              error.subManagerAddressError = '';
            }}
            value={subManagerAddress}
          />
          {error.subManagerAddressError && (
            <Text style={{color: 'red', fontSize: 14}}>
              {error.subManagerAddressError || ''}
            </Text>
          )}
        </View>
        <View
          style={[AddEditModelStyles.subTextFieldTwoMain, {marginBottom: 15}]}>
          <View style={{width: '48%'}}>
            <LocationSelect
              name="state"
              placeholder="Select State"
              arrayListItem={stateDataLists}
              stateField={true}
              onChangeValue={onChangeSubBranchState}
              subBranchSelect={true}
              defaultValue={editableBranchData?.branch_state}
            />
            {error.subManagerStateError && (
              <Text style={{color: 'red', fontSize: 14}}>
                {error.subManagerStateError || ''}
              </Text>
            )}
          </View>

          <View style={{width: '48%'}}>
            <LocationSelect
              name="city"
              placeholder="Select City"
              arrayListItem={getCityData}
              cityField={true}
              onChangeValue={onChangeSubBranchCity}
              subBranchSelect={true}
              defaultValue={editableBranchData?.branch_city}
            />
            {error.subManagerCityError && (
              <Text style={{color: 'red', fontSize: 14}}>
                {error.subManagerCityError || ''}
              </Text>
            )}
          </View>
        </View>

        <View style={{marginBottom: 15}}>
          <LocationSelect
            name="PinCode"
            placeholder="Select PinCode"
            arrayListItem={getAreaData}
            pinCodeField={true}
            onChangeValue={onChangeSubBranchPinCode}
            subBranchSelect={true}
            defaultValue={editableBranchData?.branch_pinCode}
          />
          {error.subManagerPinCodeError && (
            <Text style={{color: 'red', fontSize: 14}}>
              {error.subManagerPinCodeError || ''}
            </Text>
          )}
        </View>
        <View style={{marginBottom: 15}}>
          <NativeBaseProvider>
            <Select
              selectedValue={managerValue}
              minWidth="200"
              height="50"
              accessibilityLabel="Manager"
              placeholder="Manager"
              _selectedItem={{
                bg: 'green.200',
              }}
              mt={1}
              style={{fontSize: 16}}
              onValueChange={itemValue => setManagerValue(itemValue)}>
              <Select.Item label="None" value="" />
              <Select.Item label="Same as owner" value="Same as owner" />
              <Select.Item
                label="same as main branch manager"
                value="same as main branch manager"
              />
            </Select>
          </NativeBaseProvider>
        </View>

        <View
          style={[AddEditModelStyles.subTextFieldTwoMain, {marginBottom: 15}]}>
          <View style={{width: '48%'}}>
            <VendorSubBranchTextField
              label="First Name"
              mode="outlined"
              name="Manager_First_Name"
              activeOutlineColor="#29977E"
              disabled={
                managerValue === 'Same as owner' ||
                managerValue === 'same as main branch manager'
              }
              value={subManagerFirstName}
              onChange={e => {
                setSubManagerFirstName(e);
                error.subManagerFirstNameError = '';
              }}
            />
            {error.subManagerFirstNameError && (
              <Text style={{color: 'red', fontSize: 14}}>
                {error.subManagerFirstNameError || ''}
              </Text>
            )}
          </View>
          <View style={{width: '48%'}}>
            <VendorSubBranchTextField
              label="Last Name"
              mode="outlined"
              name="Manager_last_Name"
              activeOutlineColor="#29977E"
              disabled={
                managerValue === 'Same as owner' ||
                managerValue === 'same as main branch manager'
              }
              value={subManagerLastName}
              onChange={e => {
                setSubManagerLastName(e);
                error.subManagerLastNameError = '';
              }}
            />
            {error.subManagerLastNameError && (
              <Text style={{color: 'red', fontSize: 14}}>
                {error.subManagerLastNameError || ''}
              </Text>
            )}
          </View>
        </View>
        <View
          style={[AddEditModelStyles.subTextFieldTwoMain, {marginBottom: 15}]}>
          <View style={{width: '48%'}}>
            <VendorSubBranchTextField
              label="Email Address"
              mode="outlined"
              name="Manager_Email_Address"
              activeOutlineColor="#29977E"
              disabled={
                managerValue === 'Same as owner' ||
                managerValue === 'same as main branch manager'
              }
              value={subManagerEmail}
              onChange={e => {
                setSubManagerEmail(e);
                error.subManagerEmailError = '';
              }}
            />
            {error.subManagerEmailError && (
              <Text style={{color: 'red', fontSize: 14}}>
                {error.subManagerEmailError || ''}
              </Text>
            )}
          </View>
          <View style={{width: '48%'}}>
            <VendorSubBranchTextField
              label="Phone Number"
              mode="outlined"
              name="Manager_Phone_Number"
              activeOutlineColor="#29977E"
              disabled={
                managerValue === 'Same as owner' ||
                managerValue === 'same as main branch manager'
              }
              keyboardType="number-pad"
              value={subManagerPhone}
              onChange={e => {
                setSubManagerPhone(e);
                if (e?.length != 10) {
                  error.subManagerPhoneError = 'Number must be 10 numbers';
                } else {
                  error.subManagerPhoneError = '';
                }
              }}
            />
            {error.subManagerPhoneError && (
              <Text style={{color: 'red', fontSize: 14}}>
                {error.subManagerPhoneError || ''}
              </Text>
            )}
          </View>
        </View>
        <View style={AddEditModelStyles.buttonMain}>
          <View style={{width: '30%'}}>
            <CustomButton
              name="Cancel"
              color="#29977E"
              backgroundColor="white"
              borderColor="#29977E"
              onPress={() => handleSubBranchModalClose()}
            />
          </View>
          <View style={{width: '30%'}}>
            <CustomButton
              name={editableBranchData ? 'Update' : 'Save'}
              color="#FFFFFF"
              backgroundColor="#29977E"
              borderColor="#29977E"
              onPress={() => subBranchSubmit()}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
