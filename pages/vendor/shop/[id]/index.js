import React, { useEffect, useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import UpperFilter from "../../../../components/Filters/UpperFilter/UpperFilter";
import { changeAppliedProductsFilters } from "../../../../redux/ducks/productsFilters";
import { useRouter } from "next/router";
import {
  changeProductPage,
  loadProductsStart,
} from "../../../../redux/ducks/product";
import { withAuth } from "../../../../components/core/PrivateRouteForVendor";
import AddIcon from "@mui/icons-material/Add";
import VenderProductTable from "../../../../components/Layout/VenderProductTable";

const ShopDetailsPage = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const dispatch = useDispatch();
  const { productsCount, productPageSkip, productsData, loading } = useSelector(
    (state) => state.products
  );

  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

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
    if (appliedProductsFilters.shopId.selectedValue.length > 0) {
      getAllProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, appliedProductsFilters, sortFilters, productPageSkip]);

  useEffect(() => {
    if (id && vendorShopDetails?.id) {
      if (id !== vendorShopDetails?.id) {
        router.push("/vendor/dashboard");
      }
    }
  }, [id, router, vendorShopDetails?.id]);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col px-6 sm:px-0">
        <div className="flex flex-row-reverse mb-2">
          <button
            onClick={() =>
              router.push(
                `/vendor/shop/${vendorShopDetails?.id}/addEditProduct/`
              )
            }
            className="flex items-cente text-lg py-1 px-2 rounded-md border-2 bg-colorGreen text-white border-colorGreen"
          >
            <AddIcon className="mr-2" />
            Add Products
          </button>
        </div>

        <div className="pt-4">
          <UpperFilter showOnlyShopDetailPage={true} />

          <div
            className={`w-full relative ${
              loading && productsData?.length === 0 && "h-screen"
            }`}
          >
            <div
              className={`mt-4 ${
                productsData?.length > 0 && loading
                  ? "opacity-50"
                  : "opacity-100"
              }`}
            >
              {productsData.length > 0 ? (
                <VenderProductTable
                  productsData={productsData}
                  getAllProducts={getAllProducts}
                />
              ) : (
                !loading &&
                productsData.length === 0 && (
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
                    onChange={(e, p) =>
                      dispatch(changeProductPage((p === 1 && 0) || (p - 1) * 6))
                    }
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
