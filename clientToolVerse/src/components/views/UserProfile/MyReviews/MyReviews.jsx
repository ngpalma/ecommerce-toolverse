import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import style from "./MyReviews.module.css";
import { getUserById } from "../../../../redux/actions";

const MyReviews = ({ user }) => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const products = useSelector((state) => state.allTools);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // reviews puede no estar cargado aún → fallback a array vacío
  const userReviews = user?.reviews || [];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user?.id) {
      dispatch(getUserById(user.id));
    }
  }, [isAuthenticated, navigate, dispatch, user?.id]);

  return (
    <div>
      <div className={style.title}>
        <h1>Mis Reviews</h1>
      </div>
      {userReviews.length === 0 ? (
        <p>Todavía no hiciste ninguna reseña.</p>
      ) : (
        userReviews.map((review) => {
          const product = products.find((p) => p.id === review.productId);
          if (!product) return null;
          return (
            <div className={style.divReview} key={review.id}>
              <div>
                <img src={product.image} alt={product.name} className={style.imgProd} />
                <div className={style.nameProd}>{product.name}</div>
              </div>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={star <= review.score ? solidStar : regularStar}
                  />
                ))}
              </div>
              <textarea value={review.comments} readOnly />
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyReviews;
