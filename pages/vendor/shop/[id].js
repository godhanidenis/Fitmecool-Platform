import React, { useEffect, useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import UpperFilter from "../../../components/Filters/UpperFilter/UpperFilter";
import { useRouter } from "next/router";
import {
  changeProductPage,
  loadProductsStart,
} from "../../../redux/ducks/product";
import { withAuth } from "../../../components/core/PrivateRouteForVendor";
import AddIcon from "@mui/icons-material/Add";
import VenderProductTable from "../../../components/Layout/VenderProductTable";
import AddEditProductPage from "../../../components/sections/vendor-section/AddEditProductPage";
import { scrollToTitleName } from "../../../utils/common";

const ShopDetailsPage = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const [addEditProductShow, setAddEditProductShow] = useState(false);

  const [editableProductData, setEditableProductData] = useState();

  const router = useRouter();
  const { id } = router.query;

  const dispatch = useDispatch();
  const { productsCount, productPageSkip, productsData, loading } = useSelector(
    (state) => state.products
  );

  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (id && vendorShopDetails?.id) {
      if (id !== vendorShopDetails?.id) {
        router.push("/vendor/dashboard");
      }
    }
  }, [id, router, vendorShopDetails?.id]);

  const { appliedProductsFilters, sortFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );

  const getAllProducts = () => {
    dispatch(
      loadProductsStart({
        pageData: {
          skip: 0,
          limit: 6,
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
        forDashboard: true,
      })
    );
  };

  if (!isHydrated) {
    return null;
  }

  return !addEditProductShow ? (
    <div className="flex flex-col px-6 sm:px-0 h-full overflow-scroll hideScroll">
      <div className="flex flex-row-reverse mb-2">
        <button
          onClick={() => setAddEditProductShow(true)}
          className="flex items-center text-lg py-1 px-2 rounded-md border-2 bg-colorGreen text-white border-colorGreen"
        >
          <AddIcon className="mr-2" />
          Add Products
        </button>
      </div>

      <div className="">
        <UpperFilter showOnlyShopDetailPage={false} />

        <div
          className={`w-full relative ${
            loading && productsData?.length === 0 && "h-screen"
          }`}
        >
          <div
            className={`mt-4 ${
              productsData?.length > 0 && loading ? "opacity-50" : "opacity-100"
            }`}
          >
            {productsData.length > 0 ? (
              <VenderProductTable
                productsData={productsData}
                setAddEditProductShow={setAddEditProductShow}
                setEditableProductData={setEditableProductData}
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
                  page={(productPageSkip === 0 && 1) || productPageSkip / 6 + 1}
                  onChange={(e, p) => {
                    scrollToTitleName();
                    dispatch(changeProductPage((p === 1 && 0) || (p - 1) * 6));
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
  ) : (
    <AddEditProductPage
      setAddEditProductShow={setAddEditProductShow}
      editableProductData={editableProductData}
      setEditableProductData={setEditableProductData}
      getAllProducts={getAllProducts}
    />
  );
};

export default withAuth(ShopDetailsPage);
