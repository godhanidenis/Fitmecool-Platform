import { CircularProgress, Rating, TextareaAutosize } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomBorderLinearProgress } from "../../core/CustomMUIComponents";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { shopReview } from "../../../graphql/mutations/shops";
import { formatDate } from "../../../utils/common";
import Router, { useRouter } from "next/router";

const ShopReviewSection = ({ shopDetails, getAllReviews, shopReviews }) => {
  const [avgShopRating, setAvgShopRating] = useState(0);
  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState("");

  const [loadingSubmitReview, setLoadingSubmitReview] = useState(false);
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  const [latestReview, setLatestReview] = useState(null);

  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );

  const router = useRouter();

  useEffect(() => {
    var rating = 0;
    shopReviews.map((itm) =>
      setAvgShopRating(Math.round((rating += itm.stars) / shopReviews.length))
    );
  }, [shopReviews]);

  useEffect(() => {
    const reviewedShopsByUser = shopReviews.find(
      (itm) => itm.user_id === userProfile.id
    );
    reviewedShopsByUser
      ? setSubmitButtonDisable(true)
      : setSubmitButtonDisable(false);
  }, [router.query.id, userProfile.id, shopReviews]);

  useEffect(() => {
    // Ensure that reviews data is not empty
    if (shopReviews.length > 0) {
      // Convert timestamp strings to Date objects and sort by updatedAt in descending order
      const sortedReviews = shopReviews
        .map((review) => ({
          ...review,
          updatedAt: new Date(parseInt(review.updatedAt)),
        }))
        .sort((a, b) => b.updatedAt - a.updatedAt);

      // Get the latest review
      const latest = sortedReviews[0];
      setLatestReview(latest);
    }
  }, [shopReviews]);

  return (
    <div className="container md:flex gap-7">
      <div className="md:w-[50%] rounded-md">
        <p className="text-[#181725] text-xl sm:text-2xl font-semibold">
          Reviews For {shopDetails.data.shop.shop_name} Shop (
          {shopReviews?.length})
        </p>
        <div className="flex !flex-col xl:!flex-row gap-3 items-center lg:mt-12">
          <div className="flex w-[30%] items-center flex-col">
            <div className="rounded-lg p-1 flex items-center gap-1">
              <p className="text-[#181725] text-[58px] font-normal">
                {avgShopRating}
                <span className="text-[30px]">/5</span>
              </p>
            </div>
            <Rating size="large" value={avgShopRating} readOnly />
          </div>

          <div className="sm:w-[100%] w-[112%] xl:border-l px-[14px] sm:px-0">
            {[5, 4, 3, 2, 1].map((star) => (
              <div className="items-center p-1 flex gap-1 w-full" key={star}>
                <div className="flex items-center mr-2 gap-1 sm:pl-2 lg:w-[30%] w-[40%]">
                  <Rating
                    className="text-[#151827]"
                    size="medium"
                    value={star}
                    readOnly
                  />
                </div>

                <div className="ml-[5px] sm:ml-0 self-center lg:w-[60%] w-[50%] ">
                  <CustomBorderLinearProgress
                    variant="determinate"
                    value={
                      (shopReviews.filter((itm) => itm.stars === star).length *
                        100) /
                      shopReviews.length
                    }
                  />
                </div>
                <p className="text-sm font-normal text-center col-span-1 w-[10%]">
                  {shopReviews.filter((itm) => itm.stars === star).length}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 mb-4 sm:mb-0 sm:mt-12 text-[#181725] text-sm sm:text-base font-normal">
          Last Review Updated on {formatDate(latestReview?.updatedAt)}
        </p>
      </div>
      <div className="md:w-[50%] px-0 sm:px-8 border-t sm:border-t-0 sm:border-l">
        <p className="mt-4 sm:mt-0 text-lg font-normal text-[#181725]">
          Add A Review For {shopDetails.data.shop.shop_name} Shop
        </p>
        <div className="flex mt-6 lg:mt-12 items-center">
          <span className="text-sm sm:text-base font-normal text-[#31333E] mr-4">
            Rate out of 5
            <span className="text-[red] text-[16px] ml-[2px]">*</span>
          </span>
          <Rating
            size="large"
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
          />
        </div>
        <div className="mt-5 flex">
          <span className="text-[#31333E] text-sm sm:text-base font-normal pb-[8px] whitespace-nowrap mr-4">
            Your Review
            <span className="text-[red] text-[16px] ml-[2px]">*</span>
          </span>
          <TextareaAutosize
            minRows={5}
            placeholder="Tell us about your experience"
            className="w-full p-2 border text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-6 mt-5">
          <button
            disabled={submitButtonDisable}
            className={`bg-colorGreen rounded-[8px] text-white px-3 py-2 text-base font-semibold flex items-center justify-center ${
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
                      setMessage("");
                      setStars(0);
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
  );
};

export default ShopReviewSection;
