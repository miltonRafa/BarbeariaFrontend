import { useEffect, useMemo, useState, type ReactNode } from "react";
import dashboardArt from "../../../assets/ChatGPT Image 30 de abr. de 2026, 11_56_12.png";
import Dropdown from "../../../shared/components/Dropdown";
import { getDashboard } from "../services/dashboardService";
import { gerarRelatorioFinanceiro } from "../../financeiro/services/financeiroService";

type Agendamento = {
  id: number;
  cliente: string;
  funcionario: string;
  data: string;
  horaInicio: string;
  valorTotal: number;
};

const periodos = [
  { label: "Dia atual x dia anterior", value: "DIA" },
  { label: "Semana atual x semana anterior", value: "SEMANA" },
  { label: "Mês atual x mês anterior", value: "MES" },
  { label: "Ano atual x ano anterior", value: "ANO" },
];

function Dashboard() {
  const [periodo, setPeriodo] = useState("DIA");
  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    getDashboard(periodo).then(setDados).catch(console.error);
  }, [periodo]);

  async function gerarRelatorio() {
    const hoje = new Date().toISOString().split("T")[0];
    await gerarRelatorioFinanceiro(hoje.slice(0, 8) + "01", hoje);
    alert("Relatório gerado e enviado para a tela Relatórios.");
  }

  const barras = Object.entries(dados?.faturamentoUltimos7Dias ?? {}) as Array<[string, number]>;
  const maiorBarra = useMemo(
    () => Math.max(1, ...barras.map(([, valor]) => Number(valor))),
    [barras],
  );
  const lucroPrejuizo = Object.entries(dados?.lucroPrejuizoUltimos7Dias ?? {}) as Array<[string, number]>;
  const maiorLucroAbsoluto = useMemo(
    () => Math.max(1, ...lucroPrejuizo.map(([, valor]) => Math.abs(Number(valor)))),
    [lucroPrejuizo],
  );

  return (
    <section className="relative -mx-4 -my-5 min-h-screen overflow-hidden px-4 py-5 sm:-mx-6 sm:px-6 md:-my-8 md:py-8 lg:-mx-14 lg:-my-10 lg:px-14 lg:py-10">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-[center_right] opacity-45" style={{ backgroundImage: `url("${dashboardArt}")` }} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.9)_42%,rgba(0,0,0,0.58)_100%)]" />

      <div className="relative z-10 grid w-full gap-6">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Dashboard</h1>
            <p className="mt-2 text-sm text-zinc-300 sm:text-base">
              Bem-vindo de volta! Aqui está o resumo do seu negócio.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[18rem_auto]">
            <Dropdown
              value={periodo}
              onChange={(value) => setPeriodo(String(value))}
              options={periodos}
            />
            <button onClick={gerarRelatorio} className="rounded-lg bg-[#c59d5f] px-5 py-3 font-bold text-black">
              Gerar relatório
            </button>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon="◇" label="Agendamentos hoje" value={String(dados?.agendamentosHoje ?? 0)} detail={dados?.rotuloPeriodoAtual ?? "Hoje"} />
          <Metric icon="$" label="Faturamento" value={formatarMoeda(dados?.faturamentoPeriodo ?? 0)} detail={`${formatarVariacao(dados?.variacaoFaturamentoPeriodo)} em relação ao anterior`} />
          <Metric icon="✂" label="Serviços realizados" value={String(dados?.servicosRealizadosHoje ?? 0)} detail="Concluídos hoje" />
          <Metric icon="+" label="Novos clientes" value={String(dados?.novosClientesHoje ?? 0)} detail="Cadastrados hoje" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon="−" label="Despesas do período" value={formatarMoeda(dados?.despesasPeriodo ?? 0)} detail={dados?.rotuloPeriodoAtual ?? "Período atual"} />
          <Metric icon="↗" label="Lucro/Prejuízo" value={formatarMoeda(dados?.lucroPrejuizoPeriodo ?? 0)} detail="Receitas menos despesas" />
          <Metric icon="!" label="A pagar pendente" value={formatarMoeda(dados?.contasPagarPendentesPeriodo ?? 0)} detail={`${dados?.pagamentosPendentesPeriodo ?? 0} pagamento(s) pendente(s)`} />
          <Metric icon="✓" label="A receber pendente" value={formatarMoeda(dados?.contasReceberPendentesPeriodo ?? 0)} detail={`${dados?.pagamentosConcluidosPeriodo ?? 0} pagamento(s) concluído(s)`} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon="%" label="Total de comissões" value={formatarMoeda(dados?.totalComissoesPeriodo ?? 0)} detail="No período selecionado" />
          <Metric icon="♙" label="Custo com funcionários" value={formatarMoeda(dados?.custoFuncionariosPeriodo ?? 0)} detail="Salários + comissões" />
          <Metric icon="★" label="Mais rentável" value={dados?.funcionarioMaisRentavel?.nome ?? "-"} detail={formatarMoeda(dados?.funcionarioMaisRentavel?.rentabilidade ?? 0)} />
          <Metric icon="$" label="Maior faturamento" value={dados?.funcionarioMaiorFaturamento?.nome ?? "-"} detail={formatarMoeda(dados?.funcionarioMaiorFaturamento?.faturamentoGerado ?? 0)} />
        </div>

        <DashboardPanel title="Comparação com período anterior">
          <div className="grid gap-4 md:grid-cols-3">
            <CompareCard label="Faturamento anterior" value={formatarMoeda(dados?.faturamentoPeriodoAnterior ?? 0)} detail={dados?.rotuloPeriodoAnterior ?? "Anterior"} />
            <CompareCard label="Despesas anteriores" value={formatarMoeda(dados?.despesasPeriodoAnterior ?? 0)} detail={dados?.rotuloPeriodoAnterior ?? "Anterior"} />
            <CompareCard label="Lucro/Prejuízo anterior" value={formatarMoeda(dados?.lucroPrejuizoPeriodoAnterior ?? 0)} detail={dados?.rotuloPeriodoAnterior ?? "Anterior"} />
          </div>
        </DashboardPanel>

        <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
          <DashboardPanel title="Faturamento (últimos 7 dias)">
            <BarChart data={barras} max={maiorBarra} />
          </DashboardPanel>

          <DashboardPanel title="Próximos agendamentos">
            <div className="grid gap-1">
              {(dados?.proximosAgendamentos ?? []).slice(0, 4).map((agendamento: Agendamento) => (
                <div key={agendamento.id} className="grid grid-cols-[4rem_1fr_auto] items-center gap-4 border-b border-white/10 py-3">
                  <span className="font-semibold text-[#c59d5f]">{agendamento.horaInicio?.substring(0, 5)}</span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{agendamento.cliente}</p>
                    <p className="truncate text-sm text-zinc-400">{agendamento.funcionario} • {agendamento.data}</p>
                  </div>
                  <span className="text-[#c59d5f]">▣</span>
                </div>
              ))}
            </div>
          </DashboardPanel>
        </div>

        <DashboardPanel title="Lucro/Prejuízo (últimos 7 dias)">
          <ProfitChart data={lucroPrejuizo} max={maiorLucroAbsoluto} />
        </DashboardPanel>

        <div className="grid gap-5 xl:grid-cols-2">
          <Ranking title="Serviços mais realizados" data={dados?.servicosMaisRealizados ?? {}} />
          <FuncionariosRanking data={dados?.rankingFuncionarios ?? []} />
        </div>
      </div>
    </section>
  );
}

