import React, { useEffect, useState } from "react";

import LandingPageCoverImg from "../../../assets/LandingPageCoverImg.svg";
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
import Image from "next/image";

const LandingPage = () => {
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
    sortFilters: shopSortFilters,
    byShop,
  } = useSelector((state) => state.shopsFiltersReducer);

  const getAllProducts = () => {
    dispatch(
      loadProductsStart({
        pageData: {
          skip: productPageSkip,
          limit: 10,
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

  const getAllShops = () => {
    dispatch(
      loadShopsStart({
        pageData: {
          skip: shopPageSkip,
          limit: 10,
        },
        area: appliedShopsFilters.locations.selectedValue,
        sort: shopSortFilters.sortType.selectedValue,
        stars: appliedShopsFilters.stars.selectedValue,
      })
    );
  };

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, appliedProductsFilters, sortFilters, productPageSkip]);

  useEffect(() => {
    getAllShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, appliedShopsFilters, shopSortFilters, shopPageSkip]);

  return (
    <>
      <div className="w-100 h-[300px] relative">
        <Image
          src={LandingPageCoverImg}
          alt=""
          fill={true}
          layout={"fill"}
          objectFit={"cover"}
        />
      </div>
      <div>
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4 place-items-center">
                          {productsData?.map((product) => (
                            <ProductCard product={product} key={product.id} />
                          ))}
                        </div>
                        {productsCount > 6 && (
                          <div className="flex justify-center py-4 sm:py-8">
                            <Pagination
                              color="primary"
                              count={Math.ceil(productsCount / 10)}
                              page={
                                (productPageSkip === 0 && 1) ||
                                productPageSkip / 10 + 1
                              }
                              onChange={(e, p) =>
                                dispatch(
                                  changeProductPage(
                                    (p === 1 && 0) || (p - 1) * 10
                                  )
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 place-items-center">
                          {shopsData.map((shop) => (
                            <ShopCard key={shop.id} shop={shop} />
                          ))}
                        </div>

                        {shopsCount > 6 && (
                          <div className="flex justify-center py-4 sm:py-8">
                            <Pagination
                              color="primary"
                              count={Math.ceil(shopsCount / 10)}
                              page={
                                (shopPageSkip === 0 && 1) ||
                                shopPageSkip / 10 + 1
                              }
                              onChange={(e, p) =>
                                dispatch(
                                  changeShopPage((p === 1 && 0) || (p - 1) * 10)
                                )
                              }
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
      </div>
    </>
  );
};

export default LandingPage;
