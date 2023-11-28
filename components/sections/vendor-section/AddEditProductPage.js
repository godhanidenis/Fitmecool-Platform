import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TbPhotoPlus } from "react-icons/tb";
import { useForm } from "react-hook-form";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  createProduct,
  updateProduct,
} from "../../../graphql/mutations/products";
import { Alert, capitalize, CircularProgress, Divider } from "@mui/material";
import CustomTextFieldVendor from "../../core/CustomTextFieldVendor";
import dynamic from "next/dynamic";
import { colorsList } from "../../../constants";
import { fileDelete, fileUpdate, fileUpload } from "../../../services/wasabi";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Image from "next/image";
import { loadVendorShopDetailsStart } from "../../../redux/ducks/vendorShopDetails";
import { useRouter } from "next/router";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const AddEditProductPage = ({
  setAddEditProductShow,
  editableProductData,
  setEditableProductData,
  getAllProducts,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm();

  const [SelectImgIndex, setSelectImgIndex] = useState();
  const [productImages, setProductImages] = useState([]);
  const [uploadProductImages, setUploadProductImages] = useState([]);

  const ProductImgError = productImages?.filter((item) => item !== undefined);

  const dispatch = useDispatch();
  const [productVideo, setProductVideo] = useState("");
  const [uploadProductVideo, setUploadProductVideo] = useState();
  const [deleteProductVideo, setDeleteProductVideo] = useState();

  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState();

  const [menCategoryLabel, setMenCategoryLabel] = useState([]);
  const [womenCategoryLabel, setWomenCategoryLabel] = useState([]);
  const { categories } = useSelector((state) => state.categories);

  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const [isHydrated, setIsHydrated] = useState(false);
  const [editorDescriptionContent, setEditorDescriptionContent] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

  const [productPriceVisible, setProductPriceVisible] = useState(false);
  const [productListingType, setProductListingType] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const router = useRouter();

  const priceHandle = (e) => {
    const price = parseFloat(e.target.value);
    if (!isNaN(price)) {
      const discount = parseFloat(getValues("product_discount") || 0);
      const finalPrice = price - price * (discount / 100);
      setValue("product_final_price", Math.round(finalPrice));
    } else {
      setValue("product_final_price", null);
    }
  };

  const discountHandle = (e) => {
    const discount = parseFloat(e.target.value);
    const price = parseFloat(getValues("product_price") || 0);
    if (!isNaN(discount)) {
      const finalPrice = price - price * (discount / 100);
      setValue("product_final_price", Math.round(finalPrice));
    } else {
      setValue("product_final_price", price);
    }
  };

  const finalPriceHandle = (e) => {
    const finalPrice = parseFloat(e.target.value);
    if (!isNaN(finalPrice)) {
      const price = parseFloat(getValues("product_price") || 0);
      if (price !== 0) {
        const discount = ((price - finalPrice) / price) * 100;
        setValue("product_discount", discount.toFixed(2));
      }
    } else {
      setValue("product_discount", 0);
    }
  };

  const productListingTypeHandler = (event) => {
    setProductListingType(event.target.checked);
  };
  const productPriceVisibleHandler = (event) => {
    setProductPriceVisible(event.target.checked);
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    let resImgIndex = SelectImgIndex;

    let uploadProductImagesData = uploadProductImages;
    let ProductImagesData = productImages;

    uploadProductImagesData[resImgIndex] = files[0];
    setUploadProductImages(() => [...uploadProductImagesData]);

    files.forEach((file) => {
      ProductImagesData[resImgIndex] = URL.createObjectURL(file);
      setProductImages(() => [...ProductImagesData]);
    });
  };

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
    setDeleteProductVideo();
    setEditableProductData();
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (editableProductData) {
      const finalPrice =
        editableProductData?.product_price -
        editableProductData?.product_price *
          (editableProductData?.product_discount / 100);
      setValue("product_name", editableProductData?.product_name);
      setEditorDescriptionContent(editableProductData?.product_description);
      setValue("product_color", editableProductData?.product_color);
      setValue("product_price", Math.round(editableProductData?.product_price));
      setValue("product_discount", editableProductData?.product_discount);
      setValue("product_type", editableProductData.categoryInfo?.category_type);
      setProductType(editableProductData.categoryInfo?.category_type);
      setValue("product_category", editableProductData?.categoryInfo?.id);
      setValue("product_branch", editableProductData?.branchInfo?.id);
      setValue("product_final_price", finalPrice);
      setProductListingType(
        editableProductData?.product_listing_type === "rent" ? false : true
      );
      setProductPriceVisible(!editableProductData?.product_price_visible);
      editableProductData?.product_image?.front &&
        setProductImages((old) => [
          ...old,
          editableProductData?.product_image?.front,
        ]);
      editableProductData?.product_image?.back &&
        setProductImages((old) => [
          ...old,
          editableProductData?.product_image?.back,
        ]);
      editableProductData?.product_image?.side &&
        setProductImages((old) => [
          ...old,
          editableProductData?.product_image?.side,
        ]);

      editableProductData?.product_video &&
        setProductVideo(editableProductData?.product_video);
    }
  }, [editableProductData, setValue]);

  const onProductVideoPreview = (e) => {
    setUploadProductVideo(e.target.files[0]);
    setProductVideo(URL.createObjectURL(e.target.files[0]));
    setDeleteProductVideo();
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

  const multipleImageUploadFile = async (uploadProductImages) => {
    const uploadPromises = uploadProductImages.map((uploadProduct) => {
      return fileUpload(uploadProduct);
    });

    try {
      const uploadProductImgs = await Promise.all(uploadPromises);
      return uploadProductImgs;
    } catch (error) {
      console.error("Error during file upload:", error);
      return [];
    }
  };

  const updateProductKey = (index) => {
    const productImage = editableProductData?.product_image;

    if (productImage) {
      const keyMap = ["front", "back", "side"];
      return productImage[keyMap[index]];
    }
  };

  const deleteImageFiles = async (deletableProducts, type) => {
    try {
      const deletionPromises = deletableProducts.map((deleteProduct) =>
        fileDelete(deleteProduct, type)
      );
      await Promise.all(deletionPromises);
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  const onSubmit = async (data) => {
    if (isEditorEmpty()) {
      setErrorDescription("Product description is required");
    } else {
      setErrorDescription("");
      setLoading(true);
      if (editableProductData) {
        let imagesResponse = [];
        let videoResponse = null;

        if (deleteProductVideo) {
          await deleteImageFiles([deleteProductVideo], "video");
        }

        if (uploadProductImages.some((img) => img)) {
          const uploadPromises = uploadProductImages.map(
            (uploadProduct, index) => {
              if (uploadProduct) {
                return fileUpdate(
                  updateProductKey(index),
                  "image",
                  uploadProduct
                );
              }
            }
          );

          try {
            const updateProductImgs = await Promise.all(uploadPromises);

            imagesResponse = updateProductImgs;
          } catch (error) {
            console.error("Error during file upload:", error);
            return;
          }
        }

        if (uploadProductVideo) {
          if (editableProductData.product_video) {
            try {
              const productVideoRes = await fileUpdate(
                editableProductData.product_video,
                "video",
                uploadProductVideo
              );
              videoResponse = productVideoRes;
            } catch (error) {
              console.error("Error during file upload:", error);
              return;
            }
          } else {
            try {
              const productVideoRes = await fileUpload(uploadProductVideo);
              videoResponse = productVideoRes;
            } catch (error) {
              console.error("Error during file upload:", error);
              return;
            }
          }
        }

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
                imagesResponse[0] || editableProductData.product_image.front,
              back: imagesResponse[1] || editableProductData.product_image.back,
              side: imagesResponse[2] || editableProductData.product_image.side,
            },
            product_video:
              videoResponse ||
              (deleteProductVideo ? "" : editableProductData.product_video),
            product_price: Math.round(data.product_price),
            product_discount: Number(data.product_discount),
            product_price_visible: !productPriceVisible,
            product_listing_type: productListingType ? "sell" : "rent",
          },
        }).then(
          (res) => {
            console.log("res:::", res);
            toast.success(res.data.updateProduct.message, {
              theme: "colored",
            });
            setLoading(false);
            getAllProducts();
            handleProductListingModalClose();
            setAddEditProductShow(false);
          },
          (error) => {
            setLoading(false);
            toast.error(error.message, { theme: "colored" });
          }
        );
      } else {
        let productImagesRes = [];
        let productVideoRes = null;

        if (uploadProductImages) {
          await multipleImageUploadFile(uploadProductImages).then(
            (res) => (productImagesRes = res)
          );
        }
        if (uploadProductVideo) {
          await fileUpload(uploadProductVideo)
            .then((res) => (productVideoRes = res))
            .catch((error) => {
              console.error("Error during file upload:", error);
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
              front: productImagesRes[0],
              back: productImagesRes[1],
              side: productImagesRes[2],
            },
            product_video: productVideoRes || "",
            product_price: Math.round(data.product_price),
            product_discount: Number(data.product_discount),
            product_price_visible: !productPriceVisible,
            product_listing_type: productListingType ? "sell" : "rent",
          },
        }).then(
          (res) => {
            console.log("res:::", res);
            toast.success(res.data.createProduct.message, {
              theme: "colored",
            });
            setLoading(false);
            getAllProducts();
            dispatch(loadVendorShopDetailsStart(vendorShopDetails?.id));
            handleProductListingModalClose();
            setAddEditProductShow(false);
          },
          (error) => {
            setLoading(false);
            const targetElement = document.getElementById("AddProduct");
            if (targetElement) {
              const targetScrollPosition =
                targetElement.getBoundingClientRect().top;

              window.scrollTo({
                top: window.scrollY + targetScrollPosition,
                behavior: "smooth",
              });
            }
            setAlertMsg(error.message);
          }
        );
      }
    }
  };

  const handleInput = (e) => {
    const inputValue = e.target.value;

    let inputValue1 = e.target.value.replace(/[^\d-]/g, "");

    if (inputValue1.startsWith("-")) {
      inputValue1 = "-" + inputValue1.replace(/-/g, "");
    }

    e.target.value = inputValue1;

    if (inputValue < 0) {
      e.target.value = 0;
    }
    if (e.target.id === "pdiscount") {
      if (inputValue > 100) {
        e.target.value = 100;
      }
    }
    if (e.target.id === "pfprice") {
      const price = parseFloat(getValues("product_price"));
      if (inputValue > price) {
        e.target.value = price;
      }
    }
  };

  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  if (!isHydrated) {
    return null;
  }
  return (
    <div id="AddProduct" className="h-full overflow-scroll hideScroll">
      <div className="sm:p-0 sm:py-6 p-6">
        <div className="font-semibold text-black flex items-center gap-2 sm:mx-4">
          <span>
            <ArrowBackIcon
              sx={{
                fontSize: 30,
                "@media (max-width: 648px)": {
                  fontSize: 24,
                },
              }}
              className="cursor-pointer"
              onClick={() => {
                setAddEditProductShow(false);
                setEditableProductData();
              }}
            />
          </span>
          <span className="text-xl">
            {editableProductData ? "Update" : "Add"} Product
          </span>
        </div>
        {alertMsg && (
          <Alert severity={"error"} className="mt-5 sm:ml-6">
            {alertMsg}
            <span
              className="cursor-pointer underline font-bold ml-2"
              onClick={() => router.push("/vendor/shop-subscription/")}
            >
              Upgrade Your Plan
            </span>
          </Alert>
        )}
        <div className="my-5">
          <div className="text-base sm:text-lg font-semibold mb-3 mt-5 sm:mx-6 text-black ">
            Product
          </div>
          <div className="sm:flex justify-between">
            <div className={`sm:w-[50%] space-y-6 sm:mx-6`}>
              <div className="w-full flex gap-3 items-center ">
                <p className="text-lg font-medium font-Nova">Product Type*</p>
                <CustomSwitchComponent
                  onChange={productListingTypeHandler}
                  type={true}
                  value={productListingType}
                />
              </div>
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
              <div className="w-full relative sm:flex  sm:gap-5">
                <div className="sm:w-[50%]">
                  <CustomTextFieldVendor
                    label="Price*"
                    type="number"
                    id="pprice"
                    price={true}
                    isRequired={false}
                    placeholder="Product Price"
                    fieldValue={getValues("product_price")}
                    fieldError={errors?.product_price}
                    formValue={{
                      ...register("product_price", {
                        required: "Product Price is required",
                        onChange: priceHandle,
                      }),
                    }}
                    onInput={handleInput}
                  />
                  <div className="mt-2">
                    {errors.product_price && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {errors.product_price?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="sm:w-[50%] mt-5 sm:mt-0">
                  <CustomTextFieldVendor
                    label="Discount*"
                    type="number"
                    id="pdiscount"
                    discount={true}
                    isRequired={false}
                    placeholder="Product Discount "
                    fieldValue={getValues("product_discount")}
                    fieldError={errors?.product_discount}
                    formValue={{
                      ...register("product_discount", {
                        required: "Product Discount  is required",
                        onChange: discountHandle,
                      }),
                    }}
                    onInput={handleInput}
                  />
                  <div className="mt-2">
                    {errors.product_discount && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {errors.product_discount?.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full relative sm:flex  sm:gap-5">
                <div className="sm:w-[50%] ">
                  <CustomTextFieldVendor
                    label="Final Price*"
                    type="number"
                    id="pfprice"
                    price={true}
                    isRequired={false}
                    placeholder="Product Final Price"
                    fieldValue={getValues("product_final_price")}
                    fieldError={errors?.product_final_price}
                    formValue={{
                      ...register("product_final_price", {
                        required: "Product Final Price  is required",
                        onChange: finalPriceHandle,
                      }),
                    }}
                    onInput={handleInput}
                  />
                  <div className="mt-2">
                    {errors.product_final_price && (
                      <span style={{ color: "red" }} className="-mb-6">
                        {errors.product_final_price?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="sm:w-[50%] flex gap-3 items-center mt-5 sm:mt-0">
                  <p className="text-lg font-medium font-Nova">
                    Price Visibility*
                  </p>
                  <CustomSwitchComponent
                    onChange={productPriceVisibleHandler}
                    value={productPriceVisible}
                  />
                </div>
              </div>
              <div className="w-full relative">
                <CustomTextFieldVendor
                  label="Product Color*"
                  select
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                  fieldValue={getValues("product_color")}
                  fieldError={errors?.product_color}
                  formValue={{
                    ...register("product_color", {
                      required: "Product Color is required",
                    }),
                  }}
                >
                  <option value=""></option>
                  {colorsList?.map((color, index) => (
                    <option key={index} value={color}>
                      {capitalize(color)}
                    </option>
                  ))}
                </CustomTextFieldVendor>

                <div className="mt-2">
                  {errors.product_color && (
                    <span style={{ color: "red" }} className="-mb-6">
                      {errors.product_color?.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full relative">
                <CustomTextFieldVendor
                  label="Product Category*"
                  select
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                  fieldValue={getValues("product_type")}
                  fieldError={errors?.product_type}
                  formValue={{
                    ...register("product_type", {
                      required: "Product Category is required",
                      onChange: (e) => {
                        setProductType(e.target.value);
                      },
                    }),
                  }}
                >
                  <option value=""></option>
                  {["Men", "Women"].map((type, index) => (
                    <option key={index} value={type}>
                      {capitalize(type)}
                    </option>
                  ))}
                </CustomTextFieldVendor>

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
                  <CustomTextFieldVendor
                    label="Select Sub Category*"
                    select
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}
                    fieldValue={getValues("product_category")}
                    fieldError={errors?.product_category}
                    formValue={{
                      ...register("product_category", {
                        required: "Product Category is required",
                      }),
                    }}
                  >
                    <option value=""></option>
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
                  </CustomTextFieldVendor>

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
                <CustomTextFieldVendor
                  label="Select Branch*"
                  select
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                  fieldValue={getValues("product_branch")}
                  fieldError={errors?.product_branch}
                  formValue={{
                    ...register("product_branch", {
                      required: "Product Branch is required",
                    }),
                  }}
                >
                  <option value=""></option>
                  {vendorShopDetails?.branch_info?.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branch_address +
                        " " +
                        "(" +
                        branch.branch_type +
                        ")"}
                    </option>
                  ))}
                </CustomTextFieldVendor>

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
                  defaultStyle: "font-size: 18px;",
                }}
                setContents={editorDescriptionContent}
                onChange={handleEditorChange}
                height={productType ? "500px" : "420px"}
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
            <div className="text-base sm:text-lg font-semibold mt-6 mb-3 text-black ">
              Product Images*
              <span className="text-[#31333e66] ml-1">
                (Front, Back & Side)
              </span>
            </div>
            <div className="grid grid-cols-12 gap-6">
              {["One", "Two", "Three"]?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`${
                      index === 0 ? "col-start-2 lg:col-start-1" : "col-start-2"
                    } col-span-10 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-2 w-full cursor-pointer h-[300px] sm:h-[300px] border border-gray-200 hover:border-2 hover:border-colorGreen rounded-xl flex items-center justify-center`}
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
                      <div className="w-full relative h-full">
                        <Image
                          src={productImages[index] ?? ""}
                          alt="Uploaded Image"
                          className="!object-cover !h-full !w-full !rounded-xl !object-top"
                          layout="fill"
                          unoptimized={true}
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
                );
              })}
            </div>
            <div className="mt-2">
              {errors.productImages && (
                <span style={{ color: "red" }} className="-mb-6">
                  {errors.productImages?.message}
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-semibold mb-3 mt-6 text-black ">
              Upload Product Video{" "}
              <span className="text-[#31333e66]">( Optional )</span>
            </div>
            <div
              className="lg:w-[30%] mt-4 lg:mt-0 w-full cursor-pointer sm:h-[300px] h-[214px] border border-gray-200 hover:border-2 hover:border-colorGreen rounded-xl flex items-center justify-center"
              onClick={() => {
                productVideo == "" &&
                  document.getElementById("productVideoId").click();
              }}
            >
              {productVideo !== "" ? (
                <div className="w-full sm:h-[300px] relative h-[214px]">
                  <video
                    autoPlay
                    className="object-cover h-full w-full rounded-xl"
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
                      setDeleteProductVideo(editableProductData?.product_video);
                    }}
                    className="absolute right-4 top-[70px] border border-red-600 rounded-full p-2 bg-red-600"
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
        </div>
        <Divider className="!mt-5 !mb-5 sm:!mx-6" />
        <div className="flex justify-end sm:gap-4 gap-2 mb-8">
          <button
            className="bg-white rounded-[4px] sm:py-2 sm:px-4 sm:text-xl text-sm px-8 py-2 border"
            onClick={() => {
              setAddEditProductShow(false);
              setEditableProductData();
            }}
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
            {editableProductData ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProductPage;

const CustomSwitchComponent = ({ onChange, type, value }) => {
  return (
    <>
      <div className="flex justify-start items-center">
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={onChange}
              checked={value}
            />
            <span className="px-4 py-1 bg-colorGreen peer-checked:text-black peer-checked:bg-colorGrey text-white flex items-center">
              {type ? "Rent" : <VisibilityIcon />}
            </span>
            <span className="px-4 py-1 peer-checked:bg-colorGreen bg-colorGrey peer-checked:text-white text-black flex items-center">
              {type ? "Sell" : <VisibilityOffIcon />}
            </span>
          </label>
        </div>
      </div>
    </>
  );
};
