import { useEffect, useState } from "react";
import {
  cancelarAgendamento,
  listarAgendamentosDoCliente,
} from "../../agendamento/services/agendamentoService";

type Agendamento = {
  id: number;
  cliente?: string;
  funcionario?: string;
  data?: string;
  horaInicio?: string;
  status?: string;
  statusFinanceiro?: string;
  valorTotal?: number;
};

function ServicosAgendados() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const clienteId = Number(localStorage.getItem("clienteId"));

  useEffect(() => {
    carregarAgendamentos();
  }, [clienteId]);

  async function carregarAgendamentos() {
      try {
        const data = await listarAgendamentosDoCliente(clienteId);
        setAgendamentos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar serviços agendados", error);
      } finally {
        setLoading(false);
      }
  }

  async function cancelar(id: number) {
    if (!confirm("Cancelar este agendamento?")) return;
    await cancelarAgendamento(id);
    await carregarAgendamentos();
  }

  if (loading) {
    return <p className="text-white text-lg">Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#c59d5f] mb-6">
        Meus Serviços Agendados
      </h1>

      {agendamentos.length === 0 && (
        <p className="text-white">
          Nenhum serviço agendado encontrado.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {agendamentos.map((agendamento) => (
          <div
            key={agendamento.id}
            className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-lg p-4 sm:p-5 shadow-lg text-white hover:border-[#c59d5f] transition"
          >
            <p className="text-xl font-semibold text-[#c59d5f] mb-3">
              Agendamento #{agendamento.id}
            </p>

            <p className="text-[#9ca3af]">
              <strong>Funcionário:</strong>{" "}
              {agendamento.funcionario ?? "Não informado"}
            </p>

            <p className="text-[#9ca3af]">
              <strong>Data:</strong>{" "}
              {agendamento.data
                ? agendamento.data.split("-").reverse().join("/")
                : "Não informado"}
            </p>

            <p className="text-[#9ca3af]">
              <strong>Horário:</strong>{" "}
              {agendamento.horaInicio
                ? agendamento.horaInicio.substring(0, 5)
                : "Não informado"}
            </p>

            <p className="text-[#9ca3af]">
              <strong>Valor:</strong>{" "}
              {agendamento.valorTotal !== undefined
                ? `R$ ${agendamento.valorTotal}`
                : "Não informado"}
            </p>

            <p className="text-[#9ca3af]">
              <strong>Financeiro:</strong>{" "}
              {agendamento.statusFinanceiro ?? "PENDENTE"}
            </p>

            <div className="mt-4 pt-4 border-t border-[#1f1f23] flex items-center justify-between gap-3">
              <span className="text-xs bg-[#c59d5f] text-black px-3 py-1 rounded-full font-semibold">
                {agendamento.status ?? "AGENDADO"}
              </span>
              {agendamento.status !== "CANCELADO" && agendamento.statusFinanceiro !== "PAGO" && agendamento.status !== "CONCLUIDO" && (
                <button
                  type="button"
                  onClick={() => cancelar(agendamento.id)}
                  className="rounded-lg border border-red-500/40 px-3 py-1 text-xs font-semibold text-red-200 hover:bg-red-500/10"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicosAgendados;
