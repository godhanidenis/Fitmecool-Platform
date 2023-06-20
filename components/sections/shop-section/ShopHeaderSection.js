import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Button,
  Divider,
  Grid,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { shopFollowToggle } from "../../../redux/ducks/userProfile";
import { toast } from "react-toastify";
import { shopFollow } from "../../../graphql/mutations/shops";
import { useDispatch, useSelector } from "react-redux";
import Router, { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import facebookIcon from "../../../assets/facebook.png";
import whatsUpIcon from "../../../assets/wpToolTipIcon.svg";
import googleIcon from "../../../assets/googleIcon.svg";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import AddIcon from "@mui/icons-material/Add";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fbfbfb",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "none",
}));

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

  const [OpenToolTip, setOpenToolTip] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );
  const { themeLayout } = useSelector((state) => state.themeLayout);

  const handleClick = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip open={OpenToolTip} {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#ffffff",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      boxShadow: "0 0 10px rgba(0,0,0,.1)",
      top: 0,
    },
    [theme.breakpoints.down("sm")]: {
      [`& .${tooltipClasses.tooltip}`]: {
        marginTop: "2px !important",
        padding: "5px 0px !important",
      },
    },
  }));
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
        <div className="grid-cols-12 mt-[-50px] container bg-[#151827]">
          <div className="col-span-12 pl-[4%] pr-[4%]">
            <div className="flex flex-col	sm:flex-row	">
              <div className="mt-[-45px] flex justify-center">
                <Image
                  src={shopDetails?.shop_logo ?? ""}
                  alt="shop logo"
                  layout="fixed"
                  width={150}
                  height={150}
                  className="rounded-[50%]"
                />
              </div>
              <div className="flex flex-col w-full sm:ml-[2%]">
                <div className="sm:flex justify-between flex-nowrap">
                  <div className="flex flex-col sm:mt-3">
                    <div className="oneLineAfterThreeDots font-semibold text-[30px] text-[#FFFFFF]">
                      {shopDetails.shop_name}
                    </div>
                    <div className="oneLineAfterThreeDots text-[#FFFFFF] text-[18px] font-normal ">
                      Contourz by Taruna Manchanda
                    </div>
                    <span className="sm:pb-[55px] pb-[30px] text-[#878A99] text-[16px] font-normal oneLineAfterThreeDots">
                      <LocationOnIcon
                        fontSize="small"
                        className="-ml-1 !mr-1 text-[red]"
                      />
                      {shopDetails.branch_info.map(
                        (itm) =>
                          itm.branch_type === "main" && itm.branch_address
                      )}
                    </span>
                  </div>
                  <div className="flex sm:mt-6 items-start">
                    <Button
                      className="border !border-[#FFFFFF] w-[120px] rounded-[8px]"
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
                      <Typography
                        sx={{ textTransform: "none", color: "#FFFFFF" }}
                      >
                        {shopFollowByUser ? (
                          "UnFollow"
                        ) : (
                          <>
                            <div className="flex items-center">
                              <AddIcon className="w-[22px] h-[22px]" />
                              <div className="pt-[2px]">Follow</div>
                            </div>
                          </>
                        )}
                      </Typography>
                    </Button>
                    <div className="ml-[24px]">
                      <a
                        target="_blank"
                        href={`/shop/${shopDetails?.id}/branches`}
                      >
                        <Button
                          variant="contained"
                          className={`!bg-colorGreen !hover:bg-colorGreen !flex !items-center !justify-center capitalize`}
                          // onClick={() =>
                          //   Router.push(`/shop/${shopDetails?.id}/branches`)
                          // }
                        >
                          <Typography color="#FFFFFF">See Branches</Typography>
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[24px] sm:mt-0 relative">
            <Grid container>
              <Grid sx={{ borderRight: 1 }} item xs={3} sm={3}>
                <Item className="!bg-[#1F2233] text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row">
                  <div className="sm:flex items-center justify-between w-[100%]">
                    <div className="flex items-center">
                      <ProductionQuantityLimitsIcon
                        fontSize="small"
                        className="sm:mr-[16px] mr-[5px]"
                      />
                      <p className="text-[10px] sm:text-[16px]">Product </p>
                    </div>
                    <p className="text-[#FFFFFF] text-[16px] sm:text-[32px] pt-[12px] sm:pt-0 font-medium">
                      {totalProducts}
                    </p>
                  </div>
                </Item>
              </Grid>
              <Grid sx={{ borderRight: 1 }} item xs={3} sm={3}>
                <Item className="!bg-[#1F2233] text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row">
                  <div className="sm:flex items-center justify-between w-[100%]">
                    <div className="flex items-center">
                      <PeopleAltIcon
                        fontSize="small"
                        className="sm:mr-[16px] mr-[5px]"
                      />
                      <p className="text-[9px] sm:text-[16px]">Followers </p>
                    </div>
                    <p className="text-[#FFFFFF] text-[16px] sm:text-[32px] pt-[12px] sm:pt-0 font-medium">
                      {totalFollowers}
                    </p>
                  </div>
                </Item>
              </Grid>
              <Grid
                sx={{ borderRight: 1 }}
                item
                xs={3}
                sm={3}
                onClick={handleClick}
              >
                <Item className="!bg-[#1F2233] text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row">
                  <div className="sm:flex items-center justify-between w-[100%]">
                    <div className="flex items-center">
                      <RateReviewIcon
                        fontSize="small"
                        className="sm:mr-[16px] mr-[5px]"
                      />
                      <p className="text-[10px] sm:text-[16px]">Review </p>
                    </div>
                    <p className="text-[#FFFFFF] text-[16px] sm:text-[32px] pt-[12px] sm:pt-0 font-medium">
                      {totalReview}
                    </p>
                  </div>
                </Item>
              </Grid>
              <Grid
                item
                xs={3}
                sm={3}
                onMouseLeave={() => setOpenToolTip(false)}
              >
                <Item className="!bg-[#1F2233] text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row">
                  <div className="lg:flex items-center justify-between w-[100%]">
                    <div className="flex items-center">
                      <ShareIcon
                        fontSize="small"
                        className="sm:mr-[16px] mr-[5px]"
                      />
                      <p className="text-[10px] sm:text-[16px]">Share </p>
                    </div>
                    <div className="flex gap-1 pt-[12px] sm:pt-0">
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
                </Item>
                {/* <HtmlTooltip
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
                            <WhatsappIcon size={25} round={true} />
                          </WhatsappShareButton>
                        </div>
                        <div className="p-2 mt-[2px] rounded-lg cursor-pointer">
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
                    </React.Fragment>
                  }
                >
                  <Item
                    onClick={() => setOpenToolTip(!OpenToolTip)}
                    className="!bg-[#1F2233] text-[#FFFFFF]  !cursor-pointer flex flex-col sm:flex-row"
                  >
                    <div className="flex items-center justify-between w-[100%]">
                      <div className="flex items-center">
                        <ShareIcon fontSize="small" className="sm:mr-[16px] mr-[5px]" />
                        <p className="sm:py-[10px] py-[20px] text-[10px] sm:text-[16px]">Share </p>
                      </div>
                    </div>
                  </Item>
                </HtmlTooltip> */}
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopHeaderSection;
