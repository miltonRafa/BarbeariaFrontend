import dashboardArt from "../../assets/ChatGPT Image 30 de abr. de 2026, 11_56_12.png";

type MetricCard = {
  icon: string;
  label: string;
  value: string;
  trend: string;
};

type Appointment = {
  time: string;
  client: string;
  service: string;
};

type RankingItem = {
  name: string;
  detail: string;
  value: number;
};

const metrics: MetricCard[] = [
  {
    icon: "♙",
    label: "Agendamentos hoje",
    value: "12",
    trend: "+20% em relação a ontem",
  },
  {
    icon: "$",
    label: "Faturamento hoje",
    value: "R$ 1.250,00",
    trend: "+15% em relação a ontem",
  },
  {
    icon: "✂",
    label: "Serviços realizados",
    value: "18",
    trend: "+10% em relação a ontem",
  },
  {
    icon: "＋",
    label: "Novos clientes",
    value: "5",
    trend: "+25% em relação a ontem",
  },
];

const revenueBars = [
  { day: "16/05", value: 46 },
  { day: "17/05", value: 68 },
  { day: "18/05", value: 44 },
  { day: "19/05", value: 61 },
  { day: "20/05", value: 68 },
  { day: "21/05", value: 92 },
  { day: "22/05", value: 67 },
];

const appointments: Appointment[] = [
  { time: "09:00", client: "João Silva", service: "Corte masculino" },
  { time: "10:30", client: "Carlos Souza", service: "Barba" },
  { time: "14:00", client: "Lucas Almeida", service: "Corte + barba" },
  { time: "15:30", client: "Pedro Santos", service: "Corte masculino" },
];

const topClients: RankingItem[] = [
  { name: "João Silva", detail: "8 visitas no mês", value: 92 },
  { name: "Carlos Souza", detail: "R$ 720 em consumo", value: 78 },
  { name: "Pedro Santos", detail: "6 serviços feitos", value: 66 },
];

const topServices: RankingItem[] = [
  { name: "Corte masculino", detail: "45 atendimentos", value: 90 },
  { name: "Barba", detail: "32 atendimentos", value: 64 },
  { name: "Corte + barba", detail: "28 atendimentos", value: 56 },
];

const insights = [
  { period: "Dia", text: "Horário mais forte: 14h às 16h" },
  { period: "Semana", text: "Sexta concentra 31% do faturamento" },
  { period: "Mês", text: "Clientes recorrentes geraram R$ 8.420" },
  { period: "Ano", text: "Ticket médio subiu 18% desde janeiro" },
];

function Dashboard() {
  return (
    <section className="relative -mx-4 -my-5 min-h-screen overflow-hidden px-4 py-5 sm:-mx-6 sm:px-6 md:-my-8 md:py-8 lg:-mx-14 lg:-my-10 lg:px-14 lg:py-10">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-35 mix-blend-screen"
        style={{ backgroundImage: `url("${dashboardArt}")` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_12%,rgba(197,157,95,0.14),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.9)_45%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-300 sm:text-base">
              Bem-vindo de volta. Aqui está o resumo visual do movimento da barbearia.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Dia", "Semana", "Mês", "Ano"].map((period) => (
              <button
                key={period}
                type="button"
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                  period === "Dia"
                    ? "border-[#c59d5f] bg-[#c59d5f] text-black"
                    : "border-white/10 bg-black/35 text-zinc-300 hover:border-[#c59d5f]/70 hover:text-[#c59d5f]"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-lg border border-white/10 bg-black/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#c59d5f]/35 bg-[#c59d5f]/10 text-2xl font-bold text-[#c59d5f]">
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm text-zinc-300">{metric.label}</p>
                  <strong className="mt-2 block text-3xl text-white">
                    {metric.value}
                  </strong>
                  <span className="mt-3 block text-xs font-semibold text-emerald-400">
                    ↑ {metric.trend}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
          <article className="rounded-lg border border-white/10 bg-black/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white">
                Faturamento
                <span className="font-medium text-zinc-300"> últimos 7 dias</span>
              </h2>
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-[#c59d5f]">
                R$ 8.940
              </span>
            </div>

            <div className="grid min-h-72 grid-cols-[3rem_1fr] gap-3">
              <div className="flex flex-col justify-between pb-8 text-xs text-zinc-400">
                <span>R$ 2k</span>
                <span>R$ 1.5k</span>
                <span>R$ 1k</span>
                <span>R$ 500</span>
                <span>R$ 0</span>
              </div>
              <div className="relative flex items-end gap-3 border-l border-b border-white/10 px-2 pb-8 sm:gap-6">
                <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
                <div className="absolute inset-x-0 top-1/4 h-px bg-white/10" />
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                <div className="absolute inset-x-0 top-3/4 h-px bg-white/10" />

                {revenueBars.map((bar) => (
                  <div key={bar.day} className="relative z-10 flex flex-1 flex-col items-center gap-3">
                    <div
                      className="w-full max-w-10 rounded-t bg-gradient-to-b from-[#f1c86e] to-[#9c7229] shadow-[0_0_24px_rgba(197,157,95,0.22)]"
                      style={{ height: `${bar.value}%` }}
                    />
                    <span className="absolute -bottom-7 text-xs text-zinc-300">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-white/10 bg-black/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
            <h2 className="mb-5 text-xl font-bold text-white">
              Próximos agendamentos
            </h2>

            <div className="divide-y divide-white/10">
              {appointments.map((appointment) => (
                <div
                  key={`${appointment.time}-${appointment.client}`}
                  className="grid grid-cols-[4rem_1fr_2rem] items-center gap-3 py-4"
                >
                  <span className="font-semibold text-[#c59d5f]">
                    {appointment.time}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{appointment.client}</p>
                    <p className="mt-1 text-sm text-zinc-400">{appointment.service}</p>
                  </div>
                  <span className="text-right text-lg text-[#c59d5f]">▣</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <RankingCard title="Top clientes" items={topClients} />
          <RankingCard title="Serviços mais realizados" items={topServices} />

          <article className="rounded-lg border border-white/10 bg-black/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
            <h2 className="mb-5 text-xl font-bold text-white">
              Insights por período
            </h2>

            <div className="grid gap-3">
              {insights.map((insight) => (
                <div
                  key={insight.period}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <strong className="text-[#c59d5f]">{insight.period}</strong>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-sm leading-6 text-zinc-300">{insight.text}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function RankingCard({ title, items }: { title: string; items: RankingItem[] }) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
      <h2 className="mb-5 text-xl font-bold text-white">{title}</h2>

      <div className="grid gap-5">
        {items.map((item, index) => (
          <div key={item.name}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-lg font-bold text-[#c59d5f]">{index + 1}</span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{item.name}</p>
                  <p className="truncate text-sm text-zinc-400">{item.detail}</p>
                </div>
              </div>
              <span className="text-sm text-zinc-300">{item.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#c59d5f] to-[#f0c56a]"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default Dashboard;
