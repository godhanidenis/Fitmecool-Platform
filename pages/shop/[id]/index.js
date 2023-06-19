import React, { useEffect, useRef, useState } from "react";
import DirectoryHero from "../../../components/DirectoryHero/DirectoryHero";
import {
  Avatar,
  Button,
  Grid,
  LinearProgress,
  Pagination,
  Rating,
  TextareaAutosize,
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
import {
  loadMoreProductsStart,
  loadProductsStart,
} from "../../../redux/ducks/product";
import CircularProgress from "@mui/material/CircularProgress";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import Router, { useRouter } from "next/router";
import { withoutAuth } from "../../../components/core/PrivateRouteForVendor";

const ShopDetail = ({ shopDetails }) => {
  const [loadingSubmitReview, setLoadingSubmitReview] = useState(false);
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);

  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState("");

  const [showAllReview, setShowAllReview] = useState(false);
  const [productPageSkip, setProductPageSkip] = useState(0);

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
    productsData,
    loading,
    error,
  } = useSelector((state) => state.products);

  const { userProfile, isAuthenticate } = useSelector(
    (state) => state.userProfile
  );
  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );
  const { themeLayout } = useSelector((state) => state.themeLayout);

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
          category_id:
            productsFiltersReducer.appliedProductsFilters.categoryId
              .selectedValue,
          product_color:
            productsFiltersReducer.appliedProductsFilters.productColor
              .selectedValue,
        },
        shopId:
          productsFiltersReducer.appliedProductsFilters.shopId.selectedValue,
        sort: productsFiltersReducer.sortFilters.sortType.selectedValue,
        search: productsFiltersReducer.searchBarData,
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
  }, [
    dispatch,
    productsFiltersReducer.appliedProductsFilters,
    productsFiltersReducer.sortFilters,
    productsFiltersReducer.searchBarData,
    productPageSkip,
  ]);

  useEffect(() => {
    getAllReviews();
    getAllFollowers();
    dispatch(loadCategoriesStart());
    dispatch(loadAreaListsStart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (!isHydrated) {
    return null;
  }
  return (
    <>
      <div className="pb-20 md:pb-28 font-Nova">
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
        <div className="container py-2 bg-white mb-[1px] mt-3">
          <div className="grid grid-cols-8 container">
            <div className="lg:col-span-2 hidden lg:block"></div>
            <div className="col-span-8 lg:col-span-6">
              <UpperFilter
                setProductPageSkip={setProductPageSkip}
                forShopPage={true}
                showDrawerFilter={true}
                showOnlyShopDetailPage={true}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-8 container">
          <div className="lg:col-span-2 hidden lg:block p-8 pt-4 bg-white mr-[1px]">
            <Filter
              productByShop={true}
              setProductPageSkip={setProductPageSkip}
            />
          </div>
          <div className="col-span-8 lg:col-span-6 p-6 bg-white">
            <div className="w-[100%]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-10 place-items-center mb-10">
                {productsData &&
                  productsData?.map((product) => (
                    <ProductCard product={product} key={product.id} />
                  ))}
              </div>

              {productsCount > 6 && (
                <div className="flex items-center justify-center py-10">
                  <Pagination
                    count={Math.ceil(productsCount / 6)}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    page={
                      (productPageSkip === 0 && 1) || productPageSkip / 6 + 1
                    }
                    onChange={(e, p) => {
                      setProductPageSkip((p === 1 && 0) || (p - 1) * 6);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          ref={myDivRef}
          className="bg-[#FFFFFF] pb-0 mt-8 container shadow-[0_0_4px_rgba(0,0,0,0.25)]"
        >
          <Grid
            container
            sx={{ pb: "12px", borderBottom: "1px solid #d7d7d7" }}
          >
            <Grid item xs={12} className="pl-4 pt-3">
              Reviews for Contourz by Taruna Manchanda (44)
            </Grid>
          </Grid>
          <div className="border-b">
            <div className="md:flex gap-7 px-4">
              <div className="md:w-[40%] py-3 rounded-md">
                <div className="flex justify-between">
                  <p className="text-base">Rating + Distribution</p>
                  <div className="flex items-center flex-col">
                    <div className="rounded-lg p-1 flex items-center gap-1">
                      <StarIcon
                        fontSize="medium"
                        className="!text-yellow-400"
                      />
                      <p className="text-colorBlack font-semibold">
                        {avgShopRating}
                      </p>
                    </div>
                    <p className="text-sm">({shopReviews.length} Review)</p>
                  </div>
                </div>

                {[5, 4, 3, 2, 1].map((star) => (
                  <div
                    className="grid grid-cols-6 items-center mt-3 p-1 gap-2.5"
                    key={star}
                  >
                    <div className="flex items-center gap-1 col-span-1">
                      <p className="font-semibold">{star}</p>
                      <StarIcon
                        fontSize="medium"
                        className="!text-yellow-400"
                      />
                    </div>

                    <div className="self-center col-span-4">
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
                    <p className="text-sm font-normal text-center col-span-1">
                      {shopReviews.filter((itm) => itm.stars === star).length}{" "}
                      Review
                    </p>
                  </div>
                ))}

                <p className="mt-5 italic font-normal text-base">
                  Last Review Updated on 20 Apr 2022
                </p>
              </div>
              <div className="md:w-[60%] p-5 pt-8 border-t sm:border-t-0 sm:border-l">
                <p className="text-base font-semibold text-colorStone">
                  Review {shopDetails.data.shop.shop_name} Shop
                </p>
                <p className="text-base py-4 font-semibold text-colorStone mt-1">
                  Rate vendor
                </p>
                <div className="flex justify-between mt-1">
                  <p className="text-base font-semibold text-colorStone">
                    Rate our of
                  </p>
                  <Rating
                    size="large"
                    value={stars}
                    onChange={(e) => setStars(Number(e.target.value))}
                  />
                </div>
                <div className="mt-5">
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
                    className={`bg-colorGreen rounded-[8px] text-white p-2 text-[16px] font-semibold px-[40px] py-[16px] flex items-center justify-center ${
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

          {(
            (showAllReview && shopReviews) ||
            (!showAllReview && shopReviews.slice(0, 2))
          ).map((review) => (
            <ShopCommentsSection review={review} key={review.id} />
          ))}

          {shopReviews?.length > 2 && (
            <div className="flex items-center justify-center p-2 container">
              <Button
                variant="outlined"
                sx={{ textTransform: "none" }}
                onClick={() => setShowAllReview(!showAllReview)}
              >
                {showAllReview ? "Show Less" : "View All"}
              </Button>
            </div>
          )}
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

const CustomBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
}));

const ShopCommentsSection = ({ review }) => {
  return (
    <div className="flex justify-center border-b mt-10">
      <div className="grid grid-cols-12 px-4 w-full">
        <div className="col-span-12">
          <div className="flex items-center">
            <div className="flex justify-center items-center">
              <Avatar sx={{ width: 56, height: 56 }} />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between flex-wrap md:flex-nowrap ml-[2%]">
                <div className="flex items-center gap-10 justify-between w-full sm:justify-start">
                  <div className="flex flex-col">
                    <div className="font-semibold text-xl text-[#000000]">
                      {review.user_name}
                    </div>
                    <div className=" text-[#888888]">{review.user_type}</div>
                  </div>
                  <div className="p-2 flex items-center gap-1 bg-colorWhite">
                    <StarIcon fontSize="medium" className="!text-yellow-400" />
                    <p className="text-colorBlack font-semibold">
                      {review.stars}
                    </p>
                  </div>
                </div>
                <div className="sm:flex mt-4 mr-5 flex-nowrap items-center hidden">
                  <div className="flex items-center">
                    <p className="text-colorPrimary font-semibold">Reply</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 items-center text-sm flex p-3 font-normal gap-2.5">
          {review.message}

          <div className="sm:hidden flex items-center ml-auto">
            <div className="flex items-center">
              <p className="text-colorPrimary font-semibold">Reply</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
