import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { productLikeToggle } from "../../../redux/ducks/userProfile";
import { productLike } from "../../../graphql/mutations/products";
import { toast } from "react-toastify";
import { Box, Avatar, Tooltip, tooltipClasses } from "@mui/material";
import Router from "next/router";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { styled } from "@mui/material/styles";
import Carousel from "react-multi-carousel";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import ImageLoadingSkeleton from "../../Modal/ImageLoadingSkeleton";
import { assets } from "../../../constants";
import Modal from "@mui/material/Modal";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { refactorPrice } from "../../../utils/common";

const ContactStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  height: `calc(100vh - 235px)`,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 4,
  borderRadius: 4,
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

const ProductCard = ({ product, onlyCarousal, homepage, likePage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [autoplay, setAutoplay] = useState(false);
  const [productLikeByUser, setProductLikeByUser] = useState(false);

  const [isShopLogoLoaded, setIsShopLogoLoaded] = useState(false);
  const [isProductImagesLoaded, setIsProductImagesLoaded] = useState(false);
  const [OpenToolTip, setOpenToolTip] = useState(false);
  const [isLogoImage, setIsLogoImage] = useState(false);
  const [isProductImages, setIsProductImages] = useState(false);
  const [isProductImage, setIsProductImage] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [CarouselImage, setCarouselImage] = useState(false);

  const handleCloseCarouselImage = () => setCarouselImage(false);

  const shopId = product.branchInfo?.shop_id;
  const pageShareURL = window.location.href;

  const dispatch = useDispatch();

  const { themeLayout } = useSelector((state) => state.themeLayout);
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );

  const finalPrice =
    product?.product_price -
    product?.product_price * (product?.product_discount / 100);

  useEffect(() => {
    if (onlyCarousal) setAutoplay(false);
  }, [onlyCarousal]);

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

  useEffect(() => {
    // Initialize the photos array with initial values
    const initialPhotos = [
      {
        src: product.product_image?.front,
        type: "image",
      },
      {
        src: product.product_image?.back,
        type: "image",
      },
      {
        src: product.product_image?.side,
        type: "image",
      },
    ];

    if (onlyCarousal && product.product_video) {
      // If there's a video, add it to the initialPhotos array
      initialPhotos.push({
        src: product.product_video,
        type: "video",
      });
    }

    // Set the initial photos state
    setPhotos(initialPhotos);
  }, [onlyCarousal, product.product_image, product.product_video]);

  const productImages = photos?.map((itm, index) => {
    return (
      <div
        className="relative"
        key={index}
        style={{
          width: "100%",
          height:
            onlyCarousal && CarouselImage
              ? "calc(100vh - 300px)"
              : onlyCarousal
              ? 400
              : themeLayout === "mobileScreen"
              ? 250
              : 300,
        }}
      >
        {!isProductImagesLoaded && (
          <ImageLoadingSkeleton className="object-cover h-full" />
        )}
        {isProductImage.includes(itm) && isProductImages ? (
          <div className="w-full h-full bg-[#00000031]" />
        ) : (
          <>
            {itm?.type === "image" && (
              <Image
                src={itm?.src ?? ""}
                unoptimized={true}
                alt={product?.product_name}
                className={`object-cover object-top absolute top-0 left-0 bg-white  ${
                  isProductImagesLoaded ? "opacity-100" : "opacity-0"
                } ${onlyCarousal && CarouselImage && `object-cover`}`}
                onLoad={() => setIsProductImagesLoaded(true)}
                onError={() => {
                  setIsProductImages(true);
                  setIsProductImage((prevIndexes) => [...prevIndexes, itm]);
                }}
                layout="fill"
                onClick={() => onlyCarousal && setCarouselImage(true)}
              />
            )}
            {itm?.type === "video" && (
              <video
                src={itm?.src}
                alt="product video"
                onError={() => {
                  setIsProductImages(true);
                  setIsProductImage((prevIndexes) => [...prevIndexes, itm]);
                }}
                className="h-full !object-cover !object-top w-full !cursor-pointer"
                autoPlay={true}
                controls
                muted
                loop
              />
            )}
          </>
        )}
      </div>
    );
  });

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

  const productSlug = product?.product_name.replaceAll(" ", "-");
  const shopSlug = product?.branchInfo?.shop_info?.shop_name.replaceAll(
    " ",
    "-"
  );

  const CustomDot = ({ onClick, active }) => {
    return (
      <li className="" onClick={() => onClick()}>
        <FiberManualRecordIcon
          className={`${
            active ? "!text-[#31333E]" : "!text-[#31333e33]"
          } !w-2 lg:!w-3 !h-2 lg:!h-3 !mx-1 !cursor-pointer`}
          fontSize="small"
        />
      </li>
    );
  };

  const CustomPrevArrow = () => {
    return (
      <Link
        href={`/product/${productSlug}/${product.id}/${product.id}`}
        passHref
      >
        <a
          target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}
          rel="noopener noreferrer"
        >
          <button className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-full bg-[#fff0] text-[#fff0] z-[10px]" />
        </a>
      </Link>
    );
  };

  const CustomNextArrow = () => {
    return (
      <Link href={`/product/${productSlug}/${product.id}`} passHref>
        <a
          target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}
          rel="noopener noreferrer"
        >
          <button className="absolute top-1/2 right-0 transform -translate-y-1/2 w-full h-full bg-[#fff0] text-[#fff0] z-[10px]" />
        </a>
      </Link>
    );
  };

  return (
    <>
      <div
        className={`${onlyCarousal && `m-1`} ${
          likePage
            ? "w-[49%] sm:w-[33%]  lg:w-[25%] xl:w-[20%] mb-2 lg:mb-0 ps-[4px] xl:ps-3 pe-1  pt-[4px] xl:pt-3 pb-2 overflow-hidden rounded-lg"
            : homepage
            ? "w-[49%] sm:w-[33%]  lg:w-[23%] xl:w-[24%] mb-2 lg:mb-0 ps-[4px] xl:ps-3 pe-1  pt-[4px] xl:pt-3 pb-2 overflow-hidden rounded-lg"
            : "ps-[4px] xl:ps-3 pe-1  pt-[4px] xl:pt-3 pb-2 overflow-hidden sm:m-1 rounded-lg"
        }`}
      >
        <div className={`relative cursor-pointer`}>
          {product?.product_listing_type && (
            <div className="absolute top-2 z-10">
              <span
                className={`label label-large arrowed-right text-white font-semibold ${
                  product?.product_listing_type === "rent"
                    ? "bg-[#ff0000cc]"
                    : "bg-[#29977E]"
                }`}
              >
                {product?.product_listing_type === "sell" ? "Sell" : "Rent"}
              </span>
            </div>
          )}

          <div
            className={`${
              onlyCarousal ? "" : "shadow-md"
            } flex flex-col rounded-xl`}
          >
            <div className="cursor-pointer relative top-0 left-0">
              <div className="grid grid-cols-1 place-items-center">
                {!onlyCarousal ? (
                  // <div className="group relative w-full">
                  <div
                    className={`relative rounded-t-lg`}
                    style={{
                      width: "100%",
                      height: themeLayout === "mobileScreen" ? 250 : 300,
                    }}
                  >
                    <Link
                      href={`/product/${productSlug}/${product.id}`}
                      passHref
                    >
                      <a
                        target={`${
                          themeLayout === "webScreen" ? "_blank" : "_self"
                        }`}
                        rel="noopener noreferrer"
                      >
                        {isProductImagesLoaded && (
                          <ImageLoadingSkeleton className="object-cover h-full rounded-t-lg" />
                        )}
                        {isProductImages ? (
                          <div className="w-full h-full bg-[#00000031] rounded-t-lg" />
                        ) : (
                          <Image
                            src={product.product_image?.front ?? ""}
                            unoptimized={true}
                            alt={product?.product_name}
                            className={`object-cover object-top absolute top-0 left-0 bg-white rounded-t-lg ${
                              isProductImagesLoaded
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                            onLoad={() => setIsProductImagesLoaded(true)}
                            onError={() => {
                              setIsProductImages(true);
                            }}
                            layout="fill"
                          />
                        )}
                      </a>
                    </Link>
                  </div>
                ) : (
                  // {/* <div className="invisible group-hover:visible absolute top-0 left-0 w-full h-full rounded-t-lg">
                  //   <Carousel
                  //     autoPlay={true}
                  //     autoPlaySpeed={1500}
                  //     infinite
                  //     showDots={false}
                  //     customDot={null}
                  //     arrows={true}
                  //     customLeftArrow={<CustomPrevArrow />}
                  //     customRightArrow={<CustomNextArrow />}
                  //     responsive={responsive}
                  //     className={`rounded-t-lg`}
                  //   >
                  //     {photos.length === 0 ? (
                  //       <div
                  //         className="bg-[#00000031]"
                  //         style={{
                  //           width: "100%",
                  //           height: onlyCarousal
                  //             ? 420
                  //             : themeLayout === "mobileScreen"
                  //             ? 250
                  //             : 300,
                  //         }}
                  //       />
                  //     ) : (
                  //       productImages
                  //     )}
                  //   </Carousel>
                  // </div> */}
                  // </div>
                  <Carousel
                    autoPlay={false}
                    infinite
                    showDots={true}
                    customDot={<CustomDot />}
                    arrows={false}
                    responsive={responsive}
                    className={`!pb-5 w-full`}
                  >
                    {photos.length === 0 ? (
                      <div
                        className="bg-[#00000031]"
                        style={{
                          width: "100%",
                          height: onlyCarousal
                            ? 420
                            : themeLayout === "mobileScreen"
                            ? 250
                            : 300,
                        }}
                      />
                    ) : (
                      productImages
                    )}
                  </Carousel>
                )}
              </div>
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
                    <FavoriteIcon className="!text-red-600" />
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
                                  src={assets.facebookIcon}
                                  alt="facebookIcon"
                                  width={25}
                                  height={25}
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
                      <button
                        onClick={() => setOpenToolTip(!OpenToolTip)}
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
            </div>

            {!onlyCarousal && (
              <Link href={`/product/${productSlug}/${product.id}`} passHref>
                <a
                  className="bg-[#fff] rounded-b-lg shadow-md"
                  target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}
                  rel="noopener noreferrer"
                >
                  <div className="pl-3">
                    <div>
                      <span className="line-clamp-1 font-semibold text-black text-base mt-2 capitalize">
                        {product?.product_name}
                      </span>
                    </div>

                    <div className="flex gap-2 justify-start items-center mt-2 mb-2">
                      <div className="flex justify-center items-center">
                        <div className="relative sm:w-6 sm:h-6 w-4 h-4">
                          {!isShopLogoLoaded && (
                            <ImageLoadingSkeleton
                              className="rounded-[50%]"
                              variant="circular"
                            />
                          )}
                          <Image
                            alt="Shop Logo"
                            src={
                              product?.branchInfo?.shop_info?.shop_logo ?? ""
                            }
                            unoptimized={true}
                            layout="fill"
                            className={`rounded-[50%] absolute top-0 left-0 object-cover object-center  ${
                              isShopLogoLoaded ? "opacity-100" : "opacity-0"
                            }`}
                            onLoad={() => setIsShopLogoLoaded(true)}
                            onError={() => {
                              setIsLogoImage(true);
                            }}
                          />
                          {isLogoImage && (
                            <Avatar
                              className="!bg-colorGreen"
                              sx={{
                                fontSize: "12px",
                                width: "100%",
                                height: "100%",
                              }}
                            >
                              {String(product.branchInfo?.shop_info?.shop_name)
                                ?.split(" ")[0][0]
                                .toUpperCase()}
                            </Avatar>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link href={`/shop/${shopSlug}/${shopId}`} passHref>
                          <a
                            target={`${
                              themeLayout === "webScreen" ? "_blank" : "_self"
                            }`}
                            rel="noopener noreferrer"
                          >
                            <span className="line-clamp-1 text-[#9d9d9d] font-semibold cursor-pointer hover:text-colorPrimary text-xs sm:text-sm">
                              {product.branchInfo?.shop_info?.shop_name}
                            </span>
                          </a>
                        </Link>
                      </div>
                    </div>

                    {product?.product_price_visible ? (
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-0 sm:gap-2 lg:gap-0 xl:gap-2 mb-2  items-start sm:items-center lg:items-start xl:items-center">
                        <p className="text-black text-sm sm:text-md xl:text-md 2xl:text-lg font-bold line-clamp-1">
                          ₹{Math.round(finalPrice)}
                        </p>
                        {product?.product_discount !== 0 && (
                          <div className="flex gap-2 items-center">
                            <p className="text-[#9d9d9d] text-sm  font-semibold line-through line-clamp-1">
                              ₹{Math.round(product?.product_price)}
                            </p>
                            <p className="text-green-600 text-sm sm:text-md xl:text-sm 2xl:text-md font-medium line-clamp-1">
                              ({Math.round(product?.product_discount)}% OFF)
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row 2xl:flex-col mb-2 2xl:-mb-1  items-start sm:items-center lg:items-start xl:items-center 2xl:items-start">
                        <p className="text-black text-sm  font-bold line-clamp-1">
                          No Price Visible !
                        </p>
                        <p className="text-[#fff] text-sm">*</p>
                      </div>
                    )}
                  </div>
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
      {CarouselImage && (
        <CarouselImagesModal
          CarouselImage={CarouselImage}
          handleCloseCarouselImage={handleCloseCarouselImage}
          productImages={productImages}
          onlyCarousal={onlyCarousal}
          CustomDot={CustomDot}
        />
      )}
    </>
  );
};

export default ProductCard;

const CarouselImagesModal = ({
  CarouselImage,
  handleCloseCarouselImage,
  productImages,
  onlyCarousal,
  CustomDot,
}) => {
  return (
    <Modal
      open={CarouselImage}
      onClose={handleCloseCarouselImage}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="sm:hidden !bg-[#000000e5]"
    >
      <Box sx={ContactStyle}>
        <div className="flex justify-center items-center relative">
          <div className="bg-colorWhite rounded-lg w-[100%] mx-auto max-w-[1246px]">
            <Carousel
              infinite
              showDots={onlyCarousal ? true : false}
              customDot={onlyCarousal ? <CustomDot /> : null}
              arrows={false}
              responsive={responsive}
              className={`${onlyCarousal ? `!pb-6` : `rounded-t-lg`}`}
            >
              {productImages}
            </Carousel>
          </div>
          <div className="flex justify-end items-center absolute -top-4 right-2">
            <div
              className="p-1 rounded-full bg-[#000000]"
              onClick={handleCloseCarouselImage}
            >
              <CloseOutlined className="!text-white" fontSize="medium" />
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
