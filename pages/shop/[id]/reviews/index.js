import React from "react";
import { useState } from "react";
import {
  getShopDetails,
  getShopReviews,
} from "../../../../graphql/queries/shopQueries";
import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import {
  Avatar,
  CircularProgress,
  LinearProgress,
  Rating,
  TextareaAutosize,
  linearProgressClasses,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { shopReview } from "../../../../graphql/mutations/shops";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CustomBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: "12px",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "rgba(24, 23, 37, 0.1)",
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: "rgba(21, 24, 39, 0.4)",
  },
}));

const Reviews = ({ shopDetails }) => {
  const router = useRouter();
  const { userProfile, isAuthenticate } = useSelector(
    (state) => state?.userProfile
  );

  const [shopReviews, setShopReviews] = useState([]);
  const [avgShopRating, setAvgShopRating] = useState(0);
  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState("");
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);
  const [loadingSubmitReview, setLoadingSubmitReview] = useState(false);

  const BackToGo = () => {
    router.push(`/shop/${router?.query?.id}`);
  };

  const getAllReviews = () => {
    getShopReviews({ id: router.query.id }).then((res) =>
      setShopReviews(res.data.shopReview)
    );
  };

  useEffect(() => {
    if (router.query.id) {
      getAllReviews();
    }
  }, [router]);

  useEffect(() => {
    var rating = 0;
    shopReviews?.map((itm) =>
      setAvgShopRating(Math.round((rating += itm.stars) / shopReviews.length))
    );
  }, [shopReviews]);

  useEffect(() => {
    const reviewedShopsByUser = shopReviews?.find(
      (itm) => itm.user_id === userProfile.id
    );
    reviewedShopsByUser
      ? setSubmitButtonDisable(true)
      : setSubmitButtonDisable(false);
  }, [router.query.id, userProfile.id, shopReviews]);

  return (
    <>
      <div className="pb-20 md:pb-28 font-Nova">
        <div className="w-[44px] h-[39px] mt-[2%] ml-[3%]">
          <ArrowBackIcon
            onClick={() => BackToGo()}
            className="w-[44px] h-[39px] mr-[30px] cursor-pointer"
          />
        </div>
        <div className="bg-[#FFFFFF] sm:mt-8 py-6 sm:px-20 shadow-md shadow-[#18172505]">
          <div className="md:flex gap-7 container">
            <div className="md:w-[50%] pb-3 rounded-md">
              <p className="text-[#181725] text-base sm:text-[26px] font-semibold">
                Reviews for {shopDetails.data.shop.shop_name} Shop (
                {shopReviews?.length})
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center sm:mt-[60px]">
                <div className="flex w-[30%] items-center flex-col">
                  <div className="rounded-lg p-1 flex items-center gap-1">
                    <p className="text-[#181725] text-[58px] font-normal">
                      {avgShopRating}
                      <span className="text-[30px]">/5</span>
                    </p>
                  </div>
                  <Rating size="large" value={avgShopRating} readOnly />
                </div>

                <div className="sm:w-[70%] w-[112%] sm:border-l px-[14px] sm:px-0">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div
                      className="grid grid-cols-12 items-center p-1 gap-2.5"
                      key={star}
                    >
                      <div className="flex items-center gap-1 col-span-4 sm:pl-2">
                        <Rating
                          className="text-[#151827]"
                          size="medium"
                          value={star}
                          readOnly
                        />
                      </div>

                      <div className="ml-[5px] sm:ml-0 self-center col-span-7">
                        <CustomBorderLinearProgress
                          variant="determinate"
                          value={
                            (shopReviews?.filter((itm) => itm.stars === star)
                              .length *
                              100) /
                            shopReviews?.length
                          }
                        />
                      </div>
                      <p className="text-sm font-normal text-center col-span-1">
                        {
                          shopReviews?.filter((itm) => itm.stars === star)
                            .length
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="sm:mt-[16%] mt-[30px] text-[#181725] text-[20px] font-normal">
                Last Review Updated on 20 Apr 2022
              </p>
            </div>
            <div className="md:w-[50%] sm:p-5 pt-8 pb-5 border-t sm:border-t-0 sm:border-l">
              <p className="text-[18px] font-normal text-[#181725]">
                Add A Review {shopDetails?.data?.shop?.shop_name} Shop
              </p>
              <p className="text-[14px] py-4 font-normal text-[#31333E] mt-1">
                Rate vendor
              </p>
              <div className="flex justify-between mt-1">
                <p className="text-[14px] font-normal text-[#31333E]">
                  Rate our of
                </p>
                <Rating
                  size="large"
                  value={stars}
                  onChange={(e) => setStars(Number(e.target.value))}
                />
              </div>
              <div className="mt-5">
                <p className="text-[#31333E] text-[14px] font-normal pb-[8px]">
                  Your Review *
                </p>
                <TextareaAutosize
                  minRows={5}
                  placeholder="Tell us about experience*"
                  className="w-full p-2 border text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-6 mt-5">
                <button
                  disabled={submitButtonDisable}
                  className={`bg-colorGreen rounded-[8px] text-white p-2 text-base font-semibold sm:px-[40px] px-[30px] py-[14px] sm:py-[16px] flex items-center justify-center ${
                    submitButtonDisable && "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (isAuthenticate) {
                      if (stars > 0 && message !== "") {
                        setLoadingSubmitReview(true);
                        shopReview({
                          shopInfo: {
                            message: message,
                            shop_id: router.query.id,
                            stars: stars,
                            user_id: userProfile.id,
                          },
                        }).then(
                          (res) => {
                            getAllReviews();
                            toast.success("Review Submitted Successfully!!", {
                              theme: "colored",
                            });
                            setLoadingSubmitReview(false);
                          },
                          (error) => {
                            setLoadingSubmitReview(false);
                            toast.error("Review not Submitted!!", {
                              theme: "colored",
                            });
                          }
                        );
                      } else {
                        toast.error("Please Select Review Fields!!", {
                          theme: "colored",
                        });
                      }
                    } else {
                      Router.push("/auth/user-type");
                    }
                  }}
                >
                  {loadingSubmitReview && (
                    <CircularProgress
                      size={20}
                      color="primary"
                      sx={{ color: "white", mr: 1 }}
                    />
                  )}
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-0 mt-8 container ">
          {shopReviews?.map((review) => (
            <ShopCommentsSection review={review} key={review?.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Reviews;

export async function getServerSideProps(context) {
  try {
    const shopId = context.params.id;

    const shopDetails = await getShopDetails({ id: shopId });

    return { props: { shopDetails, shopId } };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const ShopCommentsSection = ({ review }) => {
  return (
    <div className="flex justify-center border-b mt-10 relative">
      <div className="grid grid-cols-12 px-4 w-full">
        <div className="col-span-12">
          <div className="flex items-center">
            <div className="flex justify-center items-center">
              <Avatar sx={{ width: 56, height: 56 }} />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between flex-wrap md:flex-nowrap ml-[2%]">
                <div className="flex items-start sm:gap-10 gap-[6px] w-full sm:justify-start">
                  <div className="flex flex-col">
                    <div className="font-semibold sm:text-xl text-lg text-[#000000]">
                      {review.user_name}
                    </div>
                    <div className=" text-[#888888]">{review.user_type}</div>
                  </div>
                  <div className="flex items-center gap-1 bg-colorGreen rounded ">
                    <StarIcon fontSize="small" className="!text-white pl-1" />
                    <p className="text-white pr-[6px] font-semibold">
                      {review.stars}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 items-center text-sm flex py-3 font-normal gap-2.5">
          {review.message}
        </div>
      </div>
    </div>
  );
};
