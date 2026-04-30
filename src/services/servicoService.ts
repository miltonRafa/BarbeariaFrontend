import { api } from "./api";

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