import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const axiosPublic = axios.create({
        baseURL: "http://localhost:3000",
        withCredentials: true,
    });

    // Page refresh হলে Cookie দিয়ে নতুন token নাও
    useEffect(() => {
        const refresh = async () => {
            try {
                const res = await axiosPublic.post(
                    "/api/auth/refresh-token",
                    {},
                    { withCredentials: true }
                );
                // console.log("Refresh response:", res.data);
                setAccessToken(res.data.accessToken);
                setUser(res.data.user);
            } catch (err) {
                // console.log("Refresh error:", err.response?.data); // ← error দেখো
                setAccessToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        refresh();
    }, []);

    const login = (token, userData) => {
        setAccessToken(token);
        setUser(userData);
    };



    const logout = async () => {
        try {
            await axiosPublic.post("/api/auth/logout");
            setAccessToken(null);
            setUser(null);
        } catch (err) {
            console.log("Logout error:", err.response?.data); // ← add করো
        }
    };

    const userInfo = {
        accessToken,
        user,
        login,
        logout,
        loading
    }

    return (
        <AuthContext.Provider value={userInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;