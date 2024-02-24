import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomTextInput from '../../../../common/CustomTextInput';
import {Controller, useForm} from 'react-hook-form';
import CustomButton from '../../../../common/CustomButton';
import {NativeBaseProvider, Select, useToast} from 'native-base';
import AddProductDropDown from '../../../../common/AddProductDropDown';
import {getBranchLists} from '../../../../graphql/queries/branchListsQueries';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {BackGroundStyle, FontStyle} from '../../../../../CommonStyle';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import {
  createProduct,
  updateProduct,
} from '../../../../graphql/mutations/products';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {deleteObjectsInFolder, fileUpload} from '../../../../wasabi';
import {loadVendorShopDetailsStart} from '../../../../redux/vendorShopDetailsSlice/ShopDetailSlice';
import FastImage from 'react-native-fast-image';
import CustomSwitch from '../../../../components/CustomSwitch';
import {
  generateRandomNumberString,
  isFileOfType,
  refactorPrice,
} from '../../../../utils';
import {loadProductsStart} from '../../../../redux/ProductSlice/ProductSlice';
import {colorsList} from '../../../../common/Customer/ColorList';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const AddEditProduct = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const router = useRoute();
  const editableProductData = router?.params?.state?.editableProductData;

  const {imagesVariantData} = useSelector(state => state?.imageVariants);

  const {
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
    getValues,
    control,
    watch,
  } = useForm();
  const {userProfile} = useSelector(state => state?.user);
  const {categories} = useSelector(state => state?.categories);
  const {vendorShopDetails} = useSelector(state => state?.shopDetail);
  const {PaginationProductLimit, productPageSkip} = useSelector(
    state => state?.productsData,
  );
  const {appliedProductsFilters, sortFilters} = useSelector(
    state => state.productsFiltersReducer,
  );

  const [menCategoryLabel, setMenCategoryLabel] = useState([]);
  const [womenCategoryLabel, setWomenCategoryLabel] = useState([]);
  const [productType, setProductType] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [editorDescriptionContent, setEditorDescriptionContent] = useState('');
  const [errorDescription, setErrorDescription] = useState('');

  const [productImages, setProductImages] = useState([]);
  // const [uploadProductImages, setUploadProductImages] = useState([]);
  const ProductImgError = productImages?.filter(item => item !== undefined);

  const [productVideo, setProductVideo] = useState('');
  const [uploadProductVideo, setUploadProductVideo] = useState();
  const [deleteProductVideo, setDeleteProductVideo] = useState();

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [richEditorShow, setRichEditorShow] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const scrollViewRef = useRef(null);
  const alertViewRef = useRef(null);

  const richtext = useRef(null);

  const productTypeData = ['Men', 'Women'];

  useEffect(() => {
    setTimeout(() => {
      setRichEditorShow(true);
    }, 1000);
  }, []);

  const [productPriceVisible, setProductPriceVisible] = useState(false);

  const [productListingType, setProductListingType] = useState(false);

  const onChangeLeftSwitch = () => {
    setProductPriceVisible(false);
  };
  const onChangeRightSwitch = () => {
    setProductPriceVisible(true);
  };

  const onChangeRentLeftSwitch = () => {
    setProductListingType(false);
  };
  const onChangeRentRightSwitch = () => {
    setProductListingType(true);
  };

  const Validate = () => {
    let isValid = true;
    const error = {};

    if (ProductImgError.length !== 3) {
      isValid = false;
      error['productImages'] = 'Please Select Product images*';
    }

    setError(error);
    return isValid;
  };

  useEffect(() => {
    if (ProductImgError?.length === 3) {
      setError({...error, productImages: ''});
    }
  }, [ProductImgError?.length]);

  useEffect(() => {
    setMenCategoryLabel(
      categories?.filter(itm => itm?.category_type === 'Men').map(i => i),
    );
    setWomenCategoryLabel(
      categories?.filter(itm => itm?.category_type === 'Women').map(i => i),
    );
  }, [categories]);

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      getBranchLists().then(res => {
        const branches = res?.data.branchList.filter(
          branch => branch.shop_id === userProfile?.userCreatedShopId,
        );
        setBranchList(branches);
      });
    }
  }, [userProfile]);

  const handleEditorChange = content => {
    setEditorDescriptionContent(content);

    if (content === '') {
      setErrorDescription('Product description is required');
    } else {
      setErrorDescription('');
    }
  };

  const ChooseProductImages = index => {
    let options = {
      title: 'Select Product Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose image from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const acceptedFileTypes = ['png', 'jpg', 'jpeg', 'webp', 'heic'];
        const fileName = response.assets[0].fileName || '';
        if (isFileOfType(fileName, acceptedFileTypes)) {
          updateProductKey(index);
          const sourceURI = {uri: response.assets[0].uri};
          resizeImage(sourceURI, index);

          const newImage = [...productImages]; // Create a copy of the array
          newImage[index] = response.assets[0].uri; // Update value at the specified index
          setProductImages(newImage);

          // const newImageFile = [...uploadProductImages]; // Create a copy of the array
          // newImageFile[index] = response.assets[0]; // Update value at the specified index
          // setUploadProductImages(newImageFile);
        } else {
          toast.show({
            title: 'Selected file type is not supported',
            placement: 'top',
            backgroundColor: 'red.600',
            variant: 'solid',
          });
        }
      }
    });
  };

  const [resizeAllImagesFile, setResizeAllImagesFile] = useState([]);

  const resizeImage = async (source, index) => {
    try {
      const imageVariants = [
        {
          size: Number(
            imagesVariantData?.imageVariants?.product_image_variants?.small,
          ),
          type: 'small',
        },
        {
          size: Number(
            imagesVariantData?.imageVariants?.product_image_variants?.medium,
          ),
          type: 'medium',
        },
        {
          size: Number(
            imagesVariantData?.imageVariants?.product_image_variants?.large,
          ),
          type: 'large',
        },
      ];

      const resizedImages = await Promise.all(
        imageVariants.map(async variant => {
          const resizedImage = await ImageResizer.createResizedImage(
            source.uri,
            variant.size,
            variant.size,
            'JPEG',
            100,
          );
          return {...resizedImage, type: 'image/jpeg', imageSize: variant.type};
        }),
      );

      const newImageFile = [...resizeAllImagesFile];

      const startIndex = index * imageVariants.length;

      resizedImages.forEach((img, i) => {
        newImageFile[startIndex + i] = img;
      });

      setResizeAllImagesFile(newImageFile);
    } catch (error) {
      console.log('Image resizing error:', error);
    }
  };

  const ChooseProductVideo = () => {
    let options = {
      title: 'Select Product Video',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose video from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'video',
      videoQuality: 'high',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        setProductVideo(response.assets[0].uri);
        setUploadProductVideo(response.assets[0]);
      }
    });
  };

  useEffect(() => {
    if (editableProductData) {
      if (richEditorShow) {
        setTimeout(() => {
          richtext.current.setContentHTML(
            editableProductData?.product_description,
          );
        }, 1000);
      }
    }
  }, [editableProductData, richEditorShow, richtext]);

  useEffect(() => {
    if (editableProductData) {
      setValue('product_name', editableProductData?.product_name);
      setValue(
        'product_price',
        Math.round(editableProductData?.product_price).toString(),
      );
      setValue(
        'product_discount',
        editableProductData?.product_discount.toString(),
      );
      setEditorDescriptionContent(editableProductData?.product_description);
      setValue('product_color', editableProductData?.product_color);
      setValue('product_type', editableProductData.categoryInfo?.category_type);
      setProductType(editableProductData.categoryInfo?.category_type);
      setValue('product_category', editableProductData?.categoryInfo?.id);
      setValue('product_branch', editableProductData?.branchInfo?.id);

      const finalPrice =
        editableProductData?.product_price -
        editableProductData?.product_price *
          (editableProductData?.product_discount / 100);
      setValue('product_final_price', Math.round(finalPrice).toString());

      setProductListingType(
        editableProductData?.product_listing_type === 'rent' ? false : true,
      );
      setProductPriceVisible(!editableProductData?.product_price_visible);

      editableProductData?.product_image?.front &&
        setProductImages(old => [
          ...old,
          editableProductData?.product_image?.front?.medium,
        ]);
      editableProductData?.product_image?.back &&
        setProductImages(old => [
          ...old,
          editableProductData?.product_image?.back?.medium,
        ]);
      editableProductData?.product_image?.side &&
        setProductImages(old => [
          ...old,
          editableProductData?.product_image?.side?.medium,
        ]);

      editableProductData?.product_video &&
        setProductVideo(editableProductData?.product_video);
    }
  }, [editableProductData, router, setValue]);

  const multipleProductImageUploadFile = async (
    resizeAllImagesFile,
    productFolderName,
  ) => {
    const keyMap = ['front', 'back', 'side'];
    const folderStructure = `user_${userProfile?.id}/shop/products/${productFolderName}/product_img`;

    try {
      const groupsOfThree = Array.from(
        {length: Math.ceil(resizeAllImagesFile.length / 3)},
        (_, index) => {
          const startIndex = index * 3;
          const endIndex = startIndex + 3;
          return resizeAllImagesFile.slice(startIndex, endIndex);
        },
      );

      const uploadPromises = groupsOfThree.map(async (group, groupIndex) => {
        const folderName = `${folderStructure}/${keyMap[groupIndex]}`;
        const groupUploadPromises = group.map(async (uploadProduct, index) => {
          try {
            const uploadResult = await fileUpload(uploadProduct, folderName);
            return uploadResult;
          } catch (error) {
            console.error(
              `Error uploading file ${index + 1} in ${folderName}:`,
              error,
            );
            return null;
          }
        });
        return Promise.all(groupUploadPromises);
      });

      const uploadProductImgs = await Promise.all(uploadPromises);
      return uploadProductImgs.flat(); // Flatten the array of arrays
    } catch (error) {
      console.error('Error during file upload:', error);
      return [];
    }
  };

  const [selectedChangeIndex, setSelectedChangeIndex] = useState([]);

  const updateProductKey = index => {
    const selectedIndex = [...selectedChangeIndex];
    if (index === 0) {
      selectedIndex[0] = 0;
    } else if (index === 1) {
      selectedIndex[1] = 1;
    } else if (index === 2) {
      selectedIndex[2] = 2;
    }
    setSelectedChangeIndex(selectedIndex);
  };

  const getAllProducts = () => {
    dispatch(
      loadProductsStart({
        pageData: {
          skip: productPageSkip,
          limit: PaginationProductLimit,
        },
        filter: {
          category_id: appliedProductsFilters?.categoryId?.selectedValue,
          product_color: appliedProductsFilters?.productColor?.selectedValue,
          product_price: {
            min: appliedProductsFilters.productPrice.selectedValue.min,
            max: appliedProductsFilters.productPrice.selectedValue.max,
          },
          product_listing_type:
            appliedProductsFilters?.productListingType.selectedValue,
        },
        shopId: appliedProductsFilters?.shopId?.selectedValue,
        sort: sortFilters?.sortType?.selectedValue,
        search: appliedProductsFilters?.searchBarData?.selectedValue,
        forDashboard: true,
      }),
    );
  };

  const deleteWasabiFolder = async folderName => {
    const folderStructure = `user_${userProfile?.id}/shop/${folderName}`;
    await deleteObjectsInFolder(folderStructure);
  };

  const deleteUpdateProductKey = index => {
    const productImage = editableProductData?.product_image;

    if (productImage) {
      const keyMap = ['front', 'back', 'side'];

      return productImage[keyMap[index]];
    }
  };

  const onSubmitProduct = async data => {
    if (editorDescriptionContent === '') {
      setErrorDescription('Product description is required');
    } else if (Validate()) {
      setErrorDescription('');
      setLoading(true);

      if (editableProductData) {
        let imagesResponse = [];
        let videoResponse = null;

        const productFolderName =
          editableProductData?.product_image?.front?.small
            ?.split('/products/')[1]
            .split('/')[0];

        if (deleteProductVideo) {
          deleteWasabiFolder(`products/${productFolderName}/video`);
        }

        if (selectedChangeIndex?.length > 0) {
          try {
            const updatePromises = selectedChangeIndex?.map(
              async (item, index) => {
                let folderStructure = '';
                if (item !== undefined) {
                  const data = deleteUpdateProductKey(item);
                  const splitStringAfterShop = data?.small?.split('/shop/')[1];

                  const urlParts = splitStringAfterShop.split('/');
                  const lastPart = urlParts.pop();
                  const stringWithoutLastWord = urlParts.join('/');
                  await deleteWasabiFolder(stringWithoutLastWord);

                  folderStructure = `user_${userProfile.id}/shop/${stringWithoutLastWord}`;
                }

                if (index === 0) {
                  const uploadPromises = resizeAllImagesFile
                    ?.slice(0, 3)
                    ?.map(uploadProduct => {
                      return fileUpload(uploadProduct, folderStructure);
                    });

                  return Promise.all(uploadPromises);
                }
                if (index === 1) {
                  const uploadPromises = resizeAllImagesFile
                    ?.slice(3, 6)
                    ?.map(uploadProduct => {
                      return fileUpload(uploadProduct, folderStructure);
                    });
                  return Promise.all(uploadPromises);
                }
                if (index === 2) {
                  const uploadPromises = resizeAllImagesFile
                    ?.slice(6, 9)
                    ?.map(uploadProduct => {
                      return fileUpload(uploadProduct, folderStructure);
                    });

                  return Promise.all(uploadPromises);
                }
              },
            );

            const updateProductImgs = await Promise.all(updatePromises);
            imagesResponse = updateProductImgs.flat();
          } catch (error) {
            console.error('Error occurred:', error);
          }
        }

        imagesResponse = imagesResponse?.flatMap((item, index) => {
          if (item === undefined) {
            return [item, undefined, undefined];
          } else {
            return [item];
          }
        });

        if (uploadProductVideo) {
          if (editableProductData?.product_video) {
            deleteWasabiFolder(`products/${productFolderName}/video`);
          }

          try {
            const folderStructure = `user_${userProfile?.id}/shop/products/${productFolderName}/video`;

            const productVideoRes = await fileUpload(
              uploadProductVideo,
              folderStructure,
            );
            videoResponse = productVideoRes;
          } catch (error) {
            console.error('Error during file upload:', error);
            return;
          }
        }

        const oldImageDataFront = Object.fromEntries(
          Object.entries(editableProductData?.product_image?.front).filter(
            ([key]) => key !== '__typename',
          ),
        );
        const oldImageDataBack = Object.fromEntries(
          Object.entries(editableProductData?.product_image?.back).filter(
            ([key]) => key !== '__typename',
          ),
        );
        const oldImageDataSide = Object.fromEntries(
          Object.entries(editableProductData?.product_image?.side).filter(
            ([key]) => key !== '__typename',
          ),
        );

        await updateProduct({
          id: editableProductData?.id,
          productInfo: {
            shop_id: vendorShopDetails?.id,
            branch_id: data.product_branch,
            category_id: data.product_category,
            product_color: data.product_color,
            product_description: editorDescriptionContent,
            product_name: data.product_name,
            product_type: data.product_type,
            product_image: {
              front:
                imagesResponse[0] && imagesResponse[1] && imagesResponse[2]
                  ? {
                      small: imagesResponse[0],
                      medium: imagesResponse[1],
                      large: imagesResponse[2],
                    }
                  : oldImageDataFront,
              back:
                imagesResponse[3] && imagesResponse[4] && imagesResponse[5]
                  ? {
                      small: imagesResponse[3],
                      medium: imagesResponse[4],
                      large: imagesResponse[5],
                    }
                  : oldImageDataBack,
              side:
                imagesResponse[6] && imagesResponse[7] && imagesResponse[8]
                  ? {
                      small: imagesResponse[6],
                      medium: imagesResponse[7],
                      large: imagesResponse[8],
                    }
                  : oldImageDataSide,
            },
            product_video:
              videoResponse ||
              (deleteProductVideo ? '' : editableProductData.product_video),
            product_price: Math.round(data.product_price),
            product_discount: refactorPrice(data.product_discount),
            product_price_visible: !productPriceVisible,
            product_listing_type: productListingType ? 'sell' : 'rent',
          },
        }).then(
          res => {
            console.log('res:::', res);
            setLoading(false);
            dispatch(loadVendorShopDetailsStart(vendorShopDetails?.id));
            getAllProducts();
            handleProductListingModalClose();
            toast.show({
              title: res.data.updateProduct.message,
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
      } else {
        let productImagesRes = [];
        let productVideoRes = null;

        const productFolderName =
          new Date().getTime().toString() + generateRandomNumberString(5);

        if (resizeAllImagesFile) {
          await multipleProductImageUploadFile(
            resizeAllImagesFile,
            productFolderName,
          ).then(res => (productImagesRes = res));
        }
        if (uploadProductVideo) {
          const folderStructure = `user_${userProfile?.id}/shop/products/${productFolderName}/video`;
          await fileUpload(uploadProductVideo, folderStructure)
            .then(res => (productVideoRes = res))
            .catch(error => {
              console.error('Error during file upload:', error);
            });
        }

        await createProduct({
          productInfo: {
            shop_id: vendorShopDetails?.id,
            branch_id: data.product_branch,
            category_id: data.product_category,
            product_color: data.product_color,
            product_description: editorDescriptionContent,
            product_name: data.product_name,
            product_type: data.product_type,
            product_image: {
              front: {
                small: productImagesRes[0],
                medium: productImagesRes[1],
                large: productImagesRes[2],
              },
              back: {
                small: productImagesRes[3],
                medium: productImagesRes[4],
                large: productImagesRes[5],
              },
              side: {
                small: productImagesRes[6],
                medium: productImagesRes[7],
                large: productImagesRes[8],
              },
            },
            product_video: productVideoRes || '',
            product_price: Math.round(data.product_price),
            product_discount: refactorPrice(data.product_discount),
            product_price_visible: !productPriceVisible,
            product_listing_type: productListingType ? 'sell' : 'rent',
          },
        }).then(
          res => {
            console.log('res:::', res);
            handleProductListingModalClose();
            setLoading(false);
            dispatch(loadVendorShopDetailsStart(vendorShopDetails?.id));
            getAllProducts();
            toast.show({
              title: res.data.createProduct.message,
              placement: 'top',
              backgroundColor: 'green.600',
              variant: 'solid',
            });
          },
          error => {
            setLoading(false);
            setAlertMsg(error.message);
            if (scrollViewRef.current && alertViewRef.current) {
              alertViewRef.current.measureLayout(
                scrollViewRef.current.getInnerViewNode(),
                (x, y, width, height) => {
                  scrollViewRef.current.scrollTo({y, animated: true});
                },
              );
            }
          },
        );
      }
    }
  };

  const handleProductListingModalClose = () => {
    navigation.goBack();
    // reset();
    setProductType('');

    setProductVideo();
    // setUploadProductImages([]);
    setUploadProductVideo();
    setProductImages([]);
  };

  const priceHandle = e => {
    const price = parseFloat(e.nativeEvent.text);

    if (!isNaN(price)) {
      const discount = parseFloat(getValues('product_discount') || 0);
      const finalPrice = price - price * (discount / 100);
      setValue(
        'product_final_price',
        Math.round(finalPrice.toFixed(2)).toString(),
      );
    } else {
      setValue('product_final_price', null);
    }
  };

  const discountHandle = e => {
    const discount = parseFloat(e.nativeEvent.text);
    if (!isNaN(discount)) {
      const price = parseFloat(getValues('product_price') || 0);
      const finalPrice = price - price * (discount / 100);
      setValue(
        'product_final_price',
        Math.round(finalPrice.toFixed(2)).toString(),
      );
    } else {
      setValue('product_final_price', Math.round(price.toFixed(2)).toString());
    }
  };

  const finalPriceHandle = e => {
    const finalPrice = parseFloat(e.nativeEvent.text);
    const price = parseFloat(getValues('product_price') || 0);
    if (!isNaN(finalPrice)) {
      if (price !== 0) {
        const discount = ((price - finalPrice) / price) * 100;
        setValue('product_discount', discount.toFixed(2).toString());
      }
    } else {
      setValue('product_discount', '0');
    }
  };

  const price = parseFloat(watch('product_price') || 0);
  const finalPrice = parseFloat(watch('product_final_price') || 0);

  useEffect(() => {
    if (Number(finalPrice) > Number(price)) {
      setValue('product_final_price', Math.round(price.toFixed(2)).toString());
      setValue('product_discount', '0');
    }
  }, [finalPrice]);

  const discountPrice = parseFloat(watch('product_discount') || 0);
  useEffect(() => {
    if (Number(discountPrice) > 100) {
      setValue('product_discount', '100');
      setValue('product_final_price', '0');
    }
  }, [discountPrice]);

  useEffect(() => {
    if (Number(price) < 0) {
      setValue('product_price', '0');
      setValue('product_final_price', '0');
    }
  }, [price]);

  return (
    <View style={{flex: 1}}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={{flex: 1, backgroundColor: BackGroundStyle}}>
        <View style={styles.mainContainer}>
          <View style={styles.addBranchHeader}>
            <TouchableOpacity
              style={{width: 25, height: 25}}
              onPress={() => navigation.goBack()}>
              <Icon name="angle-left" size={26} color="black" />
            </TouchableOpacity>
            <Text style={styles.addBranchText}>
              {editableProductData ? 'Edit' : 'Add'} Product
            </Text>
          </View>

          {alertMsg && (
            <View ref={alertViewRef} style={styles.alertPromtDiv}>
              <View style={styles.alertSubMain}>
                <Icon name="exclamation-circle" size={22} color="red" />
                <Text style={styles.alertMsgText}>{alertMsg}</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('SubscriptionTab')}>
                <Text style={styles.upgradeText}>Upgrade Your Plan</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.priceSwitchMain}>
            <Text style={styles.PriceVisibilityText}>Product Type : </Text>
            <View>
              <CustomSwitch
                onClickLeft={() => onChangeRentLeftSwitch()}
                onClickRight={() => onChangeRentRightSwitch()}
                switchVisibility={productListingType}
                textLeft="Rent"
                textRight="Sell"
                textName={true}
              />
            </View>
          </View>
          <View>
            <View style={{marginBottom: 15}}>
              <CustomTextInput
                label="Product Name"
                mode="outlined"
                control={control}
                name="product_name"
                rules={{
                  required: 'Product Name is required *',
                }}
                activeOutlineColor="#29977E"
              />
              {errors?.product_name && (
                <Text style={{color: 'red'}}>
                  {errors?.product_name?.message}
                </Text>
              )}
            </View>
            <View style={{marginBottom: 15, position: 'relative'}}>
              <CustomTextInput
                label="Price"
                mode="outlined"
                control={control}
                name="product_price"
                rules={{
                  required: 'Product Price is required *',
                }}
                activeOutlineColor="#29977E"
                keyboardType="number-pad"
                onChangeTextPrice={priceHandle}
              />
              <View style={{position: 'absolute', top: '40%', right: 20}}>
                <Icon name="rupee" size={18} color="black" />
              </View>
              {errors?.product_price && (
                <Text style={{color: 'red'}}>
                  {errors?.product_price?.message}
                </Text>
              )}
            </View>
            <View style={{marginBottom: 15, position: 'relative'}}>
              <CustomTextInput
                label="Discount"
                mode="outlined"
                control={control}
                name="product_discount"
                rules={{
                  required: 'Product Discount  is required *',
                  pattern: {
                    value: /^\d+(\.\d+)?$/,
                    message: 'Please enter a valid discount !',
                  },
                }}
                activeOutlineColor="#29977E"
                keyboardType="number-pad"
                onChangeTextPrice={discountHandle}
              />
              <View style={{position: 'absolute', top: '40%', right: 20}}>
                <Icon name="percent" size={16} color="black" />
              </View>
              {errors?.product_discount && (
                <Text style={{color: 'red'}}>
                  {errors?.product_discount?.message}
                </Text>
              )}
            </View>
            <View style={{marginBottom: 15, position: 'relative'}}>
              <CustomTextInput
                label="Final Price"
                mode="outlined"
                control={control}
                name="product_final_price"
                rules={{
                  required: 'Product Final Price  is required *',
                  pattern: {
                    value: /^\d+(\.\d+)?$/,
                    message: 'Please enter a valid price !',
                  },
                }}
                activeOutlineColor="#29977E"
                keyboardType="number-pad"
                onChangeTextPrice={finalPriceHandle}
              />
              <View style={{position: 'absolute', top: '40%', right: 20}}>
                <Icon name="rupee" size={18} color="black" />
              </View>
              {errors?.product_final_price && (
                <Text style={{color: 'red'}}>
                  {errors?.product_final_price?.message}
                </Text>
              )}
            </View>

            <View style={styles.priceSwitchMain}>
              <Text style={styles.PriceVisibilityText}>
                Price Visibility :{' '}
              </Text>
              <View>
                <CustomSwitch
                  onClickLeft={() => onChangeLeftSwitch()}
                  onClickRight={() => onChangeRightSwitch()}
                  switchVisibility={productPriceVisible}
                  IconLeft="eye"
                  IconRight="eye-slash"
                  switchIcon={true}
                />
              </View>
            </View>

            <View style={{marginBottom: 15}}>
              <AddProductDropDown
                name="product_color"
                label="Product Color"
                rules={{
                  required: 'Product Color is required *',
                }}
                listData={colorsList}
                control={control}
              />
              {errors?.product_color && (
                <Text style={{color: 'red'}}>
                  {errors?.product_color?.message}
                </Text>
              )}
            </View>
            <View style={{marginBottom: 15}}>
              <AddProductDropDown
                name="product_type"
                label="Product Category"
                rules={{
                  required: 'Product Category is required *',
                }}
                listData={productTypeData}
                control={control}
                setProductType={setProductType}
                AllowGetProductType={true}
              />
              {errors?.product_type && (
                <Text style={{color: 'red'}}>
                  {errors?.product_type?.message}
                </Text>
              )}
            </View>

            {productType && (
              <View style={{marginBottom: 15}}>
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => {
                    return (
                      <NativeBaseProvider>
                        <Select
                          selectedValue={value}
                          height="50"
                          placeholder="Product Sub Category"
                          _selectedItem={{
                            bg: 'green.200',
                          }}
                          style={{fontSize: 16}}
                          onValueChange={onChange}>
                          {productType === 'Men'
                            ? menCategoryLabel?.map((item, index) => (
                                <Select.Item
                                  key={item?.id}
                                  label={item?.category_name}
                                  value={item?.id}
                                />
                              ))
                            : womenCategoryLabel?.map((item, index) => (
                                <Select.Item
                                  key={item?.id}
                                  label={item?.category_name}
                                  value={item?.id}
                                />
                              ))}
                        </Select>
                      </NativeBaseProvider>
                    );
                  }}
                  name="product_category"
                  rules={{
                    required: 'Product Sub Category is required *',
                  }}
                />
                {errors?.product_category && (
                  <Text style={{color: 'red'}}>
                    {errors?.product_category?.message}
                  </Text>
                )}
              </View>
            )}

            <View style={{marginBottom: 15}}>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => {
                  return (
                    <NativeBaseProvider>
                      <Select
                        selectedValue={value}
                        height="50"
                        placeholder="Branch"
                        _selectedItem={{
                          bg: 'green.200',
                        }}
                        style={{fontSize: 16}}
                        onValueChange={onChange}>
                        {branchList?.map((item, index) => (
                          <Select.Item
                            key={item?.id}
                            label={
                              item?.branch_address +
                              ' ' +
                              '(' +
                              item?.branch_type +
                              ')'
                            }
                            value={item?.id}
                          />
                        ))}
                      </Select>
                    </NativeBaseProvider>
                  );
                }}
                name="product_branch"
                rules={{
                  required: 'Branch is required *',
                }}
              />
              {errors?.product_branch && (
                <Text style={{color: 'red'}}>
                  {errors?.product_branch?.message}
                </Text>
              )}
            </View>
            {richEditorShow && (
              <View style={{marginBottom: 15}}>
                <View style={styles.container}>
                  <Text style={styles.desText}>Description</Text>
                  <RichToolbar
                    style={styles.richToolbar}
                    editor={richtext}
                    actions={[
                      actions.setBold,
                      actions.setItalic,
                      actions.setUnderline,
                      actions.undo,
                      actions.redo,
                    ]}
                  />
                  <RichEditor
                    ref={richtext}
                    onChange={des => handleEditorChange(des)}
                    style={styles.richEditor}
                  />
                </View>
                {errorDescription && (
                  <Text style={{color: 'red'}}>{errorDescription}</Text>
                )}
              </View>
            )}

            <Text style={styles.shopImgText}>Product Images</Text>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                width: '100%',
              }}>
              {['One', 'Two', 'Three']?.map((item, index) => {
                return (
                  <>
                    {productImages[index] ? (
                      <TouchableOpacity
                        onPress={() => ChooseProductImages(index)}
                        key={item}
                        style={styles.shopImagesMain}>
                        <FastImage
                          style={{width: '100%', height: 112, borderRadius: 10}}
                          source={{
                            uri: productImages[index],
                            cache: FastImage.cacheControl.web,
                          }}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={() => ChooseProductImages(index)}
                          style={[
                            styles.editIconMain,
                            {position: 'absolute', top: 6, right: 4},
                          ]}>
                          <Icon name="pencil" size={16} color="white" />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => ChooseProductImages(index)}
                        key={item}
                        style={[styles.shopImagesMain, {width: '30%'}]}>
                        <Icon name="image" size={23} color="black" />
                        <Text style={[styles.uploadText, {fontSize: 12}]}>
                          Click to Upload
                        </Text>
                        <Text style={styles.uploadTextInner}>
                          Product Image{' '}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                );
              })}
            </View>

            {error?.productImages && (
              <Text style={styles.errorText}>{error?.productImages}</Text>
            )}

            <Text style={styles.shopImgText}>Product Video</Text>
            <TouchableOpacity
              onPress={() => ChooseProductVideo()}
              style={[styles.coverMainDiv, {marginTop: 0}]}>
              {productVideo === '' ? (
                <>
                  <Icon name="image" size={25} color="black" />
                  <Text style={styles.uploadText}>Click to Upload </Text>
                  <Text style={styles.uploadTextInner}>Product Video </Text>
                </>
              ) : (
                <Video
                  source={{
                    uri: productVideo,
                  }}
                  style={{width: '100%', height: 150, borderRadius: 10}}
                  // controls={true}
                  resizeMode="cover"
                />
              )}
              {productVideo && (
                <View style={styles.videoMainIcon}>
                  <TouchableOpacity
                    onPress={() => ChooseProductVideo()}
                    style={[styles.editIconMain]}>
                    <Icon name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setProductVideo('');
                      setUploadProductVideo('');
                      setDeleteProductVideo(editableProductData?.product_video);
                    }}
                    style={[styles.trashIcon, {backgroundColor: 'red'}]}>
                    <Icon name="trash" color={'white'} size={16} />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>

            <View style={{width: '100%', marginTop: 20}}>
              <CustomButton
                name={editableProductData ? 'Edit Product' : 'Add Product'}
                color="#FFFFFF"
                backgroundColor="#29977E"
                borderColor="#29977E"
                onPress={handleSubmit(onSubmitProduct)}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddEditProduct;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 22,
    marginVertical: 30,
  },
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

  container: {
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'gray',
  },
  richEditor: {},
  richToolbar: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  desText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    padding: 6,
  },

  shopImgText: {
    color: '#151827',
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 16,
  },
  shopImagesMain: {
    position: 'relative',
    backgroundColor: '#FFF',
    alignItems: 'center',
    height: 112,
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 2,
    width: '30%',
  },
  videoMainIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 10,
  },
  editIconMain: {
    backgroundColor: 'black',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  trashIcon: {
    backgroundColor: '#151827',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: '600',
    paddingTop: 6,
  },
  uploadText: {
    color: '#29977E',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FontStyle,
    paddingTop: 6,
  },
  uploadTextInner: {
    color: 'rgba(21, 24, 39, 0.40)',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FontStyle,
  },
  coverMainDiv: {
    position: 'relative',
    backgroundColor: '#FFF',
    marginTop: 25,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: 150,
    justifyContent: 'center',
    elevation: 2,
    borderRadius: 10,
  },
  priceSwitchMain: {
    marginBottom: 15,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  PriceVisibilityText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  alertPromtDiv: {
    width: '100%',
    backgroundColor: '#fdeded',
    marginBottom: 20,
    borderRadius: 8,
    padding: 20,
  },
  alertSubMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  upgradeText: {
    textAlign: 'center',
    paddingTop: 2,
    textDecorationLine: 'underline',
    color: 'black',
    fontWeight: '600',
  },
  alertMsgText: {
    color: 'black',
    fontWeight: '400',
  },
});
