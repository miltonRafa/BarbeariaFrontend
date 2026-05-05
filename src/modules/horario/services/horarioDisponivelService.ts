import { api } from "../../../shared/services/api";

export const listarHorariosDisponiveis = async (
  funcionarioId: number,
  data: string
) => {
  const response = await api.get(
    `/horarios-disponiveis/funcionario/${funcionarioId}`,
    {
      params: {
        data,
      },
    }
  );

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

export async function encerrarExpediente(
  funcionarioId: number,
  data: string
) {
  await api.delete(
    `/horarios-disponiveis/funcionario/${funcionarioId}`,
    {
      params: { data },
    }
  );
}