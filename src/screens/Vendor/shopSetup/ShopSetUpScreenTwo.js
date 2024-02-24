import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FontStyle} from '../../../../CommonStyle';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import {useToast} from 'native-base';
import {isFileOfType} from '../../../utils';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {useSelector} from 'react-redux';

const ShopSetUpScreenTwo = ({
  setUploadShopVideo,
  setResizeShopLogoFile,
  setResizeShopCoverImageFile,
  resizeShopImagesFile,
  setResizeShopImagesFile,
}) => {
  const toast = useToast();
  const [shopLogo, setShopLogo] = useState('');
  const [shopBackground, setShopBackground] = useState('');
  const [shopImages, setShopImages] = useState([]);
  const ShopImgsError = shopImages?.filter(item => item !== undefined);
  const [shopVideo, setShopVideo] = useState('');
  const [error, setError] = useState({});

  const {imagesVariantData} = useSelector(state => state?.imageVariants);

  useEffect(() => {
    if (ShopImgsError?.length === 3) {
      setError({...error, shopImages: ''});
    }
  }, [ShopImgsError?.length]);

  const ChooseShopLogoImage = () => {
    let options = {
      title: 'Select Shop Logo',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose image from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo', // Set mediaType to photo to filter only images
      // selectionLimit: 1,
      // mimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
      // mediaType: 'video',
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
          setError({...error, shopLogo: ''});
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
          setError({...error, shopBackground: ''});
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
          const newImage = [...shopImages]; // Create a copy of the array
          newImage[index] = response.assets[0].uri; // Update value at the specified index
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
      }
    });
  };

  return (
    <View style={{marginHorizontal: 16}}>
      <TouchableOpacity
        onPress={() => ChooseShopLogoImage()}
        style={styles.logoMainDiv}>
        {shopLogo === '' ? (
          <>
            <Icon name="image" size={25} color="black" />
            <Text style={styles.uploadText}>Click to Upload </Text>
            <Text style={styles.uploadTextInner}>Logo </Text>
          </>
        ) : (
          <Image
            source={{uri: shopLogo}}
            style={{width: 150, height: 150, borderRadius: 100}}
          />
        )}
      </TouchableOpacity>
      {error?.shopLogo && (
        <Text style={[styles.errorText, {alignSelf: 'center'}]}>
          {error?.shopLogo}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => ChooseShopCoverImage()}
        style={styles.coverMainDiv}>
        {shopBackground === '' ? (
          <>
            <Icon name="image" size={25} color="black" />
            <Text style={styles.uploadText}>Click to Upload </Text>
            <Text style={styles.uploadTextInner}>Cover Image </Text>
          </>
        ) : (
          <Image
            resizeMode="cover"
            source={{uri: shopBackground}}
            style={{width: '100%', height: 148, borderRadius: 10}}
          />
        )}
      </TouchableOpacity>

      {error?.shopBackground && (
        <Text style={styles.errorText}>{error?.shopBackground}</Text>
      )}

      <Text style={styles.shopImgText}>Shop Images</Text>

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
              {shopImages[index] ? (
                <TouchableOpacity
                  onPress={() => ChooseShopImages(index)}
                  key={item}
                  style={styles.shopImagesMain}>
                  <Image
                    resizeMode="cover"
                    source={{uri: shopImages[index]}}
                    style={{width: '100%', height: 112, borderRadius: 10}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => ChooseShopImages(index)}
                  key={item}
                  style={[styles.shopImagesMain, {width: '30%'}]}>
                  <Icon name="image" size={23} color="black" />
                  <Text style={[styles.uploadText, {fontSize: 12}]}>
                    Click to Upload
                  </Text>
                  <Text style={styles.uploadTextInner}>Shop Image </Text>
                </TouchableOpacity>
              )}
            </>
          );
        })}
      </View>

      {error?.shopImages && (
        <Text style={styles.errorText}>{error?.shopImages}</Text>
      )}

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
          <Video
            source={{
              uri: shopVideo,
            }}
            style={{width: '100%', height: 150, borderRadius: 10}}
            // controls={true}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ShopSetUpScreenTwo;

const styles = StyleSheet.create({
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
    backgroundColor: '#FFF',
    alignItems: 'center',
    height: 112,
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 2,
    width: '30%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: '600',
    paddingTop: 6,
  },
});
