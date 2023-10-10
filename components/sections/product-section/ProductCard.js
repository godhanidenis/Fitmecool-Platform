import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { productLikeToggle } from "../../../redux/ducks/userProfile";
import { productLike } from "../../../graphql/mutations/products";
import { toast } from "react-toastify";
import { Avatar, Tooltip, tooltipClasses } from "@mui/material";
import Router from "next/router";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
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

const ProductCard = ({ product, onlyCarousal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [autoplay, setAutoplay] = useState(false);
  const [productLikeByUser, setProductLikeByUser] = useState(false);

  const [isShopLogoLoaded, setIsShopLogoLoaded] = useState(false);
  const [isProductImagesLoaded, setProductImagesLoaded] = useState(false);
  const [OpenToolTip, setOpenToolTip] = useState(false);
  const [isLogoImage, setIsLogoImage] = useState(false);
  const [isProductImages, setIsProductImages] = useState(false);
  const [isProductImage, setIsProductImage] = useState("");

  const [photos, setPhotos] = useState([]);

  const shopId = product.branchInfo?.shop_id;
  const pageShareURL = window.location.href;

  const dispatch = useDispatch();

  const { themeLayout } = useSelector((state) => state.themeLayout);
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );

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
          height: onlyCarousal
            ? 400
            : themeLayout === "mobileScreen"
            ? 250
            : 300,
        }}
        onMouseEnter={(e) => {
          if (!onlyCarousal) {
            setAutoplay(true);
            setCurrentImageIndex(null);
          }
        }}
        onMouseLeave={() => {
          if (!onlyCarousal) {
            setAutoplay(false);
            setCurrentImageIndex(0);
          }
        }}
      >
        {!isProductImagesLoaded && (
          <ImageLoadingSkeleton className="object-cover" />
        )}
        <Link href={`/product/${product.id}`} passHref>
          <a
            target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}
            rel="noopener noreferrer"
          >
            {isProductImage === itm && isProductImages ? (
              <div className="w-full h-full bg-[#00000031]" />
            ) : (
              <>
                {itm?.type === "image" && (
                  <Image
                    src={
                      currentImageIndex === null
                        ? itm?.src
                        : currentImageIndex === 0 && photos[0]?.src
                    }
                    alt={product?.product_name}
                    className={`object-cover absolute top-0 left-0 rounded-t-lg ${
                      isProductImagesLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setProductImagesLoaded(true)}
                    onError={() => {
                      setIsProductImages(true);
                      setIsProductImage(itm);
                    }}
                    layout="fill"
                  />
                )}
                {itm?.type === "video" && (
                  <video
                    src={itm?.src}
                    alt="product video"
                    onError={() => {
                      setIsProductImages(true);
                      setIsProductImage(itm);
                    }}
                    className="h-full w-full !cursor-pointer !object-cover"
                    autoPlay={true}
                    controls
                    muted
                    loop
                  />
                )}
              </>
            )}
          </a>
        </Link>
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

  return (
    <>
      <div className="shadow-xl flex flex-col rounded-lg">
        <div className="cursor-pointer relative top-0 left-0">
          <div className="grid grid-cols-1 place-items-center">
            <div className="w-[100%]">
              <Carousel
                autoPlay={autoplay}
                autoPlaySpeed={1500}
                infinite
                arrows={onlyCarousal}
                // removeArrowOnDeviceType={["mobile"]}
                responsive={responsive}
                className="rounded-t-lg"
              >
                {productImages}
              </Carousel>
            </div>
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
          <Link href={`/product/${product.id}`} passHref>
            <a
              className="bg-[#FFFFFF] rounded-b-lg"
              target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}
              rel="noopener noreferrer"
            >
              <div className="pl-3">
                <div>
                  <span className="line-clamp-1 font-semibold text-black text-base mt-4">
                    {product.product_name}
                  </span>
                </div>

                <div className="flex gap-2 justify-start items-center sm:mt-3 mt-2 mb-2">
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
                        src={product?.branchInfo?.shop_info?.shop_logo ?? ""}
                        layout="fill"
                        className={`rounded-[50%] absolute top-0 left-0 ${
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
                          {/* {String(product.branchInfo?.shop_info?.shop_name)
                            ?.split(" ")[0][0]
                            .toUpperCase() +
                            String(product.branchInfo?.shop_info?.shop_name)
                              ?.split(" ")[1][0]
                              .toUpperCase()} */}
                        </Avatar>
                      )}
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
                        <span className="line-clamp-1 text-[#9d9d9d] font-semibold cursor-pointer hover:text-colorPrimary text-xs sm:text-sm">
                          {product.branchInfo?.shop_info?.shop_name}
                        </span>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        )}
      </div>
    </>
  );
};

export default ProductCard;
