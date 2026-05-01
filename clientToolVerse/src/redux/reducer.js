import {
  ADD_TO_CART,
  CLEAN_BDD,
  CREATE_USER,
  GET_USER,
  GET_TOOLS,
  GET_TOOLS_BY_ID,
  GET_TOOLS_BY_NAME,
  ORDER_BY_NAME,
  ORDER_BY_PRICE,
  REMOVE_FROM_CART,
  LESS_FROM_CART,
  SET_CURRRENT_PAGE,
  CHANGE_FILTER_CATEGORY,
  CHANGE_FILTER_BRAND,
  LOGIN,
  CERRAR_SESION,
  ERROR_LOGIN,
  ISAUTHENTICATED,
  UPDATE_TOOL_STOCK,
  REGISTER_STOCK_EXIT_SUCCESS,
  REGISTER_STOCK_EXIT_FAILURE,
  ACTUAL_USER,
  DELETE_TROLLEY,
  GET_CATEGORY,
  ADD_REVIEW,
  UPDATE_REVIEW_COMMENTS,
  DELETE_REVIEW,
  SET_IS_AUTHENTICATED,
  GET_SHIPPING_ADDRESS_SUCCESS,
  SET_LAST_VISITED_ROUTE,
  GET_USER_ID,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  CREATE_CART_BDD,
  ADD_TO_CART_SUCCESS,
  SELECT_ADDRESS,
  ORDERS,
  DELETE_ORDER,
  INTERSECT,
} from "./type";

const initialState = {
  allTools: [],
  toolsShown: [],
  toolsDetail: {},
  usersCreated: [],
  actualUser: {},
  itemCart: [],
  currentPage: 1,
  login: {},
  errorLogin: "",
  isAuthenticated: false,
  address: [],
  category: [],
  reviews: [],
  lastVisitedRoute: "/",
  user: {},
  updateUserError: null,
  addressSelected: "",
  orders: [],
  byCategory: [],
  byBrand: [],
  cartBDD: null,
};

function intersection(arr1, arr2, arr3) {
  return [arr1, arr2, arr3].reduce((a, b) => a.filter((c) => b.includes(c)));
}

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_TOOLS:
      return {
        ...state,
        allTools: payload,
        toolsShown: payload,
        byBrand: payload,
        byCategory: payload,
      };

    case GET_TOOLS_BY_NAME:
      return { ...state, toolsShown: payload };

    case GET_TOOLS_BY_ID:
      return { ...state, toolsDetail: payload };

    case CREATE_USER:
      return { ...state, usersCreated: [...state.usersCreated, payload] };

    case GET_USER:
      return { ...state, usersCreated: payload };

    case GET_USER_ID:
      return { ...state, user: payload };

    case ADD_TO_CART: {
      const existingIndex = state.itemCart.findIndex((item) => item.id === payload.id);
      if (existingIndex === -1) {
        return { ...state, itemCart: [...state.itemCart, { ...payload, quantity: 1 }] };
      }
      return {
        ...state,
        itemCart: state.itemCart.map((item) =>
          item.id === payload.id && item.quantity < 5
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }

    case REMOVE_FROM_CART:
      return { ...state, itemCart: state.itemCart.filter((prod) => prod.id !== payload) };

    case LESS_FROM_CART: {
      const updated = state.itemCart.reduce((acc, item) => {
        if (item.id === payload) {
          if (item.quantity > 1) acc.push({ ...item, quantity: item.quantity - 1 });
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
      return { ...state, itemCart: updated };
    }

    case DELETE_TROLLEY:
      return { ...state, itemCart: [] };

    case CREATE_CART_BDD:
      return { ...state, cartBDD: { purchaseCartId: payload } };

    case ADD_TO_CART_SUCCESS:
      return { ...state, cartBDD: { ...state.cartBDD, details: payload } };

    case SET_CURRRENT_PAGE:
      return { ...state, currentPage: payload };

    case CLEAN_BDD:
      return { ...state, toolsShown: [] };

    case CHANGE_FILTER_CATEGORY:
      return {
        ...state,
        byCategory: state.allTools.filter((e) => e.category.includes(payload)),
      };

    case CHANGE_FILTER_BRAND:
      return {
        ...state,
        byBrand: state.allTools.filter((e) => e.brand === payload),
      };

    case INTERSECT:
      return {
        ...state,
        toolsShown: intersection(state.allTools, state.byCategory, state.byBrand),
      };

    case ORDER_BY_NAME: {
      const sorted = [...state.toolsShown].sort((a, b) => {
        if (a.name > b.name) return payload === "de A-Z" ? 1 : -1;
        if (a.name < b.name) return payload === "de A-Z" ? -1 : 1;
        return 0;
      });
      return { ...state, toolsShown: sorted };
    }

    case ORDER_BY_PRICE: {
      const sorted = [...state.toolsShown].sort((a, b) =>
        payload === "Ascendente" ? a.price - b.price : b.price - a.price
      );
      return { ...state, toolsShown: sorted };
    }

    case UPDATE_TOOL_STOCK:
      return {
        ...state,
        allTools: state.allTools.map((tool) =>
          tool.id === payload.productId ? { ...tool, stock: payload.newStock } : tool
        ),
      };

    case REGISTER_STOCK_EXIT_SUCCESS:
      return {
        ...state,
        allTools: state.allTools.map((tool) =>
          tool.id === payload.id ? { ...tool, stock: payload.stock } : tool
        ),
      };

    case REGISTER_STOCK_EXIT_FAILURE:
      return { ...state, error: payload };

    case LOGIN:
      // Al ingresar limpiamos datos del usuario anterior para evitar contaminación entre sesiones
      return {
        ...state,
        login: payload,
        user: {},
        actualUser: {},
        address: [],
        addressSelected: "",
        itemCart: [],
        errorLogin: "",
      };

    case ACTUAL_USER:
      return { ...state, actualUser: payload };

    case CERRAR_SESION:
      return { ...state, isAuthenticated: false, actualUser: {}, login: {}, itemCart: [] };

    case ISAUTHENTICATED:
      return { ...state, isAuthenticated: true };

    case SET_IS_AUTHENTICATED:
      return { ...state, isAuthenticated: payload };

    case SET_LAST_VISITED_ROUTE:
      return { ...state, lastVisitedRoute: payload };

    case ERROR_LOGIN:
      return { ...state, errorLogin: payload };

    case GET_CATEGORY:
      return { ...state, category: payload };

    case ADD_REVIEW:
      return { ...state, reviews: [...state.reviews, payload] };

    case UPDATE_REVIEW_COMMENTS:
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review.id === payload.id ? { ...review, comments: payload.comments } : review
        ),
      };

    case DELETE_REVIEW:
      return { ...state, reviews: state.reviews.filter((review) => review.id !== payload) };

    case GET_SHIPPING_ADDRESS_SUCCESS:
      return { ...state, address: payload };

    case SELECT_ADDRESS:
      return { ...state, addressSelected: payload };

    case UPDATE_USER_SUCCESS:
      return { ...state, actualUser: payload, updateUserError: null };

    case UPDATE_USER_ERROR:
      return { ...state, updateUserError: payload };

    case ORDERS:
      return { ...state, orders: payload };

    case DELETE_ORDER:
      return { ...state, orders: state.orders.filter((order) => order.id !== payload) };

    default:
      return state;
  }
};

export default rootReducer;
