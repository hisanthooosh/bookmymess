import axios from "axios";

const API = axios.create({
    baseURL: "https://bookmymess.me/api"
});

export default API;