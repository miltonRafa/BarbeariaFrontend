import { api } from "../../../shared/services/api";

export type ProdutoRequest = {
  nome: string;
  descricao?: string;
  precoVenda: number;
  precoCusto: number;
  quantidade: number;
  quantidadeMinima: number;
  ativo?: boolean;
};

export const listarEstoque = async (busca?: string) => {
  const response = await api.get("/estoque", {
    params: busca ? { busca } : {},
  });
  return response.data;
};

export const criarProduto = async (data: ProdutoRequest) => {
  const response = await api.post("/estoque", data);
  return response.data;
};

export const atualizarProduto = async (id: number, data: ProdutoRequest) => {
  const response = await api.put(`/estoque/${id}`, data);
  return response.data;
};

export const excluirProduto = async (id: number) => {
  await api.delete(`/estoque/${id}`);
};
