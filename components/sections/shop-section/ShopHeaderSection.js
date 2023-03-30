import React, { useEffect, useState } from "react";
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Button, Divider, Grid, Typography } from "@mui/material";
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
}) => {
  const [shopFollowByUser, setShopFollowByUser] = useState(false);

  const [open, setOpen] = useState(false);
  const [authTypeModal, setAuthTypeModal] = useState();
  const router = useRouter();

  const dispatch = useDispatch();
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );
  const { themeLayout } = useSelector((state) => state.themeLayout);

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
      <div className="flex justify-center container">
        <div className="grid-cols-12 mt-[-50px] rounded-xl sm:w-[85%] bg-[#FFFFFF]">
          <div className="col-span-12 pl-[4%] pr-[4%]">
            <div className="flex flex-col	sm:flex-row	">
              <div className="mt-[-45px] flex justify-center">
                <Image
                  src={shopDetails.shop_logo}
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
                    <div className="text-[#888888] oneLineAfterThreeDots">
                      Contourz by Taruna Manchanda
                    </div>
                    <p className="text-[#888888] text-sm font-normal oneLineAfterThreeDots">
                      <LocationOnIcon fontSize="small" className="mr-1" />
                      {shopDetails.branch_info.map(
                        (itm) =>
                          itm.branch_type === "main" && itm.branch_address
                      )}
                    </p>
                  </div>
                  <div className="flex sm:mt-4 items-center">
                    <Button
                      variant="outlined"
                      endIcon={<PersonAddIcon />}
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
                      <Typography sx={{ textTransform: "none" }}>
                        {shopFollowByUser ? "UnFollow" : "Follow"}
                      </Typography>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 items-center sm:justify-end flex my-5 pl-[4%] pr-[4%]">
            <Button
              variant="contained"
              className={`rounded-xl bg-colorPrimary hover:bg-colorPrimary !flex !items-center !justify-center capitalize`}
            >
              <Typography color="#FFFFFF">See Branches</Typography>
            </Button>
          </div>

          <Grid container sx={{ backgroundColor: "#fbfbfb" }}>
            <Grid item sm={3}>
              <Item className="flex items-center justify-center flex-col sm:flex-row p-3">
                <ProductionQuantityLimitsIcon /> {totalProducts} Product
              </Item>
            </Grid>
            <Divider
              className="block"
              orientation="vertical"
              variant="middle"
              flexItem
            />
            <Grid item sm={3}>
              <Item className="flex items-center justify-center flex-col sm:flex-row p-3">
                <PeopleAltIcon /> {totalFollowers} Followers
              </Item>
            </Grid>
            <Divider
              className="block"
              orientation="vertical"
              variant="middle"
              flexItem
            />
            <Grid item sm={3}>
              <Item className="flex items-center justify-center flex-col sm:flex-row p-3">
                <RateReviewIcon /> {totalReview} Review
              </Item>
            </Grid>
            <Divider
              className="block"
              orientation="vertical"
              variant="middle"
              flexItem
            />
            <Grid item sm={2.5}>
              <Item className="flex items-center justify-center flex-col sm:flex-row p-3">
                <ShareIcon /> Share
              </Item>
            </Grid>
          </Grid>
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

export default ShopHeaderSection;
