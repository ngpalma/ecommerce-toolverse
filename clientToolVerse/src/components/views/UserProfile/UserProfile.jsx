import React, { useEffect, useState } from "react";
import style from "./UserProfile.module.css";
import { useDispatch, useSelector } from "react-redux";
import MyAddress from "./MyAddress/MyAddress";
import MyProfile from "./MyProfile/MyProfile";
import MyReviews from "./MyReviews/MyReviews";
import MyShopping from "./MyShopping/MyShopping";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../../redux/actions";

const UserProfile = () => {
  const { id } = useSelector((state) => state.login);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const user = useSelector((state) => state.user);
  const [active, setActive] = useState("MiPerfil");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (id) {
      dispatch(getUserById(id)).catch(() => {});
    }
  }, [dispatch, id, isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  if (!user?.id) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={style.userProfileContainer}>
      <div className={style.secondaryContainer}>
        <div className={style.nameContainer}>
          <h1>Hola {user.firstName} {user.lastName}</h1>
        </div>
        <div className={style.menuContainer}>
          <button
            className={`${style.customButton} ${active === "MiPerfil" ? style.activeButton : ""}`}
            onClick={() => setActive("MiPerfil")}
          >
            Mi Perfil
          </button>
          <button
            className={`${style.customButton} ${active === "MisDatos" ? style.activeButton : ""}`}
            onClick={() => setActive("MisDatos")}
          >
            Mis Direcciones
          </button>
          <button
            className={`${style.customButton} ${active === "MisCompras" ? style.activeButton : ""}`}
            onClick={() => setActive("MisCompras")}
          >
            Mis Compras
          </button>
          <button
            className={`${style.customButton} ${active === "MisReviews" ? style.activeButton : ""}`}
            onClick={() => setActive("MisReviews")}
          >
            Mis Reviews
          </button>
        </div>
      </div>
      <div className={style.componentContainer}>
        {active === "MiPerfil" && <MyProfile user={user} />}
        {active === "MisDatos" && <MyAddress user={user} />}
        {active === "MisCompras" && <MyShopping />}
        {active === "MisReviews" && <MyReviews user={user} />}
      </div>
    </div>
  );
};

export default UserProfile;
