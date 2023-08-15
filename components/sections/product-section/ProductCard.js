import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { productLikeToggle } from "../../../redux/ducks/userProfile";
import {
  deleteProduct,
  productLike,
} from "../../../graphql/mutations/products";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomAuthModal } from "../../core/CustomMUIComponents";
import { Box, Button, Tooltip, tooltipClasses } from "@mui/material";
import Router, { useRouter } from "next/router";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { styled } from "@mui/material/styles";
import facebookIcon from "../../../assets/facebook.png";
import googleIcon from "../../../assets/googleIcon.svg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import HTMLReactParser from "html-react-parser";

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

const TrendingCustomLeftArrow = ({ onClick }) => {
  return (
    <div
      style={{
        background: "black",
        color: "white",
        left: 0,
        position: "absolute",
        cursor: "pointer",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        marginLeft: "16px",
        marginBottom: "25%",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => onClick()}
    >
      <i
        style={{
          border: "solid",
          width: "10px",
          height: "10px",
          borderWidth: "0px 2px 2px 0px",
          display: "inline-block",
          transform: "rotate(135deg)",
          cursor: "pointer",
          position: "relative",
          right: "-2px",
        }}
      />
    </div>
  );
};

const TrendingCustomRightArrow = ({ onClick }) => {
  return (
    <div
      style={{
        background: "black",
        color: "white",
        right: 0,
        position: "absolute",
        cursor: "pointer",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        marginRight: "16px",
        marginBottom: "25%",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => onClick()}
    >
      <i
        style={{
          border: "solid",
          width: "10px",
          height: "10px",
          borderWidth: "0px 2px 2px 0px",
          display: "inline-block",
          transform: "rotate(-45deg)",
          cursor: "pointer",
          position: "relative",
          left: "-2px",
        }}
      />
    </div>
  );
};

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const ProductCard = ({
  product,
  shopProduct,
  getAllProducts,
  setProductPageSkip,
  setEditProductId,
  onlyCarousal,
}) => {
  const [productLikeByUser, setProductLikeByUser] = useState(false);

  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState();
  const router = useRouter();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const dispatch = useDispatch();
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );

  const { themeLayout } = useSelector((state) => state.themeLayout);
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );

  console.log("vendorShopDetails", vendorShopDetails);

  useEffect(() => {
    if (!isAuthenticate) {
      setProductLikeByUser(false);
    }

    const likedProductByUser = userProfile?.product_like_list?.find(
      (itm) => itm.id === product.id
    );

    likedProductByUser
      ? setProductLikeByUser(true)
      : setProductLikeByUser(false);
  }, [isAuthenticate, product.id, userProfile]);

  const items = [
    product.product_image.front,
    product.product_image.back,
    product.product_image.side,
  ].map((itm) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        style={{
          width: "100%",
          height: onlyCarousal
            ? 400
            : productsFiltersReducer.productLayout === "list"
            ? themeLayout === "mobileScreen"
              ? 250
              : 300
            : themeLayout === "mobileScreen"
            ? 250
            : 300,
        }}
        src={itm ?? ""}
        alt={product.name}
        className={`${onlyCarousal ? "" : "rounded-t-xl"} object-cover`}
        key={itm}
      />
    );
  });
  const shopId = product.branchInfo?.shop_id;

  const [OpenToolTip, setOpenToolTip] = useState(false);
  const pageShareURL = window.location.href;

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip open={OpenToolTip} {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#ffffff",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      boxShadow: "0 0 10px rgba(0,0,0,.1)",
    },
  }));

  const handleTooltipOpen = () => {
    setOpenToolTip(!OpenToolTip);
  };

  return (
    <>
      <div
        className={`shadow-xl ${
          productsFiltersReducer.productLayout === "list"
            ? "md:flex "
            : "flex flex-col"
        }`}
      >
        <div
          className={`${
            !onlyCarousal && productsFiltersReducer.productLayout === "list"
              ? "w-full"
              : ""
          }`}
        >
          <div className="cursor-pointer product-parent-div">
            <div className="grid grid-cols-1 place-items-center">
              <div className="w-[100%]">
                <Carousel
                  infinite
                  arrows={onlyCarousal ? false : true}
                  removeArrowOnDeviceType={["mobile"]}
                  responsive={responsive}
                  customLeftArrow={
                    <TrendingCustomLeftArrow
                      onClick={TrendingCustomLeftArrow}
                    />
                  }
                  customRightArrow={
                    <TrendingCustomRightArrow
                      onClick={TrendingCustomRightArrow}
                    />
                  }
                  dotListClass={"Landing_customDots"}
                >
                  {items}
                </Carousel>
              </div>
            </div>

            {shopProduct && (
              <button
                className={`sm:w-10 sm:h-10 w-8 h-8 rounded-full transition-colors bg-black text-white duration-300 hover:opacity-80  absolute sm:top-[70px] top-16 right-4`}
                onClick={() => {
                  console.log(
                    "object",
                    product.id,
                    "{vendorShopDetails?.id",
                    vendorShopDetails?.id
                  );
                  // setEditProductId(product.id);
                  router.push(
                    `/vendor/shop/${vendorShopDetails?.id}/addEditProduct/${product.id}`
                  );
                }}
              >
                <EditIcon
                  sx={{
                    fontSize: 20,
                    "@media (max-width: 648px)": {
                      fontSize: 16,
                    },
                  }}
                />
              </button>
            )}
            {!shopProduct ? (
              <>
                <div className="flex flex-col absolute top-0 right-[16px]">
                  <button
                    className={`w-10 h-10 rounded-full transition-colors bg-[#15182730] duration-300 my-[14px]`}
                    style={{
                      backdropFilter: "blur(20px)",
                    }}
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
                        Router.push("/auth/user-type");
                      }
                    }}
                  >
                    {!productLikeByUser ? (
                      <FavoriteBorderIcon className="!text-white" />
                    ) : (
                      "❤️"
                    )}
                  </button>
                  {onlyCarousal && (
                    <>
                      <HtmlTooltip
                        title={
                          <React.Fragment>
                            <div className="">
                              <div className="p-2 rounded-lg cursor-pointer">
                                <FacebookShareButton
                                  windowWidth={900}
                                  windowHeight={900}
                                  url={pageShareURL}
                                >
                                  <Image
                                    src={facebookIcon ?? ""}
                                    alt="facebookIcon"
                                  />
                                </FacebookShareButton>
                              </div>
                              <div className="p-2 rounded-lg cursor-pointer">
                                <WhatsappShareButton
                                  windowWidth={900}
                                  windowHeight={900}
                                  url={pageShareURL}
                                >
                                  <WhatsappIcon size={25} round={true} />
                                </WhatsappShareButton>
                              </div>
                              <div className="p-2 mt-[2px] rounded-lg cursor-pointer">
                                <EmailShareButton
                                  subject="Product Detail Page"
                                  windowWidth={900}
                                  windowHeight={900}
                                  url={pageShareURL}
                                >
                                  <Image
                                    src={googleIcon ?? ""}
                                    alt="googleIcon"
                                  />
                                </EmailShareButton>
                              </div>
                            </div>
                          </React.Fragment>
                        }
                      >
                        <button
                          onClick={handleTooltipOpen}
                          className={`w-10 h-10 rounded-full transition-colors bg-[#15182730] duration-300 mb-[16px]`}
                          style={{
                            backdropFilter: "blur(20px)",
                          }}
                        >
                          <FileUploadOutlinedIcon className="!text-white" />
                        </button>
                      </HtmlTooltip>
                      <button
                        className={`w-10 h-10 rounded-full transition-colors bg-[#15182730] duration-300`}
                        style={{
                          backdropFilter: "blur(20px)",
                        }}
                      >
                        <ReportGmailerrorredOutlinedIcon className="!text-white" />
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                className={`sm:w-10 sm:h-10 w-8 h-8 rounded-full transition-colors bg-[#D63848] duration-300 hover:opacity-80  absolute top-4 right-4`}
                onClick={() => {
                  setProductDeleteModalOpen(true);
                  setDeleteProductId(product.id);
                }}
              >
                <DeleteIcon
                  className="!text-white"
                  sx={{
                    fontSize: 20,
                    "@media (max-width: 648px)": {
                      fontSize: 16,
                    },
                  }}
                />
              </button>
            )}

            {!onlyCarousal &&
              productsFiltersReducer.productLayout === "grid" && (
                <>
                  <div className="product-overlay">
                    <Link href={`/product/${product.id}`}>
                      <a
                        target={`${
                          themeLayout === "webScreen" ? "_blank" : "_self"
                        }`}
                      >
                        <button className="text-colorWhite sm:text-base text-[10px] px-5 sm:py-2 py-1 w-[80%] bg-colorPrimary rounded-t-[16px] detailButton whitespace-nowrap">
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
          <div
            className={`${
              productsFiltersReducer.productLayout === "list"
                ? "pl-3 md:w-[200%] bg-[#FFFFFF]"
                : "pl-3 bg-[#FFFFFF]"
            }`}
          >
            {productsFiltersReducer.productLayout === "grid" && (
              <div>
                <Link href={`/product/${product.id}`} passHref>
                  <a
                    target={`${
                      themeLayout === "webScreen" ? "_blank" : "_self"
                    }`}
                    rel="noopener noreferrer"
                  >
                    <span className="oneLineAfterThreeDots font-semibold text-black text-base mt-4">
                      {product.product_name}
                    </span>
                  </a>
                </Link>
              </div>
            )}
            <div className="flex gap-2 justify-start items-center sm:mt-3 mt-2 mb-2">
              <div className="flex justify-center items-center">
                <div
                  className={`relative ${
                    productsFiltersReducer.productLayout === "list"
                      ? "w-11 h-11"
                      : "sm:w-6 sm:h-6 w-4 h-4"
                  }`}
                >
                  <Image
                    alt="shop_logo_img"
                    src={product?.branchInfo?.shop_info?.shop_logo ?? ""}
                    layout="fill"
                    className="rounded-[50%]"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Link href={`/shop/${shopId}`} passHref>
                  <a
                    target={`${
                      themeLayout === "webScreen" ? "_blank" : "_self"
                    }`}
                    rel="noopener noreferrer"
                  >
                    <span
                      className={`text-[#9d9d9d] font-semibold cursor-pointer hover:text-colorPrimary  ${
                        productsFiltersReducer.productLayout === "list"
                          ? "text-xl"
                          : "text-xs sm:text-sm"
                      }`}
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
                  <Link href={`/product/${product.id}`} passHref>
                    <a
                      target={`${
                        themeLayout === "webScreen" ? "_blank" : "_self"
                      }`}
                      rel="noopener noreferrer"
                    >
                      <span className="oneLineAfterThreeDots font-semibold text-[#565f66] text-base mt-2">
                        {product.product_name}
                      </span>
                    </a>
                  </Link>

                  <span className="text-[#565f66] text-base mt-2">
                    {HTMLReactParser(product.product_description)}
                  </span>
                  <Link href={`/product/${product.id}`} passHref>
                    <a
                      target={`${
                        themeLayout === "webScreen" ? "_blank" : "_self"
                      }`}
                      rel="noopener noreferrer"
                    >
                      <button className="hidden sm:display text-colorWhite text-base px-4 py-2 my-2 md:mt-6 mr-2 md:w-1/2 w-[50%] xl:w-1/2 bg-colorPrimary rounded-md whitespace-nowrap">
                        See Details
                      </button>
                    </a>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

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
                <p className="flex items-center text-colorBlack text-xl font-semibold">
                  Confirmation Modal
                </p>
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
                      Router.push("/auth/user-type");
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
    </>
  );
};

export default ProductCard;
