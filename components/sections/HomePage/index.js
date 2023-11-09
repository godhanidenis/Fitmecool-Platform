import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeProductPage,
  loadProductsStart,
} from "../../../redux/ducks/product";
import UpperFilter from "../../Filters/UpperFilter/UpperFilter";
import ProductCard from "../product-section/ProductCard";
import { changeShopPage, loadShopsStart } from "../../../redux/ducks/shop";
import ShopCard from "../shop-section/ShopCard";
import Filter from "../../Filters";
import { CircularProgress, Pagination } from "@mui/material";
import { assets } from "../../../constants";
import BannerHero from "../../DirectoryHero/BannerHero";

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    productsLimit,
    productsCount,
    numOfPages,
    productPageSkip,
    productsData,
    loading,
    error,
  } = useSelector((state) => state.products);

  const {
    shopsLimit,
    shopsCount,
    numOfPages: shopNumOfPages,
    shopPageSkip,
    shopsData,
    loading: shopLoading,
    error: shopError,
  } = useSelector((state) => state.shops);

  const { appliedProductsFilters, sortFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );
  const {
    appliedShopsFilters,
    sortFilters: shopSortFilter,
    byShop,
  } = useSelector((state) => state.shopsFiltersReducer);

  const { appliedCityFilter } = useSelector(
    (state) => state.cityFiltersReducer
  );

  const carouselItems = [
    { imageSrc: assets.bannerImg4, des: "bannerImg4" },
    { imageSrc: assets.bannerImg5, des: "bannerImg5" },
    { imageSrc: assets.bannerImg6, des: "bannerImg6" },
  ];

  const getAllProducts = () => {
    dispatch(
      loadProductsStart({
        pageData: {
          skip: productPageSkip,
          limit: 12,
        },
        filter: {
          category_id: appliedProductsFilters.categoryId.selectedValue,
          product_color: appliedProductsFilters.productColor.selectedValue,
          product_price: {
            min: appliedProductsFilters.productPrice.selectedValue.min,
            max: appliedProductsFilters.productPrice.selectedValue.max,
          },
          product_listing_type:
            appliedProductsFilters.productListingType.selectedValue,
        },
        shopId: appliedProductsFilters.shopId.selectedValue,
        sort: sortFilters.sortType.selectedValue,
        search: appliedProductsFilters.searchBarData.selectedValue,
        city: appliedCityFilter.city.selectedValue,
      })
    );
  };

  const getAllShops = () => {
    dispatch(
      loadShopsStart({
        pageData: {
          skip: shopPageSkip,
          limit: 10,
        },
        area: appliedShopsFilters.locations.selectedValue.map((itm) => itm.pin),
        sort: shopSortFilter.sortType.selectedValue,
        stars: appliedShopsFilters.stars.selectedValue,
        city: appliedCityFilter.city.selectedValue,
      })
    );
  };

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    appliedProductsFilters,
    appliedCityFilter,
    sortFilters,
    productPageSkip,
  ]);

  useEffect(() => {
    getAllShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    appliedShopsFilters,
    appliedCityFilter,
    shopSortFilter,
    shopPageSkip,
  ]);

  return (
    <>
      <BannerHero carouselItems={carouselItems} />

      <div className="grid grid-cols-12 container-full 2xl:container mb-4 font-Nova py-4 gap-2">
        <div className="lg:col-span-3 hidden lg:block bg-white shadow-xl">
          <Filter />
        </div>

        <div className="col-span-12 lg:col-span-9 px-4 bg-white shadow-xl">
          <div className="mt-1 px-1">
            <UpperFilter />
          </div>
          <div className="w-full mt-4 mb-4">
            {!byShop ? (
              <div
                className={`relative ${
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
                      <div className="w-[100%] flex flex-wrap justify-between lg:justify-center xl:justify-normal lg:gap-3 p-1 place-items-center">
                        {productsData?.map((product) => (
                          <ProductCard
                            product={product}
                            key={product.id}
                            homepage={true}
                          />
                        ))}
                      </div>
                      {productsCount > 10 && (
                        <div className="flex justify-center py-4 sm:py-8">
                          <Pagination
                            color="primary"
                            count={Math.ceil(productsCount / 10)}
                            page={
                              (productPageSkip === 0 && 1) ||
                              productPageSkip / 10 + 1
                            }
                            onChange={(e, p) => {
                              const targetElement =
                                document.getElementById("titleName");

                              if (targetElement) {
                                const targetScrollPosition =
                                  targetElement.getBoundingClientRect().top;

                                window.scrollTo({
                                  top: window.scrollY + targetScrollPosition,
                                  behavior: "smooth",
                                });
                              }
                              dispatch(
                                changeProductPage(
                                  (p === 1 && 0) || (p - 1) * 10
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
            ) : (
              <div
                className={`relative ${
                  shopLoading && shopsData?.length === 0 && "h-screen"
                }`}
              >
                <div
                  className={`${
                    shopsData?.length > 0 && shopLoading
                      ? "opacity-50"
                      : "opacity-100"
                  }`}
                >
                  {shopsData?.length > 0 ? (
                    <>
                      <div className="w-[100%] flex flex-wrap justify-center lg:justify-center xl:justify-normal sm:gap-3 p-1 place-items-center">
                        {shopsData.map((shop) => (
                          <ShopCard key={shop.id} shop={shop} />
                        ))}
                      </div>

                      {shopsCount > 10 && (
                        <div className="flex justify-center py-4 sm:py-8">
                          <Pagination
                            color="primary"
                            count={Math.ceil(shopsCount / 10)}
                            page={
                              (shopPageSkip === 0 && 1) || shopPageSkip / 10 + 1
                            }
                            onChange={(e, p) => {
                              const targetElement =
                                document.getElementById("titleName");
                              if (targetElement) {
                                const targetScrollPosition =
                                  targetElement.getBoundingClientRect().top;

                                window.scrollTo({
                                  top: window.scrollY + targetScrollPosition,
                                  behavior: "smooth",
                                });
                              }
                              dispatch(
                                changeShopPage((p === 1 && 0) || (p - 1) * 10)
                              );
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    !shopLoading && (
                      <span className="flex items-center justify-center mt-10">
                        No shop found!
                      </span>
                    )
                  )}
                </div>
                {shopLoading && (
                  <div className="absolute top-1/2 left-1/2">
                    <CircularProgress color="secondary" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
