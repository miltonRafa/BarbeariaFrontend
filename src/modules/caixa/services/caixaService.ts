import { api } from "../../../shared/services/api";

export type CaixaMovimentacaoRequest = {
  tipo: "ENTRADA" | "SAIDA" | "SUPRIMENTO" | "SANGRIA";
  formaPagamento?: "DINHEIRO" | "PIX" | "CARTAO_DEBITO" | "CARTAO_CREDITO" | "OUTRO";
  valor: number;
  descricao: string;
  data?: string;
  agendamentoId?: number;
  operadorUsuarioId?: number;
};

export type FecharAtendimentoRequest = {
  agendamentoId?: number;
  formaPagamento?: "DINHEIRO" | "PIX" | "CARTAO_DEBITO" | "CARTAO_CREDITO" | "OUTRO";
  desconto?: number;
  valorManual?: number;
  observacao?: string;
  data?: string;
  operadorUsuarioId?: number;
  produtos?: Array<{ produtoId: number; quantidade: number }>;
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

export const abrirCaixa = async (data: string, saldoInicial: number, operadorUsuarioId?: number) => {
  const response = await api.post("/caixa/abrir", { data, saldoInicial, operadorUsuarioId });
  return response.data;
};

export const fecharCaixa = async (data: string, operadorUsuarioId?: number) => {
  const response = await api.post("/caixa/fechar", null, { params: { data, operadorUsuarioId } });
  return response.data;
};

export const listarAtendimentosCaixa = async () => {
  const response = await api.get("/caixa/atendimentos");
  return response.data;
};

export const fecharAtendimentoCaixa = async (dados: FecharAtendimentoRequest) => {
  const response = await api.post("/caixa/fechar-atendimento", dados);
  return response.data;
};
