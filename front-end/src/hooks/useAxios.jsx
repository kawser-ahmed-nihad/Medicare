import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://medicare-s8om.onrender.com`,
    withCredentials: true,
})

const useAxios = () => {
    return axiosInstance;

};

export default useAxios;