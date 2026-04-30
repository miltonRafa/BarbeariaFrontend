import { api } from "./api";

export async function criarUsuario(data: {
  nome: string;
  email: string;
  senha: string;
  perfil: "ADMIN" | "CAIXA" | "CLIENTE" | "FUNCIONARIO";
  ativo: boolean;
}) {
  const response = await api.post("/usuarios", data);
  return response.data;
}