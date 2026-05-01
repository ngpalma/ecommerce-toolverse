import style from './purchaseCartDisplay.module.css';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import mercadoPago from '../img/MercadoPago.jpeg';
import React, { useState } from 'react';
import loadingGear from "../img/Spin-1s-200px.gif";

export default function PurchaseCartDisplay() {
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const actualUser = useSelector((state) => state.actualUser);
    const selectedAddress = useSelector((state) => state.addressSelected);
    const trolley = useSelector((state) => state.itemCart);

    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }

    const calculateTotal = () => {
        const suma = trolley.reduce((acc, p) => acc + p.price * p.quantity, 0);
        return parseFloat(suma.toFixed(2));
    };

    const total = calculateTotal();

    const handleMP = async () => {
        try {
            setPaying(true);
            setError(null);
            const res = await axios.post('/payment', trolley);
            window.location.href = res.data.response.init_point;
        } catch (err) {
            console.error("Error al iniciar pago:", err);
            const msg = err?.response?.data?.detail || err?.response?.data?.message || "Error al conectar con Mercado Pago";
            setError(msg);
            setPaying(false);
        }
    };

    return (
        <div>
            {!actualUser || !selectedAddress
                ? <div><img src={loadingGear} alt='Cargando...' /></div>
                : <div className={style.overallCompra}>
                    {trolley.length === 0
                        ? <h1>Aún no has hecho ninguna compra</h1>
                        : <div>
                            <h1 className={style.titulo}>Confirmando Compra:</h1>
                            <div className={style.detallesTotal}>
                                <div className={style.userDetails}>
                                    <h4>Envío a:</h4>
                                    <div>Nombre: {actualUser.firstName}</div>
                                    <div>Apellido: {actualUser.lastName}</div>
                                    <div>Email: {actualUser.email}</div>
                                    <div>Teléfono: {actualUser.phone}</div>
                                    <h4>Dirección postal:</h4>
                                    <div>País: {selectedAddress.country}</div>
                                    <div>Estado: {selectedAddress.state}</div>
                                    <div>Ciudad: {selectedAddress.city}</div>
                                    <div>Calle: {selectedAddress.address}</div>
                                    <div>CP: {selectedAddress.postalCode}</div>
                                </div>

                                <div>
                                    <h2>Producto(s):</h2>
                                    {trolley.map((product) => (
                                        <div key={product.id} className={style.prodDetails}>
                                            <div className={style.nameMiniProd}>{product.name}</div>
                                            <div className={style.priceMiniProd}>${product.price}</div>
                                            <div>Cantidad: {product.quantity}</div>
                                        </div>
                                    ))}
                                    <h2 className={style.total}>Total: ${total}</h2>
                                </div>
                            </div>

                            {error && (
                                <div className={style.errorMsg}>
                                    ⚠️ {error}
                                </div>
                            )}

                            <div className={style.toPay}>
                                <button
                                    onClick={handleMP}
                                    className={style.buttonPay}
                                    disabled={paying}
                                >
                                    {paying
                                        ? <img src={loadingGear} alt="Procesando..." style={{ height: 40 }} />
                                        : <img src={mercadoPago} alt="Pagar con Mercado Pago" className={style.mercadoPago} />
                                    }
                                </button>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    );
}
