import { api } from "../../../shared/services/api";

export const listarRelatorios = async () => {
  const response = await api.get("/relatorios");
  return response.data;
};

export const baixarRelatorioPdf = async (id: number) => {
  const response = await api.get(`/relatorios/${id}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-${id}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const gerarRelatorioFuncionarios = async (
  tipo: "rentabilidade" | "ranking" | "folha-pagamento" | "comissoes" | "custos",
  inicio?: string,
  fim?: string,
) => {
  const response = await api.post(`/relatorios/funcionarios/${tipo}`, null, {
    params: { inicio, fim },
  });
  return response.data;
};

export const excluirRelatorio = async (id: number) => {
  await api.delete(`/relatorios/${id}`);
};
