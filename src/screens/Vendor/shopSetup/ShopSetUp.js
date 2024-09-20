import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import VendorHeader from '../../../components/VendorHeader';
import {FontStyle} from '../../../../CommonStyle';
import CustomButton from '../../../common/CustomButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useForm} from 'react-hook-form';
import ShopSetUpScreenOne from './ShopSetUpScreenOne';
import ShopSetUpScreenTwo from './ShopSetUpScreenTwo';
import ShopSetUpScreenThree from './ShopSetUpScreenThree';
import {shopRegistration} from '../../../graphql/mutations/shops';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setShopRegisterId} from '../../../redux/LoginUserProfileSlice/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'native-base';
import {
  homeCoverImage,
  shop_vendorIcon,
} from '../../../common/AllLiveImageLink';
import VersionAppModel from '../../AppVersionModel/VersionApp';
import {fileUpload} from '../../../wasabi';
import {getStateLists} from '../../../graphql/queries/areaListsQueries';
import {generateRandomNumberString} from '../../../utils';
import StepIndicator from 'react-native-step-indicator';

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 25,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,

  stepStrokeCurrentColor: '#29977E', // green
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#29977E', // green
  stepStrokeUnFinishedColor: '#1518271a', //gray
  separatorFinishedColor: '#29977E', // green
  separatorUnFinishedColor: '#1518271a', //gray

  stepIndicatorFinishedColor: '#29977E', // green
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelCurrentColor: 'black',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#1518271a', //gray
  labelColor: 'black',
  labelSize: 18,
  currentStepLabelColor: 'black',
};

