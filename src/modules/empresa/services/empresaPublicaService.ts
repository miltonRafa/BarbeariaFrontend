import { api } from "../../../shared/services/api";

export type EmpresaPublica = {
  id: number;
  nomeFantasia: string;
  slugPublico: string;
  logo: string | null;
};

export async function buscarEmpresaPublica(slugPublico: string) {
  const response = await api.get(`/empresas/publica/${slugPublico}`);
  return response.data as EmpresaPublica;
}
