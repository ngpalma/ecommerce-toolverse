import axios from "axios";

import {
  GET_TOOLS,
  GET_TOOLS_BY_NAME,
  GET_TOOLS_BY_ID,
  CREATE_USER,
  GET_USER,
  ADD_TO_CART,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  REMOVE_FROM_CART,
  LESS_FROM_CART,
  ORDER_BY_NAME,
  ORDER_BY_PRICE,
  SET_CURRRENT_PAGE,
  CLEAN_BDD,
  CHANGE_FILTER_CATEGORY,
  CHANGE_FILTER_BRAND,
  LOGIN,
  CERRAR_SESION,
  ERROR_LOGIN,
  ISAUTHENTICATED,
  REGISTER_STOCK_ENTRY_SUCCESS,
  REGISTER_STOCK_ENTRY_FAILURE,
  REGISTER_STOCK_EXIT_SUCCESS,
  UPDATE_TOOL_STOCK,
  ACTUAL_USER,
  DELETE_TROLLEY,
  GET_CATEGORY,
  PURCHASE_ORDER_SUCCESS,
  PURCHASE_ORDER_ERROR,
  CREATE_SHIPPING_ADDRESS_SUCCESS,
  CREATE_SHIPPING_ADDRESS_ERROR,
  ADD_REVIEW,
  UPDATE_REVIEW_COMMENTS,
  DELETE_REVIEW,
  SET_IS_AUTHENTICATED,
  GET_SHIPPING_ADDRESS_SUCCESS,
  GET_SHIPPING_ADDRESS_ERROR,
  DELETE_SHIPPING_ADDRESS_SUCCESS,
  DELETE_SHIPPING_ADDRESS_ERROR,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  UPDATE_SHIPPING_ADDRESS_SUCCESS,
  UPDATE_SHIPPING_ADDRESS_ERROR,
  SET_LAST_VISITED_ROUTE,
  GET_USER_ID,
  GET_USER_ID_ERROR,
  CREATE_CART_BDD,
  ORDERS,
  DELETE_ORDER,
  SELECT_ADDRESS,
  INTERSECT,
} from "./type";

export const getToolsByName = (tool) => async (dispatch) => {
  try {
    const response = await axios.get(`/products?name=${tool}`);
    dispatch({ type: GET_TOOLS_BY_NAME, payload: response.data });
  } catch (error) {
    console.error("Error buscando productos:", error);
  }
};

