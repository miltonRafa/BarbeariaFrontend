import { api } from "./api";

type AgendamentoRequest = {
  clienteId: number;
  funcionarioId: number;
  servicosIds: number[];
  horarioDisponivelId: number;
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