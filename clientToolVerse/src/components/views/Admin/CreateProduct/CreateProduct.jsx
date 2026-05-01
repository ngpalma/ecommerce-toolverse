import React, { useEffect, useState } from "react";
import styles from "./CreateProduct.module.css";
import { useDispatch } from "react-redux";
import { getTools } from "../../../../redux/actions";
import axios from "axios";
import Swal from "sweetalert2";
import CloudinaryUploadWidget from "../../CloudinaryUploadWidget/CloudinaryUploadWidget";

const INITIAL_STATE = {
  brand: "",
  name: "",
  model: "",
  feature: "",
  detail: "",
  price: "",
  image: "",
  category: [],
  stock: "",
};

const BRANDS = [
  "Makita", "Einhell", "Dewalt", "Truper", "Stanley",
  "Irwin", "Bosch", "Black & Decker", "Senco", "Ingersoll Rand",
  "Bahco", "Milwaukee", "Schulz",
];

// Categorías fijas — coinciden con el ARRAY(STRING) del modelo Product
const CATEGORIES = ["Eléctricos", "Manuales", "Inalámbricos", "Neumáticos", "Hogar", "Jardín"];

const CreateProduct = () => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getTools());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "image") {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectCategory = (e) => {
    const selected = Array.from(e.target.options)
      .filter((o) => o.selected)
      .map((o) => o.value); // strings, no integers
    setProduct((prev) => ({ ...prev, category: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name.trim() || !product.brand || !product.price || !product.stock) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completá nombre, marca, precio y stock.",
      });
      return;
    }

    const imageUrl = typeof product.image === "object" ? product.image.url : product.image;
    const payload = { ...product, image: imageUrl };

    try {
      setSubmitting(true);
      await axios.post("/products", payload);
      Swal.fire({
        icon: "success",
        title: "¡Producto creado!",
        text: `"${product.name}" fue agregado al catálogo.`,
        confirmButtonColor: "#f4c434",
      });
      setProduct(INITIAL_STATE);
    } catch (error) {
      const msg =
        error?.response?.status === 400
          ? "Datos inválidos. Revisá los campos e intentá de nuevo."
          : "Ocurrió un error al crear el producto.";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const previewUrl =
    typeof product.image === "object" ? product.image?.url : product.image;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Crear Producto</h2>

      <form onSubmit={handleSubmit} className={styles.form}>

        {/* Nombre + Marca */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Nombre</label>
          <input
            className={styles.input}
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Ej: Taladro percutor 750W"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="brand">Marca</label>
          <select
            className={styles.input}
            id="brand"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            required
          >
            <option value="">Seleccioná una marca</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Modelo + Precio */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="model">Modelo</label>
          <input
            className={styles.input}
            type="text"
            id="model"
            name="model"
            value={product.model}
            onChange={handleChange}
            placeholder="Ej: HP1631K"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="price">Precio ($)</label>
          <input
            className={styles.input}
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Ej: 12500"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Stock + Categoría */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="stock">Stock inicial</label>
          <input
            className={styles.input}
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            placeholder="Ej: 20"
            min="0"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">
            Categoría(s)
            <span className={styles.hint}> — Ctrl+clic para seleccionar varias</span>
          </label>
          <select
            className={`${styles.input} ${styles.multiSelect}`}
            id="category"
            name="category"
            multiple
            value={product.category}
            onChange={handleSelectCategory}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {product.category.length > 0 && (
            <span className={styles.categoryPreview}>
              ✓ {product.category.join(", ")}
            </span>
          )}
        </div>

        {/* Características (full-width) */}
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="feature">Características</label>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            id="feature"
            name="feature"
            value={product.feature}
            onChange={handleChange}
            placeholder="Características principales del producto…"
            rows={3}
          />
        </div>

        {/* Detalle (full-width) */}
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="detail">Detalle adicional</label>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            id="detail"
            name="detail"
            value={product.detail}
            onChange={handleChange}
            placeholder="Descripción detallada, usos, especificaciones técnicas…"
            rows={3}
          />
        </div>

        {/* Imagen (full-width) */}
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label}>Imagen del producto</label>
          <div className={styles.imageSection}>
            <div className={styles.imageActions}>
              <CloudinaryUploadWidget imageUrl={setProduct} inputs={product} />
              <span className={styles.orText}>o pegá una URL:</span>
              <input
                className={styles.input}
                type="url"
                name="image"
                value={typeof product.image === "string" ? product.image : product.image?.url || ""}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            {previewUrl && (
              <div className={styles.imagePreview}>
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className={`${styles.field} ${styles.fieldFull} ${styles.submitRow}`}>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? "Creando…" : "Crear Producto"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateProduct;
