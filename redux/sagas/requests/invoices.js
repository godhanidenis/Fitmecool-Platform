import {
  getAllInvoice,
  getPaymentMethods,
} from "../../../graphql/queries/invoicesQueries";

export function requestGetAllInvoices(payload) {
  return getAllInvoice(payload);
}

export function requestGetPaymentMethods(payload) {
  return getPaymentMethods(payload);
}
