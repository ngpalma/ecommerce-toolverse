import React, { useEffect, useState } from "react";
import styles from "./login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/actions";
import { useNavigate } from "react-router-dom";

function Login() {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const errorLogin = useSelector((state) => state.errorLogin);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const loginData = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(inputs));
    setSubmitted(true);
  };

  useEffect(() => {
    if (isAuthenticated && submitted) {
      if (loginData?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/userprofile");
      }
    }
  }, [isAuthenticated, submitted, loginData?.role, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Bienvenido</div>
      <div className={styles.subtitle}>Ingresá a tu cuenta</div>
      <div className={styles.content}>
        <form onSubmit={handleSubmit}>
          <div className={styles["user-details"]}>
            <div className={styles["input-box"]}>
              <span className={styles.details}>Email</span>
              <input
                type="email"
                placeholder="tu@email.com"
                name="email"
                value={inputs.email}
                onChange={handleInput}
                autoComplete="email"
              />
            </div>
            <div className={styles["input-box"]}>
              <span className={styles.details}>Contraseña</span>
              <input
                type="password"
                placeholder="Tu contraseña"
                name="password"
                value={inputs.password}
                onChange={handleInput}
                autoComplete="current-password"
              />
            </div>
          </div>
          <div className={styles.button}>
            <input type="submit" value="Iniciar Sesión" />
          </div>
        </form>

        {errorLogin && <div className={styles.error}>{errorLogin}</div>}
      </div>
    </div>
  );
}

export default Login;
