export const LOAD_INVOICES_START = "LOAD_INVOICES_START";
export const LOAD_INVOICES_SUCCESS = "LOAD_INVOICES_SUCCESS";
export const LOAD_INVOICES_ERROR = "LOAD_INVOICES_ERROR";

export const LOAD_PAYMENT_METHODS_START = "LOAD_PAYMENT_METHODS_START";
export const LOAD_PAYMENT_METHODS_SUCCESS = "LOAD_PAYMENT_METHODS_SUCCESS";
export const LOAD_PAYMENT_METHODS_ERROR = "LOAD_PAYMENT_METHODS_ERROR";

export const loadInvoiceStart = (invoices) => ({
  type: LOAD_INVOICES_START,
  payload: invoices,
});

export const loadInvoiceSuccess = (invoices) => ({
  type: LOAD_INVOICES_SUCCESS,
  payload: invoices,
});

export const loadInvoiceError = (error) => ({
  type: LOAD_INVOICES_ERROR,
  payload: error,
});

export const loadPaymentMethodsStart = (paymentMethods) => ({
  type: LOAD_PAYMENT_METHODS_START,
  payload: paymentMethods,
});

export const loadPaymentMethodsSuccess = (paymentMethods) => ({
  type: LOAD_PAYMENT_METHODS_SUCCESS,
  payload: paymentMethods,
});

export const loadPaymentMethodsError = (error) => ({
  type: LOAD_PAYMENT_METHODS_ERROR,
  payload: error,
});

const initialState = {
  invoices: [],
  invoiceLoading: false,
  paymentMethods: [],
  paymentMethodLoading: false,
};

const invoicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INVOICES_START:
      return {
        ...state,
        invoiceLoading: true,
      };

    case LOAD_INVOICES_SUCCESS:
      return {
        ...state,
        invoiceLoading: false,
        invoices: action.payload,
      };

    case LOAD_INVOICES_ERROR:
      return {
        ...state,
        invoiceLoading: false,
      };
    case LOAD_PAYMENT_METHODS_START:
      return {
        ...state,
        paymentMethodLoading: true,
      };

    case LOAD_PAYMENT_METHODS_SUCCESS:
      return {
        ...state,
        paymentMethodLoading: false,
        paymentMethods: action.payload,
      };

    case LOAD_PAYMENT_METHODS_ERROR:
      return {
        ...state,
        paymentMethodLoading: false,
      };
    default:
      return state;
  }
};

export default invoicesReducer;
