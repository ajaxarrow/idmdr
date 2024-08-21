import axios from "axios";

const server = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL_DJANGO
});

export {server};