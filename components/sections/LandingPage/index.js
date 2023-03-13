import React, { useEffect, useState } from "react";

import DirectoryHero from "../../DirectoryHero/DirectoryHero";
import LandingBg from "../../../assets/landing-page-img.png";
import { useDispatch, useSelector } from "react-redux";
import {
  loadMoreProductsStart,
  loadProductsStart,
} from "../../../redux/ducks/product";
import UpperFilter from "../../Filters/UpperFilter/UpperFilter";
import ProductCard from "../product-section/ProductCard";
import { loadMoreShopsStart, loadShopsStart } from "../../../redux/ducks/shop";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import ShopCard from "../shop-section/ShopCard";
import { loadCategoriesStart } from "../../../redux/ducks/categories";
import { loadAreaListsStart } from "../../../redux/ducks/areaLists";
import Filter from "../../Filters";

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

  const getMoreProductsList = () => {
    dispatch(
      loadMoreProductsStart({
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

  const getMoreShopsList = () => {
    dispatch(
      loadMoreShopsStart({
        pageData: {
          skip: shopPageSkip,
          limit: 6,
        },
        area: shopsFiltersReducer.appliedShopsFilters.locations.selectedValue,
        sort: shopsFiltersReducer.sortFilters.sortType.selectedValue,
        stars: "",
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
        stars: "",
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
  ]);

  useEffect(() => {
    if (productPageSkip > 0) {
      getMoreProductsList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, productPageSkip]);

  useEffect(() => {
    getAllShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    shopsFiltersReducer.appliedShopsFilters,
    shopsFiltersReducer.sortFilters,
  ]);

  useEffect(() => {
    if (shopPageSkip > 0) {
      getMoreShopsList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, shopPageSkip]);

  return (
    <>
      <DirectoryHero bgImg={LandingBg.src} />
      <div className="grid grid-cols-8 gap-2 sm:gap-4 container mt-8">
        <div className="lg:col-span-2 hidden lg:block ">
          <Filter
            byShop={byShop}
            setByShop={setByShop}
            setProductPageSkip={setProductPageSkip}
            setShopPageSkip={setShopPageSkip}
          />
        </div>
        <div className="col-span-8 border-l lg:col-span-6 rounded-lg">
          <div className="container">
            <UpperFilter
              byShop={byShop}
              setProductPageSkip={setProductPageSkip}
              setShopPageSkip={setShopPageSkip}
            />

            {!byShop ? (
              <>
                {/* <p className="font-bold text-2xl text-colorBlack">Products</p> */}
                <InfiniteScroll
                  className="!overflow-hidden p-0.5"
                  dataLength={productsData.length}
                  next={() => setProductPageSkip(productPageSkip + 6)}
                  hasMore={productsData.length < productsCount}
                  loader={
                    <div className="text-center">
                      <CircularProgress />
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center mb-10">
                    {productsData &&
                      productsData?.map((product) => (
                        <ProductCard product={product} key={product.id} />
                      ))}
                  </div>
                </InfiniteScroll>
              </>
            ) : (
              <>
                <p className="font-bold text-2xl text-colorBlack">
                  Special Shops
                </p>

                <InfiniteScroll
                  className="!overflow-hidden p-0.5"
                  dataLength={shopsData.length}
                  next={() => setShopPageSkip(shopPageSkip + 6)}
                  hasMore={shopsData.length < shopsCount}
                  loader={
                    <div className="text-center">
                      <CircularProgress />
                    </div>
                  }
                >
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center mb-10">
                    {shopsData &&
                      shopsData.map((shop) => (
                        <ShopCard key={shop.id} shop={shop} />
                      ))}
                  </div>
                </InfiniteScroll>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
