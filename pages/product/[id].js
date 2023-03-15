import React, { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import facebookIcon from "../../assets/facebook.png";
import instagramIcon from "../../assets/instagram.png";
import googleIcon from "../../assets/googleIcon.svg";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import Image from "next/image";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormGroup,
  Rating,
  Switch,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Slider from "react-slick";
// import ReactImageMagnify from "react-image-magnify";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getProductDetails } from "../../graphql/queries/productQueries";
import ProfileIcon from "../../assets/profile.png";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ProductCard from "../../components/sections/product-section/ProductCard";
import AuthModal from "../../components/core/AuthModal";
import { AuthTypeModal } from "../../components/core/Enum";
import { useDispatch, useSelector } from "react-redux";
import { shopFollow } from "../../graphql/mutations/shops";
import { toast } from "react-toastify";
import {
  productLikeToggle,
  shopFollowToggle,
} from "../../redux/ducks/userProfile";
import { productLike } from "../../graphql/mutations/products";
import Link from "next/link";
import SubHeader from "../../components/Layout/SubHeader";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Carousel, {
  autoplayPlugin,
  slidesToShowPlugin,
} from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

const ProductDetail = ({ productDetails }) => {
  console.log("productDetails", productDetails);

  const [shopFollowByUser, setShopFollowByUser] = useState(false);
  const [productLikeByUser, setProductLikeByUser] = useState(false);

  const [open, setOpen] = useState(false);
  const [authTypeModal, setAuthTypeModal] = useState();
  const dispatch = useDispatch();
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );

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

  const photos = [
    productDetails.data.product.data.product_image?.front,
    productDetails.data.product.data.product_image?.back,
    productDetails.data.product.data.product_image?.side,
  ];
  const [openContactInfo, setOpenContactInfo] = useState(false);
  const [images, setImages] = useState(photos[0]);

  const slider = useRef(null);

  var productSliderSetting = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    vertical: true,
    verticalSwiping: true,
    arrows: false,
  };

  const contactInfoSwitchHandler = (event) => {
    setOpenContactInfo(event.target.checked);
  };
  const selectImage = (img, i) => {
    setImages(img);
  };

  const items = photos.map((itm, i) => {
    return (
      <div
        className="w-[70%] mx-auto my-2"
        onMouseEnter={() => selectImage(itm, i)}
        key={i}
        onClick={() => selectImage(itm, i)}
      >
        <Image
          src={itm}
          alt="Product Images"
          width={250}
          height={300}
          className="rounded"
        />
      </div>
    );
  });

  return (
    <>
      <SubHeader />
      <div className="bg-colorWhite">
        <div className="p-5 w-[85%] mx-auto">
          <div className="grid grid-cols-2 p-2 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <div className="p-2 py-5">
                    <KeyboardArrowUpIcon
                      onClick={() => slider?.current?.slickNext()}
                      className="flex cursor-pointer m-auto"
                    />
                    <Slider {...productSliderSetting} ref={slider}>
                      <div className="bg-white cursor-pointer">{items}</div>
                      <div className="bg-white cursor-pointer">{items}</div>
                    </Slider>
                    <KeyboardArrowDownIcon
                      onClick={() => slider?.current?.slickPrev()}
                      className="flex cursor-pointer m-auto"
                    />
                  </div>
                </div>
                <div className="col-span-3 border-2 flex justify-center items-center bg-colorWhite h-[70vh]">
                  <div style={{ width: "60%" }}>
                    {/* <ReactImageMagnify
                      {...{
                        smallImage: {
                          alt: "Wristwatch by Ted Baker London",
                          isFluidWidth: true,
                          src: images,
                        },
                        largeImage: {
                          src: images,
                          width: 1200,
                          height: 800,
                        },
                        enlargedImageContainerDimensions: {
                          width: "100%",
                          height: "100%",
                        },
                      }}
                    /> */}
                  </div>
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-3 pt-5 flex justify-between items-center bg-colorWhite ">
                  {/* <div className=""> */}
                  <Button variant="outlined" sx={{ textTransform: "none" }}>
                    <FavoriteBorderOutlinedIcon /> &nbsp; Like & Save
                  </Button>
                  <Button variant="outlined" sx={{ textTransform: "none" }}>
                    <FileUploadOutlinedIcon /> &nbsp; Share
                  </Button>
                  <Button variant="outlined" sx={{ textTransform: "none" }}>
                    <ReportGmailerrorredOutlinedIcon /> &nbsp;Report
                  </Button>
                  {/* </div> */}
                </div>
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Box sx={{ boxShadow: "0 0 10px rgb(0 0 0 / 10%)" }}>
                <div className="bg-colorWhite p-3 rounded-lg grid grid-cols-3">
                  <div className="col-span-1 flex justify-start items-center">
                    <div className="flex justify-start items-center">
                      <div className="flex justify-center items-center">
                        <Image
                          alt="Shop Logo"
                          src={
                            productDetails.data.product.data.branchInfo
                              ?.shop_info.shop_logo
                          }
                          width={80}
                          height={50}
                          className="rounded-[50%]"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link
                          href={`/shop/${productDetails.data.product.data.branchInfo?.shop_id}`}
                        >
                          <a target="_blank">
                            <p className="text-[#000000] text-base font-semibold cursor-pointer hover:text-colorPrimary">
                              {
                                productDetails.data.product.data.branchInfo
                                  ?.shop_info.shop_name
                              }
                            </p>
                          </a>
                        </Link>
                        <p className="text-[#888888] text-sm font-normal">
                          25 days ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center flex-col items-center">
                    <Rating
                      name="text-feedback"
                      value={Math.round(
                        productDetails.data.product.data.branchInfo?.shop_info
                          .shop_rating
                      )}
                      readOnly
                      // size=""
                      emptyIcon={<StarIcon fontSize="inherit" />}
                    />
                    <p className="text-[#888888] font-normal flex items-center">
                      <LocationOnIcon fontSize="small" className="mr-1" />
                      {
                        productDetails.data.product.data.branchInfo
                          ?.branch_address
                      }
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      variant="contained"
                      sx={{ textTransform: "none" }}
                      className={`rounded-md ${
                        shopFollowByUser
                          ? "bg-green-500 hover:bg-green-500"
                          : "bg-colorBlack hover:bg-colorBlack"
                      }   !flex !items-center !justify-center`}
                      endIcon={<PersonAddIcon fontSize="large" />}
                      onClick={() => {
                        if (isAuthenticate) {
                          shopFollow({
                            shopInfo: {
                              shop_id:
                                productDetails.data.product.data.branchInfo
                                  ?.shop_id,
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
                                          productDetails.data.product.data
                                            .branchInfo.shop_id,
                                      },
                                    })
                              );
                              toast.success(res.data.shopFollower.message, {
                                theme: "colored",
                              });
                            },
                            (error) => {
                              toast.error(error.message, { theme: "colored" });
                            }
                          );
                        } else {
                          setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
                        }
                      }}
                    >
                      <Typography color="#FFFFFF">
                        {shopFollowByUser ? "UnFollow" : "Follow"}
                      </Typography>
                    </Button>
                  </div>
                </div>
              </Box>
              <div className="pt-5">
                <div className="flex justify-between">
                  <p className="font-semibold text-2xl text-colorBlack">
                    {productDetails.data.product.data.product_name}
                  </p>
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
                                      value:
                                        productDetails.data.product.data.id,
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
                        setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
                      }
                    }}
                  >
                    {!productLikeByUser ? (
                      <FavoriteBorderIcon fontSize="medium" />
                    ) : (
                      "❤️"
                    )}
                  </button>
                </div>
                <p className="pt-3 font-normal text-lg text-[#888888]">
                  {productDetails.data.product.data.product_description}
                </p>
              </div>

              <div className="flex items-center pt-12 font-semibold text-xl text-colorBlack gap-10">
                Color :
                <div
                  className={`rounded-[50%] w-5 h-5`}
                  style={{
                    backgroundColor:
                      productDetails.data.product.data.product_color,
                  }}
                />
              </div>

              <div className="flex justify-center items-center pt-10">
                <a
                  href={`https://api.whatsapp.com/send?phone=${productDetails.data.product.data.branchInfo?.manager_contact}`}
                  target="_blank"
                  className="w-full"
                  rel="noreferrer"
                >
                  <button
                    className="bg-colorWhite hover:bg-colorWhite text-colorBlack p-5 w-full rounded-xl tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline 
                  shadow-lg flex items-center justify-center gap-3"
                  >
                    <WhatsAppIcon className="text-green-600" />
                    Contact to Whatsapp
                  </button>
                </a>
              </div>
              <p className="flex items-center justify-center py-3 text-lg text-colorStone">
                or
              </p>
              <div className="flex justify-center items-center">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <PersonOutlineIcon
                        fontSize="large"
                        className="text-colorBlack"
                      />
                    }
                    label={
                      <Typography sx={{ fontWeight: 600, color: "black" }}>
                        Show contact info
                      </Typography>
                    }
                  />
                </FormGroup>
                <Switch
                  checked={openContactInfo}
                  onChange={contactInfoSwitchHandler}
                />
              </div>

              {openContactInfo && (
                <div className="flex justify-center items-center mt-3">
                  <div className="bg-colorWhite rounded-lg flex items-center shadow-lg">
                    <div className="p-5 flex gap-4 justify-start">
                      <div className="flex justify-center items-center">
                        <Image
                          alt="Shop Logo"
                          src={
                            productDetails.data.product.data.branchInfo
                              ?.shop_info?.shop_logo
                          }
                          width={80}
                          height={50}
                          className="rounded-[50%]"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[#000000] text-base font-semibold cursor-pointer">
                          {
                            productDetails.data.product.data.branchInfo
                              ?.shop_info?.shop_name
                          }
                        </p>
                        <p className="text-[#888888] text-sm font-normal">
                          {
                            productDetails.data.product.data.branchInfo
                              ?.branch_address
                          }
                        </p>
                      </div>
                    </div>
                    <Divider orientation="vertical" flexItem />
                    <div className="p-5 flex gap-4 justify-start">
                      <div className="flex justify-center items-center">
                        <Avatar className=" !w-14 !h-14">
                          <Image src={ProfileIcon} alt="ProfileIcon" />
                        </Avatar>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[#000000] text-base font-semibold cursor-pointer">
                          {
                            productDetails.data.product.data.branchInfo
                              ?.manager_name
                          }
                        </p>
                        <p className="text-colorBlack text-sm font-normal flex justify-end">
                          - Manager
                        </p>

                        <p className="flex justify-center mt-1 text-[#000000] text-base font-semibold cursor-pointer">
                          {
                            productDetails.data.product.data.branchInfo
                              ?.manager_contact
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* <div className="flex justify-center items-center pt-5 gap-10">
                <Typography sx={{ fontWeight: 600, color: "black" }}>
                  Share :
                </Typography>
                <a
                  className="p-2 rounded-lg bg-colorWhite cursor-pointer"
                  href={`${productDetails.data.product.data.branchInfo.shop_info.shop_social_link.facebook}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image src={facebookIcon} alt="facebookIcon" />
                </a>
                <a
                  className="p-2 rounded-lg bg-colorWhite cursor-pointer"
                  href={`${productDetails.data.product.data.branchInfo.shop_info.shop_social_link.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image src={instagramIcon} alt="instagramIcon" />
                </a>
                <a
                  className="p-2 rounded-lg bg-colorWhite cursor-pointer"
                  href={`${productDetails.data.product.data.branchInfo.shop_info.shop_social_link.website}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image src={googleIcon} alt="googleIcon" />
                </a>
              </div> */}
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5F5] p-5 w-[95%] mx-auto my-10">
          <p className="text-colorBlack pb-2 font-semibold text-xl">
            Special Products
          </p>

          {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center mb-10"> */}
            <Carousel
              // value={value}
              // onChange={onChange}
              plugins={[
                'infinite',
                {
                  resolve: slidesToShowPlugin,
                  options: {
                   numberOfSlides: 5
                  }
                },
                {      
                resolve: autoplayPlugin,
                  options: {
                    interval: 2000,
                  }
                },
              ]}
              breakpoints={{
                820: {
                  plugins: [
                   {
                     resolve: slidesToShowPlugin,
                     options: {
                      numberOfSlides: 2
                     },
                     resolve: autoplayPlugin,
                     options: {
                       interval: 2000,
                     }
                   },
                 ]
                }
              }}
              animationSpeed={2000}
              arrows
              // infinite
              slidesPerPage={4}
            >
              {productDetails.data.product.related &&
                productDetails.data.product.related?.map((product) => {
                  return <ProductCard product={product} key={product.id} />;
                })}
            </Carousel>
          {/* </div> */}
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

export default ProductDetail;

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
