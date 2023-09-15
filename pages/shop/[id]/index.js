import React, { useEffect, useRef, useState } from "react";
import DirectoryHero from "../../../components/DirectoryHero/DirectoryHero";
import {
  Avatar,
  LinearProgress,
  Pagination,
  Rating,
  TextareaAutosize,
  linearProgressClasses,
} from "@mui/material";
import Filter from "../../../components/Filters/index";
import UpperFilter from "../../../components/Filters/UpperFilter/UpperFilter";

import {
  getShopDetails,
  getShopFollowers,
  getShopReviews,
} from "../../../graphql/queries/shopQueries";
import ShopHeaderSection from "../../../components/sections/shop-section/ShopHeaderSection";
import ProductCard from "../../../components/sections/product-section/ProductCard";
import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { shopReview } from "../../../graphql/mutations/shops";
import { toast } from "react-toastify";
import { loadCategoriesStart } from "../../../redux/ducks/categories";
import { loadAreaListsStart } from "../../../redux/ducks/areaLists";
import { changeProductPage, loadProductsStart } from "../../../redux/ducks/product";
import CircularProgress from "@mui/material/CircularProgress";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import Router, { useRouter } from "next/router";
import { withoutAuth } from "../../../components/core/PrivateRouteForVendor";
import { loadAllShopsListsStart } from "../../../redux/ducks/shop";
import { CustomBorderLinearProgress } from "../../../components/core/CustomMUIComponents";

