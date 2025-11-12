import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function PrivateRoute({ children }) {
    const { user, loadingAuth } = useAuth();
    const location = useLocation();

    if (loadingAuth) return <Spinner fullScreen />;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

    return children;
}
