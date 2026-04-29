import { api } from "./api";

type LoginRequest = {
  email: string;
  senha: string;
};

export const login = async (dados: LoginRequest) => {
  const response = await api.post("/auth/login", dados);
  return response.data;
};