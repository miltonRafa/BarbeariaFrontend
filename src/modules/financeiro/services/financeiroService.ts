import { api } from "../../../shared/services/api";

export type ContaFinanceiraRequest = {
  tipo: "PAGAR" | "RECEBER";
  status?: "PENDENTE" | "CONCLUIDO";
  descricao: string;
  valor: number;
  vencimento: string;
  pagamento?: string;
};

export const getFinanceiro = async (inicio?: string, fim?: string) => {
  const response = await api.get("/financeiro", {
    params: { inicio, fim },
  });
  return response.data;
};

export const criarContaFinanceira = async (data: ContaFinanceiraRequest) => {
  const response = await api.post("/financeiro/contas", data);
  return response.data;
};

export const atualizarContaFinanceira = async (id: number, data: ContaFinanceiraRequest) => {
  const response = await api.put(`/financeiro/contas/${id}`, data);
  return response.data;
};

export const excluirContaFinanceira = async (id: number) => {
  await api.delete(`/financeiro/contas/${id}`);
};

export const gerarRelatorioFinanceiro = async (inicio?: string, fim?: string) => {
  const response = await api.post("/financeiro/relatorio", null, {
    params: { inicio, fim },
  });
  return response.data;
};
