import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomButton from '../../../../common/CustomButton';
import {FontStyle} from '../../../../../CommonStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {shopUpdate} from '../../../../graphql/mutations/shops';
import {useToast} from 'native-base';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import {deleteObjectsInFolder, fileUpload} from '../../../../wasabi';
import FastImage from 'react-native-fast-image';
import {generateRandomNumberString, isFileOfType} from '../../../../utils';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {useSelector} from 'react-redux';

const ShopLayoutTab = ({
  vendorShopDetails,
  useProfileData,
  updateVendorShopDetailStore,
}) => {
  const toast = useToast();
  const [shopLogo, setShopLogo] = useState('');
  const [deleteShopLogo, setDeleteShopLogo] = useState('');
  const [resizeShopLogoFile, setResizeShopLogoFile] = useState([]);

  const [shopBackground, setShopBackground] = useState('');
  const [resizeShopCoverImageFile, setResizeShopCoverImageFile] = useState([]);
  const [deleteShopBackground, setDeleteShopBackground] = useState('');

  const [shopImages, setShopImages] = useState([]);
  const [resizeShopImagesFile, setResizeShopImagesFile] = useState([]);
  const [shopImagesWasabiUrl, setShopImageWasabiUrl] = useState([]);
  const [deleteShopImages, setDeleteShopImages] = useState([]);

  const [shopVideo, setShopVideo] = useState('');
  const [uploadShopVideo, setUploadShopVideo] = useState('');
  const [deleteShopVideo, setDeleteShopVideo] = useState('');

  const [shopLayoutLoading, setShopLayoutLoading] = useState(false);
  const {userProfile} = useSelector(state => state?.user);
  const {imagesVariantData} = useSelector(state => state?.imageVariants);

  // const srcToFile = async (src, fileName, mimeType) => {
  //   const response = await RNFetchBlob.fetch('GET', src);
  //   const buf = await response.blob();
  //   const file = new File([buf], fileName, {type: mimeType});

  //   let ext = '';
  //   if (mimeType === 'image/png') {
  //     ext = 'jpg';
  //   } else if (mimeType === 'video') {
  //     ext = 'mp4';
  //   }
  //   const storeLocalUrl = await RNFetchBlob.config({
  //     fileCache: true,
  //     appendExt: ext,
  //   }).fetch('GET', src);
  //   const imagePath = storeLocalUrl.path();
  //   const imagePathModify = `file://${imagePath}`;

  //   const reFactorFile = {
  //     ...file?._data,
  //     fileName: file?._data?.name,
  //     fileSize: file?._data?.size,
  //     uri: imagePathModify,
  //   };

  //   return reFactorFile;
  // };

  useEffect(() => {
    setShopImages([]);

    if (vendorShopDetails) {
      setShopLogo(vendorShopDetails?.shop_logo?.medium);
      setShopBackground(vendorShopDetails?.shop_cover_image?.medium);
      setShopImageWasabiUrl([...vendorShopDetails?.shop_images]);
      setShopImages([...vendorShopDetails?.shop_images]);

      vendorShopDetails?.shop_video &&
        setShopVideo(vendorShopDetails?.shop_video);
    }
  }, [vendorShopDetails]);

  const ChooseShopLogoImage = () => {
    let options = {
      title: 'Select Shop Logo',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose image from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
      },
      mediaType: 'photo',
      // selectionLimit: 10,
      // maxWidth: 500,
      // maxHeight: 500,

      // videoQuality: 'high',
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
        const acceptedFileTypes = ['png', 'jpg', 'jpeg', 'webp', 'heic'];
        const fileName = response.assets[0].fileName || '';
        if (isFileOfType(fileName, acceptedFileTypes)) {
          setShopLogo(response.assets[0].uri);
          const sourceURI = {uri: response.assets[0].uri};
          resizeShopLogoImage(sourceURI);

          setDeleteShopLogo('');
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

  const resizeShopLogoImage = async source => {
    try {
      const resizedImage1 = await ImageResizer.createResizedImage(
        source.uri,
        Number(
          imagesVariantData?.imageVariants?.shop_logo_variants?.extraSmall,
        ),
        Number(
          imagesVariantData?.imageVariants?.shop_logo_variants?.extraSmall,
        ),
        'JPEG',
        100,
      );
      const resizedImage2 = await ImageResizer.createResizedImage(
        source.uri,
        Number(imagesVariantData?.imageVariants?.shop_logo_variants?.small),
        Number(imagesVariantData?.imageVariants?.shop_logo_variants?.small),
        'JPEG',
        100,
      );
      const resizedImage3 = await ImageResizer.createResizedImage(
        source.uri,
        Number(imagesVariantData?.imageVariants?.shop_logo_variants?.medium),
        Number(imagesVariantData?.imageVariants?.shop_logo_variants?.medium),
        'JPEG',
        100,
      );
      const resizedImage4 = await ImageResizer.createResizedImage(
        source.uri,
        Number(imagesVariantData?.imageVariants?.shop_logo_variants?.large),
        Number(imagesVariantData?.imageVariants?.shop_logo_variants?.large),
        'JPEG',
        100,
      );

      const img1 = {
        ...resizedImage1,
        type: 'image/jpeg',
        imageSize: 'extraSmall',
      };
      const img2 = {...resizedImage2, type: 'image/jpeg', imageSize: 'small'};
      const img3 = {...resizedImage3, type: 'image/jpeg', imageSize: 'medium'};
      const img4 = {...resizedImage4, type: 'image/jpeg', imageSize: 'large'};

      setResizeShopLogoFile([img1, img2, img3, img4]);
    } catch (error) {
      console.log('Image resizing error:', error);
    }
  };

  const ChooseShopCoverImage = () => {
    let options = {
      title: 'Select Shop Cover Image',
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
        alert(response.customButton);
      } else {
        const acceptedFileTypes = ['png', 'jpg', 'jpeg', 'webp', 'heic'];
        const fileName = response.assets[0].fileName || '';
        if (isFileOfType(fileName, acceptedFileTypes)) {
          setShopBackground(response.assets[0].uri);
          const sourceURI = {uri: response.assets[0].uri};
          resizeShopCoverImage(sourceURI);

          setDeleteShopBackground('');
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

  const resizeShopCoverImage = async source => {
    try {
      const resizedImage1 = await ImageResizer.createResizedImage(
        source.uri,
        Number(imagesVariantData?.imageVariants?.shop_cover_variants?.small),
        Number(imagesVariantData?.imageVariants?.shop_cover_variants?.small),
        'JPEG',
        100,
      );
      const resizedImage2 = await ImageResizer.createResizedImage(
        source.uri,
        Number(imagesVariantData?.imageVariants?.shop_cover_variants?.medium),
        Number(imagesVariantData?.imageVariants?.shop_cover_variants?.medium),
        'JPEG',
        100,
      );
      const resizedImage3 = await ImageResizer.createResizedImage(
        source.uri,
        Number(imagesVariantData?.imageVariants?.shop_cover_variants?.large),
        Number(imagesVariantData?.imageVariants?.shop_cover_variants?.large),
        'JPEG',
        100,
      );

      const img1 = {...resizedImage1, type: 'image/jpeg', imageSize: 'small'};
      const img2 = {...resizedImage2, type: 'image/jpeg', imageSize: 'medium'};
      const img3 = {...resizedImage3, type: 'image/jpeg', imageSize: 'large'};

      setResizeShopCoverImageFile([img1, img2, img3]);
    } catch (error) {
      console.log('Image resizing error:', error);
    }
  };

  function fillArrayWithEmptyValues(arr, targetLength) {
    while (arr.length < targetLength) {
      arr.push({links: `none${arr.length}`});
    }
    return arr;
  }

  const ChooseShopImages = index => {
    let options = {
      title: 'Select Shop Cover Image',
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
        alert(response.customButton);
      } else {
        const acceptedFileTypes = ['png', 'jpg', 'jpeg', 'webp', 'heic'];
        const fileName = response.assets[0].fileName || '';
        if (isFileOfType(fileName, acceptedFileTypes)) {
          let deleteShopImagesData = deleteShopImages;

          deleteShopImagesData[index] = undefined;
          setDeleteShopImages(() => [...deleteShopImagesData]);

          // let editableShopImagesData = editableShopImages;
          // editableShopImagesData[index] = {
          //   oldLink: shopImagesWasabiUrl[index]?.links,
          //   newData: response.assets[0],
          // };

          let updatedShopImagesWasabiUrl = shopImagesWasabiUrl;
          updatedShopImagesWasabiUrl[index] = {};

          setShopImageWasabiUrl(() => [...updatedShopImagesWasabiUrl]);

          const newImage = [...shopImages];
          newImage[index] = {links: {medium: response.assets[0].uri}};
          setShopImages(newImage);

          const sourceURI = {uri: response.assets[0].uri};
          resizeShopImages(sourceURI, index);
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

  const resizeShopImages = async (source, index) => {
    try {
      const imageVariants = [
        {
          size: Number(
            imagesVariantData?.imageVariants?.shop_image_variants?.small,
          ),
          type: 'small',
        },
        {
          size: Number(
            imagesVariantData?.imageVariants?.shop_image_variants?.medium,
          ),
          type: 'medium',
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

      const newImageFile = [...resizeShopImagesFile];

      const startIndex = index * imageVariants.length;

      resizedImages.forEach((img, i) => {
        newImageFile[startIndex + i] = img;
      });

      setResizeShopImagesFile(newImageFile);
    } catch (error) {
      console.log('Image resizing error:', error);
    }
  };

  const ChooseShopVideo = () => {
    let options = {
      title: 'Select Shop Video',
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
        setShopVideo(response.assets[0].uri);
        setUploadShopVideo(response.assets[0]);
        setDeleteShopVideo('');
      }
    });
  };

  const emptyImageStates = () => {
    setShopLogo('');
    setShopBackground('');
    setShopImages([]);
    setShopImageWasabiUrl([]);
    setDeleteShopImages([]);
    setDeleteShopLogo('');
    setDeleteShopBackground('');
    setDeleteShopVideo('');
    setShopVideo('');
    setUploadShopVideo('');

    setResizeShopLogoFile([]);
    setResizeShopCoverImageFile([]);
    setResizeShopImagesFile([]);
  };

  const deleteWasabiFolder = async folderName => {
    const folderStructure = `user_${userProfile?.id}/shop/${folderName}`;
    await deleteObjectsInFolder(folderStructure);
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

  const shopLayoutOnSubmit = async () => {
    setShopLayoutLoading(true);

    let logoResponse = [];
    let backgroundResponse = [];
    let imagesResponse = [];
    let videoResponse = null;

    if (deleteShopLogo) {
      await deleteWasabiFolder('logo');
    }

    if (deleteShopBackground) {
      await deleteWasabiFolder('cover');
    }

    if (deleteShopVideo) {
      await deleteWasabiFolder('video');
    }

    if (deleteShopImages?.filter(itm => itm !== undefined).length > 0) {
      deleteShopImages
        ?.filter(itm => itm !== undefined)
        ?.map(async item => {
          const splitStringAfterShop = item?.medium?.split('/shop/')[1];
          const urlParts = splitStringAfterShop?.split('/');
          const lastPart = urlParts?.pop();
          const stringWithoutLastWord = urlParts?.join('/');
          await deleteWasabiFolder(stringWithoutLastWord);
        });
    }

    if (resizeShopLogoFile?.length > 0) {
      if (vendorShopDetails?.shop_logo?.large) {
        await deleteWasabiFolder('logo');
      }
      const folderStructure = `user_${userProfile?.id}/shop/logo`;

      await multipleImageUploadFile(resizeShopLogoFile, folderStructure).then(
        res => (logoResponse = res),
      );
    }

    if (resizeShopCoverImageFile?.length > 0) {
      if (vendorShopDetails?.shop_cover_image?.small) {
        await deleteWasabiFolder('cover');
      }

      const folderStructure = `user_${userProfile?.id}/shop/cover`;

      await multipleImageUploadFile(
        resizeShopCoverImageFile,
        folderStructure,
      ).then(res => (backgroundResponse = res));
    }

    if (uploadShopVideo) {
      if (vendorShopDetails?.shop_video) {
        await deleteWasabiFolder('video');
      }

      try {
        const folderStructure = `user_${userProfile.id}/shop/video`;
        const shopVideoRes = await fileUpload(uploadShopVideo, folderStructure);
        videoResponse = shopVideoRes;
      } catch (error) {
        console.error('Error during file upload:', error);
        return;
      }
    }

    const newShopImagesWasabiUrl = shopImagesWasabiUrl?.map(item => {
      const updatedItem = {...item};

      // Remove "__typename" property from every key
      Object.keys(updatedItem).forEach(key => {
        if (key === '__typename') {
          delete updatedItem[key];
        } else if (
          typeof updatedItem[key] === 'object' &&
          updatedItem[key] !== null
        ) {
          // If the property is an object, apply the same process recursively
          updatedItem[key] = Object.keys(updatedItem[key]).reduce(
            (acc, innerKey) => {
              if (innerKey !== '__typename') {
                acc[innerKey] = updatedItem[key][innerKey];
              }
              return acc;
            },
            {},
          );
        }
      });

      return updatedItem;
    });

    if (resizeShopImagesFile?.length > 0) {
      for (let i = 0; i < resizeShopImagesFile?.length; i += 2) {
        const shopImageIndex = i / 2;

        if (resizeShopImagesFile[i] && resizeShopImagesFile[i + 1]) {
          const shopImage = vendorShopDetails?.shop_images[shopImageIndex];
          if (shopImage?.links?.medium) {
            const splitStringAfterShop =
              shopImage.links.medium.split('/shop/')[1];
            const urlParts = splitStringAfterShop.split('/');
            urlParts.pop(); // Remove last part
            const stringWithoutLastWord = urlParts.join('/');

            await deleteWasabiFolder(stringWithoutLastWord);
          }
        }
      }

      await multipleShopImagesUploadFile(resizeShopImagesFile).then(
        res => (imagesResponse = res),
      );
    }

    const {__typename: shopLogoTypename, ...newShopLogoVariants} =
      vendorShopDetails?.shop_logo;

    const {__typename: shopCoverTypename, ...newShopCoverVariants} =
      vendorShopDetails?.shop_cover_image;

    const shopImagesPayload = Array.from(
      {length: imagesResponse?.length / 2},
      (_, index) => ({
        links: {
          small: imagesResponse[index * 2],
          medium: imagesResponse[index * 2 + 1],
        },
      }),
    );

    let combinedLinks = [...newShopImagesWasabiUrl, ...shopImagesPayload];

    const generateSizes = (
      imageResponse,
      deleteImage,
      oldImageVariants,
      type,
    ) => {
      let sizes = {};
      const sizeLabels =
        type === 'logo'
          ? ['extraSmall', 'small', 'medium', 'large']
          : ['small', 'medium', 'large'];

      if (imageResponse && imageResponse.length > 0) {
        sizeLabels.forEach((sizeLabel, index) => {
          if (imageResponse[index]) {
            sizes[sizeLabel] = imageResponse[index];
          }
        });
      } else {
        sizes = deleteImage?.large ? {} : oldImageVariants;
      }
      return sizes;
    };

    await shopUpdate({
      shopLayout: {
        id: useProfileData?.userCreatedShopId,
        shop_logo: generateSizes(
          logoResponse,
          deleteShopLogo,
          newShopLogoVariants,
          'logo',
        ),
        shop_cover_image: generateSizes(
          backgroundResponse,
          deleteShopBackground,
          newShopCoverVariants,
          'cover',
        ),
        shop_images: combinedLinks?.filter(
          item => Object.keys(item).length > 0,
        ),
        shop_video:
          videoResponse ||
          (deleteShopVideo ? '' : vendorShopDetails?.shop_video),
      },
    }).then(
      res => {
        toast.show({
          title: res.data.updateShop.message,
          placement: 'top',
          backgroundColor: 'green.600',
          variant: 'solid',
        });
        emptyImageStates();
        setShopLayoutLoading(false);
        updateVendorShopDetailStore();
      },
      error => {
        setShopLayoutLoading(false);
        toast.show({
          title: error.message,
          placement: 'top',
          backgroundColor: 'red.600',
          variant: 'solid',
        });
      },
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <View style={{marginBottom: 20}}>
          <TouchableOpacity
            onPress={() => ChooseShopLogoImage()}
            style={styles.logoMainDiv}>
            {shopLogo === '' || shopLogo === null ? (
              <>
                <Icon name="image" size={25} color="black" />
                <Text style={styles.uploadText}>Click to Upload </Text>
                <Text style={styles.uploadTextInner}>Logo </Text>
              </>
            ) : (
              <>
                <FastImage
                  style={{width: 150, height: 150, borderRadius: 100}}
                  source={{
                    uri: shopLogo,
                    cache: FastImage.cacheControl.web,
                  }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    onPress={() => ChooseShopLogoImage()}
                    style={styles.editIconMain}>
                    <Icon name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShopLogo('');
                      setResizeShopLogoFile([]);
                      setDeleteShopLogo(vendorShopDetails?.shop_logo);
                    }}
                    style={styles.trashIconMain}>
                    <Icon name="trash" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => ChooseShopCoverImage()}
            style={styles.coverMainDiv}>
            {shopBackground === '' || shopBackground === null ? (
              <>
                <Icon name="image" size={25} color="black" />
                <Text style={styles.uploadText}>Click to Upload </Text>
                <Text style={styles.uploadTextInner}>Cover Image </Text>
              </>
            ) : (
              <>
                <FastImage
                  style={{width: '100%', height: 148, borderRadius: 10}}
                  source={{
                    uri: shopBackground,
                    cache: FastImage.cacheControl.web,
                  }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    gap: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() => ChooseShopCoverImage()}
                    style={[styles.editIconMain]}>
                    <Icon name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShopBackground('');
                      setResizeShopCoverImageFile([]);
                      setDeleteShopBackground(
                        vendorShopDetails?.shop_cover_image,
                      );
                    }}
                    style={[styles.trashIconMain]}>
                    <Icon name="trash" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.shopImgText}>Shop Images</Text>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              width: '100%',
            }}>
            {fillArrayWithEmptyValues([...shopImages], 3)?.length > 0 &&
              fillArrayWithEmptyValues([...shopImages], 3)?.map(
                (item, index) => {
                  return (
                    <>
                      {shopImages[index] ? (
                        <TouchableOpacity
                          key={index}
                          style={styles.shopImagesMain}>
                          <FastImage
                            style={{width: 112, height: 112, borderRadius: 10}}
                            source={{
                              uri: shopImages[index]?.links?.medium,
                              cache: FastImage.cacheControl.web,
                            }}
                            resizeMode="cover"
                          />
                          <View
                            style={{
                              position: 'absolute',
                              top: 6,
                              right: 0,
                              gap: 5,
                            }}>
                            <TouchableOpacity
                              onPress={() => ChooseShopImages(index)}
                              style={[styles.editIconMain]}>
                              <Icon name="pencil" size={16} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setShopImages(
                                  shopImages?.filter(
                                    (itm, idx) => idx !== index,
                                  ),
                                );
                                let deleteShopImagesData = deleteShopImages;

                                deleteShopImagesData[index] =
                                  vendorShopDetails?.shop_images[index]?.links;
                                setDeleteShopImages(() => [
                                  ...deleteShopImagesData,
                                ]);

                                let updatedShopImagesWasabiUrl =
                                  shopImagesWasabiUrl;
                                updatedShopImagesWasabiUrl[index] = {};

                                setShopImageWasabiUrl(() => [
                                  ...updatedShopImagesWasabiUrl,
                                ]);

                                let shopImagesData = shopImages;
                                shopImagesData[index] = undefined;
                                setShopImages(() => [...shopImagesData]);

                                let resizeShopImagesData = [
                                  ...resizeShopImagesFile,
                                ];
                                if (resizeShopImagesFile?.length > 0) {
                                  if (index === 0) {
                                    resizeShopImagesData[0] = undefined;
                                    resizeShopImagesData[1] = undefined;
                                  } else if (index === 1) {
                                    resizeShopImagesData[2] = undefined;
                                    resizeShopImagesData[3] = undefined;
                                  } else if (index === 2) {
                                    resizeShopImagesData[4] = undefined;
                                    resizeShopImagesData[5] = undefined;
                                  }
                                  setResizeShopImagesFile(resizeShopImagesData);
                                }
                              }}
                              style={[styles.trashIconMain]}>
                              <Icon name="trash" size={16} color="white" />
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => ChooseShopImages(index)}
                          key={index}
                          style={[styles.shopImagesMain, {width: '30%'}]}>
                          <Icon name="image" size={23} color="black" />
                          <Text style={[styles.uploadText, {fontSize: 12}]}>
                            Click to Upload
                          </Text>
                          <Text style={styles.uploadTextInner}>
                            Shop Image{' '}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  );
                },
              )}
          </View>

          <Text style={styles.shopImgText}>Shop Video</Text>
          <TouchableOpacity
            onPress={() => ChooseShopVideo()}
            style={[styles.coverMainDiv, {marginTop: 0}]}>
            {shopVideo === '' ? (
              <>
                <Icon name="image" size={25} color="black" />
                <Text style={styles.uploadText}>Click to Upload </Text>
                <Text style={styles.uploadTextInner}>Shop Video </Text>
              </>
            ) : (
              <>
                <Video
                  source={{
                    uri: shopVideo,
                  }}
                  style={{width: '100%', height: 150, borderRadius: 10}}
                  // controls={true}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 0,
                    gap: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() => ChooseShopVideo()}
                    style={[styles.editIconMain, {top: 10, right: 10}]}>
                    <Icon name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShopVideo('');
                      setUploadShopVideo('');
                      setDeleteShopVideo(vendorShopDetails?.shop_video);
                    }}
                    style={[styles.trashIconMain, {top: 10, right: 10}]}>
                    <Icon name="trash" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{width: '100%'}}>
          <CustomButton
            name="Update"
            color="#FFFFFF"
            backgroundColor="#151827"
            borderColor="#29977E"
            onPress={() => shopLayoutOnSubmit()}
            loading={shopLayoutLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default ShopLayoutTab;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 22,
    marginVertical: 30,
  },
  logoMainDiv: {
    backgroundColor: '#FFF',
    marginTop: 25,
    alignItems: 'center',
    alignSelf: 'center',
    width: 150,
    height: 150,
    justifyContent: 'center',
    borderRadius: 100,
    elevation: 2,
    position: 'relative',
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
    width: '26%',
  },

  editIconMain: {
    backgroundColor: 'black',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },

  trashIconMain: {
    backgroundColor: 'red',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: '600',
    paddingTop: 6,
  },
});
