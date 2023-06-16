import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Button, Divider, Grid, Tooltip, tooltipClasses, Typography } from "@mui/material";
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
import { EmailShareButton, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import shareIcon from "../../../assets/shareIcon.svg";
import AddIcon from "@mui/icons-material/Add";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fbfbfb",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "none",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxWidth: "1200px",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  height: "auto",
};

const ShopHeaderSection = ({ shopDetails, totalReview, totalFollowers, getAllFollowers, totalProducts, scrollRef }) => {
  console.log("shopDetails", shopDetails);

  const pageShareURL = window.location.href;

  const [shopFollowByUser, setShopFollowByUser] = useState(false);

  const [open, setOpen] = useState(false);
  const [authTypeModal, setAuthTypeModal] = useState();
  const [OpenToolTip, setOpenToolTip] = useState(false);
  const [allBranchModalOpen, setAllBranchModalOpen] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();
  const { userProfile, isAuthenticate } = useSelector((state) => state.userProfile);
  const { themeLayout } = useSelector((state) => state.themeLayout);

  const handleClick = () => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const HandleGoToSeeBranch = () => {
    router.push(`/shop/${shopDetails?.id}/seeBranch`)
    // const serializedData = JSON.stringify(shopDetails?.branch_info);
    // const queryString = new URLSearchParams(shopDetails).toString();

    // router.push({
    //   pathname: `/shop/${shopDetails?.id}/seeBranch/`,
    //   query: { data: queryString },
    // });

    

    // router.push(
    //   {
    //     pathname: `/shop/${shopDetails?.id}/seeBranch/`,
    //     query: { data: "" },
    //   }
    // );
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

    const followedShopsByUser = userProfile.shop_follower_list?.find((itm) => itm.shop_id === router.query.id);

    followedShopsByUser ? setShopFollowByUser(true) : setShopFollowByUser(false);
  }, [isAuthenticate, router.query.id, shopFollowByUser, userProfile]);

  return (
    <>
      <div className="flex justify-center font-Nova">
        <div className="grid-cols-12 mt-[-50px] rounded-xl sm:w-[100%] bg-[#FFFFFF]">
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
              <div className="flex flex-col w-full sm:ml-[4%]">
                <div className="flex justify-between flex-nowrap">
                  <div className="flex flex-col sm:mt-5">
                    <div className="oneLineAfterThreeDots font-semibold text-2xl text-[#000000]">
                      {shopDetails.shop_name}
                    </div>
                    <p className="text-[#878A99] text-[16px] font-normal oneLineAfterThreeDots">
                      <LocationOnIcon fontSize="small" className="!mr-1" />
                      {shopDetails.branch_info.map((itm) => itm.branch_type === "main" && itm.branch_address)}
                    </p>
                    <div className="oneLineAfterThreeDots mt-[15px] text-[#151827] text-[24px] font-normal ">
                      Contourz by Taruna Manchanda
                    </div>
                    <div className="mt-[24px] mb-[80px]">
                      <Button
                        variant="contained"
                        className={`rounded-[500px] bg-[#29977E] hover:bg-[#29977E] !flex !items-center !justify-center capitalize`}
                        onClick={() => HandleGoToSeeBranch()}
                      >
                        <Typography color="#FFFFFF">See Branches</Typography>
                      </Button>
                    </div>
                    <div className="flex gap-7 mb-[10px] flex-wrap">
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
                                    {/* <Image src={instagramIcon ?? "" } alt="instagramIcon" /> */}
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
                    </div>
                  </div>
                  <div className="flex sm:mt-[6%] items-start">
                    <Button
                      className="border border-[#29977E] w-[120px] rounded-[8px]"
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
                            setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
                          }
                        }
                      }}
                    >
                      <Typography sx={{ textTransform: "none", color: "#29977E" }}>
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

          {/* <Grid container sx={{ backgroundColor: "#fbfbfb" }}>
            <Grid item sm={3}>
              <Item className="!cursor-pointer flex items-center justify-center flex-col sm:flex-row !p-3">
                <ProductionQuantityLimitsIcon /> {totalProducts} Product
              </Item>
            </Grid>
            <Divider className="block" orientation="vertical" variant="middle" flexItem />
            <Grid item sm={3}>
              <Item className="!cursor-pointer flex items-center justify-center flex-col sm:flex-row !p-3">
                <PeopleAltIcon /> {totalFollowers} Followers
              </Item>
            </Grid>
            <Divider className="block" orientation="vertical" variant="middle" flexItem />
            <Grid item sm={3} onClick={handleClick}>
              <Item className="!cursor-pointer flex items-center justify-center flex-col sm:flex-row !p-3">
                <RateReviewIcon /> {totalReview} Review
              </Item>
            </Grid>
            <Divider className="block" orientation="vertical" variant="middle" flexItem />
            <Grid item sm={2.5} onMouseLeave={() => setOpenToolTip(false)}>
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
                        <EmailShareButton subject="Shop Detail" windowWidth={900} windowHeight={900} url={pageShareURL}>
                          <Image src={googleIcon ?? ""} alt="googleIcon" />
                        </EmailShareButton>
                      </div>
                    </div>
                  </React.Fragment>
                }
              >
                <Item
                  onClick={() => setOpenToolTip(!OpenToolTip)}
                  className="!cursor-pointer flex items-center justify-center flex-col sm:flex-row !p-3"
                >
                  <ShareIcon /> Share
                </Item>
              </HtmlTooltip>
            </Grid>
          </Grid> */}
        </div>
      </div>
      <AllBranchModal
        allBranchModalOpen={allBranchModalOpen}
        setAllBranchModalOpen={setAllBranchModalOpen}
        allBranchList={shopDetails?.branch_info}
      />
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

export default ShopHeaderSection;

const AllBranchModal = ({ allBranchModalOpen, setAllBranchModalOpen, allBranchList }) => {
  console.log("allBranchList", allBranchList);
  return (
    <>
      <CustomAuthModal
        open={allBranchModalOpen}
        onClose={() => setAllBranchModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="animate__animated animate__slideInDown"
      >
        <Box sx={style} className="!w-[90%] lg:!w-1/2 !bg-[#F5F5F5]">
          <div className="p-5">
            <div className="flex items-center">
              <ArrowBackIcon className="!text-black !cursor-pointer" onClick={() => setAllBranchModalOpen(false)} />
              <p className="flex items-center text-colorBlack text-xl ml-5 font-semibold">All Branches</p>
              <CloseIcon
                className="!text-black !ml-auto !cursor-pointer"
                onClick={() => setAllBranchModalOpen(false)}
              />
            </div>

            <div className="h-[calc(100vh-300px)] sm:h-[calc(100vh-335px)] overflow-auto my-5">
              <div className="container grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
                {allBranchList.map((branch, index) => (
                  <div className="bg-colorWhite p-5 rounded-xl flex flex-col gap-1" key={index}>
                    <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                      <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch Address : </b>
                      {branch.branch_address}
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                      <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch City : </b>
                      {branch.branch_city}
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                      <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch PinCode : </b>
                      {branch.branch_pinCode}
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                      <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch Manager Name :</b>
                      {branch.manager_name}
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                      <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch Manager Email :</b>
                      {branch.manager_email}
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-colorBlack">
                      <b className="mr-2 text-sm sm:text-base lg:text-lg">Branch Manager Phone Number :</b>
                      {branch.manager_contact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>
      </CustomAuthModal>
    </>
  );
};
