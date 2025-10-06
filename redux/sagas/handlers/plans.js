import { call, put } from "redux-saga/effects";
import { loadPlansError, loadPlansSuccess } from "../../ducks/plans";
import { requestGetAllPlans } from "../requests/plans";

export function* handleGetPlansStart() {
  try {
    const response = yield call(requestGetAllPlans);

    yield put(loadPlansSuccess(response.data.getAllPlans));
  } catch (error) {
    yield put(loadPlansError(error.message));
  }
}
