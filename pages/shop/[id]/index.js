import React, { useEffect, useRef, useState } from "react";
import DirectoryHero from "../../../components/DirectoryHero/DirectoryHero";
import {
  Avatar,
  Button,
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
import { loadProductsStart } from "../../../redux/ducks/product";
import CircularProgress from "@mui/material/CircularProgress";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import Router, { useRouter } from "next/router";
import { withoutAuth } from "../../../components/core/PrivateRouteForVendor";
import FbIcon from "../../../assets/fbIconShop.svg";
import TwiterIcon from "../../../assets/twiterIconShop.svg";
import Image from "next/image";

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
        <div className="py-2 bg-white mb-[1px] mt-3">
          <div className="container">
            <UpperFilter
              setProductPageSkip={setProductPageSkip}
              forShopPage={true}
              showDrawerFilter={true}
              showOnlyShopDetailPage={true}
            />
          </div>
        </div>
        <div className="grid grid-cols-8 container">
          <div className="lg:col-span-2 hidden lg:block p-8 pt-4 bg-white mr-[1px]">
            <Filter
              productByShop={true}
              setProductPageSkip={setProductPageSkip}
            />
          </div>
          <div className="col-span-8 lg:col-span-6 sm:p-6 bg-white">
            <div className="w-[100%]">
              <div
                className={`${
                  productsFiltersReducer.productLayout === "list"
                    ? "flex flex-col gap-5"
                    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 place-items-center mb-10"
                }`}
              >
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
        <div ref={myDivRef} className="bg-[#FFFFFF] pb-0 mt-8 container ">
          <div className="">
            <div className="md:flex gap-7 px-4">
              <div className="md:w-[50%] pb-3 rounded-md">
                <p className="text-[#181725] text-[26px] font-semibold">
                  Reviews for Contourz by Taruna Manchanda (44)
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

                  <div className="sm:w-[70%] w-[112%] sm:border-l">
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
                              (shopReviews.filter((itm) => itm.stars === star)
                                .length *
                                100) /
                              shopReviews.length
                            }
                          />
                        </div>
                        <p className="text-sm font-normal text-center col-span-1">
                          {
                            shopReviews.filter((itm) => itm.stars === star)
                              .length
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="sm:mt-[50px] mt-[30px] text-[#181725] text-[20px] font-normal">
                  Last Review Updated on 20 Apr 2022
                </p>
              </div>
              <div className="md:w-[50%] sm:p-5 pt-8 border-t sm:border-t-0 sm:border-l">
                <p className="text-[18px] font-normal text-[#181725]">
                  Add A Review {shopDetails.data.shop.shop_name} Shop
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
        <div className="mt-[80px] flex justify-center">
          <button className="text-[#29977E] border border-[#29977E] text-xl font-normal rounded-[16px] py-[16px] px-[38px] bg-[#FAFCFC]">
            View All
          </button>
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
  borderRadius: "12px",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "rgba(24, 23, 37, 0.1)",
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: "rgba(21, 24, 39, 0.4)",
  },
}));

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
                  <div className="flex items-center gap-1 bg-[#29977E]">
                    <StarIcon fontSize="small" className="!text-white pl-1" />
                    <p className="text-white pr-[6px] font-semibold">
                      {review.stars}
                    </p>
                  </div>
                  <div className="flex sm:mr-5 items-center absolute right-0 top-[30px] sm:top-0">
                    <div className="flex gap-3 sm:gap-4 items-center">
                    <div className="w-[24px] h-[24px] sm:w-auto sm:h-auto">
                      <Image src={FbIcon} alt="fb" />
                    </div>
                    <div className="w-[24px] h-[24px] sm:w-auto sm:h-auto">
                      <Image className="" src={TwiterIcon} alt="" />
                    </div>
                      {/* <p className="text-colorPrimary font-semibold">Reply</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 items-center text-sm flex py-3 font-normal gap-2.5">
          {review.message}
          {/* <div className="sm:hidden flex items-center ml-auto">
            <div className="flex items-center">
              <p className="text-colorPrimary font-semibold">Reply</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
