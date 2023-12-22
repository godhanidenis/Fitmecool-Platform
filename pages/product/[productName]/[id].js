/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import Image from "next/image";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  ClickAwayListener,
  Divider,
  Rating,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { getProductDetails } from "../../../graphql/queries/productQueries";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ProductCard from "../../../components/sections/product-section/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { shopFollow } from "../../../graphql/mutations/shops";
import { toast } from "react-toastify";
import {
  productLikeToggle,
  shopFollowToggle,
} from "../../../redux/ducks/userProfile";
import {
  productContactInquiry,
  productLike,
  productWhatsappInquiry,
} from "../../../graphql/mutations/products";
import Link from "next/link";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import { TiArrowForwardOutline } from "react-icons/ti";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import CustomReactImageMagnify from "../../../components/Layout/CustomReactImageMagnify";
import { withoutAuth } from "../../../components/core/PrivateRouteForVendor";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import { ScreeResizeForViewMoreItems } from "../../../components/core/useScreenResize";
import ImageLoadingSkeleton from "../../../components/Modal/ImageLoadingSkeleton";
import { assets } from "../../../constants";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import Errors from "../../../components/Layout/Errors";

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

const ProductDetail = ({ productDetails, error }) => {
  const [shopFollowByUser, setShopFollowByUser] = useState(false);
  const [productLikeByUser, setProductLikeByUser] = useState(false);
  const [isShopImages, setIsShopImages] = useState(false);
  const [isProductImage, setIsProductImage] = useState([]);

  const [isHydrated, setIsHydrated] = useState(false);

  const [openToolTip, setOpenToolTip] = useState(false);

  const [readMore, setReadMore] = useState(false);

  const [photos, setPhotos] = useState([]);

  const [shopOldDate, setShopOldDate] = useState("");

  const pageShareURL = window.location.href;

  const dispatch = useDispatch();
  const router = useRouter();

  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );

  const productDetailsData = productDetails?.data?.product;

  const finalPrice =
    productDetailsData?.data?.product_price -
    productDetailsData?.data?.product_price *
      (productDetailsData?.data?.product_discount / 100);

  const { themeLayout } = useSelector((state) => state.themeLayout);

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip open={openToolTip} {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#ffffff",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      boxShadow: "0 0 10px rgba(0,0,0,.1)",
    },
  }));

  const productDescription = productDetailsData?.data?.product_description;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const createdAtDate = useMemo(() => {
    return new Date(
      Number(
        productDetails?.data?.product?.data.branchInfo?.shop_info?.createdAt
      )
    );
  }, [productDetails]);

  useEffect(() => {
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - createdAtDate;
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (24 * 60 * 60 * 1000)
    );
    setShopOldDate(differenceInDays);
  }, [createdAtDate]);

  useEffect(() => {
    if (!isAuthenticate) {
      setShopFollowByUser(false);
      setProductLikeByUser(false);
    }

    const followedShopsByUser = userProfile.shop_follower_list?.find(
      (itm) => itm.shop_id === productDetailsData?.data.branchInfo?.shop_id
    );

    followedShopsByUser
      ? setShopFollowByUser(true)
      : setShopFollowByUser(false);

    const likedProductByUser = userProfile.product_like_list?.find(
      (itm) => itm.id === productDetailsData?.data.id
    );

    likedProductByUser
      ? setProductLikeByUser(true)
      : setProductLikeByUser(false);
  }, [
    isAuthenticate,
    productDetailsData?.data.branchInfo?.shop_id,
    productDetailsData?.data.id,
    userProfile,
  ]);

  const [openContactInfo, setOpenContactInfo] = useState(false);
  const [images, setImages] = useState({});

  const handleCloseContactInfo = () => setOpenContactInfo(false);

  useEffect(() => {
    const initialPhotos = [
      {
        src: productDetailsData?.data.product_image?.front,
        type: "image",
      },
      {
        src: productDetailsData?.data.product_image?.back,
        type: "image",
      },
      {
        src: productDetailsData?.data.product_image?.side,
        type: "image",
      },
    ];

    if (productDetailsData?.data.product_video) {
      initialPhotos.push({
        src: productDetailsData?.data.product_video,
        type: "video",
      });
    }

    setPhotos(initialPhotos);
  }, [
    productDetailsData?.data.product_image,
    productDetailsData?.data.product_video,
  ]);

  useEffect(() => {
    if (photos?.length > 0) setImages(photos[0]);
  }, [photos]);

  const selectImage = (img) => {
    setImages(img);
  };

  const productImages = photos?.map((itm, i) => {
    return (
      <div
        className="mx-auto mb-[24px] relative"
        onMouseEnter={() => {
          selectImage(itm);
        }}
        key={i}
        onClick={() => {
          selectImage(itm);
        }}
      >
        {itm ? (
          isProductImage.includes(itm) && isShopImages ? (
            <div
              className="w-[129px] h-[146px] cursor-pointer bg-[#00000031]"
              style={{ border: images === itm ? "2px solid #29977E" : 0 }}
            />
          ) : (
            <>
              {itm?.type === "image" && (
                <img
                  src={itm?.src?.small}
                  alt="Product Images"
                  style={{
                    border: images?.src === itm?.src ? "2px solid #29977E" : 0,
                  }}
                  className="object-top object-cover cursor-pointer w-[130px] h-[150px]"
                  onError={() => {
                    setIsShopImages(true);
                    setIsProductImage((prevIndexes) => [...prevIndexes, itm]);
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
                    className="object-cover cursor-pointer w-full h-full"
                    onError={() => {
                      setIsShopImages(true);
                      setIsProductImage(isProductImage.push(itm));
                    }}
                  />
                  <PlayCircleIcon className="!absolute !top-2 !right-2 !text-colorPrimary" />
                </div>
              )}
            </>
          )
        ) : (
          <ImageLoadingSkeleton className="!w-[130px] !h-[150px]" />
        )}
      </div>
    );
  });
  const productImages1 = photos?.map((itm, i) => {
    return (
      <div className="mx-auto mb-[24px] relative" key={i}>
        {itm ? (
          isProductImage.includes(itm) && isShopImages ? (
            <div
              className="w-[129px] h-[146px] cursor-pointer bg-[#00000031]"
              style={{ border: images === itm ? "2px solid #29977E" : 0 }}
            />
          ) : (
            <>
              {itm?.type === "image" && (
                <img
                  src={itm?.src?.large}
                  alt="Product Images"
                  style={{
                    border: images?.src === itm?.src ? "2px solid #29977E" : 0,
                  }}
                  className="object-top object-cover cursor-pointer w-[130px] h-[150px]"
                  onError={() => {
                    setIsShopImages(true);
                    setIsProductImage((prevIndexes) => [...prevIndexes, itm]);
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
                    className="object-cover cursor-pointer w-full h-full"
                    onError={() => {
                      setIsShopImages(true);
                      setIsProductImage(isProductImage.push(itm));
                    }}
                  />
                  <PlayCircleIcon className="!absolute !top-2 !right-2 !text-colorPrimary" />
                </div>
              )}
            </>
          )
        ) : (
          <ImageLoadingSkeleton className="!w-[130px] !h-[150px]" />
        )}
      </div>
    );
  });

  const isScreenWide = ScreeResizeForViewMoreItems();

  const handleProductLike = () => {
    if (isAuthenticate) {
      productLike({
        productInfo: {
          product_id: productDetailsData?.data.id,
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
                    value: productDetailsData?.data.id,
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
      router.push({
        pathname: "/auth/user-type",
        query: { redirectPath: new URL(window.location.href).pathname },
      });
    }
  };

  const shopSlug =
    productDetailsData?.data?.branchInfo?.shop_info?.shop_name.replaceAll(
      " ",
      "-"
    );

  const shopDetailHeader = () => (
    <div className="flex items-center bg-colorPrimary p-3">
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex gap-3 items-center">
          <div className="flex justify-center items-center">
            {productDetailsData?.data.branchInfo?.shop_info.shop_logo?.small ? (
              <Avatar
                alt="Shop Logo"
                className="!w-12 !h-12 !cursor-pointer"
                src={
                  productDetailsData?.data.branchInfo?.shop_info.shop_logo
                    ?.small ?? ""
                }
                key={new Date().getTime()}
              >
                {String(
                  productDetailsData?.data.branchInfo?.shop_info.shop_name
                )
                  ?.split(" ")[0][0]
                  .toUpperCase()}
              </Avatar>
            ) : !productDetailsData?.data.branchInfo?.shop_info.shop_logo
                ?.small ? (
              <Avatar
                className="!bg-colorGreen !w-12 !h-12"
                sx={{
                  fontSize: "15px",
                }}
              >
                {String(
                  productDetailsData?.data.branchInfo?.shop_info.shop_name
                )
                  ?.split(" ")[0][0]
                  .toUpperCase()}
              </Avatar>
            ) : (
              <ImageLoadingSkeleton
                validClassName={true}
                variant="circular"
                className="!w-12 !h-12"
                sx={{
                  backgroundColor: "#F3F6F6",
                }}
              />
            )}
          </div>
          <div className="flex flex-col justify-start">
            <Link
              href={`/shop/${shopSlug}/${productDetailsData?.data.branchInfo?.shop_id}`}
            >
              <a target="_self">
                <p className="line-clamp-1 text-white text-[15px] xl:text-sm sm:text-base font-semibold cursor-pointer hover:text-colorGreen">
                  {productDetailsData?.data.branchInfo?.shop_info.shop_name}
                </p>
              </a>
            </Link>
            <p className="text-[#888888] text-[10px] md:text-ms 2xl:text-sm font-normal line-clamp-1">
              {shopOldDate} days ago
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <Rating
            name="text-feedback"
            className="!text-[17px] sm:!text-[24px]"
            value={Math.round(
              productDetailsData?.data.branchInfo?.shop_info.shop_rating
            )}
            readOnly
            emptyIcon={
              <StarIcon
                sx={{ color: "gray" }}
                className="!text-[17px] sm:!text-[24px]"
              />
            }
          />
          <div className="text-[#878A99] font-normal text-[13px] flex items-center">
            <div className="flex items-center">
              <LocationOnIcon fontSize="small" className="!mr-1" />
              <span className="line-clamp-1">
                {productDetailsData?.data.branchInfo?.branch_address}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center md:justify-end">
          <Button
            className="!bg-colorGreen "
            variant="outlined"
            sx={{
              textTransform: "none",
              color: "white",
              border: "1px solid colorGreen",
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
                    shop_id: productDetailsData?.data.branchInfo?.shop_id,
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
                                productDetailsData?.data.branchInfo?.shop_id,
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
                router.push({
                  pathname: "/auth/user-type",
                  query: {
                    redirectPath: new URL(window.location.href).pathname,
                  },
                });
              }
            }}
          >
            {shopFollowByUser ? (
              "Following"
            ) : (
              <div className="flex items-center justify-center">
                <AddIcon className="text-white" fontSize="small" />
                <div className="text-white">Follow</div>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  if (!isHydrated) {
    return null;
  }

  if (error) {
    return <Errors error={error} item="product" />;
  }

  return (
    <>
      <div className="font-Nova container">
        <div className="py-2 sm:py-4 !w-[100%] pl-[14px] sm:pl-[10px] flex gap-3 items-center">
          <ArrowBackIcon
            onClick={() => router.back()}
            className="cursor-pointer"
          />
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="#">
              <div className="text-colorGreen font-semibold">Product</div>
            </Link>
            <Link underline="hover" color="inherit" href="#">
              <div className="text-colorGreen font-semibold">
                {productDetailsData?.data.categoryInfo?.category_type}
              </div>
            </Link>
            <Link
              underline="hover"
              color="text.primary"
              href="#"
              aria-current="page"
            >
              <div className="font-semibold">
                {productDetailsData?.data.categoryInfo?.category_name}
              </div>
            </Link>
          </Breadcrumbs>
        </div>
      </div>

      <Box className="lg:!hidden font-Nova">{shopDetailHeader()}</Box>
      <div className="sm:hidden font-Nova">
        {productDetailsData && (
          <ProductCard product={productDetailsData?.data} onlyCarousal={true} />
        )}
      </div>

      <div className="bg-[#FAFCFC] font-Nova">
        <div className="container">
          <div className="!w-[100%] ">
            <div className="grid grid-cols-2 p-2 gap-8">
              <div className="col-span-2 lg:col-span-1 hidden sm:flex">
                <div className="grid grid-cols-4 w-full h-full">
                  <div className="col-span-1 relative">
                    <div className="p-2 pt-0 ">{productImages}</div>
                    <div className="p-2 pt-0 absolute top-0 -z-[10] ">
                      {productImages1}
                    </div>
                  </div>
                  <div className="col-span-3 relative">
                    {productDetailsData?.data?.product_listing_type &&
                      images?.type === "image" && (
                        <div className="absolute top-3 z-10">
                          <span
                            className={`label-big label-large arrowed-right text-white font-semibold ${
                              productDetailsData?.data?.product_listing_type ===
                              "rent"
                                ? "bg-[#ff0000cc]"
                                : "bg-[#29977E]"
                            }`}
                          >
                            {productDetailsData?.data?.product_listing_type ===
                            "sell"
                              ? "Sell"
                              : "Rent"}
                          </span>
                        </div>
                      )}
                    <div className="absolute h-52 w-52 -left-1 2xl:-left-4 -top-1 2xl:-top-4 overflow-hidden"></div>
                    <div className="flex justify-center items-center bg-colorWhite h-[700px] bg-cover">
                      {images?.type === "image" && (
                        <CustomReactImageMagnify
                          src={images.src?.large}
                          height="700px"
                          width="100%"
                          className="object-cover object-top"
                        />
                      )}

                      {images?.type === "video" && (
                        <video
                          src={images?.src}
                          alt="product-video"
                          onError={() => {
                            setIsShopImages(true);
                            setIsProductImage(images);
                          }}
                          className="h-[700px] w-full !cursor-pointer !object-cover !object-top"
                          autoPlay={true}
                          controls
                          muted
                          loop
                        />
                      )}
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
                            display: "flex",
                            gap: "5px",
                          }}
                          onClick={handleProductLike}
                        >
                          {!productLikeByUser ? (
                            <FavoriteBorderIcon className="!text-[rgba(21, 24, 39, 0.4)]" />
                          ) : (
                            <FavoriteIcon className="!text-red-600" />
                          )}
                          <span>Like</span>
                        </Button>
                      </div>
                      <ClickAwayListener
                        onClickAway={() => setOpenToolTip(false)}
                      >
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
                              onClick={() => setOpenToolTip(!openToolTip)}
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
                                display: "flex",
                                gap: "5px",
                                alignItems: "center",
                              }}
                            >
                              <TiArrowForwardOutline className="!text-[24px]" />
                              <span>Share</span>
                            </Button>
                          </HtmlTooltip>
                        </div>
                      </ClickAwayListener>
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
                            display: "flex",
                            gap: "5px",
                          }}
                        >
                          <ReportGmailerrorredOutlinedIcon className="!text-[#f34747]" />
                          <span>Report</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Box className="!hidden lg:!block">{shopDetailHeader()}</Box>
                <div className="mt-3">
                  <div className="flex items-center  justify-between border-b border-['rgba(0, 0, 0, 0.1)'] pb-[8px]">
                    <span className="font-semibold text-[30px] text-colorGreen leading-9 capitalize">
                      {productDetailsData?.data.product_name}
                    </span>
                    <button
                      className={`w-10 h-10 rounded-full transition-colors bg-[#ffffff] duration-300`}
                      onClick={handleProductLike}
                    >
                      {!productLikeByUser ? (
                        <FavoriteBorderIcon
                          fontSize="large"
                          className="!text-[#151827]"
                        />
                      ) : (
                        <FavoriteIcon
                          className="!text-red-600"
                          fontSize="large"
                        />
                      )}
                    </button>
                  </div>
                </div>
                {productDetailsData?.data?.product_price_visible && (
                  <div className="flex gap-2 mt-3 items-center">
                    <p className="text-black text-[22px] font-bold">
                      ₹{Math.round(finalPrice)}
                    </p>
                    {productDetailsData?.data?.product_discount !== 0 && (
                      <div className="flex gap-2 items-center">
                        <p className="text-[#9d9d9d] text-[16px] font-medium line-through">
                          ₹{Math.round(productDetailsData?.data?.product_price)}
                        </p>
                        <p className="text-green-600 text-md font-normal ">
                          (
                          {Math.round(
                            productDetailsData?.data?.product_discount
                          )}
                          % OFF)
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-3">
                  <div className="text-[#151827] font-semibold text-[22px] mb-[5px]">
                    About
                  </div>
                  <div
                    className={`${
                      readMore ? "h-[304px] overflow-scroll" : " "
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
                          className="cursor-pointer text-red-500"
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
                      <span className="text-base">Category :</span>
                      <span className="text-base font-semibold mr-2 text-colorBlack ml-[9px]">
                        {productDetailsData?.data.categoryInfo?.category_name}
                      </span>
                    </div>
                    <div className="flex mt-1 items-center">
                      <span className="text-base">Color :</span>
                      <span
                        className={`rounded-[50%] w-4 h-4 ml-[9px] border`}
                        style={{
                          backgroundColor:
                            productDetailsData?.data.product_color,
                        }}
                      />
                      <span className="text-base font-normal mr-2 text-colorBlack ml-[9px]">
                        ({productDetailsData?.data.product_color})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-0 mt-10 items-center justify-between">
                  <div
                    className="w-[100%] md:w-[48%]"
                    onClick={() =>
                      isAuthenticate
                        ? productWhatsappInquiry({
                            id: productDetailsData?.data.id,
                          })
                        : router.push({
                            pathname: "/auth/user-type",
                            query: {
                              redirectPath: new URL(window.location.href)
                                .pathname,
                            },
                          })
                    }
                  >
                    <a
                      href={
                        isAuthenticate &&
                        `https://api.whatsapp.com/send?phone=${
                          productDetailsData?.data.branchInfo?.manager_contact
                        }&text=${encodeURIComponent(window.location.href)}`
                      }
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
                      isAuthenticate
                        ? productContactInquiry({
                            id: productDetailsData?.data.id,
                          })
                        : router.push({
                            pathname: "/auth/user-type",
                            query: {
                              redirectPath: new URL(window.location.href)
                                .pathname,
                            },
                          })
                    }
                  >
                    <button
                      className="bg-[#E8EBEA] text-[#31333E] text-[24px] py-[28px] w-full rounded-xl tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline 
                  shadow-lg flex items-center justify-center gap-3"
                      onClick={() =>
                        isAuthenticate && setOpenContactInfo(!openContactInfo)
                      }
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

            {productDetailsData?.related &&
              productDetailsData?.related.length > (isScreenWide ? 5 : 4) && (
                <div className="underline text-[#29977E] font-semibold text-[16px] sm:text-[18px] flex items-center">
                  <Link
                    href={`/shop/${shopSlug}/${productDetailsData?.data.branchInfo?.shop_id}`}
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

          <div className="w-[100%] flex flex-wrap justify-start place-items-center mt-4">
            {productDetailsData?.related &&
              productDetailsData?.related
                .slice(0, isScreenWide ? 5 : 4)
                ?.map((product, index) => (
                  <div
                    className="w-[50%] md:w-[33%]  lg:w-[25%] xl:w-[20%] 2xl:w-[20%] mb-2 sm:mb-0"
                    key={product.id}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </div>

      <ContactDetailsModal
        productDetailsData={productDetailsData}
        openContactInfo={openContactInfo}
        handleCloseContactInfo={handleCloseContactInfo}
      />
    </>
  );
};

export default withoutAuth(ProductDetail);

const ContactDetailsModal = ({
  productDetailsData,
  openContactInfo,
  handleCloseContactInfo,
}) => {
  const manager_name = productDetailsData?.data.branchInfo?.manager_name;

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
                    productDetailsData?.data.branchInfo?.shop_info?.shop_logo ??
                    ""
                  }
                  alt="Shop Logo"
                  key={new Date().getTime()}
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#000000] text-base font-semibold cursor-pointer text-center sm:text-start">
                  {productDetailsData?.data.branchInfo?.shop_info?.shop_name}
                </p>
                <p className="text-[#888888] text-sm font-normal text-center sm:text-start">
                  {productDetailsData?.data.branchInfo?.branch_address}
                </p>
              </div>
            </div>
            <Divider />
            <div className="p-5 flex flex-col sm:flex-row gap-4 justify-start">
              <div className="flex justify-center items-center">
                <Avatar
                  className="!w-16 !h-16 bg-colorGreen"
                  sx={{
                    fontSize: "20px",
                  }}
                >
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
                  {productDetailsData?.data.branchInfo?.manager_contact}
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
    return { props: { error: error.message } };
  }
}
