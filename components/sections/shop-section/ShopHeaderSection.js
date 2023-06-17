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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShareIcon from "@mui/icons-material/Share";
import { shopFollowToggle } from "../../../redux/ducks/userProfile";
import { toast } from "react-toastify";
import { shopFollow } from "../../../graphql/mutations/shops";
import { useDispatch, useSelector } from "react-redux";
import { AuthTypeModal } from "../../core/Enum";
import AuthModal from "../../core/AuthModal";
import Router, { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import facebookIcon from "../../../assets/facebook.png";
import instagramIcon from "../../../assets/instagram.png";
import googleIcon from "../../../assets/googleIcon.svg";
import { CustomAuthModal } from "../../core/CustomMUIComponents";
import { Box } from "@mui/system";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import shareIcon from "../../../assets/shareIcon.svg";
import AddIcon from "@mui/icons-material/Add";

const ShopHeaderSection = ({
  shopDetails,
  totalReview,
  totalFollowers,
  getAllFollowers,
  totalProducts,
  scrollRef,
}) => {
  console.log("shopDetails", shopDetails);

  const pageShareURL = window.location.href;

  const [shopFollowByUser, setShopFollowByUser] = useState(false);

  const [open, setOpen] = useState(false);
  const [authTypeModal, setAuthTypeModal] = useState();
  const [OpenToolTip, setOpenToolTip] = useState(false);
  const [allBranchModalOpen, setAllBranchModalOpen] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );
  const { themeLayout } = useSelector((state) => state.themeLayout);

  const handleClick = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const HandleGoToSeeBranch = () => {
    router.push(`/shop/${shopDetails?.id}/branches`);
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
      marginTop: "10px !important",
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
        <div className="grid-cols-12 mt-[-50px] sm:w-[90%] bg-[#151827]">
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
                <div className="flex justify-between flex-nowrap">
                  <div className="flex flex-col sm:mt-3">
                    <div className="oneLineAfterThreeDots font-semibold text-[30px] text-[#FFFFFF]">
                      {shopDetails.shop_name}
                    </div>
                    <div className="oneLineAfterThreeDots text-[#FFFFFF] text-[18px] font-normal ">
                      Contourz by Taruna Manchanda
                    </div>
                    <span className="pb-[55px] text-[#878A99] text-[16px] font-normal oneLineAfterThreeDots">
                      <LocationOnIcon fontSize="small" className="-ml-1 !mr-1 text-[red]" />
                      {shopDetails.branch_info.map(
                        (itm) =>
                          itm.branch_type === "main" && itm.branch_address
                      )}
                    </span>

                    {/* <div className="mt-[24px] mb-[80px]">
                      <Button
                        variant="contained"
                        className={`rounded-[500px] bg-[#29977E] hover:bg-[#29977E] !flex !items-center !justify-center capitalize`}
                        onClick={() => HandleGoToSeeBranch()}
                      >
                        <Typography color="#FFFFFF">See Branches</Typography>
                      </Button>
                    </div> */}
                    {/* <div className="flex gap-7 mb-[10px] flex-wrap">
                      <div className="w-[175px] h-[176px] border border-[#151827] rounded-xl flex flex-col justify-center items-center">
                        <p className="text-[#878A99] text-[48px] font-semibold">{totalProducts}</p>
                        <p className="text-[#31333E] text-[24px] font-normal">Product</p>
                      </div>
                      <div className="w-[175px] h-[176px] border border-[#151827] rounded-xl flex flex-col justify-center items-center">
                        <p className="text-[#878A99] text-[48px] font-semibold">{totalFollowers}</p>
                        <p className="text-[#31333E] text-[24px] font-normal">Followers</p>
                      </div>
                      <div className="w-[175px] h-[176px] border border-[#151827] rounded-xl flex flex-col justify-center items-center">
                        <p className="text-[#878A99] text-[48px] font-semibold">{totalReview}</p>
                        <p className="text-[#31333E] text-[24px] font-normal">Review</p>
                      </div>
                      <div
                        onMouseLeave={() => setOpenToolTip(false)}
                        className="w-[175px] h-[176px] border border-[#151827] rounded-xl flex flex-col justify-center items-center pt-[40px]"
                      >
                        <Image
                          onClick={() => setOpenToolTip(!OpenToolTip)}
                          src={shareIcon}
                          className="cursor-pointer"
                          alt=""
                        />
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
                          <p
                            onClick={() => setOpenToolTip(!OpenToolTip)}
                            className="text-[#31333E] text-[24px] font-normal cursor-pointer mt-[14px]"
                          >
                            Share
                          </p>
                        </HtmlTooltip>
                      </div>
                    </div> */}
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
                          if (themeLayout === "mobileScreen") {
                            Router.push("/auth/signin");
                          } else {
                            setOpen(true),
                              setAuthTypeModal(AuthTypeModal.Signin);
                          }
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
                      <Button
                        variant="contained"
                        className={`!bg-[#29977E] !hover:bg-[#29977E] !flex !items-center !justify-center capitalize`}
                        onClick={() => HandleGoToSeeBranch()}
                      >
                        <Typography color="#FFFFFF">See Branches</Typography>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-span-12 items-center justify-end flex my-5 pl-[4%] pr-[4%]">
            <Button
              variant="contained"
              className={`rounded-xl bg-colorPrimary hover:bg-colorPrimary !flex !items-center !justify-center capitalize`}
              onClick={() => setAllBranchModalOpen(true)}
            >
              <Typography color="#FFFFFF">See Branches</Typography>
            </Button>
          </div> */}

          <Grid container>
            <Grid item sm={3}>
              <div className="bg-[#1F2233] text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row">
                <div className="flex items-center justify-center w-[100%] py-2">
                  <span>
                    <ProductionQuantityLimitsIcon /> Products{" "}
                  </span>
                  <span className="text-[#FFFFFF] text-[32px] font-medium ml-4">
                    {totalProducts}
                  </span>
                </div>
              </div>
            </Grid>
            <Divider
              className="block"
              orientation="vertical"
              variant="middle"
              flexItem
            />
            <Grid item sm={3}>
              <div className="bg-[#1F2233] text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row">
                <div className="flex items-center justify-center w-[100%] py-2">
                  <span>
                    <PeopleAltIcon /> Followers{" "}
                  </span>
                  <span className="text-[#FFFFFF] text-[32px] font-medium ml-4">
                    {totalFollowers}
                  </span>
                </div>
              </div>
            </Grid>
            <Divider
              className="block"
              orientation="vertical"
              variant="middle"
              flexItem
            />
            <Grid item sm={3} onClick={handleClick}>
              <div className="bg-[#1F2233] text-[#FFFFFF] !cursor-pointer flex flex-col sm:flex-row">
                <div className="flex items-center justify-center w-[100%] py-2">
                  <span>
                    <RateReviewIcon /> Reviews{" "}
                  </span>
                  <span className="text-[#FFFFFF] text-[32px] font-medium ml-4">
                    {totalReview}
                  </span>
                </div>
              </div>
            </Grid>
            <Divider
              className="block"
              orientation="vertical"
              variant="middle"
              flexItem
            />
            <Grid item sm={2.9} onMouseLeave={() => setOpenToolTip(false)}>
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
                          <Image src={facebookIcon ?? ""} alt="facebookIcon" />
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
                <div
                  onClick={() => setOpenToolTip(!OpenToolTip)}
                  className="bg-[#1F2233] text-[#FFFFFF]  !cursor-pointer flex flex-col sm:flex-row"
                >
                  {/* <ShareIcon /> Share */}
                  <div className="flex items-center justify-center w-[100%] py-2">
                    <ShareIcon />
                    <span className="py-[10px] ml-[2px]">Share </span>
                    {/* <p>{totalReview}</p> */}
                  </div>
                </div>
              </HtmlTooltip>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default ShopHeaderSection;
