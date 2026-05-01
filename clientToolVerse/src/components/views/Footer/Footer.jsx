import React from 'react';
import logo from "./ToolVe.png";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <Link to="/home" className={styles.logoLink}>
                    <img src={logo} alt="Toolverse" className={styles.logo} />
                </Link>
                <p className={styles.tagline}>Herramientas para el hogar y la industria</p>
                <p className={styles.copy}>© {year} Toolverse — Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
