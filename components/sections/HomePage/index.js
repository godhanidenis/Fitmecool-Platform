import React, { useCallback, useEffect, useState } from "react";
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
import { scrollToTitleName } from "../../../utils/common";
import { changeByShopFilters } from "../../../redux/ducks/shopsFilters";
import CustomSwitchComponent from "../../core/CustomSwitchComponent";

const HomePage = () => {
  const dispatch = useDispatch();

  const productPerPageCount = parseInt(
    process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE_LISTING
  );

  const shopPerPageCount = parseInt(
    process.env.NEXT_PUBLIC_SHOPS_PER_PAGE_LISTING
  );

  const { productsCount, productPageSkip, productsData, loading } = useSelector(
    (state) => state.products
  );

  const {
    shopsCount,
    shopPageSkip,
    shopsData,
    loading: shopLoading,
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

  const [checked, setChecked] = useState(byShop);

  const switchHandler = (event) => {
    setChecked(event.target.checked);
    dispatch(changeByShopFilters(event.target.checked));
  };

  useEffect(() => {
    setChecked(byShop);
  }, [byShop]);

  const carouselItems = [
    { imageSrc: assets.bannerImg4, des: "bannerImg4" },
    { imageSrc: assets.bannerImg5, des: "bannerImg5" },
    { imageSrc: assets.bannerImg6, des: "bannerImg6" },
  ];

  const getAllProducts = useCallback(() => {
    dispatch(
      loadProductsStart({
        pageData: {
          skip: productPageSkip,
          limit: productPerPageCount,
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
  }, [
    dispatch,
    sortFilters.sortType.selectedValue,
    appliedProductsFilters,
    appliedCityFilter.city.selectedValue,
    productPageSkip,
  ]);

  const getAllShops = useCallback(() => {
    dispatch(
      loadShopsStart({
        pageData: {
          skip: shopPageSkip,
          limit: shopPerPageCount,
        },
        area: appliedShopsFilters.locations.selectedValue.map((itm) => itm.pin),
        sort: shopSortFilter.sortType.selectedValue,
        stars: appliedShopsFilters.stars.selectedValue,
        city: appliedCityFilter.city.selectedValue,
      })
    );
  }, [
    dispatch,
    shopPerPageCount,
    shopPageSkip,
    shopSortFilter.sortType.selectedValue,
    appliedShopsFilters,
    appliedCityFilter.city.selectedValue,
  ]);

  useEffect(() => {
    getAllProducts();
  }, [
    dispatch,
    appliedProductsFilters,
    appliedCityFilter,
    sortFilters,
    productPageSkip,
    getAllProducts,
  ]);

  useEffect(() => {
    getAllShops();
  }, [
    dispatch,
    appliedShopsFilters,
    appliedCityFilter,
    shopSortFilter,
    shopPageSkip,
    getAllShops,
  ]);

  return (
    <>
      {/* <BannerHero carouselItems={carouselItems} /> */}

      <div className="grid grid-cols-12 container-full 2xl:container mb-4 font-Nova py-4 gap-2">
        <div className="lg:col-span-3 hidden lg:block bg-white shadow-xl">
          <Filter />
        </div>

        <div className="fixed bottom-7 right-[40%] z-10 lg:hidden">
          <CustomSwitchComponent checked={checked} onChange={switchHandler} />
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
                      <div className="w-[100%] flex flex-wrap justify-start lg:gap-3 p-1 place-items-center">
                        {productsData?.map((product) => (
                          <ProductCard
                            product={product}
                            key={product.id}
                            homepage={true}
                          />
                        ))}
                      </div>
                      {productsCount > productPerPageCount && (
                        <div className="flex justify-center py-4 sm:py-8">
                          <Pagination
                            color="primary"
                            count={Math.ceil(
                              productsCount / productPerPageCount
                            )}
                            page={
                              (productPageSkip === 0 && 1) ||
                              productPageSkip / productPerPageCount + 1
                            }
                            onChange={(e, p) => {
                              scrollToTitleName();
                              dispatch(
                                changeProductPage(
                                  (p === 1 && 0) ||
                                    (p - 1) * productPerPageCount
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
                      <div className="w-[100%] flex flex-wrap justify-start sm:gap-3 p-1 place-items-center">
                        {shopsData.map((shop) => (
                          <ShopCard key={shop.id} shop={shop} />
                        ))}
                      </div>

                      {shopsCount > shopPerPageCount && (
                        <div className="flex justify-center py-4 sm:py-8">
                          <Pagination
                            color="primary"
                            count={Math.ceil(shopsCount / shopPerPageCount)}
                            page={
                              (shopPageSkip === 0 && 1) ||
                              shopPageSkip / shopPerPageCount + 1
                            }
                            onChange={(e, p) => {
                              scrollToTitleName();
                              dispatch(
                                changeShopPage(
                                  (p === 1 && 0) || (p - 1) * shopPerPageCount
                                )
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
