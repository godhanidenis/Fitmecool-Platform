import ShopByLocation from "./ShopFilters/ShopByLocation";
import FilterActions from "./FilterActions/FilterActions";
import ProductByShopFilter from "./ProductFilters/ProductByShopFilter";
import ProductColorFilter from "./ProductFilters/ProductColorFilter";
import ShopRatingsFilter from "./ShopFilters/ShopRatingsFilter";
import ProductCategoriesFilter from "./ProductFilters/ProductCategoriesFilter";
import { useSelector } from "react-redux";

const Filter = ({ productByShop }) => {
  const { byShop } = useSelector((state) => state.shopsFiltersReducer);

  return (
    <div className="flex flex-col space-y-4 mb-5">
      <FilterActions productByShop={productByShop} />

      {!byShop ? (
        <div className="px-5 sm:px-8">
          <ProductCategoriesFilter />
          {!productByShop && <ProductByShopFilter />}
          <ProductColorFilter />
        </div>
      ) : (
        <div className="px-8">
          <ShopByLocation />
          <ShopRatingsFilter />
        </div>
      )}
    </div>
  );
};

export default Filter;
