import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  cancelarAgendamento,
  listarAgendamentos,
  pagarAgendamento,
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

type AgendaContext = {
  funcionarioId?: number | null;
};

function MeusAgendamentos() {
  const agendaContext = useOutletContext<AgendaContext | null>();
  const funcionarioContextId = agendaContext?.funcionarioId;
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
      try {
        setLoading(true);
        const funcionarioId =
          funcionarioContextId ||
          Number(localStorage.getItem("funcionarioAgendaId")) ||
          Number(localStorage.getItem("funcionarioId"));

        if (!funcionarioId) {
          setAgendamentos([]);
          setErro("Selecione um funcionário para carregar a agenda.");
          return;
        }

        const data = await listarAgendamentos(funcionarioId);
        setAgendamentos(Array.isArray(data) ? data : []);
        setErro("");
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar os agendamentos.");
      } finally {
        setLoading(false);
      }
  }, [funcionarioContextId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
  }, [carregar]);

  async function cancelar(id: number) {
    if (!confirm("Cancelar este agendamento?")) return;
    await cancelarAgendamento(id);
    await carregar();
  }

  async function marcarPago(id: number) {
    await pagarAgendamento(id);
    await carregar();
  }

  if (loading) return <p className="text-white">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#c59d5f] mb-6">
        Minha Agenda
      </h1>

      {erro && (
        <p className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
          {erro}
        </p>
      )}

      {!erro && agendamentos.length === 0 && (
        <p className="text-white">Nenhum agendamento encontrado.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {agendamentos.map((agendamento) => (
          <div
            key={agendamento.id}
            className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-lg p-4 sm:p-5 shadow-lg text-white"
          >
            <p className="text-xl font-semibold text-[#c59d5f] mb-3">
              {agendamento.cliente ?? "Cliente não informado"}
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
                {agendamento.status ?? "Agendado"}
              </span>
              {agendamento.status !== "CANCELADO" && (
                <div className="flex flex-wrap gap-2">
                  {agendamento.statusFinanceiro !== "PAGO" && (
                    <button
                      type="button"
                      onClick={() => marcarPago(agendamento.id)}
                      className="rounded-lg border border-emerald-500/40 px-3 py-1 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/10"
                    >
                      Pago
                    </button>
                  )}
                  {agendamento.statusFinanceiro !== "PAGO" && agendamento.status !== "CONCLUIDO" && (
                    <button
                      type="button"
                      onClick={() => cancelar(agendamento.id)}
                      className="rounded-lg border border-red-500/40 px-3 py-1 text-xs font-semibold text-red-200 hover:bg-red-500/10"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MeusAgendamentos;
