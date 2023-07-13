import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TbPhotoPlus } from "react-icons/tb";
import { Controller, useForm } from "react-hook-form";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

import VendorShopSubHeader from "../../Layout/VendorShopSubHeader";
import { MultipleImageUploadFile } from "../../../services/MultipleImageUploadFile";
import { getBranchLists } from "../../../graphql/queries/branchListsQueries";
import {
  createProduct,
  updateProduct,
} from "../../../graphql/mutations/products";
import { VideoUploadFile } from "../../../services/VideoUploadFile";
import { deleteMedia } from "../../../graphql/mutations/deleteMedia";

import {
  capitalize,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  styled,
} from "@mui/material";
import { getProductDetails } from "../../../graphql/queries/productQueries";
import CustomTextFieldVendor from "../../Layout/CustomTextFieldVendor";
// import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import dynamic from "next/dynamic";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const NativeSelectInput = styled(Select)(({ theme }) => ({
  "& .MuiInputBase-input": {
    // Custom styles for the select input
    color: "#1518278F",
    marginLeft: 10,
  },
}));

const AddEditProductPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    control,
  } = useForm();

  const [SelectImgIndex, setSelectImgIndex] = useState();
  const [productImages, setProductImages] = useState([]);
  const [uploadProductImages, setUploadProductImages] = useState([]);
  const ProductImgError = productImages?.filter((item) => item !== undefined);
  const [productVideo, setProductVideo] = useState("");
  const [uploadProductVideo, setUploadProductVideo] = useState();
  const [loading, setLoading] = useState(false);
  const [editProductId, setEditProductId] = useState();
  const [productType, setProductType] = useState();
  const [branchList, setBranchList] = useState([]);
  const [menCategoryLabel, setMenCategoryLabel] = useState([]);
  const [womenCategoryLabel, setWomenCategoryLabel] = useState([]);
  const router = useRouter();
  const { id, id1 } = router.query;
  const { categories } = useSelector((state) => state.categories);
  const [productAllMediaImages, setProductAllMediaImages] = useState([]);
  const [productAllMediaVideo, setProductAllMediaVideo] = useState();
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

  const onError = (errors) => console.log("Errors Occurred !! :", errors);
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const [isHydrated, setIsHydrated] = useState(false);

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    let resImgIndex = SelectImgIndex;

    let uploadProductImagesData = uploadProductImages;
    let ProductImagesData = productImages;

    uploadProductImagesData[resImgIndex] = files[0];
    setUploadProductImages(() => [...uploadProductImagesData]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        ProductImagesData[resImgIndex] = reader.result;
        setProductImages(() => [...ProductImagesData]);
      };
    });
  };

  useEffect(() => {
    if (id1) {
      setEditProductId(id1);
    }
  }, [id1]);

  useEffect(() => {
    setMenCategoryLabel(
      categories.filter((itm) => itm.category_type === "Men").map((i) => i)
    );
    setWomenCategoryLabel(
      categories.filter((itm) => itm.category_type === "Women").map((i) => i)
    );
  }, [categories]);

  const handleProductListingModalClose = () => {
    reset();
    setProductType();
    setProductImages([]);
    setUploadProductImages([]);
    setProductVideo();
    setUploadProductVideo();
    setEditProductId();
  };
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    getBranchLists().then((res) => {
      const branches = res.data.branchList.filter(
        (branch) => branch.shop_id === id
      );

      setBranchList(branches);
    });
  }, [id]);

  async function srcToFile(src, fileName, mimeType) {
    const res = await fetch(src, {
      mode: "no-cors",
    });
    const buf = await res.arrayBuffer();
    return new File([buf], fileName, { type: mimeType });
  }

  useEffect(() => {
    if (editProductId !== undefined) {
      getProductDetails({ id: editProductId }).then((res) => {
        console.log("res:::", res.data.product.data);

        setValue("product_name", res?.data?.product?.data?.product_name);
        setValue(
          "product_description",
          res?.data?.product?.data?.product_description
        );
        setValue("product_color", res?.data?.product.data?.product_color);
        setValue("product_type", res?.data?.product?.data?.product_type);
        setProductType(res?.data?.product?.data.product_type);
        setValue(
          "product_category",
          res?.data?.product?.data?.categoryInfo?.id
        );
        setValue("product_branch", res?.data?.product?.data?.branchInfo?.id);

        res?.data?.product?.data?.product_image?.front &&
          srcToFile(
            res?.data?.product?.data?.product_image?.front,
            "profile.png",
            "image/png"
          ).then(function (file) {
            setUploadProductImages((old) => [...old, file]);
          });
        res?.data?.product?.data?.product_image?.back &&
          srcToFile(
            res?.data?.product?.data?.product_image?.back,
            "profile.png",
            "image/png"
          ).then(function (file) {
            setUploadProductImages((old) => [...old, file]);
          });
        res?.data?.product?.data?.product_image?.side &&
          srcToFile(
            res?.data?.product?.data?.product_image?.side,
            "profile.png",
            "image/png"
          ).then(function (file) {
            setUploadProductImages((old) => [...old, file]);
          });

        res?.data?.product?.data?.product_image?.front &&
          setProductImages((old) => [
            ...old,
            res?.data?.product?.data?.product_image?.front,
          ]);
        res?.data?.product?.data?.product_image?.back &&
          setProductImages((old) => [
            ...old,
            res?.data?.product?.data?.product_image?.back,
          ]);
        res?.data?.product?.data?.product_image?.side &&
          setProductImages((old) => [
            ...old,
            res?.data?.product?.data?.product_image?.side,
          ]);

        res?.data?.product?.data?.product_image?.front &&
          setProductAllMediaImages((old) => [
            ...old,
            res?.data?.product?.data?.product_image?.front,
          ]);
        res?.data?.product?.data?.product_image?.back &&
          setProductAllMediaImages((old) => [
            ...old,
            res?.data?.product?.data?.product_image?.back,
          ]);
        res?.data?.product?.data?.product_image?.side &&
          setProductAllMediaImages((old) => [
            ...old,
            res?.data?.product?.data?.product_image?.side,
          ]);

        res?.data?.product?.data?.product_video &&
          srcToFile(
            res?.data?.product?.data?.product_video,
            "profile.mp4",
            "video"
          ).then(function (file) {
            setUploadProductVideo(file);
          });

        res?.data?.product?.data?.product_video &&
          setProductVideo(res?.data?.product?.data?.product_video);

        res?.data?.product?.data?.product_video &&
          setProductAllMediaVideo(res?.data?.product?.data?.product_video);
      });
    }
  }, [editProductId, setValue]);

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

  const onSubmit = (data) => {
    setLoading(true);
    if (editProductId === undefined) {
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
                  router.push(`/vendor/shop/${vendorShopDetails?.id}/`);
                  // setProductPageSkip(0);
                  // getAllProducts();
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
                router.push(`/vendor/shop/${vendorShopDetails?.id}/`);
                // setProductPageSkip(0);
                // getAllProducts();
              },
              (error) => {
                setLoading(false);
                toast.error(error.message, { theme: "colored" });
              }
            );
      });
    } else {
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
                  router.push(`/vendor/shop/${vendorShopDetails?.id}/`);
                  // setProductPageSkip(0);
                  // getAllProducts();
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
                router.push(`/vendor/shop/${vendorShopDetails?.id}/`);
                // setProductPageSkip(0);
                // getAllProducts();
              },
              (error) => {
                setLoading(false);
                toast.error(error.message, { theme: "colored" });
              }
            );
      });
    }
  };
  if (!isHydrated) {
    return null;
  }
  return (
    <div>
      <VendorShopSubHeader />
      <div className="container sm:p-0 sm:py-10 p-6">
        <div className="font-semibold text-black flex items-center gap-2">
          <span>
            <ArrowBackIcon
              sx={{
                fontSize: 30,
                "@media (max-width: 648px)": {
                  fontSize: 24,
                },
              }}
              className="cursor-pointer"
              onClick={() =>
                router.push(`/vendor/shop/${vendorShopDetails?.id}/`)
              }
            />
          </span>
          <span className="sm:text-2xl text-xl">
            {" "}
            {editProductId === undefined ? "Add" : "Update"} Product
          </span>
        </div>
        <div className="sm:flex justify-between">
          <div className={`sm:w-[50%] space-y-10 my-10 sm:mx-5`}>
            <div className="w-full relative">
              <CustomTextFieldVendor
                label="Name"
                type="text"
                id="pname"
                isRequired={false}
                placeholder="Product Name"
                fieldValue={getValues("product_name")}
                fieldError={errors?.product_name}
                formValue={{
                  ...register("product_name", {
                    required: "Product Name is required",
                  }),
                }}
              />
              <div className="mt-2">
                {errors.product_name && (
                  <span style={{ color: "red" }} className="-mb-6">
                    {errors.product_name?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full relative">
              <CustomTextFieldVendor
                label="Description"
                type="text"
                id="pdescription"
                isRequired={false}
                placeholder="Product Description"
                fieldValue={getValues("product_description")}
                fieldError={errors?.product_description}
                formValue={{
                  ...register("product_description", {
                    required: "Product Description is required",
                  }),
                }}
              />
              <div className="mt-2">
                {errors.product_description && (
                  <span style={{ color: "red" }} className="-mb-6">
                    {errors.product_description?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full relative">
              <FormControl fullWidth>
                <Controller
                  name="product_color"
                  control={control}
                  defaultValue="" // Set the initial value here
                  render={({ field }) => (
                    <>
                      <InputLabel id="color-id">Product Color</InputLabel>
                      <NativeSelectInput
                        {...field}
                        native
                        labelId="color-id"
                        id=""
                        label="Product Color"
                        {...register("product_color", {
                          required: "Product Color is required",
                        })}
                      >
                        <option value="">
                          <em></em>
                        </option>
                        {colorsList?.map((color, index) => {
                          return (
                            <option key={index} value={color}>
                              {" "}
                              {capitalize(color)}
                            </option>
                          );
                        })}
                      </NativeSelectInput>
                    </>
                  )}
                />
              </FormControl>

              <div className="mt-2">
                {errors.product_color && (
                  <span style={{ color: "red" }} className="-mb-6">
                    {errors.product_color?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full relative">
              <FormControl fullWidth>
                <Controller
                  name="product_type"
                  control={control}
                  defaultValue="" // Set the initial value here
                  render={({ field }) => (
                    <>
                      <InputLabel id="product-Type-id">product Type</InputLabel>
                      <NativeSelectInput
                        {...field}
                        native
                        labelId="product-Type-id"
                        id=""
                        label="product Type"
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
                        {["Men", "Women"].map((type, index) => {
                          return (
                            <option key={index} value={type}>
                              {" "}
                              {capitalize(type)}
                            </option>
                          );
                        })}
                      </NativeSelectInput>
                    </>
                  )}
                />
              </FormControl>

              <div className="mt-2">
                {errors.product_type && (
                  <span style={{ color: "red" }} className="-mb-6">
                    {errors.product_type?.message}
                  </span>
                )}
              </div>
            </div>
            {productType && (
              <div className="w-full relative">
                <FormControl fullWidth>
                  <Controller
                    name="product_category"
                    control={control}
                    defaultValue="" // Set the initial value here
                    render={({ field }) => (
                      <>
                        <InputLabel id="Category-id">Category</InputLabel>
                        <NativeSelectInput
                          {...field}
                          native
                          labelId="Category-id"
                          id=""
                          label="Category"
                          {...register("product_category", {
                            required: "product Category is required",
                          })}
                        >
                          <option value="">
                            <em></em>
                          </option>
                          {productType === "Men" &&
                            menCategoryLabel.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.category_name}
                              </option>
                            ))}
                          {productType === "Women" &&
                            womenCategoryLabel.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.category_name}
                              </option>
                            ))}
                        </NativeSelectInput>
                      </>
                    )}
                  />
                </FormControl>

                <div className="mt-2">
                  {errors.product_category && (
                    <span style={{ color: "red" }} className="-mb-6">
                      {errors.product_category?.message}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="w-full relative">
              <FormControl fullWidth>
                <Controller
                  name="product_branch"
                  control={control}
                  defaultValue="" // Set the initial value here
                  render={({ field }) => (
                    <>
                      <InputLabel id="Branch-id">Branch</InputLabel>
                      <NativeSelectInput
                        {...field}
                        native
                        labelId="Branch-id"
                        id=""
                        label="Branch"
                        {...register("product_branch", {
                          required: "product Branch is required",
                        })}
                      >
                        <option value="">
                          <em></em>
                        </option>
                        {branchList.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.branch_address +
                              " " +
                              "(" +
                              branch.branch_type +
                              ")"}
                          </option>
                        ))}
                      </NativeSelectInput>
                    </>
                  )}
                />
              </FormControl>
              <div className="mt-2">
                {errors.product_branch && (
                  <span style={{ color: "red" }} className="-mb-6">
                    {errors.product_branch?.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="sm:w-[50%] my-10">
            <SunEditor height="370px" />
          </div>
        </div>
        <div className="gap-10 my-10 sm:ml-5">
          <div className="sm:text-xl text-sm  font-semibold  mb-5 mx-2 text-black ">
            Product Images And Video
          </div>
          <div className="w-full lg:flex gap-8">
            <div className="lg:w-[65%] w-full flex lg:gap-8 lg:flex-row flex-col gap-4">
              {["One", "Two", "Three"]?.map((item, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="w-full sm:w-2/3  cursor-pointer  sm:h-[344px] h-[344px] border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center"
                      onClick={() => {
                        productImages[index] === undefined
                          ? (setSelectImgIndex(index),
                            document
                              .getElementById(`productImage${item}`)
                              .click())
                          : "";
                      }}
                    >
                      {productImages[index] ? (
                        <div className="w-full relative sm:h-[344px]  h-[344px]">
                          <img
                            src={productImages[index] ?? ""}
                            alt="Uploaded Image"
                            className="object-cover h-full w-full rounded-3xl"
                          />
                          <span className="absolute right-4 top-4 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white z-50">
                            <EditIcon
                              sx={{
                                "@media (max-width: 768px)": {
                                  fontSize: 16,
                                },
                              }}
                              onClick={() => {
                                setSelectImgIndex(index),
                                  document
                                    .getElementById(`productImage${item}`)
                                    .click();
                              }}
                            />
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 px-3 py-3">
                          <span className="flex justify-center">
                            <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                          </span>
                          <div className="flex flex-col gap-1">
                            <p className="sm:text-lg text-sm font-bold text-gray-400">
                              <span className="text-colorGreen">
                                Click to Upload{" "}
                              </span>
                              Front Image
                            </p>
                            <p className="text-xs text-gray-400 text-center">
                              We Support JPG, PNG & No Size Limit
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        id={`productImage${item}`}
                        name="productImages"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register("productImages", {
                          required: !ProductImgError[index]
                            ? "Product All Image is required"
                            : false,
                          onChange: (e) => {
                            createProductImagesChange(e);
                          },
                        })}
                      />
                    </div>
                  </>
                );
              })}
            </div>

            <div
              className="lg:w-[35%] mt-4 lg:mt-0 w-full cursor-pointer  sm:h-[350px] h-[214px]  border border-gray-200 hover:border-4 hover:border-colorGreen rounded-3xl flex items-center justify-center"
              onClick={() => {
                productVideo == "" &&
                  document.getElementById("productVideoId").click();
              }}
            >
              {productVideo !== "" ? (
                <div className="w-full sm:h-[350px] relative  h-[214px]">
                  <video
                    autoPlay
                    className="object-cover h-full w-full rounded-3xl"
                    controls
                    src={productVideo}
                  ></video>
                  <span className="absolute right-4 top-4 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white">
                    <EditIcon
                      onClick={() => {
                        document.getElementById("productVideoId").click();
                      }}
                      sx={{
                        "@media (max-width: 768px)": {
                          fontSize: 16,
                        },
                      }}
                    />
                  </span>
                  <span
                    onClick={() => {
                      setProductVideo("");
                      setUploadProductVideo("");
                    }}
                    className="absolute right-4 top-[70px] border border-[#D63848] rounded-full p-2 bg-[#D63848]"
                  >
                    <DeleteIcon style={{ color: "white" }} />
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-4 px-3">
                  <span className="flex justify-center">
                    <TbPhotoPlus className="w-14 h-14 text-gray-400 hover:text-colorGreen" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="sm:text-2xl text-sm font-bold text-gray-400">
                      <span className="text-colorGreen">Click to Upload</span>{" "}
                      Shop Video
                    </p>
                    <p className="sm:text-sm text-xs text-gray-400 text-center">
                      No Size Limit
                    </p>
                  </div>
                </div>
              )}
              <input
                type="file"
                id="productVideoId"
                name="productVideo"
                accept="video/*"
                hidden
                controls
                onClick={(e) => (e.target.value = null)}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onProductVideoPreview(e);
                  }
                }}
              />
            </div>
          </div>
          <div className="mt-2">
            {errors.productImages && (
              <span style={{ color: "red" }} className="-mb-6">
                {errors.productImages?.message}
              </span>
            )}
          </div>
          {/* <div className="w-full">
            <div className="sm:text-xl text-sm font-semibold  mb-5 mx-2 text-black ">
              Product Video
            </div>
          </div> */}
        </div>
        <div className="flex justify-end sm:gap-4 gap-2 mt-16">
          <button
            className="bg-white rounded-[4px] sm:py-3 sm:px-12 font-semibold sm:text-xl text-sm px-8 py-2 border"
            onClick={() =>
              router.push(`/vendor/shop/${vendorShopDetails?.id}/`)
            }
          >
            Cancel
          </button>
          <button
            className="sm:py-3 sm:px-12 bg-colorGreen sm:rounded-md text-white sm:text-xl rounded-[4px] text-sm px-8 py-2"
            type="submit"
            onClick={handleSubmit(onSubmit, onError)}
            onReset={reset}
          >
            {loading && (
              <CircularProgress
                size={20}
                color="primary"
                sx={{ color: "white", mr: 1 }}
              />
            )}
            {editProductId === undefined ? "Submit" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProductPage;
