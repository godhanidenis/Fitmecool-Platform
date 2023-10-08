import { call, put } from "redux-saga/effects";
import {
  loadAllShopsListsError,
  loadAllShopsListsSuccess,
  loadShopsError,
  loadShopsSuccess,
} from "../../ducks/shop";
import { requestGetAllShops, requestGetShops } from "../requests/shops";

export function* handleGetShops({ payload }) {
  try {
    const response = yield call(requestGetShops, payload);

    yield put(loadShopsSuccess(response.data.shopList));
  } catch (error) {
    yield put(loadShopsError(error));
  }
}

export function* handleGetAllShops() {
  try {
    const response = yield call(requestGetAllShops);

    console.log("response.data", response.data);
    yield put(loadAllShopsListsSuccess(response.data.getAllShops));
  } catch (error) {
    yield put(loadAllShopsListsError(error));
  }
}
