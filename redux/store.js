import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import logger from "redux-logger";

import createSagaMiddleware from "redux-saga";
import areaListsReducer from "./ducks/areaLists";
import categoriesReducer from "./ducks/categories";
import productsReducer from "./ducks/product";
import productsFiltersReducer from "./ducks/productsFilters";
import shopsReducer from "./ducks/shop";
import shopsFiltersReducer from "./ducks/shopsFilters";
import themeLayoutReducer from "./ducks/theme";
import userProfileReducer from "./ducks/userProfile";
import vendorShopDetailsReducer from "./ducks/vendorShopDetails";
import watcherSaga from "./sagas/rootSaga";
import shopConfigurationsReducer from "./ducks/shopConfigurations";

const reducer = combineReducers({
  userProfile: userProfileReducer,
  products: productsReducer,
  shops: shopsReducer,
  categories: categoriesReducer,
  areaLists: areaListsReducer,
  productsFiltersReducer: productsFiltersReducer,
  shopsFiltersReducer: shopsFiltersReducer,
  vendorShopDetails: vendorShopDetailsReducer,
  themeLayout: themeLayoutReducer,
  shopConfigurations: shopConfigurationsReducer,
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
