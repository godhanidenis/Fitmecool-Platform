import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  capitalize,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  NativeSelect,
} from "@mui/material";
import Image from "next/image";
import img from "../../../assets/logo_Shop.png";
import img1 from "../../../assets/shopCoverImage.png";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { MultipleImageUploadFile } from "../../../services/MultipleImageUploadFile";
import Filter from "../../../components/Filters";
import VendorShopSubHeader from "../../../components/Layout/VendorShopSubHeader";
import UpperFilter from "../../../components/Filters/UpperFilter/UpperFilter";
import { loadCategoriesStart } from "../../../redux/ducks/categories";
import { loadAreaListsStart } from "../../../redux/ducks/areaLists";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "../../../components/sections/product-section/ProductCard";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { useRouter } from "next/router";
import {
  loadMoreProductsStart,
  loadProductsStart,
} from "../../../redux/ducks/product";
import {
  CustomAuthModal,
  CustomTextField,
} from "../../../components/core/CustomMUIComponents";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { getBranchLists } from "../../../graphql/queries/branchListsQueries";
import AuthModal from "../../../components/core/AuthModal";
import { AuthTypeModal } from "../../../components/core/Enum";
import {
  createProduct,
  updateProduct,
} from "../../../graphql/mutations/products";
import { toast } from "react-toastify";
import { VideoUploadFile } from "../../../services/VideoUploadFile";
import { getProductDetails } from "../../../graphql/queries/productQueries";
import { deleteMedia } from "../../../graphql/mutations/deleteMedia";
import { withAuth } from "../../../components/core/PrivateRouteForVendor";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxWidth: "1200px",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  height: "auto",
};

const colorsList = [
  "red",
  "pink",
  "yellow",
  "wine",
  "purple",
  "blue",
  "orange",
  "green",
  "white",
  "black",
];

