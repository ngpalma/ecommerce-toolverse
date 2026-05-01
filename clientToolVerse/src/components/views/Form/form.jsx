import React, { useState } from "react";
import styles from "../Form/form.module.css";
import { useDispatch } from "react-redux";
import { createUser } from "../../../redux/actions";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { validateForm } from "./validation";

function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
    role: "client",
  });

  const [error, setError] = useState({});

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm(formData);
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      dispatch(createUser(formData))
        .then(() => {
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            password: "",
            confirmPassword: "",
            role: "client",
          });
          setError({});
          Swal.fire({
            title: "Registro exitoso",
            text: "¡Tu registro ha sido exitoso!",
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
            navigate("/login");
          });
        })
        .catch(() => {
          setError({ general: "Error en el registro. Inténtalo nuevamente." });
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Registro</div>
      <div className={styles.content}>
        <form onSubmit={handleSubmit}>
          <div className={styles["user-details"]}>

            <div className={styles["input-box"]}>
              <span className={styles.details}>Nombre</span>
              <input
                type="text"
                name="firstName"
                placeholder="Ingresa tu nombre"
                value={formData.firstName}
                onChange={handleChange}
              />
              {error.firstName && <div className={styles.error}>{error.firstName}</div>}
            </div>

            <div className={styles["input-box"]}>
              <span className={styles.details}>Apellido</span>
              <input
                type="text"
                name="lastName"
                placeholder="Ingresa tu apellido"
                value={formData.lastName}
                onChange={handleChange}
              />
              {error.lastName && <div className={styles.error}>{error.lastName}</div>}
            </div>

            <div className={styles["input-box"]}>
              <span className={styles.details}>Email</span>
              <input
                type="email"
                name="email"
                placeholder="Ingresa tu email"
                value={formData.email}
                onChange={handleChange}
              />
              {error.email && <div className={styles.error}>{error.email}</div>}
            </div>

            <div className={styles["input-box"]}>
              <span className={styles.details}>Teléfono</span>
              <input
                type="text"
                name="phone"
                placeholder="Ingresa tu número de teléfono"
                value={formData.phone}
                onChange={handleChange}
              />
              {error.phone && <div className={styles.error}>{error.phone}</div>}
            </div>

            <div className={styles["input-box"]}>
              <span className={styles.details}>Dirección</span>
              <input
                type="text"
                name="address"
                placeholder="Calle y número"
                value={formData.address}
                onChange={handleChange}
              />
              {error.address && <div className={styles.error}>{error.address}</div>}
            </div>

            <div className={styles["input-box"]}>
              <span className={styles.details}>Ciudad</span>
              <input
                type="text"
                name="city"
                placeholder="Ciudad donde vivís"
                value={formData.city}
                onChange={handleChange}
              />
              {error.city && <div className={styles.error}>{error.city}</div>}
            </div>

            <div className={styles["input-box"]}>
              <span className={styles.details}>Contraseña</span>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
              />
              {error.password && <div className={styles.error}>{error.password}</div>}
            </div>

            <div className={styles["input-box"]}>
              <span className={styles.details}>Confirmar Contraseña</span>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirma tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {error.confirmPassword && <div className={styles.error}>{error.confirmPassword}</div>}
            </div>

          </div>

          {error.general && <div className={styles.error}>{error.general}</div>}

          <div className={styles.button}>
            <input type="submit" value="Registrate" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;
