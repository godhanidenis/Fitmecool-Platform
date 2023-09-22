import React, { useEffect, useState } from "react";
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Button, Grid, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { shopFollowToggle } from "../../../redux/ducks/userProfile";
import { toast } from "react-toastify";
import { shopFollow } from "../../../graphql/mutations/shops";
import { useDispatch, useSelector } from "react-redux";
import Router, { useRouter } from "next/router";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import facebookIcon from "../../../assets/img//facebook.png";
import whatsUpIcon from "../../../assets/svg/wpToolTipIcon.svg";
import googleIcon from "../../../assets/svg/googleIcon.svg";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ImageLoadingSkeleton from "../../Modal/ImageLoadingSkeleton";
import { ShopHeaderItem } from "../../core/CustomMUIComponents";

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

  const router = useRouter();

  const dispatch = useDispatch();
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );

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

  return (
    <>
      <div className="flex justify-center font-Nova">
        <div className="grid-cols-12 mt-[-100px] container bg-[#151827] rounded-lg shadow-xl">
          <div className="col-span-12 pl-[4%] pr-[4%]">
            <div className="flex flex-col	sm:flex-row">
              <div className="mt-[-45px] flex justify-center">
                {shopDetails?.shop_logo ? (
                  <Image
                    src={shopDetails?.shop_logo ?? ""}
                    alt="shop logo"
                    layout="fixed"
                    width={150}
                    height={150}
                    className="rounded-[50%]"
                  />
                ) : (
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
                      {
                        "Let's be Effortlessly Cool: Embrace Your Signature Style with Us"
                      }
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
                      className="text-colorGreen underline pb-2 sm:pb-10 mt-2 cursor-pointer"
                      onClick={() =>
                        router.push(`/shop/${shopDetails?.id}/branches`)
                      }
                    >
                      See Branches
                    </Typography>
                  </div>
                  <div className="mt-2 sm:mt-5">
                    <Button
                      className="rounded-lg bg-colorGreen hover:bg-colorGreen"
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
                          Router.push("/auth/user-type");
                        }
                      }}
                    >
                      <div className="text-colorWhite normal-case">
                        {shopFollowByUser ? (
                          "UnFollow"
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
              <Grid sx={{ borderRight: 1 }} item xs={3} sm={3}>
                <ShopHeaderItem className="!bg-[#1F2233] !text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row p-2">
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
              <Grid sx={{ borderRight: 1 }} item xs={3} sm={3}>
                <ShopHeaderItem className="!bg-[#1F2233] !text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row  p-2">
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
                sx={{ borderRight: 1 }}
                item
                xs={3}
                sm={3}
                onClick={handleClick}
              >
                <ShopHeaderItem className="!bg-[#1F2233] !text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row  p-2">
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
                <ShopHeaderItem className="!bg-[#1F2233] !text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row p-2">
                  <div className="lg:flex items-center justify-center w-[100%]">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-0 items-center">
                      <ShareIcon
                        fontSize="medium"
                        className="sm:mr-[8px] mr-[5px]"
                      />
                      <p className="text-[10px] sm:text-[16px]">Share</p>
                    </div>
                    <div className="flex pt-2 sm:pt-0 ml-0 sm:ml-6 gap-1 sm:gap-0 items-center">
                      <div className="lg:p-2 rounded-lg cursor-pointer">
                        <FacebookShareButton
                          windowWidth={900}
                          windowHeight={900}
                          url={pageShareURL}
                        >
                          <Image src={facebookIcon ?? ""} alt="facebookIcon" />
                        </FacebookShareButton>
                      </div>
                      <div className="lg:p-2 rounded-lg cursor-pointer">
                        <WhatsappShareButton
                          windowWidth={900}
                          windowHeight={900}
                          url={pageShareURL}
                        >
                          <Image
                            width={26}
                            height={26}
                            src={whatsUpIcon ?? ""}
                            alt="whatsUpIcon"
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
                          <Image src={googleIcon ?? ""} alt="googleIcon" />
                        </EmailShareButton>
                      </div>
                    </div>
                  </div>
                </ShopHeaderItem>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopHeaderSection;
