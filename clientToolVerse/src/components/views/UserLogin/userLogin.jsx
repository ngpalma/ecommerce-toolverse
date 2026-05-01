import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./userLogin.module.css";
import userIcon from "./userLogin.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cerrarSesion } from "../../../redux/actions";

export default function UserLogin() {
  const [isUserMenuVisible, setUserMenuVisibility] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const login = useSelector((state) => state.login);
  const dispatch = useDispatch();

  const isAdmin = login?.role === "admin";

  const handleMenuItemClick = (destination) => {
    setUserMenuVisibility(false);
    navigate(destination);
  };

  const handleLogout = () => {
    dispatch(cerrarSesion());
    navigate("/home");
  };

  return (
    <div
      className={styles.userLogin}
      onMouseEnter={() => setUserMenuVisibility(true)}
      onMouseLeave={() => setUserMenuVisibility(false)}
    >
      <img src={userIcon} alt="User Icon" className={styles.UserIcon} />
      <CSSTransition
        in={isUserMenuVisible}
        timeout={350}
        classNames="UserMenuAnimation"
        unmountOnExit
        nodeRef={userMenuRef}
      >
        <div className={styles.UserMenu} ref={userMenuRef}>
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <button onClick={() => handleMenuItemClick("/admin")}>
                  Panel de Admin
                </button>
              ) : (
                <button onClick={() => handleMenuItemClick("/userProfile")}>
                  Mi Perfil
                </button>
              )}
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </>
          ) : (
            <>
              <button onClick={() => handleMenuItemClick("/login")}>Iniciar Sesión</button>
              <button onClick={() => handleMenuItemClick("/form")}>Registrarse</button>
            </>
          )}
        </div>
      </CSSTransition>
    </div>
  );
}
