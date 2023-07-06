import React, { useEffect, useState } from "react";

import LandingPageCoverImg from "../../../assets/LandingPageCoverImg.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  loadMoreProductsStart,
  loadProductsStart,
} from "../../../redux/ducks/product";
import UpperFilter from "../../Filters/UpperFilter/UpperFilter";
import ProductCard from "../product-section/ProductCard";
import { loadMoreShopsStart, loadShopsStart } from "../../../redux/ducks/shop";
import ShopCard from "../shop-section/ShopCard";
import Filter from "../../Filters";
import { Pagination } from "@mui/material";
import Image from "next/image";

const LandingPage = () => {
  const dispatch = useDispatch();
  const {
    productsLimit,
    productsCount,
    numOfPages,
    productsData,
    loading,
    error,
  } = useSelector((state) => state.products);

  const {
    shopsLimit,
    shopsCount,
    numOfPages: shopNumOfPages,
    shopsData,
    loading: shopLoading,
    error: shopError,
  } = useSelector((state) => state.shops);

  const [byShop, setByShop] = useState(false);

  const productsFiltersReducer = useSelector(
    (state) => state.productsFiltersReducer
  );
  const shopsFiltersReducer = useSelector((state) => state.shopsFiltersReducer);

  const [productPageSkip, setProductPageSkip] = useState(0);
  const [shopPageSkip, setShopPageSkip] = useState(0);

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

  const getAllShops = () => {
    dispatch(
      loadShopsStart({
        pageData: {
          skip: shopPageSkip,
          limit: 6,
        },
        area: shopsFiltersReducer.appliedShopsFilters.locations.selectedValue,
        sort: shopsFiltersReducer.sortFilters.sortType.selectedValue,
        stars: shopsFiltersReducer.appliedShopsFilters.stars.selectedValue,
      })
    );
  };

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
    getAllShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    shopsFiltersReducer.appliedShopsFilters,
    shopsFiltersReducer.sortFilters,
    shopPageSkip,
  ]);

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
      <div className="container py-4 bg-[#FAFCFC]">
        <div>
          <UpperFilter
            byShop={byShop}
            setByShop={setByShop}
            setProductPageSkip={setProductPageSkip}
            setShopPageSkip={setShopPageSkip}
            showDrawerFilter={true}
          />
        </div>
      </div>
      <div className="grid grid-cols-8 container mb-4 font-Nova">
        <div className="lg:col-span-2 hidden lg:block bg-white shadow-xl">
          <Filter
            byShop={byShop}
            setByShop={setByShop}
            setProductPageSkip={setProductPageSkip}
            setShopPageSkip={setShopPageSkip}
          />
        </div>
        <div className="col-span-8 lg:col-span-6 px-0 sm:p-6 bg-[#FAFCFC] !pt-0 !pr-0">
          <div className="container !w-[100%]">
            {!byShop ? (
              <>
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 sm:py-8">
                    <p className="text-sm leading-[150%] text-[#15182766]">
                      Showing {productPageSkip + 1} -{" "}
                      {productsCount < (productPageSkip + 1) * productsLimit
                        ? productsCount
                        : (productPageSkip + 1) * productsLimit}{" "}
                      of {productsCount} results
                    </p>
                    <Pagination
                      color="primary"
                      count={Math.ceil(productsCount / 6)}
                      page={
                        (productPageSkip === 0 && 1) || productPageSkip / 6 + 1
                      }
                      onChange={(e, p) => {
                        setProductPageSkip((p === 1 && 0) || (p - 1) * 6);
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 place-items-center mb-10">
                  {shopsData &&
                    shopsData.map((shop) => (
                      <ShopCard key={shop.id} shop={shop} />
                    ))}
                </div>

                {shopsCount > 6 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 sm:py-8">
                    <p className="text-sm leading-[150%] text-[#15182766]">
                      Showing {shopPageSkip + 1} -{" "}
                      {shopsCount < (shopPageSkip + 1) * shopsLimit
                        ? shopsCount
                        : (shopPageSkip + 1) * shopsLimit}{" "}
                      of {shopsCount} results
                    </p>
                    <Pagination
                      color="primary"
                      count={Math.ceil(shopsCount / 6)}
                      page={(shopPageSkip === 0 && 1) || shopPageSkip / 6 + 1}
                      onChange={(e, p) => {
                        setShopPageSkip((p === 1 && 0) || (p - 1) * 6);
                      }}
                    />
                  </div>
                )}
                {/* {shopsCount > 6 && (
                  <div className="flex items-center justify-center py-10">
                    <Pagination
                      count={Math.ceil(shopsCount / 6)}
                      color="primary"
                      variant="outlined"
                      shape="rounded"
                      page={(shopPageSkip === 0 && 1) || shopPageSkip / 6 + 1}
                      onChange={(e, p) => {
                        setShopPageSkip((p === 1 && 0) || (p - 1) * 6);
                      }}
                    />
                  </div>
                )} */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
