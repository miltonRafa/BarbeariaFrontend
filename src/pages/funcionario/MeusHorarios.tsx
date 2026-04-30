import { useEffect, useState } from "react";
import {
  criarHorarioDisponivel,
  listarHorariosDisponiveis,
} from "../../services/horarioDisponivelService";

type HorarioDisponivel = {
  id: number;
  inicio: string;
  fim: string;
  status: string;
};

function MeusHorarios() {
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [dataHorarios, setDataHorarios] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataHorarios) return;

    async function carregarHorarios() {
      try {
        setLoading(true);

        const funcionarioId = Number(localStorage.getItem("funcionarioId"));

        if (!funcionarioId) {
          alert("Funcionário não identificado.");
          return;
        }

        const data = await listarHorariosDisponiveis(
          funcionarioId,
          dataHorarios,
        );

        setHorarios(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar horários", error);
      } finally {
        setLoading(false);
      }
    }

    carregarHorarios();
  }, [dataHorarios]);

  async function recarregarHorarios(funcionarioId: number) {
    if (!dataHorarios) return;

    const data = await listarHorariosDisponiveis(funcionarioId, dataHorarios);
    setHorarios(Array.isArray(data) ? data : []);
  }

  async function disponibilizarHorario() {
    try {
      const funcionarioId = Number(localStorage.getItem("funcionarioId"));

      if (!funcionarioId) {
        alert("Funcionário não identificado. Faça login novamente.");
        return;
      }

      if (!inicio || !fim) {
        alert("Informe o início e o fim do horário.");
        return;
      }

      await criarHorarioDisponivel({
        funcionarioId,
        inicio,
        fim,
      });

      alert("Horário disponibilizado com sucesso!");

      setInicio("");
      setFim("");

      await recarregarHorarios(funcionarioId);
    } catch (error) {
      console.error("Erro ao disponibilizar horário", error);
      alert("Erro ao disponibilizar horário.");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#c59d5f] mb-6">
        Meus Horários
      </h1>

      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-8 text-white">
        <h2 className="text-xl font-bold text-[#c59d5f] mb-4">
          Disponibilizar horário
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-zinc-300 mb-2">Início</label>
            <input
              type="datetime-local"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-300 mb-2">Fim</label>
            <input
              type="datetime-local"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>
        </div>

        <button
          onClick={disponibilizarHorario}
          className="bg-[#c59d5f] hover:bg-[#d6ae70] text-black font-bold px-6 py-3 rounded-xl"
        >
          Disponibilizar horário
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-zinc-300 mb-2">Consultar dia</label>
        <input
          type="date"
          value={dataHorarios}
          onChange={(e) => {
            setDataHorarios(e.target.value);
            setHorarios([]);
          }}
          className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
        />
      </div>

      {loading && <p className="text-white">Carregando horários...</p>}

      {!loading && dataHorarios && horarios.length === 0 && (
        <p className="text-zinc-200 mb-8">
          Nenhum horário disponível nesse dia.
        </p>
      )}

      {!dataHorarios && (
        <p className="text-zinc-200 mb-8">
          Selecione um dia para consultar seus horários disponíveis.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {horarios.map((horario) => (
          <div
            key={horario.id}
            className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-white shadow-lg"
          >
            <p className="text-xl font-semibold text-[#c59d5f] mb-3">
              Horário disponível
            </p>

            <p className="text-zinc-300">
              <strong>Início:</strong>{" "}
              {new Date(horario.inicio).toLocaleString("pt-BR")}
            </p>

            <p className="text-zinc-300">
              <strong>Fim:</strong>{" "}
              {new Date(horario.fim).toLocaleString("pt-BR")}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-xs bg-emerald-500 text-black px-3 py-1 rounded-full font-semibold">
                {horario.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MeusHorarios;