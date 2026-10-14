import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://medicare-theta-seven.vercel.app`,
    withCredentials: true,
})

const useAxios = () => {
    return axiosInstance;

};

export default useAxios;