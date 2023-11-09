import React, { useEffect, useState } from "react";
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Avatar,
  Button,
  ClickAwayListener,
  Grid,
  Typography,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { shopFollowToggle } from "../../../redux/ducks/userProfile";
import { toast } from "react-toastify";
import { shopFollow } from "../../../graphql/mutations/shops";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ImageLoadingSkeleton from "../../Modal/ImageLoadingSkeleton";
import { ShopHeaderItem } from "../../core/CustomMUIComponents";
import { assets } from "../../../constants";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const ShopHeaderSection = ({
  shopDetails,
  totalReview,
  totalFollowers,
  getAllFollowers,
  totalProducts,
  scrollRef,
}) => {
  const pageShareURL = window.location.href;

  const [shopFollowByUser, setShopFollowByUser] = useState(false);
  const [isLogoImage, setIsLogoImage] = useState(false);
  const [isShopLogoLoaded, setIsShopLogoLoaded] = useState(false);
  const [openToolTip, setOpenToolTip] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );

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

  const handleClick = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isAuthenticate) {
      setShopFollowByUser(false);
    }

    const followedShopsByUser = userProfile.shop_follower_list?.find(
      (itm) => itm.shop_id === router.query.id
    );

    followedShopsByUser
      ? setShopFollowByUser(true)
      : setShopFollowByUser(false);
  }, [isAuthenticate, router.query.id, shopFollowByUser, userProfile]);

  const shopSlug = shopDetails?.shop_name.replaceAll(" ", "-");

  return (
    <>
      <div className="flex justify-center font-Nova">
        <div className="grid-cols-12 mt-[-50px] sm:mt-[-100px] container bg-[#151827] rounded-lg shadow-xl">
          <div className="col-span-12 pl-[4%] pr-[4%]">
            <div className="flex flex-col	sm:flex-row">
              <div className="mt-[-45px] flex justify-center">
                {isLogoImage ? (
                  <Avatar
                    className="!bg-colorGreen"
                    sx={{
                      fontSize: window.innerWidth >= 640 ? "70px" : "50px",
                      width: window.innerWidth >= 640 ? 150 : 100,
                      height: window.innerWidth >= 640 ? 150 : 100,
                    }}
                  >
                    {String(shopDetails.shop_name)
                      ?.split(" ")[0][0]
                      .toUpperCase()}
                  </Avatar>
                ) : (
                  <Image
                    src={shopDetails?.shop_logo ?? ""}
                    // unoptimized={true}
                    alt="shop logo"
                    layout="fixed"
                    width={window.innerWidth >= 640 ? 150 : 100}
                    height={window.innerWidth >= 640 ? 150 : 100}
                    className="rounded-[50%] object-cover object-center"
                    onLoad={() => setIsShopLogoLoaded(true)}
                    onError={() => {
                      setIsLogoImage(true);
                    }}
                  />
                )}

                {!isShopLogoLoaded && (
                  <ImageLoadingSkeleton
                    className="rounded-[50%]"
                    variant="circular"
                    width={150}
                    height={150}
                    sx={{
                      backgroundColor: "#F3F6F6",
                    }}
                  />
                )}
              </div>
              <div className="flex flex-col w-full sm:ml-[2%]">
                <div className="flex justify-between flex-nowrap">
                  <div className="flex flex-col sm:mt-3">
                    <div className="font-semibold text-[30px] text-[#FFFFFF] line-clamp-1">
                      {shopDetails.shop_name}
                    </div>
                    <div className="text-[#FFFFFF] text-[18px] font-normal ">
                      Let&apos;s be Effortlessly Cool: Embrace Your Signature
                      Style with Us
                    </div>
                    <span className="text-[#878A99] text-[16px] font-normal flex">
                      <LocationOnIcon
                        fontSize="small"
                        className="-ml-1 !mr-1 text-[red] mb-1"
                      />
                      <span className="line-clamp-1">
                        {shopDetails.branch_info.map(
                          (itm) =>
                            itm.branch_type === "main" && itm.branch_address
                        )}
                      </span>
                    </span>

                    <Typography
                      className="text-colorGreen underline pb-2 sm:pb-10 !mt-2 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/shop/${shopSlug}/${shopDetails?.id}/branches`
                        )
                      }
                    >
                      See Branches
                    </Typography>
                  </div>
                  <div className="mt-2 sm:mt-5">
                    <Button
                      className="!rounded-lg !bg-colorGreen"
                      variant="outlined"
                      onClick={() => {
                        if (isAuthenticate) {
                          shopFollow({
                            shopInfo: {
                              shop_id: router.query.id,
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
                                        value: router.query.id,
                                      },
                                    })
                              );
                              toast.success(res.data.shopFollower.message, {
                                theme: "colored",
                              });
                              getAllFollowers();
                            },
                            (error) => {
                              toast.error(error.message, { theme: "colored" });
                            }
                          );
                        } else {
                          router.push({
                            pathname: "/auth/user-type",
                            query: {
                              redirectPath: new URL(window.location.href)
                                .pathname,
                            },
                          });
                        }
                      }}
                    >
                      <div className="text-colorWhite normal-case">
                        {shopFollowByUser ? (
                          "Following"
                        ) : (
                          <div className="flex items-center">
                            <PersonAddIcon sx={{ color: "#ffffff" }} />
                            <div className="hidden sm:block pt-[2px] ml-2">
                              Follow
                            </div>
                          </div>
                        )}
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[24px] sm:mt-0 relative">
            <Grid container>
              <Grid
                sx={{ borderRight: 1, borderColor: "#e5e7eb46" }}
                item
                xs={3}
                sm={3}
              >
                <ShopHeaderItem className="!bg-[#1F2233] !text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row !p-2">
                  <div className="sm:flex items-center justify-center w-[100%]">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-0 items-center">
                      <ProductionQuantityLimitsIcon
                        fontSize="medium"
                        className="sm:mr-[8px] mr-[5px]"
                      />
                      <p className="text-[10px] sm:text-[16px]">Products</p>
                    </div>
                    <p className="text-[#FFFFFF] text-[20px] sm:text-[32px] pt-1 sm:pt-0 font-medium ml-0 sm:ml-6">
                      {totalProducts}
                    </p>
                  </div>
                </ShopHeaderItem>
              </Grid>
              <Grid
                sx={{ borderRight: 1, borderColor: "#e5e7eb46" }}
                item
                xs={3}
                sm={3}
              >
                <ShopHeaderItem className="!bg-[#1F2233] !text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row  !p-2">
                  <div className="sm:flex items-center justify-center w-[100%]">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-0 items-center">
                      <PeopleAltIcon
                        fontSize="medium"
                        className="sm:mr-[8px] mr-[5px]"
                      />
                      <p className="text-[9px] sm:text-[16px]">Followers</p>
                    </div>
                    <p className="text-[#FFFFFF] text-[20px] sm:text-[32px] pt-1 sm:pt-0 font-medium ml-0 sm:ml-6">
                      {totalFollowers}
                    </p>
                  </div>
                </ShopHeaderItem>
              </Grid>
              <Grid
                sx={{ borderRight: 1, borderColor: "#e5e7eb46" }}
                item
                xs={3}
                sm={3}
                onClick={handleClick}
              >
                <ShopHeaderItem className="!bg-[#1F2233] !text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row  !p-2">
                  <div className="sm:flex items-center justify-center w-[100%]">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-0 items-center">
                      <RateReviewIcon
                        fontSize="medium"
                        className="sm:mr-[8px] mr-[5px]"
                      />
                      <p className="text-[10px] sm:text-[16px]">Review</p>
                    </div>
                    <p className="text-[#FFFFFF] text-[20px] sm:text-[32px] pt-1 sm:pt-0 font-medium ml-0 sm:ml-6">
                      {totalReview}
                    </p>
                  </div>
                </ShopHeaderItem>
              </Grid>
              <Grid item xs={3} sm={3}>
                {window.innerWidth >= 1024 ? (
                  <ShopHeaderItem className="!bg-[#1F2233] !text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row !p-2">
                    <div className="lg:flex items-center justify-center w-[100%]">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-0 items-center md:justify-center">
                        <ShareIcon
                          fontSize="medium"
                          className="sm:mr-[8px] mr-[5px]"
                        />
                        <p className="text-[10px] sm:text-[16px]">Share</p>
                      </div>
                      <div className="flex pt-2 sm:pt-0 ml-0 sm:ml-6 lg:ml-0 xl:ml-6 gap-1 lg:gap-0 items-center md:justify-center">
                        <div className="lg:p-2 rounded-lg cursor-pointer">
                          <FacebookShareButton
                            windowWidth={900}
                            windowHeight={900}
                            url={pageShareURL}
                          >
                            <Image
                              src={assets.facebookIcon}
                              width={26}
                              height={26}
                              alt="facebookIcon"
                            />
                          </FacebookShareButton>
                        </div>
                        <div className="lg:p-2 !rounded-lg cursor-pointer">
                          <WhatsappShareButton
                            windowWidth={900}
                            windowHeight={900}
                            url={pageShareURL}
                          >
                            <WhatsappIcon
                              size={26}
                              round={true}
                              className="w-full"
                            />
                          </WhatsappShareButton>
                        </div>
                        <div className="lg:p-2 mt-[2px] rounded-lg cursor-pointer">
                          <EmailShareButton
                            subject="Shop Detail"
                            windowWidth={900}
                            windowHeight={900}
                            url={pageShareURL}
                          >
                            <Image
                              src={assets.googleIcon}
                              width={26}
                              height={26}
                              alt="googleIcon"
                            />
                          </EmailShareButton>
                        </div>
                      </div>
                    </div>
                  </ShopHeaderItem>
                ) : (
                  <ClickAwayListener onClickAway={() => setOpenToolTip(false)}>
                    <ShopHeaderItem
                      onClick={() => setOpenToolTip(!openToolTip)}
                      className="!bg-[#1F2233] !text-[#FFFFFF] !cursor-pointer flex items-center justify-center !p-2 w-full h-full"
                    >
                      <div
                        className="flex items-center justify-center w-full h-full"
                        onMouseLeave={() => setOpenToolTip(false)}
                      >
                        <HtmlTooltip
                          title={
                            <div className="flex items-center justify-center">
                              <div className="p-1.5 sm:p-2 rounded-lg cursor-pointer">
                                <FacebookShareButton
                                  windowWidth={900}
                                  windowHeight={900}
                                  url={pageShareURL}
                                >
                                  <Image
                                    src={assets.facebookIcon}
                                    width={window.innerWidth >= 640 ? 30 : 22}
                                    height={window.innerWidth >= 640 ? 30 : 22}
                                    alt="facebookIcon"
                                  />
                                </FacebookShareButton>
                              </div>
                              <div className="p-1.5 sm:p-2 !rounded-lg cursor-pointer">
                                <WhatsappShareButton
                                  windowWidth={900}
                                  windowHeight={900}
                                  url={pageShareURL}
                                >
                                  <WhatsappIcon
                                    size={window.innerWidth >= 640 ? 30 : 22}
                                    round={true}
                                    className="w-full"
                                  />
                                </WhatsappShareButton>
                              </div>
                              <div className="p-1.5 sm:p-2 mt-[2px] rounded-lg cursor-pointer">
                                <EmailShareButton
                                  subject="Shop Detail"
                                  windowWidth={900}
                                  windowHeight={900}
                                  url={pageShareURL}
                                >
                                  <Image
                                    src={assets.googleIcon}
                                    width={window.innerWidth >= 640 ? 30 : 22}
                                    height={window.innerWidth >= 640 ? 30 : 22}
                                    alt="googleIcon"
                                  />
                                </EmailShareButton>
                              </div>
                            </div>
                          }
                        >
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-0 items-center md:justify-center">
                            <ShareIcon
                              fontSize="medium"
                              className="sm:mr-[8px] mr-[5px]"
                            />
                            <p className="text-[10px] sm:text-[16px]">Share</p>
                          </div>
                        </HtmlTooltip>
                      </div>
                    </ShopHeaderItem>
                  </ClickAwayListener>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopHeaderSection;
