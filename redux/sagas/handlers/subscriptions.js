import { call, put } from "redux-saga/effects";
import { requestGetSubscriptions } from "../requests/subscriptions";
import {
  loadSubscriptionError,
  loadSubscriptionSuccess,
} from "../../ducks/subscriptions";

export function* handleGetSubscriptions({ payload }) {
  try {
    const response = yield call(requestGetSubscriptions, payload);

    yield put(loadSubscriptionSuccess(response.data.getSubscriptions));
  } catch (error) {
    yield put(loadSubscriptionError(error.message));
  }
}
