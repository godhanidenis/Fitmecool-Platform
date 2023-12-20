import { call, put } from "redux-saga/effects";
import { requestImageVariants } from "../requests/imageVariants";
import {
  loadImageVariantsError,
  loadImageVariantsSuccess,
} from "../../ducks/imageVariants";

export function* handleGetImageVariants() {
  try {
    const response = yield call(requestImageVariants);

    yield put(loadImageVariantsSuccess(response.data.imageVariants));
  } catch (error) {
    yield put(loadImageVariantsError(error.message));
  }
}
