import axios from "axios";

export const axiosInstance = axios.create({ baseURL: 'http://localhost:8080/' }); //192.168.100.88xs