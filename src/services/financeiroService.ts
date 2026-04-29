import { api } from "./api";

export const getFinanceiro = async () => {
  const response = await api.get("/financeiro");
  return response.data;
};