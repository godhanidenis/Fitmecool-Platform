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
import { Pagination } from "@mui/material";

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
        stars: shopsFiltersReducer.appliedShopsFilters.stars.selectedValue,
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

  // useEffect(() => {
  //   if (productPageSkip > 0) {
  //     getMoreProductsList();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, productPageSkip]);

  useEffect(() => {
    getAllShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    shopsFiltersReducer.appliedShopsFilters,
    shopsFiltersReducer.sortFilters,
    shopPageSkip,
  ]);

  // useEffect(() => {
  //   if (shopPageSkip > 0) {
  //     getMoreShopsList();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, shopPageSkip]);

  return (
    <>
      <DirectoryHero bgImg={LandingBg.src} />
      <div className="grid grid-cols-8 gap-2 sm:gap-4 container mt-4 mb-4 ">
        <div className="lg:col-span-2 hidden lg:block p-8 pt-4 bg-white">
          <Filter
            byShop={byShop}
            setByShop={setByShop}
            setProductPageSkip={setProductPageSkip}
            setShopPageSkip={setShopPageSkip}
          />
        </div>
        <div className="col-span-8 lg:col-span-6 p-6 bg-white">
          <div className="container !w-[100%]">
            <UpperFilter
              byShop={byShop}
              setByShop={setByShop}
              setProductPageSkip={setProductPageSkip}
              setShopPageSkip={setShopPageSkip}
              showDrawerFilter={true}
            />
            {!byShop ? (
              <>
                {/* <p className="font-bold text-2xl text-colorBlack">Products</p> */}
                {/* <InfiniteScroll
                  className="!overflow-hidden p-0.5"
                  dataLength={productsData.length}
                  next={() => setProductPageSkip(productPageSkip + 6)}
                  hasMore={productsData.length < productsCount}
                  loader={
                    <div className="text-center">
                      <CircularProgress />
                    </div>
                  }
                > */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center mb-10">
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

                {/* </InfiniteScroll> */}
              </>
            ) : (
              <>
                {/* <InfiniteScroll
                  className="!overflow-hidden p-0.5"
                  dataLength={shopsData.length}
                  next={() => setShopPageSkip(shopPageSkip + 6)}
                  hasMore={shopsData.length < shopsCount}
                  loader={
                    <div className="text-center">
                      <CircularProgress />
                    </div>
                  }
                > */}
                <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center mb-10">
                  {shopsData &&
                    shopsData.map((shop) => (
                      <ShopCard key={shop.id} shop={shop} />
                    ))}
                </div>

                {shopsCount > 6 && (
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
                )}
                {/* </InfiniteScroll> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
