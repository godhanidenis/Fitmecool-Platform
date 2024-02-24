import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {BackGroundStyle, FontStyle} from '../../../../CommonStyle';
import {TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import OwnerDetail from './AllTabs/OwnerDetail';
import {useForm} from 'react-hook-form';
import {shopUpdate} from '../../../graphql/mutations/shops';
import {useToast} from 'native-base';
import ShopInfo from './AllTabs/ShopInfo';
import MainBranchTab from './AllTabs/MainBranchTab';
import SubBranchTab from './AllTabs/SubBranchTab';
import ShopLayoutTab from './AllTabs/ShopLayoutTab';
import VendorHeader from '../../../components/VendorHeader';
import {RefreshControl} from 'react-native';
import {loadVendorShopDetailsStart} from '../../../redux/vendorShopDetailsSlice/ShopDetailSlice';
import {getStateLists} from '../../../graphql/queries/areaListsQueries';

const ShopDetail = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const {
    handleSubmit: ownerInfoHandleSubmit,
    formState: {errors: ownerInfoErrors},
    setValue: ownerInfoSetValue,
    getValues: ownerInfoGetValue,
    control,
  } = useForm();

  const {
    handleSubmit: shopInfoHandleSubmit,
    formState: {errors: shopInfoErrors},
    setValue: shopInfoSetValue,
    control: shopInfoControl,
  } = useForm();

  const {
    handleSubmit: mainBranchInfoHandleSubmit,
    formState: {errors: mainBranchInfoErrors},
    setValue: mainBranchInfoSetValue,
    getValues: mainBranchInfoGetValue,
    control: mainBranchControl,
  } = useForm();

  const {vendorShopDetails} = useSelector(state => state?.shopDetail);
  const useProfileData = useSelector(state => state?.user.userProfile);
  const [activeTab, setActiveTab] = useState('Owner Details');
  const [individual, setIndividual] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [shopLoading, setShopLoading] = useState(false);
  const [mainBranchLoading, setMainBranchLoading] = useState(false);
  const [mainBranch, setMainBranch] = useState();
  const [sameAsOwner, setSameAsOwner] = useState('False');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sliderTabArrayShow =
    vendorShopDetails?.shop_type === 'individual'
      ? ['Owner Details', 'Shop Info', 'Main Branch', 'Shop Layout']
      : [
          'Owner Details',
          'Shop Info',
          'Main Branch',
          'Sub Branch',
          'Shop Layout',
        ];

  const [stateDataLists, setStateDataLists] = useState([]);

  const getApiState = async () => {
    await getStateLists()
      .then(res => setStateDataLists(res?.data?.stateList))
      .catch(error => console.log('ee', error));
  };

  useEffect(() => {
    getApiState();
  }, []);

  const updateVendorShopDetailStore = () => {
    dispatch(loadVendorShopDetailsStart(useProfileData?.userCreatedShopId));
  };

  const [hours, setHours] = useState([
    {key: 'Sunday', value: ['09:00 AM - 08:00 PM']},
    {key: 'Monday', value: ['09:00 AM - 08:00 PM']},
    {key: 'Tuesday', value: ['09:00 AM - 08:00 PM']},
    {key: 'Wednesday', value: ['09:00 AM - 08:00 PM']},
    {key: 'Thursday', value: ['09:00 AM - 08:00 PM']},
    {key: 'Friday', value: ['09:00 AM - 08:00 PM']},
    {key: 'Saturday', value: ['09:00 AM - 08:00 PM']},
  ]);

  const ownerInfoOnSubmit = data => {
    setOwnerLoading(true);
    shopUpdate({
      ownerInfo: {
        id: vendorShopDetails?.ownerInfo?.id,
        owner_firstName: data.first_name,
        owner_lastName: data.last_name,
        owner_email: data.user_email,
        owner_contact: data.user_contact,
        user_id: useProfileData?.id,
      },
    }).then(
      res => {
        toast.show({
          title: res.data.updateShop.message,
          placement: 'top',
          backgroundColor: 'green.600',
          variant: 'solid',
        });
        updateVendorShopDetailStore();
        setOwnerLoading(false);
      },
      error => {
        setOwnerLoading(false);
        toast.show({
          title: error.message,
          placement: 'top',
          backgroundColor: 'red.600',
          variant: 'solid',
        });
      },
    );
  };

  const shopInfoOnSubmit = data => {
    setShopLoading(true);
    shopUpdate({
      shopInfo: {
        id: useProfileData?.userCreatedShopId,
        shop_social_link: {
          facebook: individual ? '' : data?.facebook_link,
          instagram: individual ? '' : data?.instagram_link,
          website: individual ? '' : data?.personal_website,
        },
        shop_name: data?.shop_name,
        shop_email: data?.shop_email,
        shop_type: individual ? 'individual' : 'shop',
        shop_time: hours?.map(day => {
          return {
            week: day['key'],
            open_time: individual
              ? '-'
              : day['value'][0] === 'Closed' ||
                day['value'][0] === 'Open 24 hours'
              ? '-'
              : day['value'][0].split(' - ')[0],
            close_time: individual
              ? '-'
              : day['value'][0] === 'Closed' ||
                day['value'][0] === 'Open 24 hours'
              ? '-'
              : day['value'][0].split(' - ')[1],
            is_close: individual
              ? false
              : day['value'][0] === 'Closed'
              ? true
              : false,
            is_24Hours_open: individual
              ? true
              : day['value'][0] === 'Open 24 hours'
              ? true
              : false,
          };
        }),
      },
    }).then(
      res => {
        updateVendorShopDetailStore();
        toast.show({
          title: res.data.updateShop.message,
          placement: 'top',
          backgroundColor: 'green.600',
          variant: 'solid',
        });
        setShopLoading(false);
      },
      error => {
        setShopLoading(false);
        toast.show({
          title: error.message,
          placement: 'top',
          backgroundColor: 'red.600',
          variant: 'solid',
        });
      },
    );
  };

  const mainBranchInfoOnSubmit = data => {
    console.log('data', data);

    setMainBranchLoading(true);
    shopUpdate({
      branchInfo: [
        {
          id: mainBranch?.id,
          branch_address: data.address,
          branch_pinCode: data.pin_code,
          branch_city: data.city,
          branch_state: data.state,
          same_as: sameAsOwner === 'True' ? 'owner' : 'none',
          manager_name: data.manager_first_name + ' ' + data.manager_last_name,
          manager_contact: data.manager_user_contact,
          manager_email: data.manager_user_email,
          branch_type: mainBranch?.branch_type,
        },
      ],
    }).then(
      res => {
        updateVendorShopDetailStore();
        toast.show({
          title: res?.data.updateShop.message,
          placement: 'top',
          backgroundColor: 'green.600',
          variant: 'solid',
        });
        setMainBranchLoading(false);
      },
      error => {
        setMainBranchLoading(false);
        toast.show({
          title: error.message,
          placement: 'top',
          backgroundColor: 'red.600',
          variant: 'solid',
        });
      },
    );
  };

  useEffect(() => {
    if (vendorShopDetails && mainBranch) {
      if (sameAsOwner === 'True') {
        mainBranchInfoSetValue(
          'manager_first_name',
          vendorShopDetails?.ownerInfo?.owner_firstName,
        );
        mainBranchInfoSetValue(
          'manager_last_name',
          vendorShopDetails?.ownerInfo?.owner_lastName,
        );
        mainBranchInfoSetValue(
          'manager_user_email',
          vendorShopDetails?.ownerInfo?.owner_email,
        );
        mainBranchInfoSetValue(
          'manager_user_contact',
          vendorShopDetails?.ownerInfo?.owner_contact,
        );
      } else {
        mainBranchInfoSetValue('address', mainBranch?.branch_address);

        mainBranchInfoSetValue(
          'manager_first_name',
          mainBranch?.manager_name.split(' ')[0],
        );
        mainBranchInfoSetValue(
          'manager_last_name',
          mainBranch?.manager_name.split(' ')[1],
        );
        mainBranchInfoSetValue(
          'manager_user_contact',
          mainBranch?.manager_contact,
        );
        mainBranchInfoSetValue('manager_user_email', mainBranch?.manager_email);
      }
    }
  }, [mainBranch, mainBranchInfoSetValue, sameAsOwner, vendorShopDetails]);

  useEffect(() => {
    if (vendorShopDetails) {
      const mainBranches = vendorShopDetails?.branch_info?.find(
        itm => itm.branch_type === 'main',
      );
      setMainBranch(mainBranches);

      if (mainBranches?.same_as === 'owner') {
        setSameAsOwner('True');
      } else {
        setSameAsOwner('False');
      }

      mainBranchInfoSetValue('address', mainBranches?.branch_address);
      mainBranchInfoSetValue('pin_code', mainBranches?.branch_pinCode);
      mainBranchInfoSetValue('city', mainBranches?.branch_city);
    }
  }, [vendorShopDetails, mainBranchInfoSetValue]);

  useEffect(() => {
    if (useProfileData?.userCreatedShopId) {
      vendorShopDetails?.shop_time?.map(time => {
        hours?.map(itm => {
          if (time.is_24Hours_open) {
            if (itm.key === time.week) {
              itm.value = ['Open 24 hours'];
            }
          } else if (time.is_close) {
            if (itm.key === time.week) {
              itm.value = ['Closed'];
            }
          } else {
            if (itm.key === time.week) {
              itm.value = [`${time.open_time} - ${time.close_time}`];
            }
          }

          return itm;
        });
        setHours(hours);
      });
      if (vendorShopDetails?.shop_type === 'shop') {
        setIndividual(false);
      } else {
        setIndividual(true);
      }
    }
  }, [hours, vendorShopDetails, useProfileData]);

  const handleRefresh = () => {
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
    setActiveTab('Owner Details');
  };

  return (
    <View style={{flex: 1}}>
      <VendorHeader />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: BackGroundStyle}}>
        <View style={{marginTop: 20}}>
          <View style={styles.sliderMain}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
              }}>
              {sliderTabArrayShow?.map((item, index) => (
                <TouchableOpacity
                  onPress={() => setActiveTab(item)}
                  style={[
                    styles.sliderTabsMain,
                    {
                      backgroundColor:
                        activeTab === item ? '#151827' : '#FAFCFC',
                    },
                  ]}
                  key={item}>
                  <Text
                    style={[
                      styles.sliderText,
                      {color: activeTab === item ? 'white' : '#151827'},
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {activeTab === 'Owner Details' && (
            <OwnerDetail
              vendorShopDetails={vendorShopDetails}
              useProfileData={useProfileData}
              control={control}
              ownerInfoSetValue={ownerInfoSetValue}
              ownerInfoErrors={ownerInfoErrors}
              ownerInfoHandleSubmit={ownerInfoHandleSubmit}
              ownerInfoOnSubmit={ownerInfoOnSubmit}
              ownerLoading={ownerLoading}
            />
          )}
          {activeTab === 'Shop Info' && (
            <ShopInfo
              shopInfoHandleSubmit={shopInfoHandleSubmit}
              shopInfoErrors={shopInfoErrors}
              shopInfoSetValue={shopInfoSetValue}
              shopInfoOnSubmit={shopInfoOnSubmit}
              shopLoading={shopLoading}
              shopInfoControl={shopInfoControl}
              useProfileData={useProfileData}
              vendorShopDetails={vendorShopDetails}
              hours={hours}
              setHours={setHours}
            />
          )}
          {activeTab === 'Main Branch' && (
            <MainBranchTab
              mainBranchLoading={mainBranchLoading}
              mainBranchInfoOnSubmit={mainBranchInfoOnSubmit}
              mainBranchInfoErrors={mainBranchInfoErrors}
              mainBranchInfoHandleSubmit={mainBranchInfoHandleSubmit}
              mainBranchControl={mainBranchControl}
              setSameAsOwner={setSameAsOwner}
              sameAsOwner={sameAsOwner}
              stateDataLists={stateDataLists}
              mainBranch={mainBranch}
              mainBranchInfoSetValue={mainBranchInfoSetValue}
            />
          )}
          {activeTab === 'Sub Branch' && (
            <SubBranchTab
              useProfileData={useProfileData}
              vendorShopDetails={vendorShopDetails}
              mainBranchInfoGetValue={mainBranchInfoGetValue}
              ownerInfoGetValue={ownerInfoGetValue}
              updateVendorShopDetailStore={updateVendorShopDetailStore}
              stateDataLists={stateDataLists}
            />
          )}
          {activeTab === 'Shop Layout' && (
            <ShopLayoutTab
              useProfileData={useProfileData}
              vendorShopDetails={vendorShopDetails}
              updateVendorShopDetailStore={updateVendorShopDetailStore}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopDetail;

const styles = StyleSheet.create({
  sliderMain: {
    marginLeft: 22,

    alignItems: 'center',
  },
  sliderTabsMain: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 50,
  },
  sliderText: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: FontStyle,
  },
});
