import React, { useEffect, useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import UpperFilter from "../../../../components/Filters/UpperFilter/UpperFilter";
import { changeAppliedProductsFilters } from "../../../../redux/ducks/productsFilters";
import { useRouter } from "next/router";
import { loadProductsStart } from "../../../../redux/ducks/product";
import { withAuth } from "../../../../components/core/PrivateRouteForVendor";
import AddIcon from "@mui/icons-material/Add";
import VenderProductTable from "../../../../components/Layout/VenderProductTable";

const ShopDetailsPage = () => {
  const [productPageSkip, setProductPageSkip] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const dispatch = useDispatch();
  const { productsCount, productsData, loading } = useSelector(
    (state) => state.products
  );
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const productsFiltersReducer = useSelector(
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
  useEffect(() => {
    if (id) {
      dispatch(
        changeAppliedProductsFilters({
          key: "shopId",
          value: {
            selectedValue: [id],
          },
        })
      );
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (
      productsFiltersReducer.appliedProductsFilters.shopId.selectedValue
        .length > 0
    ) {
      getAllProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    productsFiltersReducer.appliedProductsFilters,
    productsFiltersReducer.sortFilters,
    productsFiltersReducer.searchBarData,
    productPageSkip,
  ]);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col mt-2 px-6 sm:px-0">
        <div className="flex flex-row-reverse py-2">
          <button
            onClick={() =>
              router.push(
                `/vendor/shop/${vendorShopDetails?.id}/addEditProduct/`
              )
            }
            className="flex items-center text-colorGreen text-lg p-2 px-4 rounded-xl border-2 border-colorGreen"
          >
            <AddIcon className="mr-2" />
            Add Products
          </button>
        </div>

        <div className="pt-4">
          <UpperFilter
            setProductPageSkip={setProductPageSkip}
            showOnlyShopDetailPage={true}
          />

          <div
            className={`w-full relative ${
              loading && productsData?.length === 0 && "h-screen"
            }`}
          >
            <div
              className={`mt-8 ${
                productsData?.length > 0 && loading
                  ? "opacity-50"
                  : "opacity-100"
              }`}
            >
              {productsData.length > 0 ? (
                <VenderProductTable
                  productsData={productsData}
                  setProductPageSkip={setProductPageSkip}
                  getAllProducts={getAllProducts}
                />
              ) : (
                !loading && (
                  <span className="flex items-center justify-center">
                    No products found!
                  </span>
                )
              )}

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
            {loading && (
              <div className="absolute top-1/2 left-1/2">
                <CircularProgress color="secondary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(ShopDetailsPage);
