import { api } from "./api";

export type FuncionarioRequest = {
  usuarioId?: number;
  nome?: string;
  email?: string;
  senha?: string;
  perfil?: "ADMIN" | "CAIXA" | "CLIENTE" | "FUNCIONARIO";
  ativo?: boolean;
};

export async function criarFuncionario(data: FuncionarioRequest) {
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

export async function atualizarFuncionario(
  funcionarioId: number,
  data: FuncionarioRequest,
) {
  const response = await api.put(`/funcionarios/${funcionarioId}`, data);
  return response.data;
}

export async function excluirFuncionario(funcionarioId: number) {
  const response = await api.delete(`/funcionarios/${funcionarioId}`);
  return response.data;
}

export async function desativarServicoDoFuncionario(
  funcionarioId: number,
  servicoId: number,
) {
  await api.put(`/funcionarios/${funcionarioId}/servicos/${servicoId}/desativar`);
}
