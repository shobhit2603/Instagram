import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = () => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthChecked) return null;


  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const GuestRoute = () => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);

  if (!isAuthChecked) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};