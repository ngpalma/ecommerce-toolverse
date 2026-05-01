import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MyShopping.module.css";
import { useDispatch } from "react-redux";
import * as actions from "../../../../redux/actions";

const MyShopping = () => {
  const dispatch = useDispatch();
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-AR", options);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: orders } = await axios.get("/purchaseOrder");

        const historyWithProducts = await Promise.all(
          orders.map(async (order) => {
            const productos = await dispatch(
              actions.getProductsInCart(order.purchaseCartId)
            );
            const prodFinal = (productos || []).map((prod) => ({
              name: prod.product?.name || "Producto",
              quantity: prod.quantity,
              price: prod.product?.price,
            }));
            return {
              orderId: order.id,
              productos: prodFinal,
              total: order.total,
              fecha: formatDate(order.createdAt),
            };
          })
        );

        setPurchaseHistory(historyWithProducts);
      } catch (error) {
        console.error("Error al obtener el historial de compras:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [dispatch]); // ← solo dispatch, que es estable

  if (loading) return <p>Cargando historial...</p>;

  return (
    <div>
      <div className={styles.title}>
        <h1>Historial de Compras</h1>
      </div>
      <div className={styles.purchaseContainer}>
        {purchaseHistory.length > 0 ? (
          purchaseHistory.map((purchase) => (
            <div className={styles.purchaseItem} key={purchase.orderId}>
              <p><b>Compra ID: </b>{purchase.orderId}</p>
              <p><b>Fecha: </b>{purchase.fecha}</p>
              <p><b>Producto(s):</b></p>
              {purchase.productos.map((prod, i) => (
                <div key={i}>
                  <p><b>Producto: </b>{prod.name}</p>
                  <p><b>Cantidad: </b>{prod.quantity}</p>
                  {prod.price && <p><b>Precio: </b>${prod.price}</p>}
                </div>
              ))}
              <p><b>Total: </b>${purchase.total}</p>
            </div>
          ))
        ) : (
          <p>No hay compras registradas</p>
        )}
      </div>
    </div>
  );
};

export default MyShopping;
