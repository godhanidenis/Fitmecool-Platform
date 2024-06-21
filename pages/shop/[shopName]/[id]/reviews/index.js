import React from "react";
import { useState } from "react";
import {
  getShopDetails,
  getShopReviews,
} from "../../../../../graphql/queries/shopQueries";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShopCommentsSection from "../../../../../components/sections/shop-section/ShopCommentsSection";
import ShopReviewSection from "../../../../../components/sections/shop-section/ShopReviewSection";
import { useCallback } from "react";

const Reviews = ({ shopDetails }) => {
  const router = useRouter();

  const [shopReviews, setShopReviews] = useState([]);

  const getAllReviews = useCallback(() => {
    getShopReviews({ id: router.query.id }).then((res) =>
      setShopReviews(res.data.shopReview)
    );
  }, [router.query.id, setShopReviews]);

  useEffect(() => {
    if (router.query.id) {
      getAllReviews();
    }
  }, [router, getAllReviews]);

  const shopSlug = shopDetails?.data?.shop?.shop_name
    ?.toLowerCase()
    ?.replaceAll(" ", "-");

  return (
    <>
      <div className="pb-20 md:pb-28 font-Nova">
        <div className="container w-[44px] h-[39px] mt-2 ml-[3%] flex items-center">
          <ArrowBackIcon
            onClick={() =>
              router.push(`/shop/${shopSlug}/${router?.query?.id}`)
            }
            className="cursor-pointer"
          />
          <span className="font-semibold ml-2">Back To Shop</span>
        </div>
        <div className="bg-[#FFFFFF] sm:mt-5 py-6 xl:px-20 shadow-md shadow-[#18172505]">
          <ShopReviewSection
            shopName={shopDetails?.data?.shop?.shop_name}
            getAllReviews={getAllReviews}
            shopReviews={shopReviews}
          />
        </div>
        <div className="pb-0 mt-8 container">
          {shopReviews?.map((review, index) => (
            <ShopCommentsSection
              review={review}
              key={review?.id}
              isEven={index % 2 === 0}
            />
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
