import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import router from '../Router/router.jsx'; // Adjust the path to router.jsx as needed.

const axiosPublic = axios.create({
    baseURL: "https://medicare-s8om.onrender.com",
    withCredentials: true,
});

const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshPromiseRef = useRef(null);

    const refreshAccessToken = useCallback(() => {
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        refreshPromiseRef.current = axiosPublic
            .post("/api/auth/refresh", {}, { withCredentials: true })
            .then((res) => {
                setAccessToken(res.data.accessToken);
                setUser(res.data.user);
                return res.data.accessToken;
            })
            .catch((err) => {
                setAccessToken(null);
                setUser(null);
                throw err;
            })
            .finally(() => {
                refreshPromiseRef.current = null;
            });

        return refreshPromiseRef.current;
    }, []);

    useEffect(() => {
        refreshAccessToken()
            .then(() => {
                const redirectTo = localStorage.getItem("postLoginRedirect");
                if (redirectTo) {
                    localStorage.removeItem("postLoginRedirect");
                    router.navigate(redirectTo, { replace: true }); // Use this instead of useNavigate().
                }
            })
            .catch(() => {
                localStorage.removeItem("postLoginRedirect");
            })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = (token, userData) => {
        setAccessToken(token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axiosPublic.post("/api/auth/logout");
        } catch (err) {
            // console.log("Logout error:", err.response?.data);
        } finally {  
            setAccessToken(null);
            setUser(null);
        }
    };

    const userInfo = { accessToken, user, login, logout, loading, refreshAccessToken };

    return (
        <AuthContext.Provider value={userInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;