import React, { useEffect, useRef, useState } from "react";
import DirectoryHero from "../../../components/DirectoryHero/DirectoryHero";
import { Pagination } from "@mui/material";
import Filter from "../../../components/Filters/index";
import UpperFilter from "../../../components/Filters/UpperFilter/UpperFilter";
import {
  getShopDetails,
  getShopFollowers,
  getShopReviews,
} from "../../../graphql/queries/shopQueries";
import ShopHeaderSection from "../../../components/sections/shop-section/ShopHeaderSection";
import ProductCard from "../../../components/sections/product-section/ProductCard";
import { useDispatch, useSelector } from "react-redux";

import { loadCategoriesStart } from "../../../redux/ducks/categories";
import { loadAreaListsStart } from "../../../redux/ducks/areaLists";
import {
  changeProductPage,
  loadProductsStart,
} from "../../../redux/ducks/product";
import CircularProgress from "@mui/material/CircularProgress";
import { changeAppliedProductsFilters } from "../../../redux/ducks/productsFilters";
import { useRouter } from "next/router";
import { withoutAuth } from "../../../components/core/PrivateRouteForVendor";
import ShopCommentsSection from "../../../components/sections/shop-section/ShopCommentsSection";
import ShopReviewSection from "../../../components/sections/shop-section/ShopReviewSection";

const ShopDetail = ({ shopDetails }) => {
  const [shopReviews, setShopReviews] = useState([]);
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
            <ShopReviewSection
              shopDetails={shopDetails}
              getAllReviews={getAllReviews}
              shopReviews={shopReviews}
            />
          </div>
          <div className="py-8 px-2 sm:px-12">
            <div className="container">
              {shopReviews.slice(0, 6)?.map((review) => (
                <ShopCommentsSection review={review} key={review.id} />
              ))}
              {shopReviews?.length > 6 && (
                <div className="mt-[80px] flex justify-center">
                  <button
                    className="text-colorGreen border border-colorGreen text-xl font-normal rounded-[16px] py-[8px] px-[8px] bg-[#FAFCFC]"
                    onClick={() =>
                      router.push(
                        `/shop/${shopDetails?.data?.shop?.id}/reviews`
                      )
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
