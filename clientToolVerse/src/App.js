import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  Detail,
  Form,
  Login,
  Home,
  Landing,
  NavBar,
  Cart,
  ProductCards,
  Error404,
  Footer,
  Dashboard,
  ProductsList,
  UserProfile,
  EditProducts,
  PurchaseCartDisplay,
  User,
  CreateProduct,
  MPFeedback,
  Order,
} from "./components/index";
import AdminRoute from "./components/AdminRoute";

import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated, getShippingAddressByUserId } from "./redux/actions";
import { persistor } from "./redux/store";

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const login = useSelector((state) => state.login);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) {
      dispatch(setIsAuthenticated(true));
    }
    persistor.persist();
    if (isAuthenticated && login?.id) {
      dispatch(getShippingAddressByUserId(login.id))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch, isAuthenticated, login?.id]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontSize: "1.6rem", color: "#777" }}>
        Cargando…
      </div>
    );
  }

  return (
    <div className="App">
      {location.pathname !== "/" && <NavBar />}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/form" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tools" element={<ProductCards />} />
        <Route path="/footer" element={<Footer />} />

        {/* Rutas de cliente autenticado */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/purchaseCartDisplay" element={<PurchaseCartDisplay />} />
        <Route path="/feedback" element={<MPFeedback />} />
        <Route path="/userprofile" element={<UserProfile />} />

        {/* Rutas de administrador — protegidas por AdminRoute */}
        <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/productsList" element={<AdminRoute><ProductsList /></AdminRoute>} />
        <Route path="/admin/editproducts" element={<AdminRoute><EditProducts /></AdminRoute>} />
        <Route path="/admin/user" element={<AdminRoute><User /></AdminRoute>} />
        <Route path="/admin/order" element={<AdminRoute><Order /></AdminRoute>} />
        <Route path="/createProduct" element={<AdminRoute><CreateProduct /></AdminRoute>} />

        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
}

export default App;
