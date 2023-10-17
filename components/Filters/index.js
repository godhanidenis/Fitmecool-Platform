import ShopByLocation from "./ShopFilters/ShopByLocation";
import FilterActions from "./FilterActions/FilterActions";
import ProductByShopFilter from "./ProductFilters/ProductByShopFilter";
import ProductColorFilter from "./ProductFilters/ProductColorFilter";
import ShopRatingsFilter from "./ShopFilters/ShopRatingsFilter";
import ProductCategoriesFilter from "./ProductFilters/ProductCategoriesFilter";
import { useSelector } from "react-redux";
import ProductPriceFilter from "./ProductFilters/ProductPriceFilter";
import ProductTypeFilter from "./ProductFilters/ProductTypeFilter";

const Filter = ({ productByShop }) => {
  const { byShop } = useSelector((state) => state.shopsFiltersReducer);

  return (
    <div className="flex flex-col space-y-4 mb-5">
      <FilterActions productByShop={productByShop} />

      {!byShop ? (
        <div className="px-5 sm:px-12">
          <ProductTypeFilter />
          <ProductCategoriesFilter />
          {!productByShop && <ProductByShopFilter />}
          <ProductColorFilter />
          <ProductPriceFilter />
        </div>
      ) : (
        <div className="px-5 sm:px-12">
          <ShopByLocation />
          <ShopRatingsFilter />
        </div>
      )}
    </div>
  );
};

export default Filter;
