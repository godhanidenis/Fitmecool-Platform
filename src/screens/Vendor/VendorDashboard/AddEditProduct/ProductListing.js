import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import UpperFilter from '../../../../common/Customer/UpperFilter';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeProductPageSkip,
  loadProductsStart,
} from '../../../../redux/ProductSlice/ProductSlice';
import {useNavigation} from '@react-navigation/native';
import {Modal} from 'react-native';
import CustomButton from '../../../../common/CustomButton';
import {deleteProduct} from '../../../../graphql/mutations/products';
import {useToast} from 'native-base';
import TablePagination from '../../../../components/TablePagination';
import {deleteObjectsInFolder} from '../../../../wasabi';
import {loadVendorShopDetailsStart} from '../../../../redux/vendorShopDetailsSlice/ShopDetailSlice';
import FastImage from 'react-native-fast-image';

const ProductListing = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    productsCount,
    PaginationProductLimit,
    productPageSkip,
    numOfPages,
    productsData,
    productLoading,
  } = useSelector(state => state?.productsData);
  const {appliedProductsFilters, sortFilters} = useSelector(
    state => state.productsFiltersReducer,
  );
  const [deletableProductsImages, setDeletableProductsImages] = useState([]);
  const [deletableProductVideo, setDeletableProductVideo] = useState();

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

  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState();
  const [deletableProductFolderName, setDeletableProductFolderName] =
    useState();

  const handlePageChange = pageNumber => {
    const newSkip = (pageNumber - 1) * PaginationProductLimit;
    console.log('newSkip', newSkip);
    dispatch(changeProductPageSkip(newSkip));
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <View style={{marginTop: 0}}>
          <UpperFilter
            byShop={false}
            showOnlyShopDetailPage={true}
            productsCount={productsCount}
          />
        </View>

        <View style={{marginTop: 15}}>
          <ScrollView horizontal={true}>
            <View style={styles.productTable}>
              <View style={styles.tableRow}>
                {[
                  'NO',
                  'Thumbnail',
                  'Name',
                  'Price',
                  'Color',
                  'Inquiry',
                  'Action',
                ].map((itm, index) => (
                  <Text
                    key={itm}
                    style={[
                      styles.tableHeader,
                      {
                        width:
                          itm === 'NO' ? 60 : itm === 'Inquiry' ? 200 : 100,
                      },
                    ]}>
                    {itm}
                  </Text>
                ))}
              </View>
              {productsData?.length === 0 ? (
                <View
                  style={{
                    paddingVertical: 40,
                    paddingHorizontal: '12%',
                    alignSelf: 'flex-start',
                  }}>
                  <Text
                    style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
                    No Product Available !
                  </Text>
                </View>
              ) : (
                productsData?.map((item, index) => {
                  const finalPrice =
                    item?.product_price -
                    item?.product_price * (item?.product_discount / 100);

                  return (
                    <View
                      key={item}
                      style={[
                        styles.tableRow,
                        {
                          opacity:
                            productLoading && productsData?.length > 0
                              ? 0.5
                              : 1,
                        },
                      ]}>
                      <Text style={[styles.tableCell, {width: 60}]}>
                        {index + 1}
                      </Text>
                      <View
                        style={[
                          styles.tableCell,
                          {
                            width: 100,
                          },
                        ]}>
                        <View
                          style={{
                            position: 'relative',
                          }}>
                          <FastImage
                            style={{width: 80, height: 70, alignSelf: 'center'}}
                            source={{
                              uri: item?.product_image?.front?.small,
                              cache: FastImage.cacheControl.web,
                            }}
                            resizeMode="cover"
                          />
                          {item?.product_listing_type && (
                            <View
                              style={[
                                styles.rentSellRebinMain,
                                {
                                  backgroundColor:
                                    item?.product_listing_type === 'rent'
                                      ? '#ff3b3b'
                                      : '#29977E',
                                },
                              ]}>
                              <Text style={styles.rebinText}>
                                {item?.product_listing_type}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Text
                        numberOfLines={2}
                        style={[styles.tableCell, {width: 100}]}>
                        {item?.product_name}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={[styles.tableCell, {width: 100}]}>
                        {Math.round(finalPrice)}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={[styles.tableCell, {width: 100}]}>
                        {item?.product_color}
                      </Text>

                      <View style={[styles.tableCell, {width: 200}]}>
                        <Text style={styles.inqueryText}>
                          WhatsApp Inquiry :{' '}
                          <Text style={{fontWeight: '700'}}>
                            {item?.whatsapp_inquiry}
                          </Text>
                        </Text>
                        <Text style={styles.inqueryText}>
                          Contact Inquiry :{' '}
                          <Text style={{fontWeight: '700'}}>
                            {item.contact_inquiry}
                          </Text>
                        </Text>
                      </View>
                      <View style={[styles.tableCell, {width: 100}]}>
                        <View style={{flexDirection: 'row', gap: 8}}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('VendorAddEditProduct', {
                                state: {
                                  productEditId: item?.id,
                                  editableProductData: item,
                                },
                              })
                            }
                            style={styles.pencilIcon}>
                            <Icon name="pencil" color={'white'} size={18} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setProductDeleteModalOpen(true);
                              setDeleteProductId(item?.id);

                              setDeletableProductFolderName(
                                item?.product_image?.front?.small
                                  ?.split('/products/')[1]
                                  .split('/')[0],
                              );
                            }}
                            style={[
                              styles.pencilIcon,
                              {backgroundColor: 'red'},
                            ]}>
                            <Icon name="trash" color={'white'} size={18} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {index === 0 &&
                        productLoading &&
                        productsData?.length > 0 && (
                          <View style={styles.loadingDiv}>
                            <ActivityIndicator />
                          </View>
                        )}
                    </View>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>

        {productsCount > PaginationProductLimit && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 15,
            }}>
            <TablePagination
              // totalItems={productsCount}
              // itemsPerPage={2}
              numOfPages={numOfPages}
              onPageChange={handlePageChange}
            />
          </View>
        )}
      </View>
      <ProductDeleteModel
        productDeleteModalOpen={productDeleteModalOpen}
        setProductDeleteModalOpen={setProductDeleteModalOpen}
        deleteProductId={deleteProductId}
        getAllProducts={getAllProducts}
        deletableProductFolderName={deletableProductFolderName}
      />
    </View>
  );
};