function FuncionariosRanking({ data }: { data: any[] }) {
  return (
    <DashboardPanel title="Top funcionários">
      <div className="grid gap-3">
        {data.length === 0 ? (
          <p className="text-sm text-zinc-400">Sem dados no período selecionado.</p>
        ) : data.map((funcionario, index) => (
          <div key={funcionario.funcionarioId} className="rounded-lg border border-white/10 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-semibold text-white"><strong className="mr-3 text-[#c59d5f]">{index + 1}</strong>{funcionario.nome}</span>
              <span className="text-sm text-[#c59d5f]">{formatarMoeda(funcionario.rentabilidade)}</span>
            </div>
            <div className="grid gap-2 text-xs text-zinc-300 sm:grid-cols-4">
              <span>Atend.: {funcionario.atendimentos}</span>
              <span>Fat.: {formatarMoeda(funcionario.faturamentoGerado)}</span>
              <span>Com.: {formatarMoeda(funcionario.comissao)}</span>
              <span>Rent.: {formatarMoeda(funcionario.rentabilidade)}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

function Metric({ icon, label, value, detail }: { icon: string; label: string; value: string; detail: string }) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="grid grid-cols-[3rem_1fr] gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg text-3xl font-bold text-[#c59d5f]">
          {icon}
        </div>
        <div>
          <p className="text-sm text-zinc-300">{label}</p>
          <strong className="mt-2 block text-2xl text-white">{value}</strong>
          <p className="mt-3 text-xs text-emerald-400">{detail}</p>
        </div>
      </div>
    </article>
  );
}

function DashboardPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <h2 className="mb-5 text-lg font-bold text-white">{title}</h2>
      {children}
    </article>
  );
}

function CompareCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm text-zinc-300">{label}</p>
      <strong className="mt-2 block text-xl text-[#c59d5f]">{value}</strong>
      <p className="mt-2 text-xs text-zinc-400">{detail}</p>
    </div>
  );
}

