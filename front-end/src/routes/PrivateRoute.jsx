
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";


export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading…</div>;
    }

    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return children;
}