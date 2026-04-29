import { api } from "./api";

export const listarServicos = async () => {
  const response = await api.get("/servicos");
  return response.data;
};