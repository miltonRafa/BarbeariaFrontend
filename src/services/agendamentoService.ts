import { api } from "./api";

type AgendamentoRequest = {
  clienteId: number;
  funcionarioId: number;
  servicosIds: number[];
  horarioDisponivelId: number;
  horaInicio?: string;
};

export const listarAgendamentos = async (funcionarioId?: number) => {
  const response = await api.get("/agendamentos", {
    params: funcionarioId ? { funcionarioId } : {},
  });

  return response.data;
};

export const criarAgendamento = async (dados: AgendamentoRequest) => {
  const response = await api.post("/agendamentos", dados);
  return response.data;
};

export const listarAgendamentosDoCliente = async (clienteId: number) => {
  const response = await api.get(`/agendamentos/cliente/${clienteId}`);
  return response.data;
};

export const cancelarAgendamento = async (agendamentoId: number) => {
  const response = await api.put(`/agendamentos/${agendamentoId}/cancelar`);
  return response.data;
};

export const concluirAgendamento = async (agendamentoId: number) => {
  const response = await api.put(`/agendamentos/${agendamentoId}/concluir`);
  return response.data;
};

export const pagarAgendamento = async (agendamentoId: number) => {
  const response = await api.put(`/agendamentos/${agendamentoId}/financeiro/pagar`);
  return response.data;
};

export const cancelarFinanceiroAgendamento = async (agendamentoId: number) => {
  const response = await api.put(`/agendamentos/${agendamentoId}/financeiro/cancelar`);
  return response.data;
};
