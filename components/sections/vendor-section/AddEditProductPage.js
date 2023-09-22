/* eslint-disable @next/next/no-img-element */
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
  Divider,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getProductDetails } from "../../../graphql/queries/productQueries";
import CustomTextFieldVendor from "../../core/CustomTextFieldVendor";
import "suneditor/dist/css/suneditor.min.css";
import { NativeSelectInput } from "../../core/CustomMUIComponents";
import dynamic from "next/dynamic";
import { colorsList } from "../../../constants";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

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

  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const [isHydrated, setIsHydrated] = useState(false);
  const [editorDescriptionContent, setEditorDescriptionContent] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

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
        setEditorDescriptionContent(
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

  const handleEditorChange = (content) => {
    setEditorDescriptionContent(content);

    const trimmedContent = content.trim();
    if (trimmedContent === "" || trimmedContent === "<p><br></p>") {
      setErrorDescription("Product description is required");
    } else {
      setErrorDescription("");
    }
  };

  const isEditorEmpty = () => {
    const trimmedContent = editorDescriptionContent.trim();
    return trimmedContent === "" || trimmedContent === "<p><br></p>";
  };

  const onSubmit = (data) => {
    if (isEditorEmpty()) {
      setErrorDescription("Product description is required");
    } else {
      setErrorDescription("");
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
                    product_description: editorDescriptionContent,
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
                  product_description: editorDescriptionContent,
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
                    product_description: editorDescriptionContent,
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
                  product_description: editorDescriptionContent,
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
                },
                (error) => {
                  setLoading(false);
                  toast.error(error.message, { theme: "colored" });
                }
              );
        });
      }
    }
  };

  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  if (!isHydrated) {
    return null;
  }
  return (
    <div>
      <div className="container sm:p-0 sm:py-6 p-6">
        <div className="font-semibold text-black flex items-center gap-2 mx-2">
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
          <span className="text-xl">
            {" "}
            {editProductId === undefined ? "Add" : "Update"} Product
          </span>
        </div>
        <div className="my-5 mt-8">
          <div className="sm:text-lg text-sm font-semibold  mb-3 mt-5 sm:mx-6 text-black ">
            Product Details
          </div>
          <div className="sm:flex justify-between">
            <div className={`sm:w-[50%] space-y-6 sm:mx-6`}>
              <div className="w-full relative">
                <CustomTextFieldVendor
                  label="Name*"
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
                <FormControl fullWidth>
                  <Controller
                    name="product_color"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabel id="color-id">Product Color*</InputLabel>
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
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabel id="product-Type-id">
                          Product Type*
                        </InputLabel>
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
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabel id="Category-id">
                            Select Category*
                          </InputLabel>
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
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabel id="Branch-id">Select Branch*</InputLabel>
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
            <div className="sm:w-[50%]">
              <p className="text-lg font-medium pb-2 -mt-1 font-Nova">
                Description*
              </p>
              <SunEditor
                setOptions={{
                  buttonList: [
                    ["undo", "redo"],
                    ["bold", "underline", "italic"],
                  ],
                }}
                setContents={editorDescriptionContent}
                onChange={handleEditorChange}
                height={productType ? "280px" : "200px"}
              />
              <div className="mt-2">
                {errorDescription && (
                  <span style={{ color: "red" }} className="-mb-6">
                    {errorDescription}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sm:mx-6">
          <div>
            <div className="sm:text-lg text-sm font-semibold mt-6 mb-3 text-black ">
              Upload Product Images*
              <span className="text-[#31333e66] ml-1">
                (Front, Back & Side)
              </span>
            </div>
            <div className="w-full lg:flex gap-8">
              <div className="lg:w-[60%] w-full flex lg:gap-8 lg:flex-row flex-col gap-4">
                {["One", "Two", "Three"]?.map((item, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="w-full sm:w-2/3  cursor-pointer  sm:h-[320px] h-[320px] border border-gray-200 hover:border-2 hover:border-colorGreen rounded-xl flex items-center justify-center"
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
                          <div className="w-full relative sm:h-[320px]  h-[320px]">
                            <img
                              src={productImages[index] ?? ""}
                              alt="Uploaded Image"
                              className="object-cover h-full w-full rounded-xl"
                            />
                            <span className="absolute right-4 top-4 border border-black rounded-full lg:p-2 px-2 py-1 bg-black text-white z-50 w-8 h-8 flex justify-center items-center">
                              <EditIcon
                                sx={{
                                  fontSize: 18,
                                  "@media (max-width: 648px)": {
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
                              <p className="sm:text-base  font-semibold text-sm text-gray-400 text-center">
                                <span className="text-colorGreen">
                                  Click to Upload{" "}
                                </span>
                                {item === "One"
                                  ? "Front Image"
                                  : item === "Two"
                                  ? "Back Image"
                                  : "Side Image"}
                              </p>
                              <p className="sm:text-sm text-xs text-gray-400 text-center">
                                We Support JPG & PNG
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
            </div>
          </div>
          <div>
            <div className="sm:text-lg text-sm font-semibold mb-3 mt-6 text-black ">
              Upload Product Video{" "}
              <span className="text-[#31333e66]">( Optional )</span>
            </div>
            <div
              className="lg:w-[30%] mt-4 lg:mt-0 w-full cursor-pointer  sm:h-[300px] h-[214px]  border border-gray-200 hover:border-2 hover:border-colorGreen rounded-xl flex items-center justify-center"
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
                    <p className="sm:text-base font-semibold text-sm text-gray-400">
                      <span className="text-colorGreen">Click to Upload</span>{" "}
                      Product Video
                    </p>
                    <p className="sm:text-sm text-xs text-gray-400 text-center">
                      We Support .mp3
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
        </div>
        <Divider className="mt-5 mb-5 sm:mx-6" />
        <div className="flex justify-end sm:gap-4 gap-2 mb-8">
          <button
            className="bg-white rounded-[4px] sm:py-2 sm:px-4 font-semibold sm:text-xl text-sm px-8 py-2 border"
            onClick={() =>
              router.push(`/vendor/shop/${vendorShopDetails?.id}/`)
            }
          >
            Cancel
          </button>
          <button
            className="sm:py-2 sm:px-4 bg-colorGreen sm:rounded-md text-white sm:text-xl rounded-[4px] text-sm px-8 py-2 flex items-center"
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
