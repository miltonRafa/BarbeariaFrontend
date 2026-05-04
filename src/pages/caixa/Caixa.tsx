import { useEffect, useState } from "react";
import {
  getCaixa,
  registrarMovimentacaoCaixa,
  type CaixaMovimentacaoRequest,
} from "../../services/caixaService";

type Movimentacao = {
  id: number;
  tipo: "ENTRADA" | "SAIDA";
  formaPagamento?: string;
  valor: number;
  descricao: string;
  criadoEm: string;
  agendamentoId?: number;
};

type CaixaResumo = {
  data: string;
  entradas: number;
  saidas: number;
  saldo: number;
  entradasPorForma: Record<string, number>;
  movimentacoes: Movimentacao[];
};

const hoje = new Date().toISOString().split("T")[0];

function Caixa() {
  const [data, setData] = useState(hoje);
  const [resumo, setResumo] = useState<CaixaResumo | null>(null);
  const [form, setForm] = useState({
    tipo: "ENTRADA" as CaixaMovimentacaoRequest["tipo"],
    formaPagamento: "PIX" as NonNullable<CaixaMovimentacaoRequest["formaPagamento"]>,
    valor: "",
    descricao: "",
    agendamentoId: "",
  });

  async function carregarCaixa() {
    const resposta = await getCaixa(data);
    setResumo(resposta);
  }

  useEffect(() => {
    carregarCaixa();
  }, [data]);

  async function registrar(event: React.FormEvent) {
    event.preventDefault();

    if (!form.valor || !form.descricao.trim()) {
      alert("Informe valor e descrição.");
      return;
    }

    await registrarMovimentacaoCaixa({
      tipo: form.tipo,
      formaPagamento: form.tipo === "ENTRADA" ? form.formaPagamento : undefined,
      valor: Number(form.valor),
      descricao: form.descricao.trim(),
      data,
      agendamentoId: form.agendamentoId ? Number(form.agendamentoId) : undefined,
    });

    setForm({
      tipo: "ENTRADA",
      formaPagamento: "PIX",
      valor: "",
      descricao: "",
      agendamentoId: "",
    });

    await carregarCaixa();
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#c59d5f]">
            Caixa do dia
          </h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Registre entradas, saídas e pagamentos vinculados a agendamentos.
          </p>
        </div>

        <input
          id="caixa-data"
          name="data"
          type="date"
          value={data}
          onChange={(event) => setData(event.target.value)}
          className="w-full rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3 text-white md:w-auto"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ResumoCard label="Saldo atual" valor={resumo?.saldo} color="text-green-400" />
        <ResumoCard label="Entradas" valor={resumo?.entradas} color="text-blue-400" />
        <ResumoCard label="Saídas" valor={resumo?.saidas} color="text-red-400" />
      </div>

      <form
        onSubmit={registrar}
        className="mt-8 rounded-lg border border-[#1f1f23] bg-[#121214] p-4 sm:p-5"
      >
        <h3 className="mb-4 text-xl font-bold text-[#c59d5f]">
          Registrar movimentação
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <select
            id="caixa-tipo"
            name="tipo"
            value={form.tipo}
            onChange={(event) =>
              setForm({ ...form, tipo: event.target.value as CaixaMovimentacaoRequest["tipo"] })
            }
            className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3"
          >
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>

          <select
            id="caixa-forma-pagamento"
            name="formaPagamento"
            value={form.formaPagamento}
            disabled={form.tipo === "SAIDA"}
            onChange={(event) =>
              setForm({
                ...form,
                formaPagamento: event.target.value as NonNullable<CaixaMovimentacaoRequest["formaPagamento"]>,
              })
            }
            className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3 disabled:opacity-50"
          >
            <option value="DINHEIRO">Dinheiro</option>
            <option value="PIX">Pix</option>
            <option value="CARTAO_DEBITO">Cartão débito</option>
            <option value="CARTAO_CREDITO">Cartão crédito</option>
            <option value="OUTRO">Outro</option>
          </select>

          <input
            id="caixa-valor"
            name="valor"
            value={form.valor}
            onChange={(event) => setForm({ ...form, valor: event.target.value })}
            type="number"
            step="0.01"
            min="0"
            placeholder="Valor"
            className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3"
          />

          <input
            id="caixa-descricao"
            name="descricao"
            value={form.descricao}
            onChange={(event) => setForm({ ...form, descricao: event.target.value })}
            placeholder="Descrição"
            className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3"
          />

          <input
            id="caixa-agendamento"
            name="agendamentoId"
            value={form.agendamentoId}
            onChange={(event) => setForm({ ...form, agendamentoId: event.target.value })}
            type="number"
            min="1"
            placeholder="Agendamento"
            className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3"
          />
        </div>

        <button className="mt-5 rounded-lg bg-[#c59d5f] px-6 py-3 font-bold text-black hover:bg-[#d6ae70]">
          Registrar
        </button>
      </form>

      <section className="mt-8">
        <h3 className="mb-4 text-xl font-bold text-[#c59d5f]">
          Movimentações
        </h3>

        {!resumo || resumo.movimentacoes.length === 0 ? (
          <p className="text-[#9ca3af]">Nenhuma movimentação nesta data.</p>
        ) : (
          <div className="grid gap-3">
            {resumo.movimentacoes.map((movimentacao) => (
              <article
                key={movimentacao.id}
                className="rounded-lg border border-[#1f1f23] bg-[#121214] p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-bold text-white">{movimentacao.descricao}</p>
                    <p className="text-sm text-[#9ca3af]">
                      {movimentacao.tipo} {movimentacao.formaPagamento ? `• ${movimentacao.formaPagamento}` : ""}
                      {movimentacao.agendamentoId ? ` • Agendamento #${movimentacao.agendamentoId}` : ""}
                    </p>
                  </div>
                  <strong className={movimentacao.tipo === "ENTRADA" ? "text-green-400" : "text-red-400"}>
                    {movimentacao.tipo === "ENTRADA" ? "+" : "-"} {formatarMoeda(movimentacao.valor)}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ResumoCard({ label, valor, color }: { label: string; valor?: number; color: string }) {
  return (
    <div className="rounded-lg border border-[#1f1f23] bg-[#121214] p-4 sm:p-5">
      <p className="text-sm text-[#9ca3af]">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{formatarMoeda(valor ?? 0)}</p>
    </div>
  );
}

function formatarMoeda(valor: number) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default Caixa;
