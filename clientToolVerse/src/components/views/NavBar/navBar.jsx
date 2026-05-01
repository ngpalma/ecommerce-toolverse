import React, { useState } from "react";
import style from './navBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserLogin from "../UserLogin/userLogin";
import logoHome from './LogoPng.png';
import logoCart from './logoCart.png';
import SearchBar from '../SearchBar/searchBar';

export default function Nav() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const login = useSelector((state) => state.login);
    const [menuOpen, setMenuOpen] = useState(false);

    const isAdmin = login?.role === "admin";

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <nav className={style.navBar}>
                <button className={style.logoBtn} onClick={() => { navigate('/home'); closeMenu(); }}>
                    <img src={logoHome} alt="Toolverse" className={style.logo} />
                </button>

                <div className={style.searchBar}>
                    <SearchBar />
                </div>

                {/* Acciones desktop */}
                <div className={style.actions}>
                    {!isAuthenticated && (
                        <button className={style.registerBtn} onClick={() => navigate('/form')}>
                            Registro
                        </button>
                    )}
                    {(!isAuthenticated || !isAdmin) && (
                        <button className={style.cartBtn} onClick={() => navigate('/cart')}>
                            <img src={logoCart} alt="Carrito" className={style.cartBtnImg} />
                        </button>
                    )}
                    <UserLogin />
                </div>

                {/* Hamburger mobile */}
                <button
                    className={style.hamburger}
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Menú"
                >
                    <span />
                    <span />
                    <span />
                </button>
            </nav>

            {/* Menú móvil desplegable */}
            <div className={`${style.mobileMenu} ${menuOpen ? style.open : ''}`}>
                {!isAuthenticated && (
                    <button className={style.registerBtn} onClick={() => { navigate('/form'); closeMenu(); }}>
                        Registro
                    </button>
                )}
                {(!isAuthenticated || !isAdmin) && (
                    <button className={style.cartBtn} onClick={() => { navigate('/cart'); closeMenu(); }}>
                        <img src={logoCart} alt="Carrito" className={style.cartBtnImg} />
                        <span style={{ marginLeft: '0.8rem', fontWeight: 600, fontSize: '1.4rem' }}>Carrito</span>
                    </button>
                )}
                <UserLogin />
            </div>
        </>
    );
}
