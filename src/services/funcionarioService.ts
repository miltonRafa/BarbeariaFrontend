import { api } from "./api";

export const listarFuncionarios = async () => {
  const response = await api.get("/funcionarios");
  return response.data;
};