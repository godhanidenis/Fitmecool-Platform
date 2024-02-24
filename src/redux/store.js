import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import userProfileReducer from './LoginUserProfileSlice/userSlice';
import ShopDetailSlice from './vendorShopDetailsSlice/ShopDetailSlice';
import CategoryListSlice from './CategorySlice/CategoryListSlice';
import AreaListSlice from './AreaSlice/AreaListSlice';
import ProductFilterSlice from './ProductFilter/ProductFilterSlice';
import ShopFilterSlice from './ShopFilter/ShopFilterSlice';
import ProductSlice from './ProductSlice/ProductSlice';
import ShopSlice from './ShopSlice/ShopSlice';
import AppVersionSlice from './AppVersionSlice/AppVersionSlice';
import ShopConfigurationsSlice from './ShopConfigurationsSlice/ShopConfigurationsSlice';
import ShopProductFilterSlice from './ShopProductFilter/ShopProductFilterSlice';
import ShopProductSlice from './ShopProductSlice/ShopProductSlice';
import CityListSlice from './CityListSlice/CityListSlice';
import CityFilterSlice from './CityFilterSlice/CityFilterSlice';
import ImageVariantsSlice from './ImageVariantsSlice/ImageVariantsSlice';

const middleware = getDefaultMiddleware({
  serializableCheck: false, // Disable serializable state check
});

const store = configureStore({
  reducer: {
    user: userProfileReducer,
    shopDetail: ShopDetailSlice,
    categories: CategoryListSlice,
    areaLists: AreaListSlice,
    productsFiltersReducer: ProductFilterSlice,
    shopProductsFiltersReducer: ShopProductFilterSlice,
    shopsFiltersReducer: ShopFilterSlice,
    productsData: ProductSlice,
    shopProductsData: ShopProductSlice,
    shops: ShopSlice,
    appVersion: AppVersionSlice,
    shopConfigurations: ShopConfigurationsSlice,
    cityLists: CityListSlice,
    cityFiltersReducer: CityFilterSlice,
    imageVariants: ImageVariantsSlice,
  },
  middleware,
});

export default store;
