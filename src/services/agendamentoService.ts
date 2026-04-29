import { api } from "./api";

export const listarAgendamentos = async () => {
  const response = await api.get("/agendamentos");
  return response.data;
};