const ShopDetail = ({ shopDetails }) => {
  const [loadingSubmitReview, setLoadingSubmitReview] = useState(false);
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);
  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState("");
  const [shopReviews, setShopReviews] = useState([]);
  const [avgShopRating, setAvgShopRating] = useState(0);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();
  const myDivRef = useRef(null);

  const {
    productsLimit,
    productsCount,
    numOfPages,
    productPageSkip,
    productsData,
    loading,
    error,
  } = useSelector((state) => state.products);

  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );
  const { appliedProductsFilters, sortFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const getAllProducts = () => {
    dispatch(
      loadProductsStart({
        pageData: {
          skip: productPageSkip,
          limit: 6,
        },
        filter: {
          category_id: appliedProductsFilters.categoryId.selectedValue,
          product_color: appliedProductsFilters.productColor.selectedValue,
        },
        shopId: appliedProductsFilters.shopId.selectedValue,
        sort: sortFilters.sortType.selectedValue,
        search: appliedProductsFilters.searchBarData.selectedValue,
      })
    );
  };

  const getAllReviews = () => {
    getShopReviews({ id: router.query.id }).then((res) =>
      setShopReviews(res.data.shopReview)
    );
  };

  const getAllFollowers = () => {
    getShopFollowers({ id: router.query.id }).then((res) =>
      setTotalFollowers(res.data.shopFollower?.length)
    );
  };

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
    dispatch(
      changeAppliedProductsFilters({
        key: "shopId",
        value: {
          selectedValue: [router.query.id],
        },
      })
    );
  }, [dispatch, router.query.id]);

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, appliedProductsFilters, sortFilters, productPageSkip]);

  useEffect(() => {
    getAllReviews();
    getAllFollowers();
    dispatch(loadCategoriesStart());
    dispatch(loadAreaListsStart());
    dispatch(loadAllShopsListsStart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (!isHydrated) {
    return null;
  }
  return (
    <>
      <div className="font-Nova">
        <DirectoryHero bgImg={shopDetails?.data?.shop?.shop_cover_image} />
        <div className="">
          <ShopHeaderSection
            shopDetails={shopDetails.data.shop}
            totalReview={shopReviews.length}
            totalFollowers={totalFollowers}
            getAllFollowers={getAllFollowers}
            totalProducts={productsCount}
            scrollRef={myDivRef}
          />
        </div>

        <div className="grid grid-cols-8 container-full 2xl:container pt-4 gap-2">
          <div className="lg:col-span-2 hidden lg:block bg-white shadow-xl">
            <Filter productByShop={true} />
          </div>
          <div className="col-span-8 lg:col-span-6 bg-white shadow-xl px-4">
            <div className="mt-1 px-1">
              <UpperFilter showOnlyShopDetailPage={true} />
            </div>

            <div
              className={`w-full mt-4 mb-4 relative ${
                loading && productsData?.length === 0 && "h-screen"
              }`}
            >
              <div
                className={`${
                  productsData?.length > 0 && loading
                    ? "opacity-50"
                    : "opacity-100"
                }`}
              >
                {productsData?.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4 place-items-center">
                      {productsData?.map((product) => (
                        <ProductCard product={product} key={product.id} />
                      ))}
                    </div>
                    {productsCount > 6 && (
                      <div className="flex justify-center py-4 sm:py-8">
                        <Pagination
                          color="primary"
                          count={Math.ceil(productsCount / 6)}
                          page={
                            (productPageSkip === 0 && 1) ||
                            productPageSkip / 6 + 1
                          }
                          onChange={(e, p) =>
                            dispatch(
                              changeProductPage((p === 1 && 0) || (p - 1) * 6)
                            )
                          }
                        />
                      </div>
                    )}
                  </>
                ) : (
                  !loading && (
                    <span className="flex items-center justify-center mt-10">
                      No products found!
                    </span>
                  )
                )}
              </div>
              {loading && (
                <div className="absolute top-1/2 left-1/2">
                  <CircularProgress color="secondary" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="shadow-xl my-4">
          <div ref={myDivRef} className="bg-[#FFFFFF] py-8 px-2 sm:px-12">
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
                      <div
                        className="items-center p-1 flex gap-1 w-full"
                        key={star}
                      >
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
                              (shopReviews.filter((itm) => itm.stars === star)
                                .length *
                                100) /
                              shopReviews.length
                            }
                          />
                        </div>
                        <p className="text-sm font-normal text-center col-span-1 w-[10%]">
                          {
                            shopReviews.filter((itm) => itm.stars === star)
                              .length
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-4 mb-4 sm:mb-0 sm:mt-12 text-[#181725] text-sm sm:text-base font-normal">
                  Last Review Updated on 20 Apr 2022
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
          <div className="py-8 px-2 sm:px-12">
            <div className="container">
              {shopReviews.slice(0, 6)?.map((review) => (
                <ShopCommentsSection review={review} key={review.id} />
              ))}
              {shopReviews?.length > 6 && (
                <div className="mt-[80px] flex justify-center">
                  <a
                    target="_self"
                    href={`/shop/${shopDetails?.data?.shop?.id}/reviews`}
                    rel="noreferrer"
                  >
                    <button className="text-colorGreen border border-colorGreen text-xl font-normal rounded-[16px] py-[8px] px-[8px] bg-[#FAFCFC]">
                      View All
                    </button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default withoutAuth(ShopDetail);

export async function getServerSideProps(context) {
  try {
    const shopId = context.params.id;

    const shopDetails = await getShopDetails({ id: shopId });

    return { props: { shopDetails } };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const ShopCommentsSection = ({ review }) => {
  return (
    <div className="flex justify-center border-b mt-10 relative">
      <div className="grid grid-cols-12 w-full">
        <div className="col-span-12">
          <div className="flex gap-2">
            <div className="flex justify-center">
              <Avatar sx={{ width: 56, height: 56 }} />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between flex-wrap md:flex-nowrap ml-[2%]">
                <div className="flex items-start sm:gap-10 gap-[6px] w-full sm:justify-start">
                  <div className="flex flex-col">
                    <div className="flex">
                      <div className="font-semibold sm:text-xl text-lg text-[#000000]">
                        {review.user_name}
                      </div>
                      <div className="flex items-center gap-1 bg-colorGreen rounded ml-2">
                        <StarIcon
                          fontSize="small"
                          className="!text-white pl-1"
                        />
                        <p className="text-white pr-[6px] font-semibold">
                          {review.stars}
                        </p>
                      </div>
                    </div>
                    <div className=" text-[#888888]">{review.user_type}</div>
                    <div className="col-span-12 items-center text-sm flex py-3 font-normal gap-2.5">
                      {review.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
