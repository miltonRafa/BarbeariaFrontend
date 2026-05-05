import { api } from "../../../shared/services/api";

export type ServicoRequest = {
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
  ativo: boolean;
};

export async function listarServicos() {
  const response = await api.get("/servicos");
  return response.data;
}

export async function criarServico(data: ServicoRequest) {
  const response = await api.post("/servicos", data);
  return response.data;
}

export async function atualizarServico(id: number, data: ServicoRequest) {
  const response = await api.put(`/servicos/${id}`, data);
  return response.data;
}

export async function desativarServico(id: number) {
  const response = await api.put(`/servicos/${id}/desativar`);
  return response.data;
}

export async function ativarServico(id: number) {
  const response = await api.put(`/servicos/${id}/ativar`);
  return response.data;
}