function Ranking({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data).slice(0, 5);
  const max = Math.max(1, ...entries.map(([, value]) => Number(value)));

  return (
    <DashboardPanel title={title}>
      <div className="grid gap-4">
        {entries.length === 0 ? (
          <p className="text-sm text-zinc-400">Sem dados no período selecionado.</p>
        ) : entries.map(([label, value], index) => (
          <div key={label} className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-white">
                <strong className="mr-3 text-[#c59d5f]">{index + 1}</strong>
                {label}
              </span>
              <span className="shrink-0 text-zinc-300">{formatarMoeda(value)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#c59d5f]" style={{ width: `${(Number(value) / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

function BarChart({ data, max }: { data: Array<[string, number]>; max: number }) {
  return (
    <div className="grid h-72 grid-cols-[4rem_1fr] gap-4">
      <div className="flex flex-col justify-between text-xs text-zinc-300">
        <span>{formatarMoedaCompacta(max)}</span>
        <span>{formatarMoedaCompacta(max / 2)}</span>
        <span>R$ 0</span>
      </div>
      <div className="flex items-end gap-3 border-b border-l border-white/10 px-3 pt-4">
        {data.map(([label, valor]) => (
          <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-56 w-full items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-[#a97725] to-[#e6bd66] shadow-[0_0_18px_rgba(197,157,95,0.22)]"
                style={{ height: `${Math.max(4, (Number(valor) / max) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-zinc-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfitChart({ data, max }: { data: Array<[string, number]>; max: number }) {
  return (
    <div className="grid h-80 grid-cols-[5rem_1fr] gap-4">
      <div className="grid grid-rows-[1fr_auto_1fr] text-xs text-zinc-300">
        <span>{formatarMoedaCompacta(max)}</span>
        <span>R$ 0</span>
        <span className="self-end">-{formatarMoedaCompacta(max).replace("R$", "R$ ")}</span>
      </div>
      <div className="relative flex gap-3 border-l border-white/10 px-3">
        <div className="absolute left-3 right-0 top-1/2 h-px bg-white/20" />
        {data.map(([label, valor]) => {
          const numero = Number(valor);
          const altura = Math.max(4, (Math.abs(numero) / max) * 48);

          return (
            <div key={label} className="relative flex min-w-0 flex-1 flex-col items-center">
              <div className="relative h-64 w-full">
                <div
                  className={`absolute left-0 w-full rounded ${numero >= 0 ? "bottom-1/2 bg-emerald-500" : "top-1/2 bg-red-500"}`}
                  style={{ height: `${altura}%` }}
                  title={`${label}: ${formatarMoeda(numero)}`}
                />
              </div>
              <span className="mt-2 text-xs text-zinc-300">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatarMoeda(valor: number) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarMoedaCompacta(valor: number) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatarVariacao(valor: number) {
  const numero = Number(valor ?? 0);
  const prefixo = numero > 0 ? "↑ " : numero < 0 ? "↓ " : "";
  return `${prefixo}${Math.abs(numero).toFixed(2)}%`;
}

export default Dashboard;