const ShopDetailsPage = () => {
  const [productListingModalOpen, setProductListingModalOpen] = useState(false);

  const [productImages, setProductImages] = useState([]);
  const [uploadProductImages, setUploadProductImages] = useState("");

  const [productAllMediaImages, setProductAllMediaImages] = useState([]);
  const [productAllMediaVideo, setProductAllMediaVideo] = useState();

  console.log("productImages", productAllMediaImages);
  console.log("productImages", productAllMediaVideo);

  const [productVideo, setProductVideo] = useState();
  const [uploadProductVideo, setUploadProductVideo] = useState();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [authTypeModal, setAuthTypeModal] = useState();

  const [menCategoryLabel, setMenCategoryLabel] = useState([]);
  const [womenCategoryLabel, setWomenCategoryLabel] = useState([]);

  const [branchList, setBranchList] = useState([]);

  const [productPageSkip, setProductPageSkip] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const [editProductId, setEditProductId] = useState();
  console.log("editProductId", editProductId);

  const router = useRouter();
  const { id } = router.query;
  const { categories } = useSelector((state) => state.categories);

  const [productType, setProductType] = useState();

  const dispatch = useDispatch();
  const { productsCount, productsData } = useSelector(
    (state) => state.products
  );

  const { isAuthenticate } = useSelector((state) => state.userProfile);
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (editProductId !== undefined) {
      setProductListingModalOpen(true);
      console.log("editProductId:::");

      getProductDetails({ id: editProductId }).then((res) => {
        console.log("res:::", res.data.product.data);

        setValue("product_name", res.data.product.data.product_name);
        setValue(
          "product_description",
          res.data.product.data.product_description
        );
        setValue("product_color", res.data.product.data.product_color);
        setProductType(res.data.product.data.product_type);
        setValue("product_category", res.data.product.data.categoryInfo.id);
        setValue("product_branch", res.data.product.data.branchInfo.id);

        res.data.product.data.product_image.front &&
          srcToFile(
            res.data.product.data.product_image.front,
            "profile.png",
            "image/png"
          ).then(function (file) {
            setUploadProductImages((old) => [...old, file]);
          });
        res.data.product.data.product_image.back &&
          srcToFile(
            res.data.product.data.product_image.back,
            "profile.png",
            "image/png"
          ).then(function (file) {
            setUploadProductImages((old) => [...old, file]);
          });
        res.data.product.data.product_image.side &&
          srcToFile(
            res.data.product.data.product_image.side,
            "profile.png",
            "image/png"
          ).then(function (file) {
            setUploadProductImages((old) => [...old, file]);
          });

        res.data.product.data.product_image.front &&
          setProductImages((old) => [
            ...old,
            res.data.product.data.product_image.front,
          ]);
        res.data.product.data.product_image.back &&
          setProductImages((old) => [
            ...old,
            res.data.product.data.product_image.back,
          ]);
        res.data.product.data.product_image.side &&
          setProductImages((old) => [
            ...old,
            res.data.product.data.product_image.side,
          ]);

        res.data.product.data.product_image.front &&
          setProductAllMediaImages((old) => [
            ...old,
            res.data.product.data.product_image.front,
          ]);
        res.data.product.data.product_image.back &&
          setProductAllMediaImages((old) => [
            ...old,
            res.data.product.data.product_image.back,
          ]);
        res.data.product.data.product_image.side &&
          setProductAllMediaImages((old) => [
            ...old,
            res.data.product.data.product_image.side,
          ]);

        res.data.product.data.product_video &&
          srcToFile(
            res.data.product.data.product_video,
            "profile.mp4",
            "video"
          ).then(function (file) {
            setUploadProductVideo(file);
          });

        res.data.product.data.product_video &&
          setProductVideo(res.data.product.data.product_video);

        res.data.product.data.product_video &&
          setProductAllMediaVideo(res.data.product.data.product_video);
      });
    }
  }, [editProductId, setValue]);

  useEffect(() => {
    setMenCategoryLabel(
      categories.filter((itm) => itm.category_type === "Men").map((i) => i)
    );
    setWomenCategoryLabel(
      categories.filter((itm) => itm.category_type === "Women").map((i) => i)
    );
  }, [categories]);

  useEffect(() => {
    getBranchLists().then((res) => {
      const branches = res.data.branchList.filter(
        (branch) => branch.shop_id === id
      );

      setBranchList(branches);
    });
  }, [id]);

  const getMoreProductsList = () => {
    dispatch(
      loadMoreProductsStart({
        pageData: {
          skip: productPageSkip,
          limit: 6,
        },
        filter: {
          category_id:
            productsFiltersReducer.appliedProductsFilters.categoryId
              .selectedValue,
          product_color:
            productsFiltersReducer.appliedProductsFilters.productColor
              .selectedValue,
        },
        shopId:
          productsFiltersReducer.appliedProductsFilters.shopId.selectedValue,
        sort: productsFiltersReducer.sortFilters.sortType.selectedValue,
        search: productsFiltersReducer.searchBarData,
      })
    );
  };

  const getAllProducts = () => {
    dispatch(
      loadProductsStart({
        pageData: {
          skip: 0,
          limit: 6,
        },
        filter: {
          category_id:
            productsFiltersReducer.appliedProductsFilters.categoryId
              .selectedValue,
          product_color:
            productsFiltersReducer.appliedProductsFilters.productColor
              .selectedValue,
        },
        shopId:
          productsFiltersReducer.appliedProductsFilters.shopId.selectedValue,
        sort: productsFiltersReducer.sortFilters.sortType.selectedValue,
        search: productsFiltersReducer.searchBarData,
      })
    );
  };
  useEffect(() => {
    dispatch(
      changeAppliedProductsFilters({
        key: "shopId",
        value: {
          selectedValue: [id],
        },
      })
    );
  }, [dispatch, id]);

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    productsFiltersReducer.appliedProductsFilters,
    productsFiltersReducer.sortFilters,
    productsFiltersReducer.searchBarData,
  ]);

  useEffect(() => {
    if (productPageSkip > 0) {
      getMoreProductsList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, productPageSkip]);

  useEffect(() => {
    dispatch(loadCategoriesStart());
    dispatch(loadAreaListsStart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onSubmit = (data) => {
    console.log("data", data);
    if (isAuthenticate) {
      setLoading(true);
      if (editProductId === undefined) {
        console.log("nice");
        MultipleImageUploadFile(uploadProductImages).then((res) => {
          uploadProductVideo !== undefined
            ? VideoUploadFile(uploadProductVideo).then((videoResponse) => {
                createProduct({
                  productInfo: {
                    branch_id: data.product_branch,
                    category_id: data.product_category,
                    product_color: data.product_color,
                    product_description: data.product_description,
                    product_name: data.product_name,
                    product_type: data.product_type,
                    product_image: {
                      front: res.data.data.multipleUpload[0],
                      back: res.data.data.multipleUpload[1],
                      side: res.data.data.multipleUpload[2],
                    },
                    product_video: videoResponse.data.data.singleUpload,
                  },
                }).then(
                  (res) => {
                    console.log("res:::", res);
                    toast.success(res.data.createProduct.message, {
                      theme: "colored",
                    });
                    setLoading(false);
                    handleProductListingModalClose();
                    setProductPageSkip(0);
                    getAllProducts();
                  },
                  (error) => {
                    setLoading(false);
                    toast.error(error.message, { theme: "colored" });
                  }
                );
              })
            : createProduct({
                productInfo: {
                  branch_id: data.product_branch,
                  category_id: data.product_category,
                  product_color: data.product_color,
                  product_description: data.product_description,
                  product_name: data.product_name,
                  product_type: data.product_type,
                  product_image: {
                    front: res.data.data.multipleUpload[0],
                    back: res.data.data.multipleUpload[1],
                    side: res.data.data.multipleUpload[2],
                  },
                },
              }).then(
                (res) => {
                  console.log("res:::", res);
                  toast.success(res.data.createProduct.message, {
                    theme: "colored",
                  });
                  setLoading(false);
                  handleProductListingModalClose();
                  setProductPageSkip(0);
                  getAllProducts();
                },
                (error) => {
                  setLoading(false);
                  toast.error(error.message, { theme: "colored" });
                }
              );
        });
      } else {
        console.log("nice11111");

        productAllMediaImages.map((img) =>
          deleteMedia({
            file: img,
            fileType: "image",
          }).then((res) => setProductAllMediaImages([]))
        );

        productAllMediaVideo !== undefined &&
          deleteMedia({
            file: productAllMediaVideo,
            fileType: "video",
          }).then((res) => setProductAllMediaVideo());

        MultipleImageUploadFile(uploadProductImages).then((res) => {
          uploadProductVideo !== undefined
            ? VideoUploadFile(uploadProductVideo).then((videoResponse) => {
                updateProduct({
                  id: editProductId,
                  productInfo: {
                    branch_id: data.product_branch,
                    category_id: data.product_category,
                    product_color: data.product_color,
                    product_description: data.product_description,
                    product_name: data.product_name,
                    product_type: data.product_type,
                    product_image: {
                      front: res.data.data.multipleUpload[0],
                      back: res.data.data.multipleUpload[1],
                      side: res.data.data.multipleUpload[2],
                    },
                    product_video: videoResponse.data.data.singleUpload,
                  },
                }).then(
                  (res) => {
                    console.log("res:::", res);
                    toast.success(res.data.updateProduct.message, {
                      theme: "colored",
                    });
                    setLoading(false);
                    handleProductListingModalClose();
                    setProductPageSkip(0);
                    getAllProducts();
                  },
                  (error) => {
                    setLoading(false);
                    toast.error(error.message, { theme: "colored" });
                  }
                );
              })
            : updateProduct({
                id: editProductId,
                productInfo: {
                  branch_id: data.product_branch,
                  category_id: data.product_category,
                  product_color: data.product_color,
                  product_description: data.product_description,
                  product_name: data.product_name,
                  product_type: data.product_type,
                  product_image: {
                    front: res.data.data.multipleUpload[0],
                    back: res.data.data.multipleUpload[1],
                    side: res.data.data.multipleUpload[2],
                  },
                },
              }).then(
                (res) => {
                  console.log("res:::", res);
                  toast.success(res.data.updateProduct.message, {
                    theme: "colored",
                  });
                  setLoading(false);
                  handleProductListingModalClose();
                  setProductPageSkip(0);
                  getAllProducts();
                },
                (error) => {
                  setLoading(false);
                  toast.error(error.message, { theme: "colored" });
                }
              );
        });
      }
    } else {
      setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
    }
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files && files.length > 3) {
      alert("You can only upload a maximum of 3 files");
      return false;
    }
    setProductImages([]);
    setUploadProductImages([]);
    files.forEach((file) => {
      setUploadProductImages((old) => [...old, file]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImages((old) => [...old, reader.result]);
      };
    });
  };

  const onProductVideoPreview = (e) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      setUploadProductVideo(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
      reader.addEventListener("load", (e) => {
        setProductVideo(reader.result);
      });
    }
  };

  async function srcToFile(src, fileName, mimeType) {
    const res = await fetch(src);
    const buf = await res.arrayBuffer();
    return new File([buf], fileName, { type: mimeType });
  }

  const handleProductListingModalClose = () => {
    setProductListingModalOpen(false);
    reset();
    setProductType();
    setProductImages([]);
    setUploadProductImages([]);
    setProductVideo();
    setUploadProductVideo();
    setEditProductId();
  };
  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <VendorShopSubHeader />
      <div className="bg-colorWhite pb-20 md:pb-28">
        <div className="bg-[#F5F5F5] overflow-visible p-10">
          <div className="container flex">
            <Image
              src={img}
              alt="shop logo"
              width={240}
              height={220}
              className="rounded-[50%] w-1/3"
              layout="fixed"
            />
            <Image
              src={img1}
              alt="shop logo"
              width={1400}
              height={280}
              className="z-0 rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2 sm:gap-4 container mt-8">
          <div className="lg:col-span-2 hidden lg:block ">
            <Filter
              productByShop={true}
              setProductPageSkip={setProductPageSkip}
            />
          </div>

          <div className="col-span-8 lg:col-span-6 flex flex-col">
            <div className="flex flex-row-reverse">
              <button
                onClick={() => setProductListingModalOpen(true)}
                className="bg-colorPrimary text-colorGrey text-lg p-2 px-6 rounded"
              >
                Add Products
              </button>
            </div>

            <div className="bg-[#F5F5F5] rounded-lg mt-5">
              <div className="container">
                <UpperFilter
                  setProductPageSkip={setProductPageSkip}
                  forShopPage={true}
                />

                {/* <p className="font-bold text-2xl text-colorBlack">
                  Special Products
                </p> */}
                <InfiniteScroll
                  className="!overflow-hidden p-0.5"
                  dataLength={productsData.length}
                  next={() => setProductPageSkip(productPageSkip + 6)}
                  hasMore={productsData.length < productsCount}
                  loader={
                    <div className="text-center">
                      <CircularProgress />
                    </div>
                  }
                >
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center mb-10">
                    {productsData &&
                      productsData?.map((product) => (
                        <ProductCard
                          product={product}
                          key={product.id}
                          shopProduct={true}
                          setProductPageSkip={setProductPageSkip}
                          getAllProducts={getAllProducts}
                          setEditProductId={setEditProductId}
                        />
                      ))}
                  </div>
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomAuthModal
        open={productListingModalOpen}
        onClose={handleProductListingModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="animate__animated animate__slideInDown"
      >
        <Box sx={style}>
          <div className="p-5">
            <div className="flex items-center mb-5">
              <ArrowBackIcon
                className="text-black cursor-pointer"
                onClick={handleProductListingModalClose}
              />
              <p className="flex items-center text-colorBlack text-xl ml-5 font-semibold">
                {editProductId === undefined ? "Add" : "Update"}Product
              </p>
              <CloseIcon
                className="text-black ml-auto cursor-pointer"
                onClick={handleProductListingModalClose}
              />
            </div>
            <form className="h-[500px] overflow-auto">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-center container gap-24">
                  <p className="mt-2 flex items-center text-colorBlack text-lg font-bold">
                    Name:
                  </p>
                  <div className="w-full">
                    <Box sx={{ display: "flex" }}>
                      <CustomTextField
                        id="input-with-sx"
                        label="Product Name"
                        variant="standard"
                        className="w-full"
                        {...register("product_name", {
                          required: "Product Name is required",
                        })}
                      />
                    </Box>
                    <div className="mt-2">
                      {errors.product_name && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.product_name?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center container gap-12">
                  <p className="mt-2 flex items-center text-colorBlack text-lg font-bold">
                    Description:
                  </p>
                  <div className="w-full">
                    <Box sx={{ display: "flex" }}>
                      <CustomTextField
                        id="input-with-sx"
                        label="Product Description"
                        variant="standard"
                        className="w-full"
                        {...register("product_description", {
                          required: "Product Description is required",
                        })}
                      />
                    </Box>
                    <div className="mt-2">
                      {errors.product_description && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.product_description?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center container gap-24">
                  <p className="mt-2 flex items-center text-colorBlack text-lg font-bold">
                    Color:
                  </p>
                  <div className="w-full">
                    <Box sx={{ display: "flex" }}>
                      <FormControl fullWidth>
                        <InputLabel
                          variant="standard"
                          htmlFor="uncontrolled-native"
                        >
                          Product Color
                        </InputLabel>
                        <NativeSelect
                          className="w-full"
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          {...register("product_color", {
                            required: "Product Color is required",
                          })}
                        >
                          <option value="">
                            <em></em>
                          </option>
                          {colorsList.map((color, index) => {
                            return (
                              <option value={color} key={index}>
                                {capitalize(color)}
                              </option>
                            );
                          })}
                        </NativeSelect>
                      </FormControl>
                    </Box>
                    <div className="mt-2">
                      {errors.product_color && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.product_color?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center container gap-24">
                  <p className="mt-2 flex items-center text-colorBlack text-lg font-bold">
                    Type:
                  </p>
                  <div className="w-full">
                    <Box sx={{ display: "flex" }}>
                      <FormControl fullWidth>
                        <InputLabel
                          variant="standard"
                          htmlFor="uncontrolled-native"
                        >
                          Product Type
                        </InputLabel>
                        <NativeSelect
                          className="w-full"
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={productType}
                          {...register("product_type", {
                            required: "product Type is required",
                            onChange: (e) => {
                              setProductType(e.target.value);
                            },
                          })}
                        >
                          <option value="">
                            <em></em>
                          </option>
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                        </NativeSelect>
                      </FormControl>
                    </Box>
                    <div className="mt-2">
                      {errors.product_type && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.product_type?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {productType && (
                  <div className="flex items-center justify-center container gap-16">
                    <p className="mt-2 flex items-center text-colorBlack text-lg font-bold">
                      Category:
                    </p>
                    <div className="w-full">
                      <Box sx={{ display: "flex" }}>
                        <FormControl fullWidth>
                          <InputLabel
                            variant="standard"
                            htmlFor="uncontrolled-native"
                          >
                            Product Category
                          </InputLabel>
                          <NativeSelect
                            className="w-full"
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            {...register("product_category", {
                              required: "product Category is required",
                            })}
                          >
                            <option value="">
                              <em></em>
                            </option>
                            {productType === "Men" &&
                              menCategoryLabel.map((cat) => (
                                <option value={cat.id} key={cat.id}>
                                  {cat.category_name}
                                </option>
                              ))}
                            {productType === "Women" &&
                              womenCategoryLabel.map((cat) => (
                                <option value={cat.id} key={cat.id}>
                                  {cat.category_name}
                                </option>
                              ))}
                          </NativeSelect>
                        </FormControl>
                      </Box>
                      <div className="mt-2">
                        {errors.product_category && (
                          <span style={{ color: "red" }} className="-mb-6">
                            {errors.product_category?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center container gap-20">
                  <p className="mt-2 flex items-center text-colorBlack text-lg font-bold">
                    Branch:
                  </p>
                  <div className="w-full">
                    <Box sx={{ display: "flex" }}>
                      <FormControl fullWidth>
                        <InputLabel
                          variant="standard"
                          htmlFor="uncontrolled-native"
                        >
                          Product Branch
                        </InputLabel>
                        <NativeSelect
                          className="w-full"
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          {...register("product_branch", {
                            required: "product Branch is required",
                          })}
                        >
                          <option value="">
                            <em></em>
                          </option>
                          {branchList.map((branch) => (
                            <option value={branch.id} key={branch.id}>
                              {branch.branch_address +
                                " " +
                                "(" +
                                branch.branch_type +
                                ")"}
                            </option>
                          ))}
                        </NativeSelect>
                      </FormControl>
                    </Box>
                    <div className="mt-2">
                      {errors.product_branch && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.product_branch?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="items-center flex-col w-full container">
                  <h4 className="font-bold mb-3 flex justify-center items-center">
                    Product Images
                  </h4>

                  <div className="flex justify-center flex-col items-center">
                    <div className="flex justify-center">
                      <Button
                        variant="contained"
                        component="label"
                        className="w-full !capitalize !bg-gray-500 !rounded-3xl"
                      >
                        Choose Product Images
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          {...register("productImages", {
                            required:
                              productImages.length === 0
                                ? "Product Image is required"
                                : false,
                            onChange: (e) => {
                              createProductImagesChange(e);
                            },
                          })}
                        />
                      </Button>
                    </div>
                    <div className="mt-2">
                      {errors.productImages && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.productImages?.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex  justify-center">
                    <div className="flex flex-col w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
                        {productImages.map((image, index) => (
                          <div key={index}>
                            <Image
                              src={image}
                              alt="Product Preview"
                              height={150}
                              width={200}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="items-center flex-col w-full container">
                  <h4 className="font-bold mb-3 flex justify-center items-center">
                    Product Video
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex justify-center flex-col items-center">
                      <div className="flex  justify-center">
                        <Button
                          variant="contained"
                          component="label"
                          className="w-full !capitalize !bg-gray-500 !rounded-3xl"
                        >
                          Choose Shop Video
                          <input
                            type="file"
                            id="productVideo"
                            name="productVideo"
                            accept="video/*"
                            hidden
                            controls
                            onChange={(e) => {
                              console.log("eee", e.target.files);
                              if (e.target.files && e.target.files.length > 0) {
                                onProductVideoPreview(e);
                              }
                            }}
                          />
                        </Button>
                      </div>
                    </div>
                    {productVideo !== undefined && (
                      <div className="flex  justify-center ">
                        <div className="flex flex-col w-full">
                          <div className="grid grid-cols-1 place-items-center">
                            <div>
                              <video
                                autoPlay
                                style={{ width: "300px", height: "200px" }}
                                controls
                                src={productVideo}
                              ></video>
                              <div
                                className="bg-gray-300 rounded-full flex justify-center items-center cursor-pointer"
                                style={{
                                  position: "relative",
                                  right: 10,
                                  bottom: 20,
                                  height: 30,
                                  width: 30,
                                  color: "#5cb85c",
                                }}
                              >
                                <CancelIcon
                                  style={{ color: "black" }}
                                  onClick={() => {
                                    setProductVideo();
                                    setUploadProductVideo();
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="container mt-5">
              <Divider />
            </div>
            <div className="container mt-5 flex items-center justify-end gap-5">
              <Button
                variant="outlined"
                className="rounded-xl capitalize text-colorBlack py-2 px-5"
                onClick={handleProductListingModalClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit, onError)}
                onReset={reset}
                variant="contained"
                className="rounded-xl capitalize text-colorWhite bg-colorPrimary hover:bg-colorPrimary py-2 px-5"
              >
                {loading && (
                  <CircularProgress
                    size={20}
                    color="primary"
                    sx={{ color: "white", mr: 1 }}
                  />
                )}
                {editProductId === undefined ? "Create" : "Update"}
              </Button>
            </div>
          </div>
        </Box>
      </CustomAuthModal>

      <AuthModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        authTypeModal={authTypeModal}
        setAuthTypeModal={setAuthTypeModal}
      />
    </>
  );
};
export default withAuth(ShopDetailsPage);
