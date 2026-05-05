import { api } from "../../../shared/services/api";

export const getDashboard = async (periodo = "DIA") => {
  const response = await api.get("/dashboard", {
    params: { periodo },
  });
  return response.data;
};
