import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Protege rutas exclusivas de administrador.
 * - Si no está autenticado → redirige a /login
 * - Si está autenticado pero no es admin → redirige a /home
 */
export default function AdminRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const login = useSelector((state) => state.login);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (login?.role !== "admin") return <Navigate to="/home" replace />;

  return children;
}
