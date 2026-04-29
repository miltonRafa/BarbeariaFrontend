import { api } from "./api";

export const listarHorariosDisponiveis = async (
  funcionarioId: number,
  data: string
) => {
  const response = await api.get("/horarios-disponiveis", {
    params: {
      funcionarioId,
      data,
    },
  });

  return response.data;
};

export const criarHorarioDisponivel = async (dados: {
  funcionarioId: number;
  inicio: string;
  fim: string;
}) => {
  const response = await api.post("/horarios-disponiveis", dados);
  return response.data;
};