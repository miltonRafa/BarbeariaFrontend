import { useEffect, useState } from "react";
import { listarAgendamentos } from "../../services/agendamentoService";

type Agendamento = {
  id: number;
  cliente?: string;
  funcionario?: string;
  data?: string;
  horaInicio?: string;
  status?: string;
  valorTotal?: number;
};

function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const funcionarioId =
          Number(localStorage.getItem("funcionarioAgendaId")) ||
          Number(localStorage.getItem("funcionarioId"));

        const data = await listarAgendamentos(funcionarioId);
        setAgendamentos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  if (loading) return <p className="text-white">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#c59d5f] mb-6">
        Minha Agenda
      </h1>

      {agendamentos.length === 0 && (
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

            <div className="mt-4 pt-4 border-t border-[#1f1f23]">
              <span className="text-xs bg-[#c59d5f] text-black px-3 py-1 rounded-full font-semibold">
                {agendamento.status ?? "Agendado"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MeusAgendamentos;