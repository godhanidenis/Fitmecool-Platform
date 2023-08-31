import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { productLikeToggle } from "../../../redux/ducks/userProfile";
import { productLike } from "../../../graphql/mutations/products";
import { toast } from "react-toastify";
import { Tooltip, tooltipClasses } from "@mui/material";
import Router from "next/router";
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
import ImageLoadingSkeleton from "../../Modal/ImageLoadingSkeleton";

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

const ProductCard = ({ product, onlyCarousal }) => {
  const [productLikeByUser, setProductLikeByUser] = useState(false);

  const dispatch = useDispatch();

  const { themeLayout } = useSelector((state) => state.themeLayout);
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );

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

  const [isShopLogoLoaded, setIsShopLogoLoaded] = useState(false);

  const [isProductImagesLoaded, setProductImagesLoaded] = useState(false);

  const items = [
    product.product_image.front,
    product.product_image.back,
    product.product_image.side,
  ].map((itm, index) => {
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
      >
        {!isProductImagesLoaded && (
          <ImageLoadingSkeleton className="object-cover" />
        )}
        <Image
          src={itm ?? ""}
          alt={product?.product_name}
          className={`object-cover absolute top-0 left-0 ${
            isProductImagesLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setProductImagesLoaded(true)}
          layout="fill"
        />
      </div>
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
      <div className="shadow-xl flex flex-col rounded-lg">
        <div className="cursor-pointer product-parent-div">
          <div className="grid grid-cols-1 place-items-center">
            <div className="w-[100%]">
              <Carousel
                infinite
                arrows={onlyCarousal ? false : true}
                removeArrowOnDeviceType={["mobile"]}
                responsive={responsive}
                customLeftArrow={
                  <TrendingCustomLeftArrow onClick={TrendingCustomLeftArrow} />
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

          {!onlyCarousal && (
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

        {!onlyCarousal && (
          <div className="pl-3 bg-[#FFFFFF]">
            <div>
              <Link href={`/product/${product.id}`} passHref>
                <a
                  target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}
                  rel="noopener noreferrer"
                >
                  <span className="line-clamp-1 font-semibold text-black text-base mt-4">
                    {product.product_name}
                  </span>
                </a>
              </Link>
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
                    <span className="line-clamp-1 text-[#9d9d9d] font-semibold cursor-pointer hover:text-colorPrimary text-xs sm:text-sm">
                      {product.branchInfo?.shop_info?.shop_name}
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCard;
