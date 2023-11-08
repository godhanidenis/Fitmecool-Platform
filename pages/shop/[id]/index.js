import React, { useEffect, useRef, useState } from "react";
import DirectoryHero from "../../../components/DirectoryHero/DirectoryHero";
import { Pagination } from "@mui/material";
import Filter from "../../../components/Filters/index";
import UpperFilter from "../../../components/Filters/UpperFilter/UpperFilter";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  getShopDetails,
  getShopFollowers,
  getShopReviews,
} from "../../../graphql/queries/shopQueries";
import ShopHeaderSection from "../../../components/sections/shop-section/ShopHeaderSection";
import ProductCard from "../../../components/sections/product-section/ProductCard";
import { useDispatch, useSelector } from "react-redux";

import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import { withoutAuth } from "../../../components/core/PrivateRouteForVendor";
import ShopCommentsSection from "../../../components/sections/shop-section/ShopCommentsSection";
import ShopReviewSection from "../../../components/sections/shop-section/ShopReviewSection";
import { useResizeScreenLayout } from "../../../components/core/useScreenResize";
import { changeByShopFilters } from "../../../redux/ducks/shopsFilters";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { changeAppliedShopProductsFilters } from "../../../redux/ducks/shopProductsFilters";
import Errors from "../../../components/Layout/Errors";
import {
  changeShopProductPage,
  loadShopProductsStart,
} from "../../../redux/ducks/shopProduct";

