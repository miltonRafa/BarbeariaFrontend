import { api } from "../../../shared/services/api";

export const listarClientes = async () => {
  const response = await api.get("/clientes");
  return response.data;
};

export type ClienteRequest = {
  nome: string;
  email: string;
  senha?: string;
  telefone: string;
  ativo?: boolean;
};

export const criarCliente = async (data: ClienteRequest) => {
  const response = await api.post("/clientes", data);
  return response.data;
};

export const atualizarCliente = async (id: number, data: ClienteRequest) => {
  const response = await api.put(`/clientes/${id}`, data);
  return response.data;
};

export const desativarCliente = async (id: number) => {
  const response = await api.put(`/clientes/${id}/desativar`);
  return response.data;
};

export const ativarCliente = async (id: number) => {
  const response = await api.put(`/clientes/${id}/ativar`);
  return response.data;
};
