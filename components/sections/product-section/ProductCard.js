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
import { Box, Button, Tooltip, tooltipClasses } from "@mui/material";
import Router from "next/router";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { EmailShareButton, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { styled } from "@mui/material/styles";
import facebookIcon from "../../../assets/facebook.png";
import instagramIcon from "../../../assets/instagram.png";
import googleIcon from "../../../assets/googleIcon.svg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";

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
        width: "38px",
        height: "38px",
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
        width: "38px",
        height: "38px",
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
  viewMore,
  productDetails,
  onlyCarousal
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
        height={productsFiltersReducer.productLayout === "list" ? 300 : 300}
        className="rounded-t-xl object-cover"
        key={itm}
      />
    );
  });
  const shopId = product.branchInfo?.shop_id;

  // const settings = {
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  // };

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
      {viewMore ? (
        <div
          style={{ position: "absolute", top: "200px" }}
          className="bg-[#FFFFFF] mx-4 shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-lg "
        >
          <Link href={`/shop/${productDetails.data.product.data.branchInfo?.shop_id}`}>
            <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
              <Button variant="outlined">View More</Button>
            </a>
          </Link>
        </div>
      ) : (
        <div className={`${productsFiltersReducer.productLayout === "list" ? "md:flex " : ""}`}>
          <div
            className={`${
              !onlyCarousal && productsFiltersReducer.productLayout === "list" ? "w-[auto] md:border-r-2" : ""
            }`}
          >
            <div className="container my-[5px] cursor-pointer product-parent-div">
              <div className="grid grid-cols-1 place-items-center">
                <div className="w-[100%]">
                  <Carousel
                    infinite
                    responsive={responsive}
                    customLeftArrow={<TrendingCustomLeftArrow onClick={TrendingCustomLeftArrow} />}
                    customRightArrow={<TrendingCustomRightArrow onClick={TrendingCustomRightArrow} />}
                    dotListClass={"Landing_customDots"}
                  >
                    {items}
                  </Carousel>
                  {/* <Slider {...settings}>{items}</Slider> */}
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
                          if (themeLayout === "mobileScreen") {
                            Router.push("/auth/signin");
                          } else {
                            setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
                          }
                        }
                      }}
                    >
                      {!productLikeByUser ? <FavoriteBorderIcon fontSize="small" className="!text-white" /> : "❤️"}
                    </button>
                    {onlyCarousal && (
                      <>
                        <HtmlTooltip
                          title={
                            <React.Fragment>
                              <div className="">
                                <div className="p-2 rounded-lg cursor-pointer">
                                  <FacebookShareButton windowWidth={900} windowHeight={900} url={pageShareURL}>
                                    <Image src={facebookIcon ?? ""} alt="facebookIcon" />
                                  </FacebookShareButton>
                                </div>
                                <div className="p-2 rounded-lg cursor-pointer">
                                  <WhatsappShareButton windowWidth={900} windowHeight={900} url={pageShareURL}>
                                    {/* <Image src={instagramIcon ?? "" } alt="instagramIcon" /> */}
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
                                    <Image src={googleIcon ?? ""} alt="googleIcon" />
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
                            <FileUploadOutlinedIcon fontSize="small" />
                          </button>
                        </HtmlTooltip>
                        <button
                          className={`w-10 h-10 rounded-full transition-colors bg-[#15182730] duration-300`}
                          style={{
                            backdropFilter: "blur(20px)",
                          }}
                        >
                          <ReportGmailerrorredOutlinedIcon className="!text-[rgba(21, 24, 39, 0.4)]" />
                        </button>
                      </>
                    )}
                  </div>
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
                        <button className="text-colorWhite text-base px-4 py-2 w-full md:w-[70%] lg:w-full xl:w-[70%] bg-colorPrimary rounded-t-[16px] detailButton whitespace-nowrap">
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
                    <p className="text-[#565f66] text-base mt-2" title={product.product_description}>
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
