import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import style from "./Detail.module.css";
import { addToCart, getToolById } from "../../../redux/actions";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import ReviewPage from "../../Review/ReviewPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as actions from "../../../redux/actions";

const Detail = () => {
  const products = useSelector((state) => state.toolsDetail);
  const user = useSelector((state) => state.user);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const reviews = user?.reviews;
  const dispatch = useDispatch();
  const { id } = useParams();
  const [prodInCart, setProdInCart] = useState(false);

  useEffect(() => {
    dispatch(getToolById(id));
  }, [dispatch, id]);

  // Solo verificar si compró el producto cuando hay un usuario autenticado con id
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const userDidBuyProd = async () => {
      try {
        const usuario = await dispatch(actions.getUserById(user.id));
        const userCarts = usuario?.purchaseCarts || [];

        const productosPorIdArray = [];
        for (const cart of userCarts) {
          const productos = await dispatch(actions.getProductsInCart(cart.id));
          (productos || []).forEach((prod) => {
            productosPorIdArray.push(prod.productId);
          });
        }

        if (productosPorIdArray.includes(Number(id))) {
          setProdInCart(true);
        }
      } catch (error) {
        console.error("Error verificando si el usuario compró el producto:", error);
      }
    };

    userDidBuyProd();
  }, [isAuthenticated, user?.id, id, dispatch]);

  const findReview = reviews?.find((review) => review.productId === parseInt(id)) ?? null;

  if (!products) return <div>Esperando carga del producto...</div>;

  return (
    <div className={style.datailReview}>
      <div className={style.detailContainer}>
        <div className={style.imageContainer}>
          <img src={products.image} alt={products.name} />
        </div>
        <div className={style.infoContainer}>
          <h1>{products.name}</h1>
          <br />
          <h3>Marca: {products.brand}</h3>
          <p><b>Modelo:</b> {products.model}</p>
          <div>
            <span className={style.block}><b>Características: </b></span>
            {products.feature}
          </div>
          <h4>Precio ${products.price}</h4>
          <br />
          <button
            className={style.addToCart}
            onClick={() => dispatch(addToCart(products))}
          >
            <b>Añadir al carrito</b>
          </button>
        </div>
      </div>

      <div className={style.reviewComp}>
        {findReview ? (
          <div>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={star <= findReview.score ? solidStar : regularStar}
                />
              ))}
            </div>
            <textarea value={findReview.comments} readOnly />
          </div>
        ) : (
          prodInCart && <ReviewPage productId={id} />
        )}
      </div>
    </div>
  );
};

export default Detail;
