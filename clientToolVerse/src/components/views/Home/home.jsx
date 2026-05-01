import style from './home.module.css';
import React from 'react';
import ProductCards from '../ProductCards/ProductCards';
import Ordering from '../../Ordering/Ordering';
import Filters from '../../Filters/Filters';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useDispatch } from "react-redux";
import { getTools, setCurrentPage } from "../../../redux/actions";
import Footer from '../Footer/Footer';

function Home() {
    const dispatch = useDispatch();

    return (
        <div className={style.homeDiv}>
            <div className={style.carouselWrapper}>
                <Carousel showThumbs={false} autoPlay={true} interval={3000} infiniteLoop>
                    <img src="https://www.bosch-professional.com/co/es/conocimiento-e-innovacion/tu-y-bosch-somos-compadres/assets/images/banner-tu-y-bosch-somos-compadres.jpg" alt="Banner Bosch" />
                    <img src="https://www.devcoshop.com/cdn/shop/collections/Makita_BANNER_LUNGO.jpg" alt="Banner Makita" />
                    <img src="https://soelco.co/wp-content/uploads/Banners-SS-Dewalt-2000x550-1.webp" alt="Banner Dewalt" />
                </Carousel>
            </div>

            <div className={style.filtOrd}>
                <Filters />
                <Ordering />
                <div className={style.button}>
                    <input
                        type="submit"
                        value="✕ Quitar filtros"
                        onClick={() => {
                            dispatch(getTools());
                            dispatch(setCurrentPage(1));
                        }}
                    />
                </div>
            </div>

            <ProductCards />

            <Footer />
        </div>
    );
}

export default Home;