export const getTools = () => async (dispatch) => {
  try {
    const tools = await axios.get(`/products`);
    dispatch({ type: GET_TOOLS, payload: tools.data });
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
};

export const getToolById = (id) => async (dispatch) => {
  try {
    const tools = await axios.get(`/products/${id}`);
    dispatch({ type: GET_TOOLS_BY_ID, payload: tools.data });
  } catch (error) {
    console.error("Error cargando producto:", error);
  }
};

export const createUser = (character) => async (dispatch) => {
  const { data } = await axios.post(`/register`, character, { withCredentials: true });
  dispatch({ type: CREATE_USER, payload: data });
};

const isAuthenticated = () => ({ type: ISAUTHENTICATED });

export const setIsAuthenticated = (value) => ({
  type: SET_IS_AUTHENTICATED,
  payload: value,
});

export const login = (character) => async (dispatch) => {
  try {
    const { data } = await axios.post(`/login`, character, { withCredentials: true });
    window.localStorage.setItem("token", data.token);
    dispatch({ type: LOGIN, payload: data });
    dispatch(isAuthenticated());
  } catch (error) {
    dispatch(errorLogin(error?.response?.data?.message));
  }
};

export const errorLogin = (error) => ({ type: ERROR_LOGIN, payload: error });

export const actualUser = (info) => ({ type: ACTUAL_USER, payload: info });

export const cerrarSesion = () => async (dispatch) => {
  try {
    await axios.post("/logout", {}, { withCredentials: true });
    window.localStorage.removeItem("token");
    dispatch({ type: CERRAR_SESION });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export const setLastVisitedRoute = (route) => ({
  type: SET_LAST_VISITED_ROUTE,
  payload: route,
});

export const getUser = (name) => async (dispatch) => {
  try {
    const response = await axios.get(`/user/${name}`);
    dispatch({ type: GET_USER, payload: response });
  } catch (error) {
    console.error("Error cargando usuario:", error);
  }
};

export const addToCart = (item) => ({ type: ADD_TO_CART, payload: item });

export const removeFromCart = (itemId) => ({ type: REMOVE_FROM_CART, payload: itemId });

export const lessFromCart = (itemId) => ({ type: LESS_FROM_CART, payload: itemId });

export const deleteTrolley = () => ({ type: DELETE_TROLLEY });

export const orderByName = (name) => ({ type: ORDER_BY_NAME, payload: name });

export const orderByPrice = (price) => ({ type: ORDER_BY_PRICE, payload: price });

export const setCurrentPage = (page) => ({ type: SET_CURRRENT_PAGE, payload: page });

export const cleanBdd = () => ({ type: CLEAN_BDD });

export const changeFilterCategory = (category) => ({
  type: CHANGE_FILTER_CATEGORY,
  payload: category,
});

export const changeFilterBrand = (brand) => ({
  type: CHANGE_FILTER_BRAND,
  payload: brand,
});

export const intersect = () => async (dispatch) => {
  dispatch({ type: INTERSECT });
};

export const updateProductStock = (productId, newStock) => ({
  type: UPDATE_TOOL_STOCK,
  payload: { productId, newStock },
});

export const registerStockEntry = (toolId, quantity) => async (dispatch) => {
  try {
    const response = await axios.post(`/stock/entrada/${toolId}/${quantity}`);
    dispatch({
      type: REGISTER_STOCK_ENTRY_SUCCESS,
      payload: { id: toolId, stock: response.data.stock },
    });
  } catch (error) {
    dispatch({
      type: REGISTER_STOCK_ENTRY_FAILURE,
      payload: error?.response?.data?.error,
    });
  }
};

export const registerStockExit = (toolId, quantity) => async (dispatch) => {
  try {
    const response = await axios.post(`/stock/salida/${toolId}/${quantity}`);
    dispatch({
      type: REGISTER_STOCK_EXIT_SUCCESS,
      payload: { id: toolId, stock: response.data.stock },
    });
  } catch (error) {
    console.error("Error registrando salida de stock:", error);
  }
};

export const getCategory = () => async (dispatch) => {
  try {
    const category = await axios.get(`/category`);
    dispatch({ type: GET_CATEGORY, payload: category.data });
  } catch (error) {
    console.error("Error cargando categorías:", error);
  }
};

export const createCartBdd = (userId) => async (dispatch) => {
  try {
    const cartId = await axios.post("/purchaseCart", { userId });
    dispatch({ type: CREATE_CART_BDD, payload: cartId.data.id });
    return cartId.data.id;
  } catch (error) {
    console.error("Error creando carrito:", error);
  }
};

export const addDetail = (purchaseCartId, products) => async (dispatch) => {
  try {
    const compra = await Promise.all(
      products.map(async (product) => {
        const cartDetail = await axios.post("/purchaseDetail", {
          purchaseCartId,
          productId: product.productId,
          quantity: product.quantity,
        });
        const prodDetails = await axios.get(`/products/${product.productId}`);
        return {
          ...cartDetail.data,
          name: prodDetails.data.name,
          price: prodDetails.data.price,
        };
      })
    );
    dispatch({ type: ADD_TO_CART_SUCCESS, payload: compra });
    return compra;
  } catch (error) {
    dispatch({
      type: ADD_TO_CART_FAILURE,
      payload: error?.response?.data?.error,
    });
  }
};

export const getLastPurchaseCart = (userId) => async () => {
  try {
    const user = await axios.get(`/user/${userId}`);
    const carts = user.data.purchaseCarts;
    if (!carts?.length) return null;
    return carts.reduce((max, cart) => (cart.id > max.id ? cart : max), carts[0]).id;
  } catch (error) {
    console.error("Error obteniendo el último carrito:", error);
    return null;
  }
};

export const getProductsInCart = (purchaseCartId) => async () => {
  try {
    if (!purchaseCartId) return [];
    const details = await axios.get(`/purchaseDetail/purchaseCartId/${purchaseCartId}`);
    return details.data;
  } catch (error) {
    console.error("Error buscando detalles del carrito:", error);
    return [];
  }
};

export const addPurchaseOrder =
  (userId, purchaseCartId, shippingAddressId, paymentMethodId, total) =>
  async (dispatch) => {
    try {
      const response = await axios.post("/purchaseOrder", {
        userId,
        purchaseCartId,
        shippingAddressId,
        paymentMethodId,
        total,
      });
      dispatch({ type: PURCHASE_ORDER_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({
        type: PURCHASE_ORDER_ERROR,
        payload: error?.response?.data?.error,
      });
    }
  };

export const createShippingAddress = (address) => async (dispatch) => {
  try {
    const response = await axios.post("/shippingAddress", address);
    dispatch({ type: CREATE_SHIPPING_ADDRESS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: CREATE_SHIPPING_ADDRESS_ERROR,
      payload: error?.response?.data?.error,
    });
  }
};

export const getShippingAddressByUserId = (userId) => async (dispatch) => {
  try {
    const response = await axios.get(`/shippingAddress/user/${userId}`);
    dispatch({ type: GET_SHIPPING_ADDRESS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: GET_SHIPPING_ADDRESS_ERROR,
      payload: error?.response?.data?.error,
    });
  }
};

export const selectAddress = (address) => async (dispatch) => {
  dispatch({ type: SELECT_ADDRESS, payload: address });
};

export const addReview = (review) => async (dispatch) => {
  try {
    const response = await axios.post("/review", review);
    dispatch({ type: ADD_REVIEW, payload: response.data });
  } catch (error) {
    console.error("Error al crear la review:", error);
  }
};

export const updateReviewComments = (id, comments) => ({
  type: UPDATE_REVIEW_COMMENTS,
  payload: { id, comments },
});

export const deleteReview = (id) => ({ type: DELETE_REVIEW, payload: id });

export const deleteShippingAddress = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(`/shippingAddress/${id}`);
    dispatch({ type: DELETE_SHIPPING_ADDRESS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: DELETE_SHIPPING_ADDRESS_ERROR,
      payload: error?.response?.data?.error,
    });
  }
};

export const updateShippingAddress = (id, address) => async (dispatch) => {
  try {
    const response = await axios.put(`/shippingAddress/${id}`, address);
    dispatch({ type: UPDATE_SHIPPING_ADDRESS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: UPDATE_SHIPPING_ADDRESS_ERROR,
      payload: error?.response?.data?.error,
    });
  }
};

export const getUserById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`/user/${id}`);
    dispatch({ type: GET_USER_ID, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({
      type: GET_USER_ID_ERROR,
      payload: error?.response?.data?.error,
    });
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    const response = await axios.put(`/user/${id}`, userData);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_ERROR,
      payload: error?.response?.data?.error,
    });
  }
};

export const getAllUsers = () => async (dispatch) => {
  try {
    const response = await axios.get(`/user`);
    dispatch({ type: GET_USER, payload: response.data });
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
};

export const getOrders = () => async (dispatch) => {
  try {
    const response = await axios.get(`/purchaseOrder`);
    dispatch({ type: ORDERS, payload: response.data });
  } catch (error) {
    console.error("Error cargando órdenes:", error);
  }
};

export const deleteOrder = (orderId) => async (dispatch) => {
  try {
    await axios.delete(`/purchaseOrder/${orderId}`);
    dispatch({ type: DELETE_ORDER, payload: orderId });
    dispatch(getOrders());
  } catch (error) {
    console.error("Error eliminando orden:", error);
  }
};
