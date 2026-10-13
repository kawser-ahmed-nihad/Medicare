import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: "https://medicare-s8om.onrender.com",
    withCredentials: true,
});

const useAxiosSecure = () => {
    const { accessToken, refreshAccessToken } = useAuth(); // setAccessToken is no longer needed here.

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use((config) => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        });

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (res) => res,
            async (error) => {
                const original = error.config;

                if (error.response?.status === 401 && !original._retry) {
                    original._retry = true;
                    try {
                        // Use AuthProvider's shared, deduplicated refresh function instead of refreshing separately here.
                        const newToken = await refreshAccessToken();
                        original.headers.Authorization = `Bearer ${newToken}`;
                        return axiosSecure(original);
                    } catch {
                        window.location.href = "/auth/login";
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken, refreshAccessToken]);

    return axiosSecure;
};

export default useAxiosSecure;