import { all, fork, takeLatest } from "redux-saga/effects";
import { LOAD_AREA_LIST_START } from "../ducks/areaLists";
import { LOAD_CATEGORY_START } from "../ducks/categories";
import { LOAD_PRODUCT_START } from "../ducks/product";
import { LOAD_ALL_SHOP_START, LOAD_SHOP_START } from "../ducks/shop";
import { LOAD_USER_PROFILE_START } from "../ducks/userProfile";
import { LOAD_VENDOR_SHOP_DETAILS_START } from "../ducks/vendorShopDetails";
import { handleGetAreaLists } from "./handlers/areaLists";
import { handleGetCategories } from "./handlers/categories";
import { handleGetProducts } from "./handlers/products";
import { handleGetAllShops, handleGetShops } from "./handlers/shops";
import { handleGetUserProfile } from "./handlers/userProfile";
import { handleGetVendorShopDetails } from "./handlers/vendorShopDetails";
import { LOAD_SHOP_CONFIGURATION_START } from "../ducks/shopConfigurations";
import { handleGetShopConfigurations } from "./handlers/shopConfigurations";

function* onLoadUserProfile() {
  yield takeLatest(LOAD_USER_PROFILE_START, handleGetUserProfile);
}

function* onLoadProducts() {
  yield takeLatest(LOAD_PRODUCT_START, handleGetProducts);
}

function* onLoadShops() {
  yield takeLatest(LOAD_SHOP_START, handleGetShops);
}

function* onLoadAllShops() {
  yield takeLatest(LOAD_ALL_SHOP_START, handleGetAllShops);
}

function* onLoadCategories() {
  yield takeLatest(LOAD_CATEGORY_START, handleGetCategories);
}

function* onLoadAreaLists() {
  yield takeLatest(LOAD_AREA_LIST_START, handleGetAreaLists);
}
function* onLoadShopConfigurations() {
  yield takeLatest(LOAD_SHOP_CONFIGURATION_START, handleGetShopConfigurations);
}

function* onLoadVendorShopDetails() {
  yield takeLatest(LOAD_VENDOR_SHOP_DETAILS_START, handleGetVendorShopDetails);
}

const userProfileSagas = [fork(onLoadUserProfile)];
const productSagas = [fork(onLoadProducts)];
const shopSagas = [fork(onLoadShops), fork(onLoadAllShops)];
const categorySagas = [fork(onLoadCategories)];
const areaLists = [fork(onLoadAreaLists)];
const shopConfigurations = [fork(onLoadShopConfigurations)];
const vendorShopDetails = [fork(onLoadVendorShopDetails)];

export default function* watcherSaga() {
  yield all([
    ...userProfileSagas,
    ...productSagas,
    ...shopSagas,
    ...categorySagas,
    ...areaLists,
    ...shopConfigurations,
    ...vendorShopDetails,
  ]);
}
