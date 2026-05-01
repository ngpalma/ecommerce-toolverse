import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./MPFeedback.module.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../redux/actions";
import loadingGear from "../../views/img/Spin-1s-200px.gif";
import generatePdf from "../../GeneratePdf/generatePdf";
import successPay from "../../views/img/successPay.jpeg";

const MPFeedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const shippingAddress = useSelector((state) => state.addressSelected);

  const userId = user.id;
  const shippingAddressId = shippingAddress.id;
  const paymentMethodId = 1;

  const [loading, setLoading] = useState(true);
  const [purchaseCartId, setPurchaseCartId] = useState("");
  const [trolley, setTrolley] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const idPago = queryParams.get("payment_id");
  const formaPago = "Mercado Pago";
  const status = queryParams.get("status");
  const orderId = queryParams.get("merchant_order_id");

  useEffect(() => {
    const getInfo = async () => {
      try {
        const cartId = await dispatch(actions.getLastPurchaseCart(userId));
        const items = await dispatch(actions.getProductsInCart(cartId));
        setPurchaseCartId(cartId);
        setTrolley(items);
        if (shippingAddressId) setLoading(false);
      } catch (error) {
        console.error("Error cargando información del pago:", error);
      }
    };
    getInfo();
  }, [dispatch, userId, shippingAddressId]);

  useEffect(() => {
    if (!loading && trolley?.length > 0 && userId && purchaseCartId && shippingAddressId) {
      const calculateTotal = () => {
        return parseFloat(
          trolley.reduce((sum, p) => sum + p.product.price * p.quantity, 0).toFixed(2)
        );
      };

      dispatch(actions.addPurchaseOrder(userId, purchaseCartId, shippingAddressId, paymentMethodId, calculateTotal()));
      trolley.forEach((product) => {
        const newStock = product.stock - product.quantity;
        dispatch(actions.registerStockExit(product.id, product.quantity));
        dispatch(actions.updateProductStock(product.id, newStock));
      });
      dispatch(actions.deleteTrolley());
    }
  }, [dispatch, loading, purchaseCartId, shippingAddressId, trolley, userId]);

  return (
    <div>
      {loading ? (
        <div><img src={loadingGear} alt="Cargando" /></div>
      ) : (
        <div className={style.successPay}>
          <div><img src={successPay} alt="Pago exitoso" className={style.successPayImg} /></div>
          <div className={style.containerFeedback}>
            <h1>Detalle del pago</h1>
            <ul>
              <li>ID de pago: {idPago}</li>
              <li>Número de orden: {orderId}</li>
              <div className={style.userDetails}>
                <h4>Envío a:</h4>
                <div>Nombre: {user.firstName} {user.lastName}</div>
                <div>Email: {user.email} — Teléfono: {user.phone}</div>
              </div>
              <div className={style.shippingDetails}>
                <h4>Dirección postal:</h4>
                <div>{shippingAddress.address}, {shippingAddress.city}</div>
                <div>{shippingAddress.postalCode}, {shippingAddress.state}, {shippingAddress.country}</div>
              </div>
              <div className={style.productDetails}>
                <h4>Producto(s):</h4>
                {trolley?.map((product, i) => (
                  <div key={i}>
                    <div>Producto: {product.product.name}</div>
                    <div>Cantidad: {product.quantity}</div>
                    <div>Precio: ${product.product.price}</div>
                  </div>
                ))}
              </div>
            </ul>
            <div className={style.buttons}>
              <button
                className={style.backHome}
                onClick={() => generatePdf(user, shippingAddress, trolley, idPago, formaPago, status, orderId)}
              >
                Guardar el Detalle
              </button>
              <button className={style.backHome} onClick={() => navigate("/home")}>
                Volver al Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MPFeedback;
