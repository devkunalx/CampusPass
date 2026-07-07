import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuthStore();

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;