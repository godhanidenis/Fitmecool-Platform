import React, { useCallback, useEffect } from "react";
import VendorSidebar from "../sections/vendor-section/VendorSidebar";
import { useDispatch, useSelector } from "react-redux";
import { loadVendorShopDetailsStart } from "../../redux/ducks/vendorShopDetails";
import { changeAppliedProductsFilters } from "../../redux/ducks/productsFilters";
import { loadProductsStart } from "../../redux/ducks/product";
import { loadShopConfigurationsStart } from "../../redux/ducks/shopConfigurations";
import { loadCategoriesStart } from "../../redux/ducks/categories";
import { loadImageVariantsStart } from "../../redux/ducks/imageVariants";

const VendorCommonLayout = ({ children, setAccessToken }) => {
  const { userProfile } = useSelector((state) => state.userProfile);

  const { appliedProductsFilters, sortFilters } = useSelector(
    (state) => state.productsFiltersReducer
  );

  const { productPageSkip } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      dispatch(loadVendorShopDetailsStart(userProfile?.userCreatedShopId));
    }
  }, [dispatch, userProfile?.userCreatedShopId]);

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      dispatch(loadShopConfigurationsStart());
      dispatch(loadImageVariantsStart());
    }
  }, [dispatch, userProfile?.userCreatedShopId]);

  const getAllProducts = useCallback(() => {
    dispatch(
      loadProductsStart({
        pageData: {
          skip: productPageSkip,
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
  }, [
    dispatch,
    appliedProductsFilters,
    sortFilters.sortType.selectedValue,
    productPageSkip,
  ]);

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      dispatch(
        changeAppliedProductsFilters({
          key: "shopId",
          value: {
            selectedValue: [userProfile?.userCreatedShopId],
          },
        })
      );
    }
  }, [dispatch, userProfile?.userCreatedShopId]);

  useEffect(() => {
    if (appliedProductsFilters.shopId.selectedValue.length > 0) {
      getAllProducts();
    }
  }, [
    dispatch,
    appliedProductsFilters,
    sortFilters,
    productPageSkip,
    getAllProducts,
  ]);

  useEffect(() => {
    dispatch(loadCategoriesStart());
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row font-Nova h-[calc(100vh-64px)] overflow-scroll">
      <div className="lg:w-[300px] relative sm:bg-white shadow-xl">
        <VendorSidebar setAccessToken={setAccessToken} />
      </div>
      <div className="w-full lg:w-[73%] xl:w-[83%] sm:mt-6 px-4 py-4 sm:my-5 sm:px-10 sm:py-0">
        {children}
      </div>
    </div>
  );
};

export default VendorCommonLayout;
