import { api } from "./api";

export type CaixaMovimentacaoRequest = {
  tipo: "ENTRADA" | "SAIDA";
  formaPagamento?: "DINHEIRO" | "PIX" | "CARTAO_DEBITO" | "CARTAO_CREDITO" | "OUTRO";
  valor: number;
  descricao: string;
  data?: string;
  agendamentoId?: number;
};

export const getCaixa = async (data?: string) => {
  const response = await api.get("/caixa", {
    params: data ? { data } : {},
  });
  return response.data;
};

export const registrarMovimentacaoCaixa = async (
  dados: CaixaMovimentacaoRequest,
) => {
  const response = await api.post("/caixa/movimentacoes", dados);
  return response.data;
};
