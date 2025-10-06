import { call, put } from "redux-saga/effects";
import {
  requestGetAllInvoices,
  requestGetPaymentMethods,
} from "../requests/invoices";
import {
  loadInvoiceError,
  loadInvoiceSuccess,
  loadPaymentMethodsError,
  loadPaymentMethodsSuccess,
} from "../../ducks/invoices";

export function* handleGetInvoices({ payload }) {
  try {
    const response = yield call(requestGetAllInvoices, payload);

    yield put(loadInvoiceSuccess(response.data.getAllInvoice));
  } catch (error) {
    yield put(loadInvoiceError(error.message));
  }
}

export function* handleGetPaymentMethods({ payload }) {
  try {
    const response = yield call(requestGetPaymentMethods, payload);

    yield put(loadPaymentMethodsSuccess(response.data.getPaymentMethods));
  } catch (error) {
    yield put(loadPaymentMethodsError(error.message));
  }
}
