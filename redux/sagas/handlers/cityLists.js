import { call, put } from "redux-saga/effects";
import { requestGetCityLists } from "../requests/cityLists";
import {
  loadCityListsError,
  loadCityListsSuccess,
} from "../../ducks/cityLists";

export function* handleGetCityLists() {
  try {
    const response = yield call(requestGetCityLists);

    yield put(loadCityListsSuccess(response.data.cityList));
  } catch (error) {
    yield put(loadCityListsError(error.message));
  }
}
