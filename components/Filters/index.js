import ShopByLocation from "./ShopFilters/ShopByLocation";
import FilterActions from "./FilterActions/FilterActions";
import ProductByShopFilter from "./ProductFilters/ProductByShopFilter";
import ProductColorFilter from "./ProductFilters/ProductColorFilter";
import ShopRatingsFilter from "./ShopFilters/ShopRatingsFilter";
import ProductCategoriesFilter from "./ProductFilters/ProductCategoriesFilter";

const Filter = ({
  byShop,
  setByShop,
  setProductPageSkip,
  setShopPageSkip,
  productByShop,
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-5">
      <FilterActions
        byShop={byShop}
        setByShop={setByShop}
        productByShop={productByShop}
      />

      {!byShop ? (
        <>
          <ProductCategoriesFilter setProductPageSkip={setProductPageSkip} />
          {!productByShop && (
            <ProductByShopFilter setProductPageSkip={setProductPageSkip} />
          )}
          <ProductColorFilter setProductPageSkip={setProductPageSkip} />
        </>
      ) : (
        <>
          <ShopByLocation setShopPageSkip={setShopPageSkip} />
          <ShopRatingsFilter setShopPageSkip={setShopPageSkip} />
        </>
      )}
    </div>
  );
};

export default Filter;
