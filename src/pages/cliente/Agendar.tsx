import { useCallback, useEffect, useState } from "react";
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

  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);

  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [horarioSelecionado, setHorarioSelecionado] = useState<{
    horario: HorarioDisponivel;
    hora: string;
  } | null>(null);

  const [loadingHorarios, setLoadingHorarios] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const funcionariosData = await listarFuncionarios();
      setFuncionarios(Array.isArray(funcionariosData) ? funcionariosData : []);
    }

    carregarDados();
  }, []);

  const servicosDoFuncionario = funcionarioSelecionado?.servicos ?? [];
  const servicosEscolhidos = servicosDoFuncionario.filter((servico) =>
    servicosSelecionados.includes(servico.id)
  );
  const duracaoTotal = servicosEscolhidos.reduce(
    (total, servico) => total + (servico.duracaoMinutos ?? 0),
    0
  );

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

  const buscarHorarios = useCallback(async () => {
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
  }, [dataSelecionada, funcionarioSelecionado]);

  useEffect(() => {
    if (funcionarioSelecionado && servicosSelecionados.length > 0 && dataSelecionada) {
      buscarHorarios();
    }
  }, [
    buscarHorarios,
    dataSelecionada,
    funcionarioSelecionado,
    servicosSelecionados.length,
  ]);

  async function confirmarAgendamento() {
    const clienteId = Number(localStorage.getItem("clienteId"));

    console.log("clienteId:", clienteId);
    console.log("funcionario:", funcionarioSelecionado);
    if (!clienteId) {
      alert("Cliente não identificado. Faça login novamente.");
      return;
    }

    if (!funcionarioSelecionado || servicosSelecionados.length === 0 || !horarioSelecionado?.hora) {
      alert("Selecione funcionário, serviço(s) e horário.");
      return;
    }

    try {
      const resposta = await criarAgendamento({
        clienteId,
        funcionarioId: funcionarioSelecionado.id,
        servicosIds: servicosSelecionados,
        horarioDisponivelId: horarioSelecionado.horario.id,
        horaInicio: horarioSelecionado.hora,
      });

      console.log("Agendamento criado:", resposta);

      alert("Agendamento realizado com sucesso!");

      setServicosSelecionados([]);
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
      <h1 className="text-2xl sm:text-3xl font-bold text-[#c59d5f] mb-2">
        Agendar Horário
      </h1>

      <p className="text-[#9ca3af] mb-8">
        Escolha o profissional, serviço, dia e horário disponível.
      </p>

      <section className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-lg p-4 sm:p-5 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          1. Profissional
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {funcionarios.map((funcionario) => (
            <button
              key={funcionario.id}
              onClick={() => {
                setFuncionarioSelecionado(funcionario);
                setServicosSelecionados([]);
                setDataSelecionada(hoje);
                setHorarios([]);
                setHorarioSelecionado(null);
              }}
              className={`text-left p-4 sm:p-5 rounded-lg border transition ${funcionarioSelecionado?.id === funcionario.id
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
        <section className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-lg p-4 sm:p-5 mb-6">
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
                    setServicosSelecionados((atual) =>
                      atual.includes(servico.id)
                        ? atual.filter((id) => id !== servico.id)
                        : [...atual, servico.id]
                    );
                    setHorarios([]);
                    setHorarioSelecionado(null);
                  }}
                  className={`text-left p-4 sm:p-5 rounded-lg border transition ${servicosSelecionados.includes(servico.id)
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

      {funcionarioSelecionado && servicosSelecionados.length > 0 && (
        <section className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-lg p-4 sm:p-5 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            3. Dia
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <input
              id="agendar-data"
              name="data"
              type="date"
              min={hoje}
              value={dataSelecionada}
              onChange={(e) => {
                setDataSelecionada(e.target.value);
                setHorarios([]);
                setHorarioSelecionado(null);
              }}
              className="min-w-[180px] rounded-lg border border-[#1f1f23] bg-[#121214]/80 px-4 py-3 text-white"
            />
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
                  className={`min-w-[72px] rounded-lg border px-3 py-3 text-center transition ${selecionada
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

      {funcionarioSelecionado && servicosSelecionados.length > 0 && (
        <section className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-lg p-4 sm:p-5 mb-6">
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
            <div className="grid gap-4">
              {horarios.map((horario) => (
                <div
                  key={horario.id}
                  className="rounded-lg border border-[#1f1f23] bg-[#121214]/80 p-4"
                >
                  <p className="font-semibold text-white">
                    Disponível das {extrairHora(horario.inicio)} às {extrairHora(horario.fim)}
                  </p>
                  <p className="mt-1 text-sm text-[#9ca3af]">
                    Opções divididas em blocos de {duracaoTotal} min.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {gerarOpcoesDeInicio(horario, duracaoTotal).map((hora) => (
                      <button
                        key={`${horario.id}-${hora}`}
                        type="button"
                        onClick={() => setHorarioSelecionado({ horario, hora })}
                        className={`rounded-lg border px-5 py-3 font-bold transition ${
                          horarioSelecionado?.horario.id === horario.id &&
                          horarioSelecionado.hora === hora
                            ? "border-[#c59d5f] bg-[#c59d5f] text-black"
                            : "border-[#1f1f23] bg-black/40 text-white hover:border-[#c59d5f]"
                        }`}
                      >
                        {hora}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {horarioSelecionado && (
        <div className="bg-black/90 border border-[#1f1f23] rounded-lg p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[#9ca3af] text-sm">Resumo</p>
            <p className="text-white font-semibold">
              {funcionarioSelecionado?.nome} • {servicosEscolhidos.length} serviço(s) •{" "}
              {horarioSelecionado.hora} • {duracaoTotal} min
            </p>
          </div>

          <button
            onClick={confirmarAgendamento}
            className="bg-[#c59d5f] hover:bg-[#d6ae70] text-black font-bold px-6 py-4 rounded-lg"
          >
            Confirmar agendamento
          </button>
        </div>
      )}
    </div>
  );
}

function extrairHora(dataHora: string) {
  const [, horaCompleta] = dataHora.split("T");
  return horaCompleta?.substring(0, 5) ?? "";
}

function gerarOpcoesDeInicio(horario: HorarioDisponivel, duracaoMinutos: number) {
  const inicio = new Date(horario.inicio);
  const fim = new Date(horario.fim);
  const ultimoInicio = new Date(fim.getTime() - duracaoMinutos * 60000);
  const opcoes: string[] = [];

  for (
    let atual = new Date(inicio);
    atual <= ultimoInicio;
    atual = new Date(atual.getTime() + duracaoMinutos * 60000)
  ) {
    opcoes.push(atual.toTimeString().slice(0, 5));
  }

  return opcoes;
}

export default Agendar;
