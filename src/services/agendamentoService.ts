import { api } from "./api";

export const listarAgendamentos = async (funcionarioId?: number) => {
  const response = await api.get("/agendamentos", {
    params: funcionarioId
      ? { funcionarioId }
      : {}
  });

  return response.data;
};

export const criarAgendamento = async (dados: {
  clienteId: number;
  funcionarioId: number;
  servicoId: number;
  horarioDisponivelId: number;
}) => {
  const response = await api.post("/agendamentos", dados);
  return response.data;
};