import { api } from "./api";

export const getConfiguracoes = async () => {
  const response = await api.get("/configuracoes");
  return response.data;
};