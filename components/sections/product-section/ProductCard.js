import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { productLikeToggle } from "../../../redux/ducks/userProfile";
import { deleteProduct, productLike } from "../../../graphql/mutations/products";
import AuthModal from "../../core/AuthModal";
import { AuthTypeModal } from "../../core/Enum";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomAuthModal } from "../../core/CustomMUIComponents";
import { Box, Button } from "@mui/material";
import Router from "next/router";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

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

const ProductCard = ({
  product,
  shopProduct,
  getAllProducts,
  setProductPageSkip,
  setEditProductId,
  viewMore,
  productDetails,
  onlyCarousal,
}) => {
  const [productLikeByUser, setProductLikeByUser] = useState(false);

  const [open, setOpen] = useState(false);
  const [authTypeModal, setAuthTypeModal] = useState();

  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState();

  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector((state) => state.productsFiltersReducer);

  const { themeLayout } = useSelector((state) => state.themeLayout);
  const { userProfile, isAuthenticate } = useSelector((state) => state.userProfile);

  useEffect(() => {
    if (!isAuthenticate) {
      setProductLikeByUser(false);
    }

    const likedProductByUser = userProfile?.product_like_list?.find((itm) => itm.id === product.id);

    likedProductByUser ? setProductLikeByUser(true) : setProductLikeByUser(false);
  }, [isAuthenticate, product.id, userProfile]);

  const items = [product.product_image.front, product.product_image.back, product.product_image.side].map((itm) => {
    return (
      <Image
        src={itm ?? ""}
        alt={product.name}
        width={250}
        height={productsFiltersReducer.productLayout === "list" ? 300 : 400}
        className="rounded object-cover"
        key={itm}
      />
    );
  });
  const shopId = product.branchInfo?.shop_id;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      {viewMore ? (
        <div
          style={{ position: "absolute", top: "190px" }}
          className="bg-[#FFFFFF] mx-4 shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-lg "
        >
          <Link href={`/shop/${productDetails.data.product.data.branchInfo?.shop_id}`}>
            <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
              <Button variant="outlined">View More</Button>
            </a>
          </Link>
        </div>
      ) : (
        <div
          className={`${
            productsFiltersReducer.productLayout === "list"
              ? "md:flex mb-3 bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-lg"
              : "bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-lg"
          }`}
        >
          <div
            className={`${
              !onlyCarousal && productsFiltersReducer.productLayout === "list" ? "w-[auto] md:border-r-2 border-b" : "border-b"
            }`}
          >
            <div className="container my-[5px] cursor-pointer product-parent-div">
              <div className="grid grid-cols-1 place-items-center">
                <div className="w-[100%]">
                  <Slider {...settings}>{items}</Slider>
                </div>
              </div>

              {shopProduct && (
                <button
                  className={`w-10 h-10 rounded-full transition-colors bg-[#f5f5f5] duration-300 hover:opacity-80  absolute top-0 left-0`}
                  onClick={() => {
                    setEditProductId(product.id);
                  }}
                >
                  <EditIcon />
                </button>
              )}
              {!shopProduct ? (
                <>
                  <button
                    className={`w-8 h-8 rounded-full transition-colors bg-[#f5f5f5] duration-300 hover:opacity-80  absolute top-0 right-0`}
                    onClick={() => {
                      if (isAuthenticate) {
                        productLike({
                          productInfo: {
                            product_id: product.id,
                            user_id: userProfile.id,
                          },
                        }).then(
                          (res) => {
                            dispatch(
                              !productLikeByUser
                                ? productLikeToggle({
                                    productInfo: {
                                      key: "like",
                                      value: res.data.productLike.data,
                                    },
                                  })
                                : productLikeToggle({
                                    productInfo: {
                                      key: "disLike",
                                      value: product.id,
                                    },
                                  })
                            );
                            toast.success(res.data.productLike.message, {
                              theme: "colored",
                            });
                          },
                          (error) => {
                            toast.error(error.message, { theme: "colored" });
                          }
                        );
                      } else {
                        if (themeLayout === "mobileScreen") {
                          Router.push("/auth/signin");
                        } else {
                          setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
                        }
                      }
                    }}
                  >
                    {!productLikeByUser ? <FavoriteBorderIcon fontSize="small" /> : "❤️"}
                  </button>
                  {onlyCarousal && (
                    <button
                      className={`w-10 h-10 rounded-full transition-colors bg-[#f5f5f5] duration-300 hover:opacity-80  absolute top-12 right-0`}
                    >
                      <FileUploadOutlinedIcon fontSize="small" />
                    </button>
                  )}
                </>
              ) : (
                <button
                  className={`w-10 h-10 rounded-full transition-colors bg-[#f5f5f5] duration-300 hover:opacity-80  absolute top-0 right-0`}
                  onClick={() => {
                    setProductDeleteModalOpen(true);
                    setDeleteProductId(product.id);
                  }}
                >
                  <DeleteIcon className="!text-red-600" />
                </button>
              )}
              {!onlyCarousal && productsFiltersReducer.productLayout === "grid" && (
                <>
                  <div className="product-overlay">
                    <Link href={`/product/${product.id}`}>
                      <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
                        <button className="text-colorWhite text-base px-4 py-2 w-full md:w-[60%] lg:w-full xl:w-[60%] bg-colorPrimary rounded-md detailButton whitespace-nowrap">
                          See Details
                        </button>
                      </a>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
          {!onlyCarousal && (
            <div className={`${productsFiltersReducer.productLayout === "list" ? "pl-3 md:w-[200%]" : "pl-3"}`}>
              {productsFiltersReducer.productLayout === "grid" && (
                <div>
                  <p
                    className="oneLineAfterThreeDots font-semibold text-[#565f66] text-base mt-2"
                    title={product.product_name}
                  >
                    {product.product_name}
                  </p>
                  {/* <p
                  className="text-[#888888] font-normal text-sm"
                  title={product.product_description}
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {product.product_description}
                </p> */}
                  {/* <p className="font-semibold text-colorBlack text-lg mt-2">
                  {product.categoryInfo?.category_name}
                </p>

                <p className="font-semibold text-colorBlack text-lg mt-2">
                  {product.product_color}
                </p> */}
                </div>
              )}
              <div className="flex gap-2 justify-start items-center mt-5 mb-2">
                <div className="flex justify-center items-center">
                  <Image
                    alt="Shop Logo"
                    src={product?.branchInfo?.shop_info?.shop_logo ?? ""}
                    width={productsFiltersReducer.productLayout === "list" ? 45 : 16}
                    height={productsFiltersReducer.productLayout === "list" ? 45 : 16}
                    className="rounded-[50%]"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <Link href={`/shop/${shopId}`}>
                    <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
                      <span
                        style={
                          productsFiltersReducer.productLayout === "list" ? { fontSize: "20px" } : { fontSize: "10px" }
                        }
                        className={`text-[#9d9d9d] font-semibold cursor-pointer hover:text-colorPrimary text-[10px] `}
                      >
                        {product.branchInfo?.shop_info?.shop_name}
                      </span>
                    </a>
                  </Link>
                </div>
              </div>
              {productsFiltersReducer.productLayout === "list" && (
                <>
                  <div className="mt-4">
                    <p
                      className="oneLineAfterThreeDots font-semibold text-[#565f66] text-base mt-2"
                      title={product.product_name}
                    >
                      {product.product_name}
                    </p>
                    <p
                      className="text-[#565f66] text-base mt-2"
                      title={product.product_description}
                    >
                      {product.product_description}
                    </p>
                    <Link href={`/product/${product.id}`}>
                      <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
                        <button className="text-colorWhite text-base px-4 py-2 my-2 md:mt-6 mr-2 md:w-1/2 w-[50%] xl:w-1/2 bg-colorPrimary rounded-md whitespace-nowrap">
                          See Details
                        </button>
                      </a>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
          <AuthModal
            open={open}
            handleClose={() => {
              setOpen(false);
            }}
            authTypeModal={authTypeModal}
            setAuthTypeModal={setAuthTypeModal}
          />

          <CustomAuthModal
            open={productDeleteModalOpen}
            onClose={() => setProductDeleteModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="animate__animated animate__slideInDown"
          >
            <Box sx={style} className="!w-[90%] lg:!w-1/2">
              <div className="p-5">
                <div className="flex items-center">
                  <p className="flex items-center text-colorBlack text-xl font-semibold">Confirmation Modal</p>
                </div>

                <div className="p-5 text-colorBlack text-lg font-normal">
                  Are you sure delete this Product <b>{deleteProductId}</b>.
                </div>

                <div className="container mt-5 flex items-center justify-end gap-5">
                  <Button
                    variant="outlined"
                    className="rounded-xl capitalize text-colorBlack py-2 px-5"
                    onClick={() => setProductDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    className="rounded-xl capitalize text-colorWhite bg-red-600 hover:bg-red-600 py-2 px-5"
                    onClick={() => {
                      if (isAuthenticate) {
                        deleteProduct({ id: deleteProductId }).then(
                          (res) => {
                            toast.success(res.data.deleteProduct, {
                              theme: "colored",
                            });
                            setProductPageSkip(0);
                            getAllProducts();
                          },
                          (error) => {
                            toast.error(error.message, { theme: "colored" });
                          }
                        );
                        setProductDeleteModalOpen(false);
                      } else {
                        if (themeLayout === "mobileScreen") {
                          Router.push("/auth/signin");
                        } else {
                          setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Box>
          </CustomAuthModal>
        </div>
      )}
    </>
  );
};

export default ProductCard;
