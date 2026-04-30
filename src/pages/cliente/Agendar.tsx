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
  const hoje = new Date().toISOString().split("T")[0];

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);

  const [funcionarioSelecionado, setFuncionarioSelecionado] =
    useState<Funcionario | null>(null);

  const [servicoSelecionado, setServicoSelecionado] =
    useState<Servico | null>(null);

  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [horarioSelecionado, setHorarioSelecionado] =
    useState<HorarioDisponivel | null>(null);

  const [loadingHorarios, setLoadingHorarios] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const funcionariosData = await listarFuncionarios();
      setFuncionarios(Array.isArray(funcionariosData) ? funcionariosData : []);
    }

    carregarDados();
  }, []);

  useEffect(() => {
    if (funcionarioSelecionado && servicoSelecionado && dataSelecionada) {
      buscarHorarios();
    }
  }, [funcionarioSelecionado, servicoSelecionado, dataSelecionada]);

  const servicosDoFuncionario = funcionarioSelecionado?.servicos ?? [];

  function gerarDias() {
    return Array.from({ length: 10 }).map((_, index) => {
      const data = new Date();
      data.setDate(data.getDate() + index);

      return {
        valor: data.toISOString().split("T")[0],
        dia: data.getDate(),
        mes: data.toLocaleDateString("pt-BR", { month: "short" }),
        semana: data.toLocaleDateString("pt-BR", { weekday: "short" }),
      };
    });
  }

  function formatarHora(dataHora: string) {
    const [, horaCompleta] = dataHora.split("T");
    return horaCompleta?.substring(0, 5);
  }

  async function buscarHorarios() {
    if (!funcionarioSelecionado || !dataSelecionada) return;

    try {
      setLoadingHorarios(true);

      const data = await listarHorariosDisponiveis(
        funcionarioSelecionado.id,
        dataSelecionada
      );

      const listaHorarios: HorarioDisponivel[] = Array.isArray(data) ? data : [];

      const horariosDoFuncionario = listaHorarios.filter(
        (horario) =>
          !horario.funcionarioId ||
          horario.funcionarioId === funcionarioSelecionado.id
      );

      setHorarios(horariosDoFuncionario);
      setHorarioSelecionado(null);
    } catch (error) {
      console.error("Erro ao buscar horários", error);
      alert("Erro ao buscar horários disponíveis.");
    } finally {
      setLoadingHorarios(false);
    }
  }

  async function confirmarAgendamento() {
    const clienteId = Number(localStorage.getItem("clienteId"));

    console.log("clienteId:", clienteId);
    console.log("funcionario:", funcionarioSelecionado);
    console.log("servico:", servicoSelecionado);
    console.log("horario:", horarioSelecionado);

    if (!clienteId) {
      alert("Cliente não identificado. Faça login novamente.");
      return;
    }

    if (!funcionarioSelecionado || !servicoSelecionado || !horarioSelecionado) {
      alert("Selecione funcionário, serviço e horário.");
      return;
    }

    try {
      const resposta = await criarAgendamento({
        clienteId,
        funcionarioId: funcionarioSelecionado.id,
        servicosIds: [servicoSelecionado.id],
        horarioDisponivelId: horarioSelecionado.id,
      });

      console.log("Agendamento criado:", resposta);

      alert("Agendamento realizado com sucesso!");

      setServicoSelecionado(null);
      setDataSelecionada(hoje);
      setHorarios([]);
      setHorarioSelecionado(null);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      alert("Erro ao criar agendamento.");
    }
  }

  return (
    <div className="pb-28">
      <h1 className="text-3xl font-bold text-[#c59d5f] mb-2">
        Agendar Horário
      </h1>

      <p className="text-[#9ca3af] mb-8">
        Escolha o profissional, serviço, dia e horário disponível.
      </p>

      <section className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-2xl p-5 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          1. Profissional
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {funcionarios.map((funcionario) => (
            <button
              key={funcionario.id}
              onClick={() => {
                setFuncionarioSelecionado(funcionario);
                setServicoSelecionado(null);
                setDataSelecionada(hoje);
                setHorarios([]);
                setHorarioSelecionado(null);
              }}
              className={`text-left p-5 rounded-2xl border transition ${funcionarioSelecionado?.id === funcionario.id
                  ? "bg-[#c59d5f] text-black border-[#c59d5f]"
                  : "bg-[#121214]/80 text-white border-[#1f1f23] hover:border-[#c59d5f]"
                }`}
            >
              <p className="text-lg font-bold">{funcionario.nome}</p>
              <p className="text-sm opacity-80">
                {funcionario.servicos?.length ?? 0} serviços disponíveis
              </p>
            </button>
          ))}
        </div>
      </section>

      {funcionarioSelecionado && (
        <section className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-2xl p-5 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            2. Serviço
          </h2>

          {servicosDoFuncionario.length === 0 ? (
            <p className="text-sm text-[#9ca3af]">
              Este funcionário ainda não possui serviços vinculados.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {servicosDoFuncionario.map((servico) => (
                <button
                  key={servico.id}
                  onClick={() => {
                    setServicoSelecionado(servico);
                    setHorarios([]);
                    setHorarioSelecionado(null);
                  }}
                  className={`text-left p-5 rounded-2xl border transition ${servicoSelecionado?.id === servico.id
                      ? "bg-[#c59d5f] text-black border-[#c59d5f]"
                      : "bg-[#121214]/80 text-white border-[#1f1f23] hover:border-[#c59d5f]"
                    }`}
                >
                  <p className="text-lg font-bold">{servico.nome}</p>
                  <p className="text-sm opacity-80">R$ {servico.preco}</p>
                  <p className="text-sm opacity-80">
                    {servico.duracao ?? `${servico.duracaoMinutos ?? 0} min`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {funcionarioSelecionado && servicoSelecionado && (
        <section className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-2xl p-5 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            3. Dia
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {gerarDias().map((data) => {
              const selecionada = dataSelecionada === data.valor;

              return (
                <button
                  key={data.valor}
                  onClick={() => {
                    setDataSelecionada(data.valor);
                    setHorarios([]);
                    setHorarioSelecionado(null);
                  }}
                  className={`min-w-[72px] rounded-2xl border px-3 py-3 text-center transition ${selecionada
                      ? "bg-[#c59d5f] text-black border-[#c59d5f]"
                      : "bg-[#121214]/80 text-white border-[#1f1f23] hover:border-[#c59d5f]"
                    }`}
                >
                  <p className="text-xs font-semibold capitalize">
                    {data.semana.replace(".", "")}
                  </p>
                  <p className="text-2xl font-bold">{data.dia}</p>
                  <p className="text-xs capitalize">{data.mes.replace(".", "")}</p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {funcionarioSelecionado && servicoSelecionado && (
        <section className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-2xl p-5 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            4. Horário
          </h2>

          {loadingHorarios && (
            <p className="text-[#9ca3af]">Carregando horários...</p>
          )}

          {!loadingHorarios && horarios.length === 0 && (
            <p className="text-[#9ca3af]">
              Nenhum horário disponível nesse dia.
            </p>
          )}

          {!loadingHorarios && horarios.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {horarios.map((horario) => (
                <button
                  key={horario.id}
                  onClick={() => setHorarioSelecionado(horario)}
                  className={`px-5 py-3 rounded-xl border font-bold transition ${horarioSelecionado?.id === horario.id
                      ? "bg-[#c59d5f] text-black border-[#c59d5f]"
                      : "bg-[#121214]/80 text-white border-[#1f1f23] hover:border-[#c59d5f]"
                    }`}
                >
                  {formatarHora(horario.inicio)}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {horarioSelecionado && (
        <div className="bg-black/90 border border-[#1f1f23] rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[#9ca3af] text-sm">Resumo</p>
            <p className="text-white font-semibold">
              {funcionarioSelecionado?.nome} • {servicoSelecionado?.nome} •{" "}
              {formatarHora(horarioSelecionado.inicio)}
            </p>
          </div>

          <button
            onClick={confirmarAgendamento}
            className="bg-[#c59d5f] hover:bg-[#d6ae70] text-black font-bold px-6 py-4 rounded-xl"
          >
            Confirmar agendamento
          </button>
        </div>
      )}
    </div>
  );
}

export default Agendar;