import { api } from "./api";

export async function criarFuncionario(data: { usuarioId: number }) {
  const response = await api.post("/funcionarios", data);
  return response.data;
}

export async function atribuirServicosAoFuncionario(
  funcionarioId: number,
  servicoIds: number[],
) {
  const response = await api.put(`/funcionarios/${funcionarioId}/servicos`, {
    servicoIds,
  });

  return response.data;
}

export async function listarFuncionarios() {
  const response = await api.get("/funcionarios");
  return response.data;
}

export async function listarHorariosDisponiveis(
  funcionarioId: number,
  data: string,
) {
  const response = await api.get("/horarios-disponiveis", {
    params: {
      funcionarioId,
      data,
    },
  });

  return response.data;
}

export async function listarServicosDoFuncionario(funcionarioId: number) {
  const response = await api.get(`/funcionarios/${funcionarioId}/servicos`);
  return response.data;
}