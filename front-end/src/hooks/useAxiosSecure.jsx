import axios from "axios";

import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

const useAxiosSecure = () => {
    const { accessToken, setAccessToken } = useAuth(); 

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            }
        );

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (res) => res,
            async (error) => {
                const original = error.config;

                if (error.response?.status === 401 && !original._retry) {
                    original._retry = true;
                    try {
                        const res = await axios.post(
                            "http://localhost:3000/api/auth/refresh-token",
                            {},
                            { withCredentials: true }
                        );

                        const newToken = res.data.accessToken;
                        setAccessToken(newToken);

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
    }, [accessToken, setAccessToken]);

    return axiosSecure; 
};

export default useAxiosSecure;