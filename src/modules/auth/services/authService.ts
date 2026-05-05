import { api } from "../../../shared/services/api";

type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  nome: string;
  perfil: string;
  usuarioId: number;
  funcionarioId: number | null;
  clienteId: number | null;
  empresaId: number | null;
  nomeEmpresa: string | null;
  planoSistema: "BASIC" | "PLUS" | "PREMIUM" | null;
};

export type ClienteCadastroRequest = {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
  slugPublicoEmpresa: string;
};

export type ConfirmarEmailRequest = {
  email: string;
  codigo: string;
};

export async function login(dados: LoginRequest) {
  const response = await api.post("/auth/login", dados);
  return response.data as LoginResponse;
}

export async function loginCliente(dados: LoginRequest & { slugPublicoEmpresa: string }) {
  const response = await api.post("/auth/cliente/login", dados);
  return response.data as LoginResponse;
}

export async function solicitarCadastroCliente(dados: ClienteCadastroRequest) {
  const response = await api.post("/auth/cliente/solicitar-cadastro", dados);
  return response.data;
}

export async function confirmarEmailCliente(dados: ConfirmarEmailRequest) {
  const response = await api.post("/auth/cliente/confirmar-email", dados);
  return response.data;
}

export async function reenviarCodigoCliente(email: string) {
  const response = await api.post("/auth/cliente/reenviar-codigo", { email });
  return response.data;
}
