import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import logger from "redux-logger";

import createSagaMiddleware from "redux-saga";
import areaListsReducer from "./ducks/areaLists";
import cityListsReducer from "./ducks/cityLists";
import categoriesReducer from "./ducks/categories";
import productsReducer from "./ducks/product";
import shopProductsReducer from "./ducks/shopProduct";
import productsFiltersReducer from "./ducks/productsFilters";
import cityFiltersReducer from "./ducks/cityFilter";
import shopProductsFiltersReducer from "./ducks/shopProductsFilters";
import shopsReducer from "./ducks/shop";
import shopsFiltersReducer from "./ducks/shopsFilters";
import themeLayoutReducer from "./ducks/theme";
import userProfileReducer from "./ducks/userProfile";
import vendorShopDetailsReducer from "./ducks/vendorShopDetails";
import watcherSaga from "./sagas/rootSaga";
import shopConfigurationsReducer from "./ducks/shopConfigurations";
import imageVariantsReducer from "./ducks/imageVariants";

const reducer = combineReducers({
  userProfile: userProfileReducer,
  products: productsReducer,
  shopProducts: shopProductsReducer,
  shops: shopsReducer,
  categories: categoriesReducer,
  areaLists: areaListsReducer,
  cityLists: cityListsReducer,
  productsFiltersReducer: productsFiltersReducer,
  cityFiltersReducer: cityFiltersReducer,
  shopProductsFiltersReducer: shopProductsFiltersReducer,
  shopsFiltersReducer: shopsFiltersReducer,
  vendorShopDetails: vendorShopDetailsReducer,
  themeLayout: themeLayoutReducer,
  shopConfigurations: shopConfigurationsReducer,
  imageVariants: imageVariantsReducer,
});

const sagaMiddleWares = createSagaMiddleware();

const middleWares = [sagaMiddleWares];

if (process.env.NODE_ENV === "development") {
  middleWares.push(logger);
}

let composeEnhancers = compose;
if (typeof window !== "undefined") {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleWares))
);

sagaMiddleWares.run(watcherSaga);

export default store;
