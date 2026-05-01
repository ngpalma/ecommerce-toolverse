import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from "./Card.module.css";
import { useDispatch } from 'react-redux';
import * as actions from '../../../redux/actions';

const Card = ({ id, image, name, model, brand, feature, price, stock }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(actions.addToCart({ id, image, name, model, brand, feature, price, stock }));
  };

  return (
    <div className={style.upperDiv} onClick={() => navigate(`/detail/${id}`)}>
      <div className={style.imageWrapper}>
        <img src={image} alt={name} className={style.image} />
      </div>
      <div className={style.info}>
        <div className={style.name}>{name}</div>
        <div className={style.brand}>{brand}</div>
        <div className={style.model}>{model}</div>
        <div className={style.price}>${price.toLocaleString('es-AR')}</div>
      </div>
      <div className={style.button}>
        <input
          type="submit"
          value="Añadir al carrito"
          onClick={handleAdd}
        />
      </div>
    </div>
  );
};

export default Card;
