import style from './purchaseOrder.module.css';
import { useSelector } from "react-redux";
import mercadoPago from '../img/MercadoPago.jpeg';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../redux/actions";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

export default function PurchaseOrder() {
    const doc = new jsPDF('p', 'pt');
    const dispatch = useDispatch();
    const trolley = useSelector((state) => state.itemCart);
    const actualUser = useSelector((state) => state.actualUser);
    const [total, setTotal] = useState("");
    const [pagos, setPagos] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.isAuthenticated);

    useEffect(() => {
        if (!actualUser.country || !actualUser.state || !actualUser.city || !actualUser.address || !actualUser.postalCode) {
            dispatch(actions.getShippingAddressByUserId(actualUser.id));
        }
    }, [actualUser, dispatch]);

    useEffect(() => {
        try {
            const suma = trolley.reduce((acc, p) => acc + p.price * p.quantity, 0);
            setTotal(parseFloat(suma.toFixed(2)));
        } catch (error) {
            console.error("Error al calcular el total:", error);
        }
    }, [trolley]);

    const handleMP = () => {
        axios.post('/payment', trolley).then((res) => {
            window.location.href = res.data.response.init_point;
        });
        setPagos(false);
    };

    const exitStock = () => {
        trolley.forEach((product) => {
            dispatch(actions.registerStockExit(product.id, product.quantity));
            const newStock = product.stock - product.quantity;
            dispatch(actions.updateProductStock(product.id, newStock));
        });
    };

    const createPdf = () => {
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(20, 40, "TOOLVERSE - Orden de Compra");

        doc.setFont("courier", "normal");
        doc.setFontSize(18);
        doc.text(20, 80, "Envío a:");
        doc.setFontSize(14);
        doc.text(20, 100, `${actualUser.firstName} ${actualUser.lastName}`);
        doc.text(20, 120, `${actualUser.email}  Teléfono: ${actualUser.phone}`);
        doc.text(20, 160, `${actualUser.address} ${actualUser.postalCode}`);
        doc.setFontSize(12);
        doc.text(20, 180, `${actualUser.city}. ${actualUser.state}. ${actualUser.country}`);
        doc.setFont("courier", "bold");
        doc.setFontSize(14);
        doc.text(340, 220, `Total a pagar: $${total}`);

        const data = trolley.map((e) => ({
            id: e.id,
            product: e.name,
            quantity: e.quantity,
            price: e.price,
        }));

        autoTable(doc, {
            margin: { top: 240 },
            body: data,
            columns: [
                { header: 'ID', dataKey: 'id' },
                { header: 'Producto', dataKey: 'product' },
                { header: 'Cantidad', dataKey: 'quantity' },
                { header: 'Precio', dataKey: 'price' },
            ],
        });

        doc.save("ToolVersePurchaseOrder.pdf");
    };

    const confirm = () => {
        exitStock();
        setPagos(true);
    };

    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }

    return (
        <div className={style.overallCompra}>
            {trolley.length === 0
                ? <div>Aún no has hecho ninguna compra</div>
                : <div>
                    <h1 className={style.titulo}>Confirmando Compra:</h1>
                    <div className={style.detallesTotal}>
                        <div className={style.userDetails}>
                            <h4>Envío a:</h4>
                            <div>Nombre: {actualUser.firstName}</div>
                            <div>Apellido: {actualUser.lastName}</div>
                            <div>Email: {actualUser.email}</div>
                            <div>Teléfono: {actualUser.phone}</div>
                            <div>País: {actualUser.country}</div>
                            <div>Estado: {actualUser.state}</div>
                            <div>Ciudad: {actualUser.city}</div>
                            <div>Calle: {actualUser.address}</div>
                            <div>CP: {actualUser.postalCode}</div>
                        </div>
                        <div>
                            {trolley.map((product) => (
                                <div key={product.id} className={style.prodDetails}>
                                    <div className={style.nameImgMini}>
                                        <div className={style.nameMiniProd}>{product.name}</div>
                                        <img src={product.image} alt="producto" className={style.imgProd} />
                                    </div>
                                    <div className={style.brandModelMini}>
                                        <div className={style.brandMiniProd}>{product.brand}</div>
                                        <div className={style.modelMiniProd}>{product.model}</div>
                                    </div>
                                    <div className={style.priceMiniProd}>${product.price}</div>
                                    <div>Cantidad: {product.quantity}</div>
                                </div>
                            ))}
                            <h2 className={style.total}>Total: ${total}</h2>
                        </div>
                    </div>

                    <div className={style.button}>
                        <input type="submit" value="Guardar PDF" onClick={createPdf} />
                    </div>
                    <div className={style.button}>
                        <input type="submit" value="Confirmar Compra" onClick={confirm} />
                    </div>

                    {pagos && (
                        <div className={style.metPago}>
                            <h2 className={style.elige}>Elige tu Método de Pago</h2>
                            <div className={style.toPay}>
                                <button onClick={handleMP} className={style.buttonPay}>
                                    <img src={mercadoPago} alt="Mercado Pago" className={style.mercadoPago} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}
