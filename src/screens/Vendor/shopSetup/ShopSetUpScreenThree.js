import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomTextInput from '../../../common/CustomTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FontStyle} from '../../../../CommonStyle';
import CustomButton from '../../../common/CustomButton';
import {RadioButton} from 'react-native-paper';
import {Select, NativeBaseProvider} from 'native-base';
import VendorSubBranchTextField from '../../../common/VendorSubBranchTextField';
import LocationSelect from '../../../common/LocationSelect';
import {useSelector} from 'react-redux';
import {
  getAreaByCityLists,
  getCityByStateLists,
} from '../../../graphql/queries/areaListsQueries';

const ShopSetUpScreenThree = ({
  control,
  errors,
  getValues,
  setValue,
  individual,
  currentPosition,
  subBranch,
  setSubBranch,
  sameAsOwner,
  setSameAsOwner,
  stateDataLists,
}) => {
  const [mainBranchShow, setMainBranchShow] = useState(true);
  const [managerShow, setManagerShow] = useState(true);
  const [managerSubBranchShow, setManagerSubBranchShow] = useState(true);
  const [subBranchEdit, setSubBranchEdit] = useState();

  const {areaLists} = useSelector(state => state.areaLists);

  useEffect(() => {
    if (sameAsOwner === 'True') {
      setValue('manager_first_name', getValues('first_name'));
      setValue('manager_last_name', getValues('last_name'));
      setValue('manager_user_email', getValues('user_email'));
      setValue('manager_user_contact', getValues('user_contact'));
    } else {
      setValue('manager_first_name', '');
      setValue('manager_last_name', '');
      setValue('manager_user_email', '');
      setValue('manager_user_contact', '');
    }
  }, [getValues, sameAsOwner, setValue, currentPosition]);

  const [getCityData, setGetCityData] = useState([]);
  const [getAreaData, setGetAreaData] = useState([]);

  const onChangeState = async data => {
    await getCityByStateLists(data)
      .then(res => setGetCityData(res?.data?.cityByState))
      .catch(err => console.log('error', err));
  };
  const onChangeCity = async data => {
    await getAreaByCityLists(data)
      .then(res => setGetAreaData(res?.data?.areaByCity))
      .catch(err => console.log('error', err));
  };
  const onChangePinCode = data => {
    console.log('pincode', data);
  };
  return (
    <View style={{marginHorizontal: 16}}>
      <View>
        <TouchableOpacity
          onPress={() => setMainBranchShow(!mainBranchShow)}
          style={styles.labelMain}>
          <Icon
            name={mainBranchShow ? 'angle-up' : 'angle-down'}
            size={33}
            color="black"
          />
          <Text style={styles.labelStyle}>Main Branch</Text>
        </TouchableOpacity>

        {mainBranchShow && (
          <View>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="Address"
                mode="outlined"
                control={control}
                name="address"
                rules={{required: 'Address is required *'}}
                activeOutlineColor="#29977E"
              />
              {errors?.address && (
                <Text style={{color: 'red'}}>{errors?.address?.message}</Text>
              )}
            </View>
            <View style={{marginBottom: 15}}>
              <LocationSelect
                control={control}
                name="state"
                rules={{required: 'State is required *'}}
                placeholder="Select State"
                arrayListItem={stateDataLists}
                stateField={true}
                onChangeValue={onChangeState}
              />
              {errors?.state && (
                <Text style={{color: 'red'}}>{errors?.state?.message}</Text>
              )}
            </View>
            {getCityData?.length > 0 && (
              <View style={{marginBottom: 15}}>
                <LocationSelect
                  control={control}
                  name="city"
                  rules={{required: 'City is required *'}}
                  placeholder="Select City"
                  arrayListItem={getCityData}
                  cityField={true}
                  onChangeValue={onChangeCity}
                />
                {errors?.city && (
                  <Text style={{color: 'red'}}>{errors?.city?.message}</Text>
                )}
              </View>
            )}
            {getAreaData?.length > 0 && (
              <View style={{marginBottom: 15}}>
                <LocationSelect
                  control={control}
                  name="pin_code"
                  rules={{required: 'Pin Code is required *'}}
                  placeholder="Select Pin Code"
                  arrayListItem={getAreaData}
                  pinCodeField={true}
                  onChangeValue={onChangePinCode}
                />
                {errors?.pin_code && (
                  <Text style={{color: 'red'}}>
                    {errors?.pin_code?.message}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          onPress={() => setManagerShow(!managerShow)}
          style={styles.labelMain}>
          <Icon
            name={managerShow ? 'angle-up' : 'angle-down'}
            size={33}
            color="black"
          />
          <Text style={styles.labelStyle}>Manager : Save as owner</Text>
        </TouchableOpacity>

        {managerShow && (
          <View>
            <RadioButton.Group
              onValueChange={newValue => {
                if (newValue === 'True') {
                  setSameAsOwner('True');
                } else {
                  setSameAsOwner('False');
                }
              }}
              value={sameAsOwner}>
              <View style={styles.radioParent}>
                <View style={styles.radioMain}>
                  <RadioButton color="#29977E" value="True" />
                  <Text
                    style={[
                      styles.radioText,
                      {
                        color:
                          sameAsOwner === 'True'
                            ? '#151827'
                            : 'rgba(21, 24, 39, 0.56)',
                      },
                    ]}>
                    Yes
                  </Text>
                </View>
                <View style={styles.radioMain}>
                  <RadioButton color="#29977E" value="False" />
                  <Text
                    style={[
                      styles.radioText,
                      {
                        color:
                          sameAsOwner === 'False'
                            ? '#151827'
                            : 'rgba(21, 24, 39, 0.56)',
                      },
                    ]}>
                    No
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="First Name"
                mode="outlined"
                disabled={sameAsOwner === 'True'}
                control={control}
                name="manager_first_name"
                rules={{required: 'Manager first name is required *'}}
                activeOutlineColor="#29977E"
              />
              {errors?.manager_first_name && (
                <Text style={{color: 'red'}}>
                  {errors?.manager_first_name?.message}
                </Text>
              )}
            </View>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="Last Name"
                mode="outlined"
                disabled={sameAsOwner === 'True'}
                control={control}
                name="manager_last_name"
                rules={{required: 'Manager last name is required *'}}
                activeOutlineColor="#29977E"
              />
              {errors?.manager_last_name && (
                <Text style={{color: 'red'}}>
                  {errors?.manager_last_name?.message}
                </Text>
              )}
            </View>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="Email"
                mode="outlined"
                disabled={sameAsOwner === 'True'}
                control={control}
                name="manager_user_email"
                rules={{
                  required: 'Manager Email is required *',
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Please enter a valid email',
                  },
                }}
                activeOutlineColor="#29977E"
              />
              {errors?.manager_user_email && (
                <Text style={{color: 'red'}}>
                  {errors?.manager_user_email?.message}
                </Text>
              )}
            </View>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="Phone Number"
                mode="outlined"
                disabled={sameAsOwner === 'True'}
                control={control}
                name="manager_user_contact"
                rules={{
                  required: 'Phone Number is required *',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid number',
                  },
                }}
                activeOutlineColor="#29977E"
              />
              {errors?.manager_user_contact && (
                <Text style={{color: 'red'}}>
                  {errors?.manager_user_contact?.message}
                </Text>
              )}
            </View>
          </View>
        )}

        {!individual && (
          <>
            <TouchableOpacity
              onPress={() => setManagerSubBranchShow(!managerSubBranchShow)}
              style={styles.labelMain}>
              <Icon
                name={managerSubBranchShow ? 'angle-up' : 'angle-down'}
                size={33}
                color="black"
              />
              <Text style={styles.labelStyle}>Sub Branch</Text>
            </TouchableOpacity>

            {managerSubBranchShow && (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{flexDirection: 'row', gap: 15}}
                  style={{marginBottom: 15}}>
                  {subBranch?.map(sub => (
                    <View key={sub?.id} style={styles.subListMain}>
                      <View style={styles?.delEditMain}>
                        <TouchableOpacity
                          onPress={() => {
                            setSubBranch(
                              subBranch?.filter(itm => itm.id !== sub.id),
                            );
                          }}>
                          <Text style={styles.delText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setSubBranchEdit(sub);
                          }}>
                          <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.textInnerMain}>
                        <Text style={styles.textLabelSub}>Address : </Text>
                        <Text style={styles.textSub}>
                          {sub?.subManagerAddress}
                        </Text>
                      </View>
                      <View style={styles.textInnerMain}>
                        <Text style={styles.textLabelSub}>State : </Text>
                        <Text style={styles.textSub}>
                          {sub.subManagerState}
                        </Text>
                      </View>
                      <View style={styles.textInnerMain}>
                        <Text style={styles.textLabelSub}>City : </Text>
                        <Text style={styles.textSub}>{sub.subManagerCity}</Text>
                      </View>
                      <View style={styles.textInnerMain}>
                        <Text style={styles.textLabelSub}>Pin Code : </Text>
                        <Text style={styles.textSub}>
                          {sub.subManagerPinCode}
                        </Text>
                      </View>
                      <View style={styles.textInnerMain}>
                        <Text style={styles.textLabelSub}>Manager Name : </Text>
                        <Text style={styles.textSub}>
                          {sub.subManagerFirstName +
                            ' ' +
                            sub.subManagerLastName}
                        </Text>
                      </View>
                      <View style={styles.textInnerMain}>
                        <Text style={styles.textLabelSub}>
                          Manager Email :{' '}
                        </Text>
                        <Text style={styles.textSub}>
                          {sub.subManagerEmail}
                        </Text>
                      </View>
                      <View style={styles.textInnerMain}>
                        <Text style={styles.textLabelSub}>
                          Manager Phone Number :{' '}
                        </Text>
                        <Text style={styles.textSub}>
                          {sub.subManagerPhone}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <SubBranchModel
                  getValues={getValues}
                  subBranch={subBranch}
                  setSubBranch={setSubBranch}
                  subBranchEdit={subBranchEdit}
                  setSubBranchEdit={setSubBranchEdit}
                  areaLists={areaLists}
                  stateDataLists={stateDataLists}
                />
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default ShopSetUpScreenThree;

const styles = StyleSheet.create({
  labelStyle: {
    color: '#151827',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: FontStyle,
  },
  labelMain: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 16,
  },
  radioParent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  radioMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FontStyle,
  },
  SubMainBtn: {
    borderWidth: 1,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 12,
    width: '40%',
    justifyContent: 'center',
    marginTop: 10,
  },
  subBtnText: {
    color: '#29977E',
    fontSize: 14,
    fontWeight: '600',
  },
  subListMain: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'rgba(21, 24, 39, 0.10)',
    padding: 12,
  },
  textInnerMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textLabelSub: {
    color: '#151827',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: FontStyle,
    paddingBottom: 5,
  },
  textSub: {
    color: '#151827',
    fontWeight: '400',
    fontSize: 16,
    fontFamily: FontStyle,
    paddingBottom: 5,
  },
  delEditMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  delText: {
    color: 'red',
    fontWeight: '600',
    fontSize: 16,
  },
  editText: {
    color: 'blue',
    fontWeight: '600',
    fontSize: 16,
  },
});

const branchStyles = StyleSheet.create({
  bottomButtonMain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    marginVertical: 16,
  },
  subTextFieldTwoMain: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});

const SubBranchModel = ({
  getValues,
  subBranch,
  setSubBranch,
  setSubBranchEdit,
  subBranchEdit,
  stateDataLists,
}) => {
  const [subManagerAddress, setSubManagerAddress] = useState('');
  const [subManagerState, setSubManagerState] = useState('');
  const [subManagerCity, setSubManagerCity] = useState('');
  const [subManagerPinCode, setSubManagerPinCode] = useState('');

  const [subManagerFirstName, setSubManagerFirstName] = useState('');
  const [subManagerLastName, setSubManagerLastName] = useState('');
  const [subManagerEmail, setSubManagerEmail] = useState('');
  const [subManagerPhone, setSubManagerPhone] = useState('');
  const [managerValue, setManagerValue] = useState('');

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
      setSubManagerFirstName(getValues('first_name'));
      setSubManagerLastName(getValues('last_name'));
      setSubManagerEmail(getValues('user_email'));
      setSubManagerPhone(getValues('user_contact'));
      error.subManagerFirstNameError = '';
      error.subManagerLastNameError = '';
      error.subManagerEmailError = '';
      error.subManagerPhoneError = '';
    } else if (managerValue === 'same as main branch manager') {
      setSubManagerFirstName(getValues('manager_first_name'));
      setSubManagerLastName(getValues('manager_last_name'));
      setSubManagerEmail(getValues('manager_user_email'));
      setSubManagerPhone(getValues('manager_user_contact'));
      error.subManagerFirstNameError = '';
      error.subManagerLastNameError = '';
      error.subManagerEmailError = '';
      error.subManagerPhoneError = '';
    } else {
      setSubManagerFirstName('');
      setSubManagerLastName('');
      setSubManagerEmail('');
      setSubManagerPhone('');
    }
  }, [error, getValues, managerValue]);

  useEffect(() => {
    if (subBranchEdit !== undefined) {
      setSubManagerAddress(subBranchEdit.subManagerAddress);
      setSubManagerCity(subBranchEdit.subManagerCity);
      setSubManagerState(subBranchEdit.subManagerState);
      setSubManagerPinCode(subBranchEdit.subManagerPinCode);
      setSubManagerFirstName(subBranchEdit.subManagerFirstName);
      setSubManagerLastName(subBranchEdit.subManagerLastName);
      setSubManagerEmail(subBranchEdit.subManagerEmail);
      setSubManagerPhone(subBranchEdit.subManagerPhone);
    }
  }, [subBranchEdit]);

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
      allError.subManagerPhoneError =
        'SubManagerPhone Number must be 10 numbers';
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
      if (subBranchEdit === undefined) {
        setSubBranch([
          ...subBranch,
          {
            id: subBranch.length + 1,
            subManagerAddress,
            subManagerState,
            subManagerCity,
            subManagerPinCode,
            subManagerFirstName,
            subManagerLastName,
            subManagerEmail,
            subManagerPhone,
            managerValue,
          },
        ]);
        handleSubBranchModalClose();
      } else {
        const editSelectedSubBranchIndex = subBranch?.findIndex(
          sub => sub.id === subBranchEdit.id,
        );
        const editSelectedSubBranch = [...subBranch];
        editSelectedSubBranch[editSelectedSubBranchIndex] = {
          id: subBranchEdit.id,
          subManagerAddress,
          subManagerState,
          subManagerCity,
          subManagerPinCode,
          subManagerFirstName,
          subManagerLastName,
          subManagerEmail,
          subManagerPhone,
          managerValue,
        };
        setSubBranch(editSelectedSubBranch);
        handleSubBranchModalClose();
      }
    }
  };

  const handleSubBranchModalClose = () => {
    setSubManagerAddress('');
    setSubManagerState('');
    setSubManagerCity('');
    setSubManagerPinCode('');
    setSubManagerFirstName('');
    setSubManagerLastName('');
    setSubManagerEmail('');
    setManagerValue('');
    setSubManagerPhone('');
    setSubBranchEdit();

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

  const onChangeSubBranchState = async data => {
    await getCityByStateLists(data)
      .then(res => setGetCityData(res?.data?.cityByState))
      .catch(err => console.log('error', err));
    setSubManagerState(data);
    error.subManagerStateError = '';
  };
  const onChangeSubBranchCity = async data => {
    await getAreaByCityLists(data)
      .then(res => setGetAreaData(res?.data?.areaByCity))
      .catch(err => console.log('error', err));

    setSubManagerCity(data);
    error.subManagerCityError = '';
  };
  const onChangeSubBranchPinCode = data => {
    setSubManagerPinCode(data);
    error.subManagerPinCodeError = '';
  };

  return (
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
      <View style={[branchStyles.subTextFieldTwoMain, {marginBottom: 15}]}>
        <View style={{width: '48%'}}>
          <LocationSelect
            name="state"
            placeholder="Select State"
            arrayListItem={stateDataLists}
            stateField={true}
            onChangeValue={onChangeSubBranchState}
            subBranchSelect={true}
          />
          {error.subManagerStateError && (
            <Text style={{color: 'red', fontSize: 14}}>
              {error.subManagerStateError || ''}
            </Text>
          )}
        </View>

        {getCityData?.length > 0 && (
          <View style={{width: '48%'}}>
            <LocationSelect
              name="city"
              placeholder="Select City"
              arrayListItem={getCityData}
              cityField={true}
              onChangeValue={onChangeSubBranchCity}
              subBranchSelect={true}
            />
            {error.subManagerCityError && (
              <Text style={{color: 'red', fontSize: 14}}>
                {error.subManagerCityError || ''}
              </Text>
            )}
          </View>
        )}
      </View>
      {getAreaData?.length > 0 && (
        <View style={{marginBottom: 15}}>
          <LocationSelect
            name="PinCode"
            placeholder="Select PinCode"
            arrayListItem={getAreaData}
            pinCodeField={true}
            onChangeValue={onChangeSubBranchPinCode}
            subBranchSelect={true}
          />
          {error.subManagerPinCodeError && (
            <Text style={{color: 'red', fontSize: 14}}>
              {error.subManagerPinCodeError || ''}
            </Text>
          )}
        </View>
      )}

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

      <View style={[branchStyles.subTextFieldTwoMain, {marginBottom: 15}]}>
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
      <View style={[branchStyles.subTextFieldTwoMain, {marginBottom: 15}]}>
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
      {/* bottm cancel */}
      <View style={branchStyles.bottomButtonMain}>
        <View style={{width: '20%'}}>
          <CustomButton
            name="Reset"
            color="#29977E"
            backgroundColor="white"
            borderColor="#29977E"
            onPress={handleSubBranchModalClose}
          />
        </View>
        <View style={{width: '20%'}}>
          <CustomButton
            name={subBranchEdit?.id ? 'Update' : 'Add'}
            color="white"
            backgroundColor="#29977E"
            borderColor="#29977E"
            onPress={() => subBranchSubmit()}
          />
        </View>
      </View>
    </View>
  );
};
