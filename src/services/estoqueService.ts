import { api } from "./api";

export const listarEstoque = async () => {
  const response = await api.get("/estoque");
  return response.data;
};