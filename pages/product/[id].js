/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import facebookIcon from "../../assets/facebook.png";
import instagramIcon from "../../assets/instagram.png";
import googleIcon from "../../assets/googleIcon.svg";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import Image from "next/image";
import { Avatar, Box, Breadcrumbs, Button, Divider, Rating } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { getProductDetails } from "../../graphql/queries/productQueries";
import ProfileIcon from "../../assets/profile.png";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ProductCard from "../../components/sections/product-section/ProductCard";
import AuthModal from "../../components/core/AuthModal";
import { AuthTypeModal } from "../../components/core/Enum";
import { useDispatch, useSelector } from "react-redux";
import { shopFollow } from "../../graphql/mutations/shops";
import { toast } from "react-toastify";
import { productLikeToggle, shopFollowToggle } from "../../redux/ducks/userProfile";
import { productLike } from "../../graphql/mutations/products";
import Link from "next/link";
import SubHeader from "../../components/Layout/SubHeader";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import CustomReactImageMagnify from "../../components/Layout/CustomReactImageMagnify";
import { withoutAuth } from "../../components/core/PrivateRouteForVendor";
import Slider from "react-slick";
import Router from "next/router";
import { loadCategoriesStart } from "../../redux/ducks/categories";
import { loadAreaListsStart } from "../../redux/ducks/areaLists";
import { EmailShareButton, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

const ProductDetail = ({ productDetails }) => {
  const [shopFollowByUser, setShopFollowByUser] = useState(false);
  const [productLikeByUser, setProductLikeByUser] = useState(false);

  const [open, setOpen] = useState(false);
  const [authTypeModal, setAuthTypeModal] = useState();

  const [isHydrated, setIsHydrated] = useState(false);

  const [OpenToolTip, setOpenToolTip] = useState(false);

  const pageShareURL = window.location.href;

  const dispatch = useDispatch();
  const { userProfile, isAuthenticate } = useSelector((state) => state.userProfile);

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

  const handleTooltipOpen = () => {
    setOpenToolTip(!OpenToolTip);
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticate) {
      setShopFollowByUser(false);
      setProductLikeByUser(false);
    }

    const followedShopsByUser = userProfile.shop_follower_list?.find(
      (itm) => itm.shop_id === productDetails.data.product.data.branchInfo?.shop_id
    );

    followedShopsByUser ? setShopFollowByUser(true) : setShopFollowByUser(false);

    const likedProductByUser = userProfile.product_like_list?.find(
      (itm) => itm.id === productDetails.data.product.data.id
    );

    likedProductByUser ? setProductLikeByUser(true) : setProductLikeByUser(false);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const photos = [
    productDetails.data.product.data.product_image?.front,
    productDetails.data.product.data.product_image?.back,
    productDetails.data.product.data.product_image?.side,
  ];
  const [openContactInfo, setOpenContactInfo] = useState(false);
  const [images, setImages] = useState();

  useEffect(() => {
    setImages(photos[0]);
  }, []);

  const selectImage = (img, i) => {
    setImages(img);
  };

  const items = photos?.map((itm, i) => {
    return (
      <div
        className="w-[70%] mx-auto mb-2"
        onMouseEnter={() => selectImage(itm, i)}
        key={i}
        onClick={() => selectImage(itm, i)}
      >
        <img
          src={itm}
          alt="Product Images"
          width={250}
          height={300}
          style={images === itm ? { border: "1px solid black" } : { border: "0" }}
          className="rounded cursor-pointer"
        />
      </div>
    );
  });

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return <div className={className} style={{ ...style, display: "block", color: "white" }} onClick={onClick} />;
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return <div className={className} style={{ ...style, display: "block" }} onClick={onClick} />;
  }

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1441,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <SubHeader />
      <div className="bg-colorWhite">
        <div className="container pt-4 pb-2 !w-[75%] pl-3">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="#">
              Product
            </Link>
            <Link underline="hover" color="inherit" href="#">
              {productDetails.data.product.data.categoryInfo?.category_type}
            </Link>
            <Link underline="hover" color="text.primary" href="#" aria-current="page">
              {productDetails.data.product.data.categoryInfo?.category_name}
            </Link>
          </Breadcrumbs>
        </div>
      </div>
      <Box sx={{ boxShadow: "0 0 10px rgb(0 0 0 / 10%)" }} className="lg:!hidden">
        <div className="bg-colorWhite p-3 sm:rounded-lg">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex justify-start items-center gap-1 sm:gap-4">
              <div className="flex justify-center items-center">
                <img
                  alt="Shop Logo"
                  src={productDetails.data.product.data.branchInfo?.shop_info.shop_logo}
                  className="rounded-[50%] w-[50px] h-[50px]"
                />
              </div>
              <div className="flex flex-col justify-center">
                <Link href={`/shop/${productDetails.data.product.data.branchInfo?.shop_id}`}>
                  <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
                    <p className="oneLineAfterThreeDots text-[#000000] text-sm sm:text-base font-semibold cursor-pointer hover:text-colorPrimary">
                      {productDetails.data.product.data.branchInfo?.shop_info.shop_name}
                    </p>
                  </a>
                </Link>

                <p className="text-[#888888] text-xs sm:text-sm font-normal">25 days ago</p>
              </div>
            </div>
            <div className="flex flex-col">
              <Rating
                name="text-feedback"
                value={Math.round(productDetails.data.product.data.branchInfo?.shop_info.shop_rating)}
                readOnly
                size="small"
                emptyIcon={<StarIcon fontSize="inherit" />}
              />
              <p className="oneLineAfterThreeDots text-[#888888] font-normal flex items-center">
                <LocationOnIcon fontSize="small" className="!mr-1" />
                {productDetails.data.product.data.branchInfo?.branch_address}
              </p>
            </div>

            <div className="flex items-center md:justify-end">
              <Button
                variant="outlined"
                sx={{ textTransform: "none" }}
                endIcon={<PersonAddIcon fontSize="large" />}
                onClick={() => {
                  if (isAuthenticate) {
                    shopFollow({
                      shopInfo: {
                        shop_id: productDetails.data.product.data.branchInfo?.shop_id,
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
                                  value: productDetails.data.product.data.branchInfo?.shop_id,
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
                    if (themeLayout === "mobileScreen") {
                      Router.push("/auth/signin");
                    } else {
                      setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
                    }
                  }
                }}
              >
                <Typography color="#95539B">{shopFollowByUser ? "Unfollow" : "Follow"}</Typography>
              </Button>
            </div>
          </div>
        </div>
      </Box>
      <div className="sm:hidden">
        {productDetails && <ProductCard product={productDetails?.data?.product?.data} onlyCarousal={true} />}
      </div>

      <div className="bg-colorWhite">
        <div className="container !w-[75%]">
          <div className="grid grid-cols-2 p-2 gap-8">
            <div className="col-span-2 lg:col-span-1 hidden sm:flex">
              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <div className="p-2 pt-0">{items}</div>
                </div>
                <div className="col-span-3 border-2 flex justify-center items-center bg-colorWhite">
                  <CustomReactImageMagnify large={images} preview={images} />
                </div>
                <div className="col-span-1"></div>
                <div className="md:col-span-3 pt-5 md:flex justify-between items-center bg-colorWhite ">
                  <div className="min-[320px]:mb-2 md:mb-0">
                    <Button variant="outlined" sx={{ textTransform: "none", width: "max-content" }}>
                      <FavoriteBorderOutlinedIcon /> &nbsp; Like & Save
                    </Button>
                  </div>
                  <div className="min-[320px]:mb-2 md:mb-0" onMouseLeave={() => setOpenToolTip(false)}>
                    <HtmlTooltip
                      title={
                        <React.Fragment>
                          <div className="flex">
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
                      <Button
                        onClick={handleTooltipOpen}
                        variant="outlined"
                        sx={{ textTransform: "none", width: "max-content" }}
                      >
                        <FileUploadOutlinedIcon /> &nbsp; Share
                      </Button>
                    </HtmlTooltip>
                  </div>
                  <Button variant="outlined" sx={{ textTransform: "none", width: "max-content" }}>
                    <ReportGmailerrorredOutlinedIcon /> &nbsp;Report
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Box sx={{ boxShadow: "0 0 10px rgb(0 0 0 / 10%)" }} className="!hidden lg:!block">
                <div className="bg-colorWhite p-3 rounded-lg">
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex justify-start items-center gap-1 sm:gap-4">
                      <div className="flex justify-center items-center">
                        <img
                          alt="Shop Logo"
                          src={productDetails.data.product.data.branchInfo?.shop_info.shop_logo}
                          className="rounded-[50%] w-[50px] h-[50px]"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link href={`/shop/${productDetails.data.product.data.branchInfo?.shop_id}`}>
                          <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
                            <p className="oneLineAfterThreeDots text-[#000000] text-sm sm:text-base font-semibold cursor-pointer hover:text-colorPrimary">
                              {productDetails.data.product.data.branchInfo?.shop_info.shop_name}
                            </p>
                          </a>
                        </Link>
                        <p className="text-[#888888] text-xs sm:text-sm font-normal">25 days ago</p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Rating
                        name="text-feedback"
                        value={Math.round(productDetails.data.product.data.branchInfo?.shop_info.shop_rating)}
                        readOnly
                        size="small"
                        emptyIcon={<StarIcon fontSize="inherit" />}
                      />
                      <p className="oneLineAfterThreeDots text-[#888888] font-normal flex items-center">
                        <LocationOnIcon fontSize="small" className="!mr-1" />
                        {productDetails.data.product.data.branchInfo?.branch_address}
                      </p>
                    </div>

                    <div className="flex items-center md:justify-end">
                      <Button
                        variant="outlined"
                        sx={{ textTransform: "none" }}
                        endIcon={<PersonAddIcon fontSize="large" />}
                        onClick={() => {
                          if (isAuthenticate) {
                            shopFollow({
                              shopInfo: {
                                shop_id: productDetails.data.product.data.branchInfo?.shop_id,
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
                                          value: productDetails.data.product.data.branchInfo?.shop_id,
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
                            if (themeLayout === "mobileScreen") {
                              Router.push("/auth/signin");
                            } else {
                              setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
                            }
                          }
                        }}
                      >
                        <Typography color="#95539B">{shopFollowByUser ? "Unfollow" : "Follow"}</Typography>
                      </Button>
                    </div>
                  </div>
                </div>
              </Box>
              <div className="mt-5">
                <div className="flex justify-between">
                  <span className="font-semibold text-2xl text-colorBlack">
                    {productDetails.data.product.data.product_name}
                  </span>
                  <button
                    className={`w-10 h-10 rounded-full transition-colors bg-[#ffffff] duration-300`}
                    onClick={() => {
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
                    {!productLikeByUser ? <FavoriteBorderIcon fontSize="large" /> : "❤️"}
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div>
                  <span className="pt-3 font-normal text-lg text-[#888888]">
                    {productDetails.data.product.data.product_description}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-10 items-center justify-evenly">
                <div className="">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${productDetails.data.product.data.branchInfo?.manager_contact}`}
                    target="_blank"
                    className="w-full"
                    rel="noreferrer"
                  >
                    <button
                      className="bg-green-600 text-white p-3 w-full rounded-xl tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline 
                  shadow-lg flex items-center justify-center gap-3"
                    >
                      <WhatsAppIcon className="!text-white" />
                      Send Message
                    </button>
                  </a>
                </div>
                <div className="w-full sm:w-auto text-center ">
                  <span className="text-lg text-colorStone">OR</span>
                </div>
                <div className="flex">
                  <button
                    className="bg-[#E72E77] text-white p-3 w-full rounded-xl tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline 
                  shadow-lg flex items-center justify-center gap-3"
                    onClick={() => setOpenContactInfo(!openContactInfo)}
                  >
                    <PersonOutlineIcon className="!text-white" />
                    {openContactInfo ? "Hide Contact" : "Show Contact"}
                  </button>
                </div>
              </div>

              {openContactInfo && (
                <div className="flex justify-center items-center mt-3">
                  <div className="bg-colorWhite rounded-lg flex items-center shadow-lg justify-between w-full sm:w-[80%] lg:w-auto mx-auto">
                    <div className="p-5 flex flex-col sm:flex-row gap-4 justify-start">
                      <div className="flex justify-center items-center">
                        <img
                          alt="Shop Logo"
                          src={productDetails.data.product.data.branchInfo?.shop_info?.shop_logo}
                          width={60}
                          height={40}
                          className="rounded-[40%]"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[#000000] text-base font-semibold cursor-pointer">
                          {productDetails.data.product.data.branchInfo?.shop_info?.shop_name}
                        </p>
                        <p className="text-[#888888] text-sm font-normal">
                          {productDetails.data.product.data.branchInfo?.branch_address}
                        </p>
                      </div>
                    </div>
                    <Divider orientation="vertical" flexItem />
                    <div className="p-5 flex flex-col sm:flex-row gap-4 justify-start">
                      <div className="flex justify-center items-center">
                        <Avatar className=" !w-14 !h-14">
                          <Image src={ProfileIcon ?? ""} alt="ProfileIcon" />
                        </Avatar>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[#000000] text-base font-semibold cursor-pointer">
                          {productDetails.data.product.data.branchInfo?.manager_name}
                        </p>
                        <p className="text-colorBlack text-sm font-normal flex justify-end">- Manager</p>

                        <p className="flex justify-center mt-1 text-[#000000] text-base font-semibold cursor-pointer">
                          {productDetails.data.product.data.branchInfo?.manager_contact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10">
                <span className="font-semibold text-base text-colorBlack">ITEM DETAILS</span>
                <Divider />
                <div className="flex mt-3 items-center">
                  <span className="text-sm font-semibold mr-2 text-colorBlack">CATEGORY:</span>
                  <span className="text-sm">{productDetails.data.product.data.categoryInfo?.category_name}</span>
                </div>
                <div className="flex mt-1 items-center">
                  <span className="text-sm font-semibold mr-2 text-colorBlack">COLOR:</span>
                  <span
                    className={`rounded-[50%] w-3 h-3`}
                    style={{
                      backgroundColor: productDetails.data.product.data.product_color,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#f1f3f6] w-[100%] mt-10">
          <div className="container mb-8">
            <p className="text-colorBlack pt-4 font-semibold text-xl">SIMILAR PRODUCTS</p>

            <div>
              <Slider {...settings}>
                {productDetails.data.product.related &&
                  productDetails.data.product.related?.map((product, index) => {
                    if (index <= 4) {
                      return (
                        <div className="m-4" key={product.id}>
                          <ProductCard product={product} />
                        </div>
                      );
                    } else if (index === 5) {
                      return (
                        <ProductCard
                          product={product}
                          productDetails={productDetails}
                          viewMore={true}
                          key={product.id}
                        />
                      );
                    }
                  })}
              </Slider>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        authTypeModal={authTypeModal}
        setAuthTypeModal={setAuthTypeModal}
      />
    </>
  );
};

export default withoutAuth(ProductDetail);

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
