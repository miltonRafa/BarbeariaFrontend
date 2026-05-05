import { api } from "../../../shared/services/api";

export type NotificacaoConfig = {
  emailContasPagarAtivo: boolean;
  whatsappAgendamentoAtivo: boolean;
};

export const getNotificacaoConfig = async () => {
  const response = await api.get("/notificacoes/config");
  return response.data as NotificacaoConfig;
};

export const atualizarNotificacaoConfig = async (data: NotificacaoConfig) => {
  const response = await api.put("/notificacoes/config", data);
  return response.data as NotificacaoConfig;
};
