import { useEffect, useState } from "react";
import { listarFuncionarios } from "../../services/funcionarioService";
import { listarHorariosDisponiveis } from "../../services/horarioDisponivelService";
import { criarAgendamento } from "../../services/agendamentoService";

type Servico = {
  id: number;
  nome: string;
  preco: number;
  duracao?: string;
  duracaoMinutos?: number;
};

type Funcionario = {
  id: number;
  nome: string;
  servicos?: Servico[];
};

type HorarioDisponivel = {
  id: number;
  inicio: string;
  fim: string;
  status: string;
  funcionarioId?: number;
};

function Agendar() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);

  const [funcionarioSelecionado, setFuncionarioSelecionado] =
    useState<Funcionario | null>(null);

  const [servicoSelecionado, setServicoSelecionado] =
    useState<Servico | null>(null);

  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] =
    useState<HorarioDisponivel | null>(null);

  useEffect(() => {
    async function carregarDados() {
      const funcionariosData = await listarFuncionarios();
      setFuncionarios(Array.isArray(funcionariosData) ? funcionariosData : []);
    }

    carregarDados();
  }, []);

  async function buscarHorarios() {
    if (!funcionarioSelecionado || !dataSelecionada) {
      alert("Selecione funcionário e data.");
      return;
    }

    const data = await listarHorariosDisponiveis(
      funcionarioSelecionado.id,
      dataSelecionada,
    );

    const listaHorarios: HorarioDisponivel[] = Array.isArray(data) ? data : [];

    const horariosDoFuncionario = listaHorarios.filter(
      (horario) =>
        !horario.funcionarioId ||
        horario.funcionarioId === funcionarioSelecionado.id,
    );

    setHorarios(horariosDoFuncionario);
    setHorarioSelecionado(null);
  }

  async function confirmarAgendamento() {
    if (!funcionarioSelecionado || !servicoSelecionado || !horarioSelecionado) {
      alert("Selecione funcionário, serviço e horário.");
      return;
    }

    if (
      horarioSelecionado.funcionarioId &&
      horarioSelecionado.funcionarioId !== funcionarioSelecionado.id
    ) {
      alert("Esse horário não pertence ao funcionário selecionado.");
      return;
    }

    await criarAgendamento({
      clienteId: 1,
      funcionarioId: funcionarioSelecionado.id,
      servicosIds: [servicoSelecionado.id],
      horarioDisponivelId: horarioSelecionado.id,
    });

    alert("Agendamento realizado com sucesso!");

    setServicoSelecionado(null);
    setDataSelecionada("");
    setHorarios([]);
    setHorarioSelecionado(null);
  }

  const servicosDoFuncionario = funcionarioSelecionado?.servicos ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#c59d5f] mb-6">
        Agendar Horário
      </h1>

      <h2 className="text-xl font-semibold text-white mb-3">
        1. Escolha o profissional
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {funcionarios.map((funcionario) => (
          <button
            key={funcionario.id}
            onClick={() => {
              setFuncionarioSelecionado(funcionario);
              setServicoSelecionado(null);
              setDataSelecionada("");
              setHorarios([]);
              setHorarioSelecionado(null);
            }}
            className={`text-left p-5 rounded-2xl border transition ${
              funcionarioSelecionado?.id === funcionario.id
                ? "bg-[#c59d5f] text-black border-[#c59d5f]"
                : "bg-slate-950/80 text-white border-slate-800 hover:border-[#c59d5f]"
            }`}
          >
            <p className="text-lg font-semibold">{funcionario.nome}</p>

          </button>
        ))}
      </div>

      {funcionarioSelecionado && (
        <>
          <h2 className="text-xl font-semibold text-white mb-3">
            2. Escolha o serviço
          </h2>

          {servicosDoFuncionario.length === 0 ? (
            <p className="text-sm text-slate-300 mb-8">
              Este funcionário ainda não possui serviços vinculados.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {servicosDoFuncionario.map((servico) => (
                <button
                  key={servico.id}
                  onClick={() => {
                    setServicoSelecionado(servico);
                    setDataSelecionada("");
                    setHorarios([]);
                    setHorarioSelecionado(null);
                  }}
                  className={`text-left p-5 rounded-2xl border transition ${
                    servicoSelecionado?.id === servico.id
                      ? "bg-[#c59d5f] text-black border-[#c59d5f]"
                      : "bg-slate-950/80 text-white border-slate-800 hover:border-[#c59d5f]"
                  }`}
                >
                  <p className="text-lg font-semibold">{servico.nome}</p>
                  <p className="text-sm opacity-80">R$ {servico.preco}</p>
                  <p className="text-sm opacity-80">
                    {servico.duracao ?? `${servico.duracaoMinutos ?? 0} min`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {funcionarioSelecionado && servicoSelecionado && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">
            3. Escolha a data
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => {
                setDataSelecionada(e.target.value);
                setHorarios([]);
                setHorarioSelecionado(null);
              }}
              className="px-4 py-3 rounded-xl bg-slate-950/80 text-white border border-slate-800"
            />

            <button
              onClick={buscarHorarios}
              className="bg-[#c59d5f] hover:bg-[#d6ae70] text-black font-semibold px-5 py-3 rounded-xl"
            >
              Ver horários
            </button>
          </div>
        </div>
      )}

      {horarios.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-white mb-3">
            4. Escolha o horário
          </h2>

          <div className="flex flex-wrap gap-3 mb-8">
            {horarios.map((horario) => (
              <button
                key={horario.id}
                onClick={() => setHorarioSelecionado(horario)}
                className={`px-5 py-3 rounded-xl border transition ${
                  horarioSelecionado?.id === horario.id
                    ? "bg-[#c59d5f] text-black border-[#c59d5f]"
                    : "bg-slate-950/80 text-white border-slate-800 hover:border-[#c59d5f]"
                }`}
              >
                {new Date(horario.inicio).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            ))}
          </div>

          <button
            onClick={confirmarAgendamento}
            className="bg-[#c59d5f] hover:bg-[#d6ae70] text-black font-bold px-6 py-4 rounded-xl"
          >
            Agendar horário
          </button>
        </>
      )}
    </div>
  );
}

export default Agendar;