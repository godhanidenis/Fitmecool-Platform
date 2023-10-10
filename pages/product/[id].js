/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import Image from "next/image";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Rating,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { getProductDetails } from "../../graphql/queries/productQueries";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ProductCard from "../../components/sections/product-section/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { shopFollow } from "../../graphql/mutations/shops";
import { toast } from "react-toastify";
import {
  productLikeToggle,
  shopFollowToggle,
} from "../../redux/ducks/userProfile";
import {
  productContactInquiry,
  productLike,
  productWhatsappInquiry,
} from "../../graphql/mutations/products";
import Link from "next/link";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import CustomReactImageMagnify from "../../components/Layout/CustomReactImageMagnify";
import { withoutAuth } from "../../components/core/PrivateRouteForVendor";
import Router from "next/router";
import { loadCategoriesStart } from "../../redux/ducks/categories";
import { loadAreaListsStart } from "../../redux/ducks/areaLists";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import { screeResizeForViewMoreItems } from "../../components/core/useScreenResize";
import ImageLoadingSkeleton from "../../components/Modal/ImageLoadingSkeleton";
import { assets } from "../../constants";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

const ContactStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

const ProductDetail = ({ productDetails }) => {
  const [shopFollowByUser, setShopFollowByUser] = useState(false);
  const [productLikeByUser, setProductLikeByUser] = useState(false);
  const [isShopImages, setIsShopImages] = useState(false);
  const [isProductImage, setIsProductImage] = useState("");

  const [isHydrated, setIsHydrated] = useState(false);

  const [OpenToolTip, setOpenToolTip] = useState(false);

  const [readMore, setReadMore] = useState(false);

  const [photos, setPhotos] = useState([]);

  const pageShareURL = window.location.href;

  const dispatch = useDispatch();
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );

  const { themeLayout } = useSelector((state) => state.themeLayout);

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

  const productDescription =
    productDetails.data.product.data?.product_description;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticate) {
      setShopFollowByUser(false);
      setProductLikeByUser(false);
    }

    const followedShopsByUser = userProfile.shop_follower_list?.find(
      (itm) =>
        itm.shop_id === productDetails.data.product.data.branchInfo?.shop_id
    );

    followedShopsByUser
      ? setShopFollowByUser(true)
      : setShopFollowByUser(false);

    const likedProductByUser = userProfile.product_like_list?.find(
      (itm) => itm.id === productDetails.data.product.data.id
    );

    likedProductByUser
      ? setProductLikeByUser(true)
      : setProductLikeByUser(false);
  }, [
    isAuthenticate,
    productDetails.data.product.data.branchInfo?.shop_id,
    productDetails.data.product.data.id,
    userProfile,
  ]);

  useEffect(() => {
    dispatch(loadCategoriesStart());
    dispatch(loadAreaListsStart());
  }, [dispatch]);

  const [openContactInfo, setOpenContactInfo] = useState(false);
  const [images, setImages] = useState();

  const handleCloseContactInfo = () => setOpenContactInfo(false);

  useEffect(() => {
    // Initialize the photos array with initial values
    const initialPhotos = [
      {
        src: productDetails.data.product.data.product_image?.front,
        type: "image",
      },
      {
        src: productDetails.data.product.data.product_image?.back,
        type: "image",
      },
      {
        src: productDetails.data.product.data.product_image?.side,
        type: "image",
      },
    ];

    if (productDetails.data.product.data.product_video) {
      // If there's a video, add it to the initialPhotos array
      initialPhotos.push({
        src: productDetails.data.product.data.product_video,
        type: "video",
      });
    }

    // Set the initial photos state
    setPhotos(initialPhotos);
  }, [
    productDetails.data.product.data.product_image,
    productDetails.data.product.data.product_video,
  ]);

  useEffect(() => {
    if (photos?.length > 0) setImages(photos[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos?.length]);

  const selectImage = (img) => {
    setImages(img);
  };

  const productImages = photos?.map((itm, i) => {
    return (
      <div
        className="mx-auto mb-[24px] relative"
        onMouseEnter={() => selectImage(itm)}
        key={i}
        onClick={() => selectImage(itm)}
      >
        {itm ? (
          isProductImage === itm && isShopImages ? (
            <div
              className="w-[129px] h-[146px] cursor-pointer rounded-[16px] bg-[#00000031]"
              style={{ border: images === itm ? "2px solid #29977E" : 0 }}
            />
          ) : (
            <>
              {itm?.type === "image" && (
                <img
                  src={itm?.src}
                  alt="Product Images"
                  style={{
                    border: images?.src === itm?.src ? "2px solid #29977E" : 0,
                  }}
                  className="rounded-[16px] object-cover cursor-pointer w-[130px] h-[150px]"
                  onError={() => {
                    setIsShopImages(true);
                    setIsProductImage(itm);
                  }}
                />
              )}
              {itm?.type === "video" && (
                <div className="relative w-[130px] h-[150px]">
                  <video
                    src={itm?.src}
                    alt="Product Video"
                    style={{
                      border:
                        images?.src === itm?.src ? "2px solid #29977E" : 0,
                    }}
                    className="rounded-[16px] object-cover cursor-pointer w-full h-full"
                    onError={() => {
                      setIsShopImages(true);
                      setIsProductImage(itm);
                    }}
                  />
                  <PlayCircleIcon className="!absolute !top-2 !right-2 !text-colorPrimary" />
                </div>
              )}
            </>
          )
        ) : (
          <ImageLoadingSkeleton className="rounded-[16px] !w-[130px] !h-[150px]" />
        )}
      </div>
    );
  });

  const isScreenWide = screeResizeForViewMoreItems();

  const handleProductLike = () => {
    if (isAuthenticate) {
      productLike({
        productInfo: {
          product_id: productDetails.data.product.data.id,
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
                    value: productDetails.data.product.data.id,
                  },
                })
          );
          toast.success(res.data.productLike.message, {
            theme: "colored",
          });
        },
        (error) => {
          toast.error(error.message, {
            theme: "colored",
          });
        }
      );
    } else {
      Router.push("/auth/user-type");
    }
  };

  const shopDetailHeader = () => (
    <div className="flex items-center bg-colorPrimary p-3">
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex justify-start items-center gap-1 sm:gap-4">
          <div className="flex justify-center items-center">
            <Link
              href={`/shop/${productDetails.data.product.data.branchInfo?.shop_id}`}
            >
              {productDetails.data.product.data.branchInfo?.shop_info
                .shop_logo ? (
                <Avatar
                  alt="Shop Logo"
                  className="!w-12 !h-12 !cursor-pointer"
                  src={
                    productDetails.data.product.data.branchInfo?.shop_info
                      .shop_logo ?? ""
                  }
                />
              ) : (
                <ImageLoadingSkeleton
                  variant="circular"
                  className="!w-12 !h-12"
                  sx={{
                    backgroundColor: "#F3F6F6",
                  }}
                />
              )}
            </Link>
          </div>
          <div className="flex flex-col justify-center">
            <Link
              href={`/shop/${productDetails.data.product.data.branchInfo?.shop_id}`}
            >
              <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
                <p className="line-clamp-1 text-white text-sm sm:text-base font-semibold cursor-pointer hover:text-colorGreen">
                  {
                    productDetails.data.product.data.branchInfo?.shop_info
                      .shop_name
                  }
                </p>
              </a>
            </Link>
            <p className="text-[#888888] text-xs sm:text-sm font-normal">
              25 days ago
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <Rating
            name="text-feedback"
            value={Math.round(
              productDetails.data.product.data.branchInfo?.shop_info.shop_rating
            )}
            readOnly
            emptyIcon={<StarIcon fontSize="small" sx={{ fontSize: "6px" }} />}
          />
          <div className="text-[#878A99] font-normal text-[13px] flex items-center">
            <div className="flex items-center">
              <LocationOnIcon fontSize="small" className="!mr-1" />
              <span className="line-clamp-1">
                {productDetails.data.product.data.branchInfo?.branch_address}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center md:justify-end">
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              color: "white",
              border: "1px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              height: "36px",
              fontSize: "14px",
              fontWeight: 400,
              borderRadius: "8px",
            }}
            onClick={() => {
              if (isAuthenticate) {
                shopFollow({
                  shopInfo: {
                    shop_id:
                      productDetails.data.product.data.branchInfo?.shop_id,
                    user_id: userProfile.id,
                  },
                }).then(
                  (res) => {
                    dispatch(
                      !shopFollowByUser
                        ? shopFollowToggle({
                            shopInfo: {
                              key: "follow",
                              value: res.data.shopFollower.data,
                            },
                          })
                        : shopFollowToggle({
                            shopInfo: {
                              key: "unFollow",
                              value:
                                productDetails.data.product.data.branchInfo
                                  ?.shop_id,
                            },
                          })
                    );
                    toast.success(res.data.shopFollower.message, {
                      theme: "colored",
                    });
                  },
                  (error) => {
                    toast.error(error.message, {
                      theme: "colored",
                    });
                  }
                );
              } else {
                Router.push("/auth/user-type");
              }
            }}
          >
            {shopFollowByUser ? (
              "Unfollow"
            ) : (
              <>
                <div className="flex items-center justify-center">
                  <AddIcon className="text-white" fontSize="small" />
                  <div className="text-white">Follow</div>
                </div>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="bg-colorWhite font-Nova container">
        <div className="py-2 sm:py-4 !w-[100%] pl-[14px] sm:pl-[10px]   ">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="#">
              <div className="text-colorGreen font-semibold">Product</div>
            </Link>
            <Link underline="hover" color="inherit" href="#">
              <div className="text-colorGreen font-semibold">
                {productDetails.data.product.data.categoryInfo?.category_type}
              </div>
            </Link>
            <Link
              underline="hover"
              color="text.primary"
              href="#"
              aria-current="page"
            >
              <div className="font-semibold">
                {productDetails.data.product.data.categoryInfo?.category_name}
              </div>
            </Link>
          </Breadcrumbs>
        </div>
      </div>

      <Box className="lg:!hidden font-Nova">{shopDetailHeader()}</Box>
      <div className="sm:hidden font-Nova">
        {productDetails && (
          <ProductCard
            product={productDetails?.data?.product?.data}
            onlyCarousal={true}
          />
        )}
      </div>

      <div className="bg-[#FAFCFC] font-Nova">
        <div className="container">
          <div className="!w-[100%] ">
            <div className="grid grid-cols-2 p-2 gap-8">
              <div className="col-span-2 lg:col-span-1 hidden sm:flex">
                <div className="grid grid-cols-4 w-full h-full">
                  <div className="col-span-1">
                    <div className="p-2 pt-0">{productImages}</div>
                  </div>
                  <div className="col-span-3">
                    <div className="border-2 flex justify-center items-center bg-colorWhite h-[700px] rounded-2xl">
                      <CustomReactImageMagnify
                        large={images}
                        preview={images}
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between mt-4">
                      <div className="w-[30%]">
                        <Button
                          variant="outlined"
                          sx={{
                            textTransform: "none",
                            width: "100%",
                            color:
                              !productLikeByUser && "rgba(21, 24, 39, 0.4)",
                            border: "1px solid rgba(21, 24, 39, 0.4)",
                            borderRadius: "10px",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            fontWeight: 600,
                            fontSize: "18px",
                          }}
                          onClick={handleProductLike}
                        >
                          {!productLikeByUser ? (
                            <FavoriteBorderIcon className="!text-[rgba(21, 24, 39, 0.4)]" />
                          ) : (
                            "❤️"
                          )}
                          &nbsp; Like
                        </Button>
                      </div>
                      <div
                        className="w-[30%]"
                        onMouseLeave={() => setOpenToolTip(false)}
                      >
                        <HtmlTooltip
                          title={
                            <React.Fragment>
                              <div className="flex">
                                <div className="p-2 rounded-lg cursor-pointer">
                                  <FacebookShareButton
                                    windowWidth={900}
                                    windowHeight={900}
                                    url={pageShareURL}
                                  >
                                    <Image
                                      src={assets.facebookIcon}
                                      width={25}
                                      height={25}
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
                                      src={assets.googleIcon}
                                      width={25}
                                      height={25}
                                      alt="googleIcon"
                                    />
                                  </EmailShareButton>
                                </div>
                              </div>
                            </React.Fragment>
                          }
                        >
                          <Button
                            onClick={() => setOpenToolTip(!OpenToolTip)}
                            variant="outlined"
                            sx={{
                              textTransform: "none",
                              width: "100%",
                              color: "rgba(21, 24, 39, 0.4)",
                              border: "1px solid rgba(21, 24, 39, 0.4)",
                              borderRadius: "10px",
                              paddingTop: "12px",
                              paddingBottom: "12px",
                              fontWeight: 600,
                              fontSize: "18px",
                            }}
                          >
                            <Image
                              src={assets.shareIcon}
                              width={24}
                              height={24}
                              alt="shareIcon"
                            />
                            &nbsp; Share
                          </Button>
                        </HtmlTooltip>
                      </div>
                      <div className="w-[30%]">
                        <Button
                          variant="outlined"
                          sx={{
                            textTransform: "none",
                            width: "100%",
                            color: "#f34747",
                            border: "1px solid #f34747",
                            borderRadius: "10px",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            fontWeight: 600,
                            fontSize: "18px",
                          }}
                        >
                          <ReportGmailerrorredOutlinedIcon className="!text-[#f34747]" />
                          &nbsp;Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Box className="!hidden lg:!block">{shopDetailHeader()}</Box>
                <div className="mt-5">
                  <div className="flex justify-between border-b border-['rgba(0, 0, 0, 0.1)'] pb-[24px]">
                    <span className="font-semibold text-[30px] text-colorGreen leading-9">
                      {productDetails.data.product.data.product_name}
                    </span>
                    <button
                      className={`w-10 h-10 rounded-full transition-colors bg-[#ffffff] duration-300`}
                      onClick={handleProductLike}
                    >
                      {!productLikeByUser ? (
                        <FavoriteBorderIcon
                          fontSize="large"
                          className="text-[#151827]"
                        />
                      ) : (
                        "❤️"
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-[#151827] font-semibold text-[22px] mb-[5px]">
                    About
                  </div>
                  <div
                    className={`${
                      readMore ? "h-[250px] overflow-scroll" : " "
                    } border-b border-['rgba(0, 0, 0, 0.1)'] pb-[24px] `}
                  >
                    <div className="font-normal text-lg text-[#888888] leading-6">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: readMore
                            ? productDescription
                            : productDescription.slice(0, 250) +
                              (productDescription.length > 250 ? "..." : " "),
                        }}
                      />
                      {productDescription.length > 250 && (
                        <span
                          onClick={() => setReadMore(!readMore)}
                          className="cursor-pointer text-colorBlack"
                        >
                          {readMore ? "read less" : "read more"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="font-semibold text-[22px] text-colorBlack ">
                      Item Details
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm">Category :</span>
                      <span className="text-sm font-semibold mr-2 text-colorBlack ml-[9px]">
                        {
                          productDetails.data.product.data.categoryInfo
                            ?.category_name
                        }
                      </span>
                    </div>
                    <div className="flex mt-1 items-center">
                      <span className="text-sm">Color :</span>
                      <span
                        className={`rounded-[50%] w-3 h-3 ml-[9px]`}
                        style={{
                          backgroundColor:
                            productDetails.data.product.data.product_color,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-0 mt-10 items-center justify-between">
                  <div
                    className="w-[100%] md:w-[48%]"
                    onClick={() =>
                      productWhatsappInquiry({
                        id: productDetails.data.product.data.id,
                      })
                    }
                  >
                    <a
                      href={`https://api.whatsapp.com/send?phone=${
                        productDetails.data.product.data.branchInfo
                          ?.manager_contact
                      }&text=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      className="w-full"
                      rel="noreferrer"
                    >
                      <button
                        className="bg-colorGreen text-white text-[24px] py-[28px] w-full rounded-xl tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline 
                  shadow-lg flex items-center justify-center gap-3"
                      >
                        <WhatsAppIcon className="!text-white !w-[35px] !h-[35px]" />
                        Send Message
                      </button>
                    </a>
                  </div>

                  <div
                    className="w-[100%] md:w-[48%]"
                    onClick={() =>
                      productContactInquiry({
                        id: productDetails.data.product.data.id,
                      })
                    }
                  >
                    <button
                      className="bg-[#E8EBEA] text-[#31333E] text-[24px] py-[28px] w-full rounded-xl tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline 
                  shadow-lg flex items-center justify-center gap-3"
                      onClick={() => setOpenContactInfo(!openContactInfo)}
                    >
                      <PersonOutlineIcon className="!text-black !w-[35px] !h-[35px]" />
                      {openContactInfo ? "Hide Contact" : "Show Contact"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-8 pt-4 mt-4 sm:px-[80px] px-[10px] bg-[#E8EBEA] text-[#31333E]">
          <div className="flex items-center justify-between">
            <p className="text-colorBlack font-semibold text-2xl flex items-center">
              Similar Products
            </p>

            {productDetails.data.product.related &&
              productDetails.data.product.related.length >
                (isScreenWide ? 5 : 4) && (
                <div className="underline text-[#29977E] font-semibold text-[16px] sm:text-[18px] flex items-center">
                  <Link
                    href={`/shop/${productDetails.data.product.data.branchInfo?.shop_id}`}
                  >
                    <a
                      target={`${
                        themeLayout === "webScreen" ? "_blank" : "_self"
                      }`}
                    >
                      View More
                    </a>
                  </Link>
                </div>
              )}
          </div>

          <div
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
              isScreenWide ? "xl:grid-cols-5" : "xl:grid-cols-4"
            } gap-4 sm:gap-8 place-items-center mt-4`}
          >
            {productDetails.data.product.related &&
              productDetails.data.product.related
                .slice(0, isScreenWide ? 5 : 4)
                ?.map((product, index) => (
                  <div className="" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </div>

      <ContactDetailsModal
        productDetails={productDetails}
        openContactInfo={openContactInfo}
        handleCloseContactInfo={handleCloseContactInfo}
      />
    </>
  );
};

export default withoutAuth(ProductDetail);

const ContactDetailsModal = ({
  productDetails,
  openContactInfo,
  handleCloseContactInfo,
}) => {
  const manager_name =
    productDetails.data.product.data.branchInfo?.manager_name;

  return (
    <Modal
      open={openContactInfo}
      onClose={handleCloseContactInfo}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={ContactStyle}>
        <div className="flex justify-center items-center">
          <div className="bg-colorWhite rounded-lg container">
            <div className="p-5 flex flex-col sm:flex-row gap-6 justify-start">
              <div className="flex justify-center items-center">
                <Avatar
                  className="!w-16 !h-16"
                  src={
                    productDetails.data.product.data.branchInfo?.shop_info
                      ?.shop_logo ?? ""
                  }
                  alt="Shop Logo"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#000000] text-base font-semibold cursor-pointer text-center sm:text-start">
                  {
                    productDetails.data.product.data.branchInfo?.shop_info
                      ?.shop_name
                  }
                </p>
                <p className="text-[#888888] text-sm font-normal text-center sm:text-start">
                  {productDetails.data.product.data.branchInfo?.branch_address}
                </p>
              </div>
            </div>
            <Divider />
            <div className="p-5 flex flex-col sm:flex-row gap-4 justify-start">
              <div className="flex justify-center items-center">
                <Avatar className="!w-16 !h-16 bg-colorGreen">
                  {manager_name
                    .split(" ")
                    .slice(0, 2)
                    .map((user) => user.charAt(0).toUpperCase())}
                </Avatar>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#000000] text-base font-semibold cursor-pointer text-center sm:text-start">
                  {manager_name}
                </p>
                <p className="text-colorBlack text-sm font-normal flex justify-center sm:justify-end">
                  - Manager
                </p>

                <p className="flex justify-center sm:justify-start sm:text-start mt-1 text-[#000000] text-base font-semibold cursor-pointer">
                  {productDetails.data.product.data.branchInfo?.manager_contact}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export async function getServerSideProps(context) {
  try {
    const productId = context.params.id;
    const productDetails = await getProductDetails({ id: productId });

    return { props: { productDetails } };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
