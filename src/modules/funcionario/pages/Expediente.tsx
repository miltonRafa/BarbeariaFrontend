import { useOutletContext } from "react-router-dom";
import { encerrarExpediente } from "../../horario/services/horarioDisponivelService";

type AgendaContext = {
  funcionarioId?: number | null;
};

function Expediente() {
  const agendaContext = useOutletContext<AgendaContext | null>();
  const funcionarioContextId = agendaContext?.funcionarioId;

  async function encerrar() {
    const funcionarioId =
      funcionarioContextId ||
      Number(localStorage.getItem("funcionarioAgendaId")) ||
      Number(localStorage.getItem("funcionarioId"));

    if (!funcionarioId) {
      alert("Funcionário não identificado.");
      return;
    }

    const hoje = new Date().toISOString().split("T")[0];

    if (!confirm("Tem certeza que deseja encerrar o expediente de hoje?")) {
      return;
    }

    try {
      await encerrarExpediente(funcionarioId, hoje);

      alert("Expediente encerrado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao encerrar expediente.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#c59d5f] mb-6">
        Expediente
      </h1>

      <div className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-lg p-4 sm:p-5 text-white">
        <p className="text-[#9ca3af] mb-5">
          Use esta opção para encerrar o expediente do dia.
        </p>

        <button
          onClick={encerrar}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg"
        >
          Encerrar expediente
        </button>
      </div>
    </div>
  );
}

export default Expediente;
