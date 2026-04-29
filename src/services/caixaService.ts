import { api } from "./api";

export const getCaixa = async () => {
  const response = await api.get("/caixa");
  return response.data;
};