export default ProductListing;

const ProductDeleteModel = ({
  productDeleteModalOpen,
  setProductDeleteModalOpen,
  deleteProductId,
  getAllProducts,
  // deletableProductsImages,
  // deletableProductVideo,
  deletableProductFolderName,
}) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const {vendorShopDetails} = useSelector(state => state?.shopDetail);
  const {userProfile} = useSelector(state => state?.user);
  const [loading, setLoading] = useState(false);

  const deleteWasabiFolder = async folderName => {
    const folderStructure = `user_${userProfile?.id}/shop/${folderName}`;
    await deleteObjectsInFolder(folderStructure);
  };
  const deleteProductHandler = async () => {
    setLoading(true);
    await deleteWasabiFolder(`products/${deletableProductFolderName}`);

    deleteProduct({id: deleteProductId}).then(
      res => {
        toast.show({
          title: res.data.deleteProduct,
          placement: 'top',
          backgroundColor: 'green.600',
          variant: 'solid',
        });
        setLoading(false);
        getAllProducts();
        dispatch(loadVendorShopDetailsStart(vendorShopDetails?.id));
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
    setProductDeleteModalOpen(false);
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={productDeleteModalOpen}
        onRequestClose={() => {
          setProductDeleteModalOpen(!productDeleteModalOpen);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}> Confirmation Modal</Text>
            <Text style={styles.sureText}>
              Are you sure delete this product ?{' '}
              <Text style={{fontWeight: '600', color: 'black'}}>
                {deleteProductId}
              </Text>{' '}
              ?
            </Text>
            <Text style={styles.warningText}>
              Warning :{' '}
              <Text style={{fontWeight: '400', color: 'black'}}>
                Your available products count will not be increased after
                deleting the product.
              </Text>{' '}
            </Text>
            <View style={styles.buttonMain}>
              <View style={{width: 80}}>
                <CustomButton
                  name="cancel"
                  color="#151827"
                  backgroundColor="#FAFCFC"
                  borderColor="#151827"
                  onPress={() => setProductDeleteModalOpen(false)}
                />
              </View>
              <View style={{width: 80}}>
                <CustomButton
                  name="Delete"
                  color="white"
                  backgroundColor="#dc2626"
                  borderColor="#dc2626"
                  onPress={() => deleteProductHandler()}
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 22,
    marginVertical: 30,
  },
  pencilIcon: {
    backgroundColor: '#151827',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },

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
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 20,
  },
  sureText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
  },
  warningText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonMain: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },

  productTable: {
    marginBottom: 20,
    marginHorizontal: 2,
    backgroundColor: 'white',
    elevation: 5,
  },
  tableRow: {
    flexDirection: 'row',
    position: 'relative',
  },
  tableHeader: {
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#151827',
    color: '#FFFF',
  },
  tableCell: {
    padding: 10,
    textAlign: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#151827',
    color: '#31333E',
  },
  inqueryText: {
    textAlign: 'center',
    color: '#31333E',
  },
  rentSellRebinMain: {
    height: 20,
    width: 30,
    position: 'absolute',
    top: 5,
    left: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rebinText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  loadingDiv: {
    position: 'absolute',
    top: '60%',
    left: '30%',
  },
});
