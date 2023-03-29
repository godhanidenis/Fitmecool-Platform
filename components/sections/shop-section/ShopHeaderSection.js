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
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import RateReviewIcon from "@mui/icons-material/RateReview";
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
        <div className="grid-cols-12 mt-[-50px] rounded-xl w-[85%] bg-[#FFFFFF] ">
          <div className="col-span-12 pl-[4%] pr-[4%]">
            <div className="flex flex-col	sm:flex-row	">
              <div className="mt-[-40px] sm:mt-[-50px] flex justify-center">
                <Image
                  src={shopDetails.shop_logo}
                  alt="shop logo"
                  layout="fixed"
                  width={150}
                  height={150}
                  className="rounded-[50%]"
                />
              </div>
              <div className="flex flex-col w-full ml-[4%]">
                <div className="flex justify-between flex-wrap md:flex-nowrap">
                  <div className="flex flex-col mt-5">
                    <div className="font-semibold text-2xl text-[#000000]">
                      {shopDetails.shop_name}
                    </div>
                    <div className=" text-[#888888]">
                      Contourz by Taruna Manchanda
                    </div>
                    <p className="text-[#888888] text-sm font-normal">
                      <LocationOnIcon fontSize="small" className="mr-1" />
                      {shopDetails.branch_info.map(
                        (itm) =>
                          itm.branch_type === "main" && itm.branch_address
                      )}
                    </p>
                  </div>
                  <div className="flex mt-4 flex-nowrap items-center gap-5">
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
                          setOpen(true), setAuthTypeModal(AuthTypeModal.Signin);
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
          {/* <div className="flex justify-between col-span-12 w-full bg-[#fbfbfb]">
            <div className="col-span-3">TOTAL PRODUCTS</div>
            <div className="col-span-3"> FOLLOWERS</div>
            <div className="col-span-3">REVIEWS</div>
            <div className="col-span-3">SHARE</div>
          </div> */}
          <Grid
            container
            sx={{ backgroundColor: "#fbfbfb", borderBottom: "1px solid gray" , justifyContent:"space-between" }}
          >
            <Grid item sm={6} md={3}>
              <Item>
                <ProductionQuantityLimitsIcon /> {totalProducts} Total Product
              </Item>
            </Grid>
            <Divider className="md:!block hidden " orientation="vertical" variant="middle" flexItem />
            <Grid item sm={6} md={3}>
              <Item>{totalFollowers} Followers</Item>
            </Grid>
            <Divider className="md:!block hidden " orientation="vertical" variant="middle" flexItem />
            <Grid item sm={6} md={3}>
              <Item>
                <RateReviewIcon /> {totalReview} Reviews
              </Item>
            </Grid>
            <Divider className="md:!block hidden " orientation="vertical" variant="middle" flexItem />
            <Grid item sm={6} md={2.5}>
              <Item>
                <ShareIcon /> 25 Share
              </Item>
            </Grid>
          </Grid>
        </div>
      </div>

      {/* <div className="grid grid-cols-4 gap-4 mt-6 container">
        <div className="bg-[#F5F5F5] rounded-xl p-4 text-center">
          <p className="text-colorPrimary font-bold">TOTAL PRODUCTS</p>
          <p className=" text-colorBlack font-bold text-center mt-2">
            {totalProducts}
          </p>
        </div>

        <div className="bg-[#F5F5F5] rounded-xl p-4 text-center">
          <p className="text-colorPrimary font-bold">FOLLOWERS</p>
          <p className=" text-colorBlack font-bold text-center mt-2">
            {totalFollowers}
          </p>
        </div>
        <div className="bg-[#F5F5F5] rounded-xl p-4 text-center">
          <p className="text-colorPrimary font-bold">REVIEWS</p>
          <p className=" text-colorBlack font-bold text-center mt-2">
            {totalReview}
          </p>
        </div>
        <div className="bg-[#F5F5F5] rounded-xl p-4 text-center">
          <p className="text-colorPrimary font-bold">SHARE</p>
          <p className=" text-colorBlack font-bold text-center mt-2">25</p>
        </div>
      </div> */}

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
