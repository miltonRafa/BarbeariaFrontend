import { useEffect, useMemo, useState } from "react";
import { listarFuncionarios } from "../../funcionario/services/funcionarioService";
import { listarHorariosDisponiveis } from "../../horario/services/horarioDisponivelService";
import { criarAgendamento } from "../../agendamento/services/agendamentoService";
import Dropdown from "../../../shared/components/Dropdown";

type Servico = {
  id: number;
  nome: string;
  preco: number;
  duracao?: string;
  duracaoMinutos?: number;
  ativo?: boolean;
};

type Funcionario = {
  id: number;
  nome: string;
  ativo?: boolean;
  servicos?: Servico[];
};

type HorarioDisponivel = {
  id: number;
  inicio: string;
  fim: string;
  status: string;
  funcionarioId?: number;
  funcionario?: string;
};

type SlotDisponivel = {
  funcionario: Funcionario;
  horario: HorarioDisponivel;
  hora: string;
};

const hoje = new Date().toISOString().split("T")[0];

function Agendar() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [horariosPorFuncionario, setHorariosPorFuncionario] = useState<
    Record<number, HorarioDisponivel[]>
  >({});
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [funcionarioId, setFuncionarioId] = useState("");
  const [horaFiltro, setHoraFiltro] = useState("");
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);
  const [slotSelecionado, setSlotSelecionado] = useState<SlotDisponivel | null>(
    null
  );
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const funcionariosData = await listarFuncionarios();
      setFuncionarios(Array.isArray(funcionariosData) ? funcionariosData : []);
    }

    carregarDados();
  }, []);

  const funcionariosAtivos = useMemo(
    () => funcionarios.filter((funcionario) => funcionario.ativo !== false),
    [funcionarios]
  );

  const servicos = useMemo(() => {
    const mapa = new Map<number, Servico>();

    for (const funcionario of funcionariosAtivos) {
      for (const servico of funcionario.servicos ?? []) {
        if (servico.ativo === false || mapa.has(servico.id)) continue;
        mapa.set(servico.id, servico);
      }
    }

    return Array.from(mapa.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
  }, [funcionariosAtivos]);

  const servicosEscolhidos = servicos.filter((servico) =>
    servicosSelecionados.includes(servico.id)
  );

  const duracaoTotal = servicosEscolhidos.reduce(
    (total, servico) => total + (servico.duracaoMinutos ?? 0),
    0
  );

  const duracaoParaFiltro = duracaoTotal > 0 ? duracaoTotal : 30;

  const funcionariosFiltrados = useMemo(
    () =>
      funcionariosAtivos.filter((funcionario) => {
        if (funcionarioId && funcionario.id !== Number(funcionarioId)) {
          return false;
        }

        return servicosSelecionados.every((servicoId) =>
          (funcionario.servicos ?? []).some(
            (servico) => servico.id === servicoId && servico.ativo !== false
          )
        );
      }),
    [funcionarioId, funcionariosAtivos, servicosSelecionados]
  );

  useEffect(() => {
    async function carregarHorarios() {
      if (!dataSelecionada || funcionariosAtivos.length === 0) return;

      try {
        setLoadingHorarios(true);

        const pares = await Promise.all(
          funcionariosAtivos.map(async (funcionario) => {
            const resposta = await listarHorariosDisponiveis(
              funcionario.id,
              dataSelecionada
            );
            return [
              funcionario.id,
              Array.isArray(resposta) ? resposta : [],
            ] as const;
          })
        );

        setHorariosPorFuncionario(Object.fromEntries(pares));
      } catch (error) {
        console.error("Erro ao buscar horários", error);
        alert("Erro ao buscar horários disponíveis.");
      } finally {
        setLoadingHorarios(false);
      }
    }

    carregarHorarios();
  }, [dataSelecionada, funcionariosAtivos]);

  const slotsDisponiveis = useMemo(() => {
    const slots: SlotDisponivel[] = [];

    for (const funcionario of funcionariosFiltrados) {
      const horarios = horariosPorFuncionario[funcionario.id] ?? [];

      for (const horario of horarios) {
        if (horario.status !== "DISPONIVEL") continue;

        for (const hora of gerarOpcoesDeInicio(horario, duracaoParaFiltro)) {
          if (horaFiltro && hora !== horaFiltro) continue;
          slots.push({ funcionario, horario, hora });
        }
      }
    }

    return slots.sort((a, b) => {
      const dataA = `${a.horario.inicio.slice(0, 10)}T${a.hora}`;
      const dataB = `${b.horario.inicio.slice(0, 10)}T${b.hora}`;
      return dataA.localeCompare(dataB) || a.funcionario.nome.localeCompare(b.funcionario.nome);
    });
  }, [duracaoParaFiltro, funcionariosFiltrados, horaFiltro, horariosPorFuncionario]);

  const horariosFiltro = useMemo(() => {
    const horarios = new Set<string>();

    for (const funcionario of funcionariosFiltrados) {
      for (const horario of horariosPorFuncionario[funcionario.id] ?? []) {
        for (const hora of gerarOpcoesDeInicio(horario, duracaoParaFiltro)) {
          horarios.add(hora);
        }
      }
    }

    return Array.from(horarios).sort();
  }, [duracaoParaFiltro, funcionariosFiltrados, horariosPorFuncionario]);

  useEffect(() => {
    if (!slotSelecionado) return;

    const aindaExiste = slotsDisponiveis.some(
      (slot) =>
        slot.funcionario.id === slotSelecionado.funcionario.id &&
        slot.horario.id === slotSelecionado.horario.id &&
        slot.hora === slotSelecionado.hora
    );

    if (!aindaExiste) {
      setSlotSelecionado(null);
    }
  }, [slotSelecionado, slotsDisponiveis]);

  function alternarServico(servicoId: number) {
    setServicosSelecionados((atual) =>
      atual.includes(servicoId)
        ? atual.filter((id) => id !== servicoId)
        : [...atual, servicoId]
    );
    setSlotSelecionado(null);
  }

  async function confirmarAgendamento() {
    const clienteId = Number(localStorage.getItem("clienteId"));

    if (!clienteId) {
      alert("Cliente não identificado. Faça login novamente.");
      return;
    }

    if (servicosSelecionados.length === 0 || !slotSelecionado) {
      alert("Selecione serviço(s), profissional e horário.");
      return;
    }

    try {
      await criarAgendamento({
        clienteId,
        funcionarioId: slotSelecionado.funcionario.id,
        servicosIds: servicosSelecionados,
        horarioDisponivelId: slotSelecionado.horario.id,
        horaInicio: slotSelecionado.hora,
      });

      alert("Agendamento realizado com sucesso!");

      setFuncionarioId("");
      setHoraFiltro("");
      setServicosSelecionados([]);
      setDataSelecionada(hoje);
      setSlotSelecionado(null);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      alert("Erro ao criar agendamento.");
    }
  }

  return (
    <div className="pb-28">
      <h1 className="mb-2 text-2xl font-bold text-[#c59d5f] sm:text-3xl">
        Agendar Horário
      </h1>

      <p className="mb-8 text-[#9ca3af]">
        Filtre por serviço, profissional, dia ou horário em qualquer ordem.
      </p>

      <section className="mb-6 rounded-lg border border-[#1f1f23] bg-[#0b0b0c]/80 p-4 text-white backdrop-blur-xl sm:p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#c59d5f]">Dia</span>
            <input
              id="agendar-data"
              name="data"
              type="date"
              min={hoje}
              value={dataSelecionada}
              onChange={(event) => {
                setDataSelecionada(event.target.value);
                setSlotSelecionado(null);
              }}
              className="rounded-lg border border-[#1f1f23] bg-[#121214]/80 px-4 py-3 text-white"
            />
          </label>

          <div>
            <Dropdown
              label="Profissional"
              value={funcionarioId}
              onChange={(value) => {
                setFuncionarioId(String(value));
                setSlotSelecionado(null);
              }}
              options={[
                { label: "Todos os profissionais", value: "" },
                ...funcionariosAtivos.map((funcionario) => ({
                  label: funcionario.nome,
                  value: funcionario.id,
                })),
              ]}
            />
          </div>

          <div>
            <Dropdown
              label="Horário"
              value={horaFiltro}
              onChange={(value) => {
                setHoraFiltro(String(value));
                setSlotSelecionado(null);
              }}
              options={[
                { label: "Todos os horários", value: "" },
                ...horariosFiltro.map((hora) => ({
                  label: hora,
                  value: hora,
                })),
              ]}
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-[#c59d5f]">Serviços</p>

          {servicos.length === 0 ? (
            <p className="text-sm text-[#9ca3af]">
              Nenhum serviço disponível para agendamento.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {servicos.map((servico) => {
                const indisponivelParaFuncionario =
                  Boolean(funcionarioId) &&
                  !funcionariosAtivos
                    .find((funcionario) => funcionario.id === Number(funcionarioId))
                    ?.servicos?.some(
                      (servicoFuncionario) =>
                        servicoFuncionario.id === servico.id &&
                        servicoFuncionario.ativo !== false
                    );

                return (
                  <button
                    key={servico.id}
                    type="button"
                    disabled={indisponivelParaFuncionario}
                    onClick={() => alternarServico(servico.id)}
                    className={`rounded-lg border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      servicosSelecionados.includes(servico.id)
                        ? "border-[#c59d5f] bg-[#c59d5f] text-black"
                        : "border-[#1f1f23] bg-[#121214]/80 text-white hover:border-[#c59d5f]"
                    }`}
                  >
                    <p className="font-bold">{servico.nome}</p>
                    <p className="mt-1 text-sm opacity-80">
                      R$ {Number(servico.preco ?? 0).toFixed(2).replace(".", ",")} •{" "}
                      {servico.duracao ?? `${servico.duracaoMinutos ?? 0} min`}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-[#1f1f23] bg-[#0b0b0c]/80 p-4 text-white backdrop-blur-xl sm:p-5">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Horários disponíveis
            </h2>
            <p className="mt-1 text-sm text-[#9ca3af]">
              {servicosSelecionados.length > 0
                ? `${duracaoTotal} min de atendimento selecionado`
                : "Selecione serviço(s) para confirmar; os horários abaixo usam blocos de 30 min como filtro inicial."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFuncionarioId("");
              setHoraFiltro("");
              setServicosSelecionados([]);
              setSlotSelecionado(null);
            }}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-[#c59d5f]"
          >
            Limpar filtros
          </button>
        </div>

        {loadingHorarios && (
          <p className="text-[#9ca3af]">Carregando horários...</p>
        )}

        {!loadingHorarios && slotsDisponiveis.length === 0 && (
          <p className="text-[#9ca3af]">
            Nenhuma disponibilidade encontrada para os filtros selecionados.
          </p>
        )}

        {!loadingHorarios && slotsDisponiveis.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {slotsDisponiveis.map((slot) => {
              const selecionado =
                slotSelecionado?.funcionario.id === slot.funcionario.id &&
                slotSelecionado?.horario.id === slot.horario.id &&
                slotSelecionado?.hora === slot.hora;

              return (
                <button
                  key={`${slot.funcionario.id}-${slot.horario.id}-${slot.hora}`}
                  type="button"
                  onClick={() => {
                    setSlotSelecionado(slot);
                    setFuncionarioId(String(slot.funcionario.id));
                    setHoraFiltro(slot.hora);
                  }}
                  className={`rounded-lg border p-4 text-left transition ${
                    selecionado
                      ? "border-[#c59d5f] bg-[#c59d5f] text-black"
                      : "border-[#1f1f23] bg-[#121214]/80 text-white hover:border-[#c59d5f]"
                  }`}
                >
                  <p className="text-lg font-bold">{slot.hora}</p>
                  <p className="mt-1 font-semibold">{slot.funcionario.nome}</p>
                  <p className="mt-2 text-sm opacity-80">
                    Janela das {extrairHora(slot.horario.inicio)} às{" "}
                    {extrairHora(slot.horario.fim)}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {slotSelecionado && (
        <div className="flex flex-col gap-4 rounded-lg border border-[#1f1f23] bg-black/90 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-[#9ca3af]">Resumo</p>
            <p className="font-semibold text-white">
              {slotSelecionado.funcionario.nome} • {slotSelecionado.hora} •{" "}
              {servicosEscolhidos.length || 0} serviço(s)
              {duracaoTotal > 0 ? ` • ${duracaoTotal} min` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={confirmarAgendamento}
            disabled={servicosSelecionados.length === 0}
            className="rounded-lg bg-[#c59d5f] px-6 py-4 font-bold text-black hover:bg-[#d6ae70] disabled:cursor-not-allowed disabled:opacity-50"
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
  if (duracaoMinutos <= 0) return [];

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
