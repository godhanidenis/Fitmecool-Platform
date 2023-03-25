import { call, put } from "redux-saga/effects";
import {
  loadVendorShopDetailsError,
  loadVendorShopDetailsSuccess,
} from "../../ducks/vendorShopDetails";
import { requestGetVendorShopDetails } from "../requests/vendorShopDetails";

export function* handleGetVendorShopDetails({ payload }) {
  try {
    const response = yield call(requestGetVendorShopDetails, payload);

    yield put(loadVendorShopDetailsSuccess(response.data.shop));
  } catch (error) {
    yield put(loadVendorShopDetailsError(error));
  }
}
