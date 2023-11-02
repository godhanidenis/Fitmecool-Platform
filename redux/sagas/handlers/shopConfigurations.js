import { call, put } from "redux-saga/effects";
import {
  loadShopConfigurationsError,
  loadShopConfigurationsSuccess,
} from "../../ducks/shopConfigurations";
import { requestShopConfigurations } from "../requests/shopConfigurations";

export function* handleGetShopConfigurations() {
  try {
    const response = yield call(requestShopConfigurations);

    yield put(loadShopConfigurationsSuccess(response.data.shopConfigurations));
  } catch (error) {
    yield put(loadShopConfigurationsError(error.message));
  }
}