const ShopDetail = ({ shopDetails, error }) => {
  const [shopReviews, setShopReviews] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const [videoShow, setVideoShow] = useState(true);
  const [videoPosition, setVideoPosition] = useState({
    x: window.innerWidth - 400,
    y: window.innerHeight - 250,
  });

  const shopDetailsData = shopDetails?.data?.shop;

  const handleDragStart = (e) => {
    e.preventDefault();

    const initialX = e.clientX - videoPosition.x;
    const initialY = e.clientY - videoPosition.y;

    const handleDrag = (e) => {
      const newX = e.clientX - initialX;
      const newY = e.clientY - initialY;
      setVideoPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  };

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
    error: productError,
  } = useSelector((state) => state.shopProducts);

  const { appliedShopProductsFilters, shopSortFilters } = useSelector(
    (state) => state.shopProductsFiltersReducer
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const getAllProducts = () => {
    dispatch(
      loadShopProductsStart({
        pageData: {
          skip: productPageSkip,
          limit: 6,
        },
        filter: {
          category_id: appliedShopProductsFilters.categoryId.selectedValue,
          product_color: appliedShopProductsFilters.productColor.selectedValue,
          product_price: {
            min: appliedShopProductsFilters.productPrice.selectedValue.min,
            max: appliedShopProductsFilters.productPrice.selectedValue.max,
          },
          product_listing_type:
            appliedShopProductsFilters.productListingType.selectedValue,
        },
        shopId: appliedShopProductsFilters.shopId.selectedValue,
        sort: shopSortFilters.sortType.selectedValue,
        search: appliedShopProductsFilters.searchBarData.selectedValue,
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
    if (router.query.id) {
      const passValueForProduct = (itm) => {
        if (itm === "searchBarData" || itm === "productListingType") {
          return "";
        } else if (itm === "productPrice") {
          return { min: 0, max: 0 };
        } else {
          return [];
        }
      };

      [
        "categoryId",
        "productColor",
        "productPrice",
        "productListingType",
        "shopId",
        "searchBarData",
      ].map((itm) =>
        dispatch(
          changeAppliedShopProductsFilters({
            key: itm,
            value: {
              selectedValue: passValueForProduct(itm),
            },
          })
        )
      );
      dispatch(changeShopProductPage(0));

      dispatch(
        changeAppliedShopProductsFilters({
          key: "shopId",
          value: {
            selectedValue: [router.query.id],
          },
        })
      );
    }
  }, [dispatch, router.query.id]);

  useEffect(() => {
    appliedShopProductsFilters.shopId.selectedValue?.length > 0 &&
      appliedShopProductsFilters.shopId.selectedValue[0] === router.query.id &&
      getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, appliedShopProductsFilters, shopSortFilters, productPageSkip]);

  useEffect(() => {
    getAllReviews();
    getAllFollowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const isScreenWide = useResizeScreenLayout();
  useEffect(() => {
    !isScreenWide && dispatch(changeByShopFilters(false));
  }, [dispatch, isScreenWide]);

  if (!isHydrated) {
    return null;
  }

  if (error) {
    return <Errors error={error} item="shop" />;
  }

  return (
    <>
      <div className="font-Nova">
        <DirectoryHero
          title={shopDetailsData?.shop_name}
          bgImg={shopDetailsData?.shop_cover_image}
        />
        <div className="">
          <ShopHeaderSection
            shopDetails={shopDetailsData}
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
                    <div className="w-[100%] flex flex-wrap justify-between lg:justify-center xl:justify-normal mb-2 lg:mb-0 lg:gap-3 p-1 place-items-center">
                      {productsData?.map((product) => (
                        <ProductCard
                          product={product}
                          key={product.id}
                          homepage={true}
                        />
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
                          onChange={(e, p) => {
                            const targetScrollPosition = 500;

                            window.scrollTo({
                              top: targetScrollPosition,
                              behavior: "smooth",
                            });
                            dispatch(
                              changeShopProductPage(
                                (p === 1 && 0) || (p - 1) * 6
                              )
                            );
                          }}
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
            <ShopReviewSection
              shopName={shopDetailsData?.shop_name}
              getAllReviews={getAllReviews}
              shopReviews={shopReviews}
            />
          </div>
          <div className="py-8 px-2 sm:px-12">
            <div className="container">
              {shopReviews.slice(0, 6)?.map((review, index) => (
                <ShopCommentsSection
                  review={review}
                  key={review.id}
                  isEven={index % 2 === 0}
                />
              ))}
              {shopReviews?.length > 6 && (
                <div className="mt-[80px] flex justify-center">
                  <button
                    className="text-colorGreen border border-colorGreen text-xl font-normal rounded-[16px] py-[8px] px-[8px] bg-[#FAFCFC]"
                    onClick={() =>
                      router.push(`/shop/${shopDetailsData?.id}/reviews`)
                    }
                  >
                    View All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10">
        {shopDetailsData?.shop_video && videoShow && (
          <div
            className={`fixed w-80 sm:w-96 h-48 sm:h-56 flex justify-end ${
              window.innerWidth < 640 ? "!left-[20px]" : ""
            }`}
            // className="fixed w-80 sm:w-96 h-48 sm:h-56 flex justify-end"
            style={{
              left: videoPosition.x,
              top: videoPosition.y,
            }}
            onMouseDown={handleDragStart}
          >
            <video
              controls
              autoPlay={false}
              muted
              className="!rounded-lg w-full bg-black"
            >
              <source src={shopDetailsData?.shop_video} type="video/mp4" />
            </video>
            <div className="absolute p-3">
              <button
                className=" p-2 bg-[#00000091] text-[#fff] rounded-full cursor-pointer"
                onClick={() => setVideoShow(false)}
              >
                <CloseOutlined />
              </button>
            </div>
          </div>
        )}
        {!videoShow && (
          <div className="fixed bottom-24 lg:bottom-6 right-6 flex justify-end ">
            <button
              className="p-3 bg-colorPrimary rounded-full shadow-xl"
              onClick={() => {
                setVideoShow(true);
                setVideoPosition({
                  x: window.innerWidth - 400,
                  y: window.innerHeight - 250,
                });
              }}
            >
              <PlayArrowIcon className="!text-[#fff] !text-3xl" />
            </button>
          </div>
        )}
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
    return { props: { error: error.message } };
  }
}
