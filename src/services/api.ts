import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_URL ??
  `${window.location.protocol}//${window.location.hostname}:8080`;

export const api = axios.create({
  baseURL: apiBaseUrl,
});
