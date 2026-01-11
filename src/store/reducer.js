// Estado inicial
const initialState = {
  products: [],
  cart: null,
  paymentData: null,
  summary: null,
  transaction: null,
  loading: false,
  error: null,
  currentStep: 'products',
  searchQuery: '',
  selectedCategory: 'Todos'
};

// Action types
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const SET_CART = 'SET_CART';
export const SET_PAYMENT_DATA = 'SET_PAYMENT_DATA';
export const SET_SUMMARY = 'SET_SUMMARY';
export const SET_TRANSACTION = 'SET_TRANSACTION';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const SET_STEP = 'SET_STEP';
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
export const SET_CATEGORY = 'SET_CATEGORY';
export const RESET = 'RESET';

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return { ...state, products: action.payload };
    case SET_CART:
      return { ...state, cart: action.payload };
    case SET_PAYMENT_DATA:
      return { ...state, paymentData: action.payload };
    case SET_SUMMARY:
      return { ...state, summary: action.payload };
    case SET_TRANSACTION:
      return { ...state, transaction: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SET_STEP:
      return { ...state, currentStep: action.payload };
    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case SET_CATEGORY:
      return { ...state, selectedCategory: action.payload };
    case RESET:
      return { ...initialState, products: state.products };
    default:
      return state;
  }
};

// Action creators
export const setProducts = (products) => ({ type: SET_PRODUCTS, payload: products });
export const setCart = (cart) => ({ type: SET_CART, payload: cart });
export const setPaymentData = (data) => ({ type: SET_PAYMENT_DATA, payload: data });
export const setSummary = (summary) => ({ type: SET_SUMMARY, payload: summary });
export const setTransaction = (transaction) => ({ type: SET_TRANSACTION, payload: transaction });
export const setLoading = (loading) => ({ type: SET_LOADING, payload: loading });
export const setError = (error) => ({ type: SET_ERROR, payload: error });
export const setStep = (step) => ({ type: SET_STEP, payload: step });
export const setSearchQuery = (query) => ({ type: SET_SEARCH_QUERY, payload: query });
export const setCategory = (category) => ({ type: SET_CATEGORY, payload: category });
export const reset = () => ({ type: RESET });

export default reducer;
