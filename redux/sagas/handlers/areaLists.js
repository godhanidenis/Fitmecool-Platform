import { call, put } from "redux-saga/effects";
import {
  loadAreaListsError,
  loadAreaListsSuccess,
} from "../../ducks/areaLists";
import { requestGetAreaLists } from "../requests/areaLists";

export function* handleGetAreaLists({ payload }) {
  try {
    const response = yield call(requestGetAreaLists, payload);

    yield put(
      loadAreaListsSuccess(
        payload ? response.data.areaByCity : response.data.areaList
      )
    );
  } catch (error) {
    yield put(loadAreaListsError(error.message));
  }
}