const ShopSetUp = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const userProfile = useSelector(state => state?.user.userProfile);
  const dispatch = useDispatch();
  const {versionData} = useSelector(state => state?.appVersion);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    getValues,
  } = useForm();

  const [currentPosition, setCurrentPosition] = useState(0);
  const [individual, setIndividual] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const [resizeShopLogoFile, setResizeShopLogoFile] = useState([]);
  const [resizeShopCoverImageFile, setResizeShopCoverImageFile] = useState([]);
  const [resizeShopImagesFile, setResizeShopImagesFile] = useState([]);

  const [uploadShopVideo, setUploadShopVideo] = useState('');
  const [loading, setLoading] = useState(false);
  const [subBranch, setSubBranch] = useState([]);
  const [sameAsOwner, setSameAsOwner] = useState('True');

  const [stateDataLists, setStateDataLists] = useState([]);

  const [hours, setHours] = useState([
    {key: 'Sunday', value: ['09:00 AM - 10:00 PM']},
    {key: 'Monday', value: ['09:00 AM - 10:00 PM']},
    {key: 'Tuesday', value: ['07:00 AM - 08:00 PM']},
    {key: 'Wednesday', value: ['09:00 AM - 08:00 PM']},
    {key: 'Thursday', value: ['09:00 AM - 08:00 PM']},
    {key: 'Friday', value: ['09:00 AM - 08:00 PM']},
    {key: 'Saturday', value: ['09:00 AM - 08:00 PM']},
  ]);

  useEffect(() => {
    console.log('userProfile :-', userProfile);
    if (userProfile) {
      setValue('first_name', userProfile?.first_name ?? '');
      setValue('last_name', userProfile?.last_name ?? '');
      setValue('user_email', userProfile?.user_email ?? '');
      setValue('user_contact', userProfile?.user_contact ?? '');
    }
  }, [setValue, userProfile]);

  useEffect(() => {
    const handleBackButton = () => {
      // BackHandler.exitApp();
      navigation.navigate('Splash');
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    getApiState();

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const getApiState = async () => {
    await getStateLists()
      .then(res => setStateDataLists(res?.data?.stateList))
      .catch(error => console.log('ee', error));
  };

  const handleClickIndividual = (option, active) => {
    setSelectedOption(option);
    setIndividual(active);
  };

  const returnSubBranchData = val => {
    return {
      branch_address: val.subManagerAddress,
      branch_pinCode: val.subManagerPinCode,
      branch_city: val.subManagerCity,
      branch_state: val.subManagerState,
      same_as:
        (val?.managerValue === 'Same as owner' && 'owner') ||
        (val?.managerValue === 'same as main branch manager' &&
          'main_branch_manager') ||
        'none',
      manager_name: val.subManagerFirstName + ' ' + val.subManagerLastName,
      manager_contact: val.subManagerPhone,
      manager_email: val.manager_user_email,
      branch_type: 'sub',
    };
  };

  const multipleImageUploadFile = async (uploadShopImages, folderStructure) => {
    const uploadPromises = uploadShopImages?.map(uploadShopImg => {
      return fileUpload(uploadShopImg, folderStructure);
    });

    try {
      const uploadShopImgs = await Promise.all(uploadPromises);
      return uploadShopImgs;
    } catch (error) {
      console.error('Error during file upload:', error);
      return [];
    }
  };

  const multipleShopImagesUploadFile = async uploadShopImages => {
    const userFolder = `user_${userProfile?.id}/shop`;
    const timestamp = new Date().getTime().toString();

    // Determine the number of pairs based on the number of images available
    const pairsCount = Math.ceil(uploadShopImages.length / 2);

    const folderStructures = Array.from(
      {length: pairsCount},
      () =>
        `${userFolder}/shop_img/${timestamp + generateRandomNumberString(5)}`,
    );

    const groupedUploads = Array.from({length: pairsCount}, (_, index) => [
      index * 2,
      Math.min(index * 2 + 1, uploadShopImages.length - 1),
    ]);

    const uploadPromises = groupedUploads.map(indices => {
      const folderStructure = folderStructures[groupedUploads.indexOf(indices)];
      const uploads = indices
        .map(index =>
          index < uploadShopImages.length ? uploadShopImages[index] : null,
        )
        .filter(Boolean);
      return Promise.all(
        uploads.map(uploadShopImg =>
          fileUpload(uploadShopImg, folderStructure),
        ),
      );
    });
    try {
      const uploadShopImgs = await Promise.all(uploadPromises);
      return uploadShopImgs.flat();
    } catch (error) {
      console.error('Error during file upload:', error);
      return [];
    }
  };

  const onSubmit = async data => {
    if (currentPosition !== 3) {
      setCurrentPosition(currentPosition + 1);
    } else {
      setLoading(true);

      let logoResponse = [];
      let backgroundResponse = [];
      let imagesResponse = [];
      let videoResponse = null;

      if (resizeShopLogoFile) {
        const folderStructure = `user_${userProfile?.id}/shop/logo`;

        await multipleImageUploadFile(resizeShopLogoFile, folderStructure).then(
          res => (logoResponse = res),
        );
      }

      if (resizeShopCoverImageFile) {
        const folderStructure = `user_${userProfile?.id}/shop/cover `;
        await multipleImageUploadFile(
          resizeShopCoverImageFile,
          folderStructure,
        ).then(res => (backgroundResponse = res));
      }

      if (resizeShopImagesFile?.filter(item => item !== undefined).length > 0) {
        await multipleShopImagesUploadFile(
          resizeShopImagesFile?.filter(item => item !== undefined),
        ).then(res => (imagesResponse = res));
      }

      if (uploadShopVideo) {
        const folderStructure = `user_${userProfile?.id}/shop/video`;
        await fileUpload(uploadShopVideo, folderStructure)
          .then(res => (videoResponse = res))
          .catch(error => {
            console.error('Error during file upload:', error);
          });
      }

      const shopImagesPayload = Array.from(
        {length: imagesResponse?.length / 2},
        (_, index) => ({
          links: {
            small: imagesResponse[index * 2],
            medium: imagesResponse[index * 2 + 1],
          },
        }),
      );

      await shopRegistration({
        userId: userProfile?.id,
        ownerInfo: {
          owner_firstName: data.first_name,
          owner_lastName: data.last_name,
          owner_email: data.user_email,
          owner_contact: data.user_contact,
          user_id: userProfile?.id,
        },
        shopInfo: {
          shop_logo:
            logoResponse?.length > 0
              ? {
                  extraSmall: logoResponse[0],
                  small: logoResponse[1],
                  medium: logoResponse[2],
                  large: logoResponse[3],
                }
              : {},
          shop_cover_image:
            backgroundResponse?.length > 0
              ? {
                  small: backgroundResponse[0],
                  medium: backgroundResponse[1],
                  large: backgroundResponse[2],
                }
              : {},
          shop_images: shopImagesPayload || [],
          shop_video: videoResponse || '',
          shop_social_link: {
            facebook: individual ? '' : data.facebook_link,
            instagram: individual ? '' : data.instagram_link,
            website: individual ? '' : data.personal_website,
          },
          shop_name: data.shop_name,
          shop_email: data.shop_email,
          shop_type: individual ? 'individual' : 'shop',
          shop_time: hours?.map(day => {
            return {
              week: day['key'],
              open_time:
                day['value'][0] === 'Closed' ||
                day['value'][0] === 'Open 24 hours'
                  ? '-'
                  : day['value'][0].split(' - ')[0],
              close_time:
                day['value'][0] === 'Closed' ||
                day['value'][0] === 'Open 24 hours'
                  ? '-'
                  : day['value'][0].split(' - ')[1],
              is_close: day['value'][0] === 'Closed' ? true : false,
              is_24Hours_open:
                day['value'][0] === 'Open 24 hours' ? true : false,
            };
          }),
        },
        branchInfo: [
          {
            branch_address: data.address,
            branch_state: data.state,
            branch_city: data.city,
            same_as: sameAsOwner === 'True' ? 'owner' : 'none',
            branch_pinCode: data.pin_code,
            manager_name:
              data.manager_first_name + ' ' + data.manager_last_name,
            manager_contact: data.manager_user_contact,
            manager_email: data.manager_user_email,
            branch_type: 'main',
          },
          ...(subBranch.length > 0 ? subBranch?.map(returnSubBranchData) : []),
        ],
      }).then(
        async res => {
          await AsyncStorage.setItem('userHaveAnyShop', JSON.stringify('true'));
          dispatch(setShopRegisterId(res.data.createShop.shopInfo.id));
          setLoading(false);
          toast.show({
            title: res.data.createShop.message,
            placement: 'top',
            backgroundColor: 'green.600',
            variant: 'solid',
          });
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
  };

  return (
    <View>
      <VendorHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{position: 'relative'}}>
          <View style={styles.imageContainer}>
            <View style={styles.imgOverTextMain}>
              <Text style={styles.imgOverText}>
                Join{' '}
                <Text style={[styles.imgOverText, styles.imgOverTextInner]}>
                  Us
                </Text>{' '}
                As{' '}
                <Text style={[styles.imgOverText, styles.imgOverTextInner]}>
                  ?
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.mainBottomContainer}>
            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.labelText,
                  currentPosition >= 0 && styles.currentLabel,
                ]}>
                Type
              </Text>
              <Text
                style={[
                  styles.labelText,
                  currentPosition >= 1 && styles.currentLabel,
                ]}>
                Details
              </Text>
              <Text
                style={[
                  styles.labelText,
                  currentPosition >= 2 && styles.currentLabel,
                ]}>
                Photos
              </Text>
              <Text
                style={[
                  styles.labelText,
                  currentPosition >= 3 && styles.currentLabel,
                  {
                    paddingRight: 2,
                  },
                ]}>
                Branches
              </Text>
            </View>
            <View style={{paddingRight: 30}}>
              <StepIndicator
                stepCount={4}
                customStyles={customStyles}
                currentPosition={currentPosition}
              />
            </View>
            {currentPosition === 0 && (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  gap: 10,
                  marginTop: 30,
                  marginHorizontal: 10,
                }}>
                <View
                  style={[
                    styles.noShopMain,
                    {
                      borderColor:
                        selectedOption === 'Individual'
                          ? '#29977E'
                          : 'rgba(21, 24, 39, 0.10)',
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      handleClickIndividual('Individual', true);
                      setTimeout(() => {
                        setCurrentPosition(1);
                      }, 300);
                    }}>
                    <View style={styles.shopIcons}>
                      <Icon
                        name="users"
                        size={20}
                        color={
                          selectedOption === 'Individual' ? '#29977E' : 'gray'
                        }
                      />
                      {selectedOption === 'Individual' && (
                        <Icon name="check-circle" size={25} color="#29977E" />
                      )}
                    </View>
                    <View style={styles.bottomMain}>
                      <Text style={styles.mainTitleText}>No Shop</Text>
                      <Text style={styles.subTitleText}>
                        Continue As Individual Seller
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.shopMain,
                    {
                      borderColor:
                        selectedOption === 'Shop'
                          ? '#29977E'
                          : 'rgba(21, 24, 39, 0.10)',
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      handleClickIndividual('Shop', false);
                      setTimeout(() => {
                        setCurrentPosition(1);
                      }, 300);
                    }}>
                    <View style={styles.shopIcons}>
                      <Image
                        source={{uri: shop_vendorIcon}}
                        style={{
                          width: 20,
                          height: 20,
                          tintColor:
                            selectedOption === 'Shop' ? '#29977E' : 'gray',
                        }}
                      />
                      {selectedOption === 'Shop' && (
                        <Icon name="check-circle" size={25} color="#29977E" />
                      )}
                    </View>
                    <View style={styles.bottomMain}>
                      <Text style={styles.mainTitleText}>Shop</Text>
                      <Text style={styles.subTitleText}>
                        Continue As Shop Seller
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {currentPosition === 1 && (
              <ShopSetUpScreenOne
                control={control}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
                setCurrentPosition={setCurrentPosition}
                individual={individual}
                hours={hours}
                setHours={setHours}
              />
            )}
            {currentPosition === 2 && (
              <ShopSetUpScreenTwo
                setUploadShopVideo={setUploadShopVideo}
                setResizeShopLogoFile={setResizeShopLogoFile}
                setResizeShopCoverImageFile={setResizeShopCoverImageFile}
                resizeShopImagesFile={resizeShopImagesFile}
                setResizeShopImagesFile={setResizeShopImagesFile}
              />
            )}
            {currentPosition === 3 && (
              <ShopSetUpScreenThree
                control={control}
                handleSubmit={handleSubmit}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                onSubmit={onSubmit}
                currentPosition={currentPosition}
                setCurrentPosition={setCurrentPosition}
                individual={individual}
                subBranch={subBranch}
                setSubBranch={setSubBranch}
                sameAsOwner={sameAsOwner}
                setSameAsOwner={setSameAsOwner}
                stateDataLists={stateDataLists}
              />
            )}
            {currentPosition !== 0 && (
              <View
                style={{
                  marginTop: 40,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  paddingHorizontal: 10,
                }}>
                <View style={{width: '45%'}}>
                  <CustomButton
                    name="Back"
                    color="#29977E"
                    backgroundColor="white"
                    borderColor="#29977E"
                    onPress={() => setCurrentPosition(currentPosition - 1)}
                  />
                </View>

                <View style={{width: '45%'}}>
                  <CustomButton
                    name={currentPosition === 3 ? 'Save' : 'Next'}
                    color="#FFFFFF"
                    backgroundColor="#29977E"
                    borderColor="#29977E"
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <VersionAppModel
        modalVisible={versionData?.versionModelVisible}
        versionData={versionData}
      />
    </View>
  );
};

export default ShopSetUp;

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
    backgroundColor: '#151827',
  },
  imgOverTextMain: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    width: 220,
  },
  imgOverText: {
    fontSize: 40,
    fontWeight: '600',
    color: '#29977E',
    fontFamily: FontStyle,
    alignSelf: 'center',
  },

  imgOverTextInner: {
    fontSize: 40,
    fontWeight: '300',
    color: 'white',
    fontFamily: FontStyle,
  },

  mainBottomContainer: {
    position: 'relative',
    bottom: 100,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 10,
    paddingBottom: 30,
    height: '100%',
  },

  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // You can adjust this width as needed
    marginTop: 20, // Adjust the margin as needed
    paddingHorizontal: 10,
  },
  labelText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'grey', // Set the label color as needed
    marginBottom: 10,
  },
  currentLabel: {
    color: '#29977E',
    fontWeight: '900', // Highlight the current label if needed
  },
  noShopMain: {
    width: '47%',
    height: 104,
    borderWidth: 1,
    borderRadius: 16,
  },
  shopMain: {
    width: '47%',
    height: 104,
    borderWidth: 1,
    borderRadius: 16,
  },
  shopIcons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  mainTitleText: {
    color: '#151827',
    fontSize: 18,
    fontFamily: FontStyle,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  subTitleText: {
    color: 'rgba(21, 24, 39, 0.56)',
    fontSize: 12,
    fontFamily: FontStyle,
    fontStyle: 'normal',
    fontWeight: '500',
  },
  bottomMain: {
    marginLeft: 10,
    marginVertical: 10,
  },
});
