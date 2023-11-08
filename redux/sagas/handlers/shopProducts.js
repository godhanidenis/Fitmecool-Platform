import { call, put } from "redux-saga/effects";
import { requestGetShopProducts } from "../requests/shopProducts";
import {
  loadShopProductsError,
  loadShopProductsSuccess,
} from "../../ducks/shopProduct";

export function* handleGetShopProducts({ payload }) {
  try {
    const response = yield call(requestGetShopProducts, payload);

    yield put(loadShopProductsSuccess(response.data.productList));
  } catch (error) {
    yield put(loadShopProductsError(error));
  }
}
