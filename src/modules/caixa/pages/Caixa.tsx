import { useEffect, useMemo, useState } from "react";
import {
  abrirCaixa,
  fecharAtendimentoCaixa,
  fecharCaixa,
  getCaixa,
  listarAtendimentosCaixa,
  registrarMovimentacaoCaixa,
  type CaixaMovimentacaoRequest,
} from "../services/caixaService";
import { listarEstoque } from "../../estoque/services/estoqueService";
import Dropdown from "../../../shared/components/Dropdown";
import Loading from "../../../shared/components/Loading";

type Movimentacao = {
  id: number;
  tipo: string;
  formaPagamento?: string;
  valor: number;
  descricao: string;
  agendamentoId?: number;
  operador?: string;
  desconto?: number;
  lucroBruto?: number;
};

type CaixaResumo = {
  data: string;
  entradas: number;
  saidas: number;
  saldo: number;
  saldoInicial: number;
  status: "ABERTO" | "FECHADO";
  operadorAbertura?: string;
  operadorFechamento?: string;
  entradasPorForma: Record<string, number>;
  movimentacoes: Movimentacao[];
};

type Atendimento = {
  id: number;
  cliente: string;
  funcionario: string;
  data: string;
  horaInicio: string;
  valorTotal: number;
};

type Produto = {
  id: number;
  nome: string;
  precoVenda: number;
  quantidade: number;
};

const hoje = new Date().toISOString().split("T")[0];
const formas = [
  { label: "Dinheiro", value: "DINHEIRO" },
  { label: "Pix", value: "PIX" },
  { label: "Cartão débito", value: "CARTAO_DEBITO" },
  { label: "Cartão crédito", value: "CARTAO_CREDITO" },
  { label: "Outro", value: "OUTRO" },
];

function Caixa() {
  const [data, setData] = useState(hoje);
  const [resumo, setResumo] = useState<CaixaResumo | null>(null);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [saldoInicial, setSaldoInicial] = useState("");
  const [mov, setMov] = useState({
    tipo: "SAIDA" as CaixaMovimentacaoRequest["tipo"],
    formaPagamento: "PIX",
    valor: "",
    descricao: "",
  });
  const [venda, setVenda] = useState({
    agendamentoId: "",
    formaPagamento: "PIX",
    desconto: "",
    observacao: "",
    produtoId: "",
    produtoQtd: "1",
  });
  const operadorUsuarioId = Number(localStorage.getItem("usuarioId")) || undefined;
  const [produtosVenda, setProdutosVenda] = useState<Array<{ produtoId: number; quantidade: number }>>([]);

  async function carregar() {
    setCarregando(true);
    try {
      const [caixa, listaAtendimentos, listaProdutos] = await Promise.all([
        getCaixa(data),
        listarAtendimentosCaixa(),
        listarEstoque(),
      ]);
      setResumo(caixa);
      setAtendimentos(Array.isArray(listaAtendimentos) ? listaAtendimentos : []);
      setProdutos(Array.isArray(listaProdutos) ? listaProdutos : []);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [data]);

  const atendimentoSelecionado = atendimentos.find((a) => a.id === Number(venda.agendamentoId));
  const totalProdutos = useMemo(
    () =>
      produtosVenda.reduce((total, item) => {
        const produto = produtos.find((p) => p.id === item.produtoId);
        return total + Number(produto?.precoVenda ?? 0) * item.quantidade;
      }, 0),
    [produtos, produtosVenda]
  );
  const totalVenda = Math.max(
    0,
    Number(atendimentoSelecionado?.valorTotal ?? 0) + totalProdutos - Number(venda.desconto || 0)
  );
  const caixaAberto = resumo?.status === "ABERTO";

  async function abrir() {
    await abrirCaixa(data, Number(saldoInicial || 0), operadorUsuarioId);
    await carregar();
  }

  async function fechar() {
    if (!confirm("Fechar o caixa deste dia?")) return;
    await fecharCaixa(data, operadorUsuarioId);
    await carregar();
  }

  async function registrarMovimentacao(event: React.FormEvent) {
    event.preventDefault();
    if (!mov.valor || !mov.descricao) {
      alert("Informe valor e descrição.");
      return;
    }
    await registrarMovimentacaoCaixa({
      tipo: mov.tipo,
      formaPagamento: mov.tipo === "ENTRADA" || mov.tipo === "SUPRIMENTO" ? mov.formaPagamento as CaixaMovimentacaoRequest["formaPagamento"] : undefined,
      valor: Number(mov.valor),
      descricao: mov.descricao,
      data,
      operadorUsuarioId,
    });
    setMov({ tipo: "SAIDA", formaPagamento: "PIX", valor: "", descricao: "" });
    await carregar();
  }

  function adicionarProduto() {
    if (!venda.produtoId) return;
    setProdutosVenda((itens) => [
      ...itens,
      { produtoId: Number(venda.produtoId), quantidade: Number(venda.produtoQtd || 1) },
    ]);
    setVenda({ ...venda, produtoId: "", produtoQtd: "1" });
  }

  function removerProduto(index: number) {
    setProdutosVenda((itens) => itens.filter((_, i) => i !== index));
  }

  async function fecharAtendimento() {
    if (!venda.agendamentoId) {
      alert("Selecione um atendimento/agendamento.");
      return;
    }
    await fecharAtendimentoCaixa({
      agendamentoId: Number(venda.agendamentoId),
      formaPagamento: venda.formaPagamento as "DINHEIRO" | "PIX" | "CARTAO_DEBITO" | "CARTAO_CREDITO" | "OUTRO",
      desconto: Number(venda.desconto || 0),
      observacao: venda.observacao,
      data,
      operadorUsuarioId,
      produtos: produtosVenda,
    });
    setVenda({ agendamentoId: "", formaPagamento: "PIX", desconto: "", observacao: "", produtoId: "", produtoQtd: "1" });
    setProdutosVenda([]);
    await carregar();
  }

  return (
    <div>
      <div className="mb-6 grid gap-4 md:flex md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#c59d5f]">Caixa do dia</h1>
        </div>
        <label className="grid gap-2 text-sm text-[#9ca3af] md:min-w-52">
          Data do caixa
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="min-h-11 rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3 text-white" />
        </label>
      </div>

      {carregando ? (
        <Loading label="Atualizando caixa..." />
      ) : (
        <>
          <section className="grid gap-4">
            <h2 className="text-lg font-bold text-[#c59d5f]">1. Status do caixa</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <ResumoCard label="Status" valor={resumo?.status ?? "FECHADO"} />
              <ResumoCard label="Saldo" valor={formatarMoeda(resumo?.saldo ?? 0)} />
              <ResumoCard label="Entradas" valor={formatarMoeda(resumo?.entradas ?? 0)} />
              <ResumoCard label="Saídas" valor={formatarMoeda(resumo?.saidas ?? 0)} />
            </div>
          </section>

          <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <ResumoCard label="Aberto por" valor={resumo?.operadorAbertura ?? "Sem operador"} />
            <ResumoCard label="Fechado por" valor={resumo?.operadorFechamento ?? "Em aberto"} />
            <ResumoCard label="Saldo inicial" valor={formatarMoeda(resumo?.saldoInicial ?? 0)} />
          </section>
        </>
      )}

      <section className="mt-6 rounded-lg border border-[#1f1f23] bg-[#121214] p-4 text-white sm:p-5">
        <h2 className="mb-4 text-lg font-bold text-[#c59d5f]">2. Abrir/fechar</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
          <input value={saldoInicial} onChange={(e) => setSaldoInicial(e.target.value)} type="number" step="0.01" placeholder="Saldo inicial" className="min-h-11 rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3" />
          <button onClick={abrir} disabled={caixaAberto} className="min-h-11 rounded-lg bg-emerald-500 px-5 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50">Abrir caixa</button>
          <button onClick={fechar} disabled={!caixaAberto} className="min-h-11 rounded-lg bg-red-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Fechar caixa</button>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-[#1f1f23] bg-[#121214] p-4 text-white sm:p-5">
        <div className="mb-4 flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#c59d5f]">3. Registrar venda</h2>
          {!caixaAberto && (
            <p className="text-sm text-red-200">Abra o caixa para fechar atendimento ou registrar venda.</p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Dropdown value={venda.agendamentoId} onChange={(value) => setVenda({ ...venda, agendamentoId: String(value) })} options={[
            { label: "Selecione cliente/agendamento", value: "" },
            ...atendimentos.map((a) => ({ label: `#${a.id} - ${a.cliente} - ${formatarMoeda(a.valorTotal)}`, value: a.id })),
          ]} searchable searchPlaceholder="Pesquisar cliente" disabled={!caixaAberto} />
          <Dropdown value={venda.formaPagamento} onChange={(value) => setVenda({ ...venda, formaPagamento: String(value) })} options={formas} disabled={!caixaAberto} />
          <input value={venda.desconto} onChange={(e) => setVenda({ ...venda, desconto: e.target.value })} type="number" step="0.01" placeholder="Desconto" disabled={!caixaAberto} className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_8rem_auto]">
          <Dropdown value={venda.produtoId} onChange={(value) => setVenda({ ...venda, produtoId: String(value) })} options={[
            { label: "Produto opcional", value: "" },
            ...produtos.filter((p) => p.quantidade > 0).map((p) => ({ label: `${p.nome} - ${formatarMoeda(p.precoVenda)} (${p.quantidade})`, value: p.id })),
          ]} searchable searchPlaceholder="Pesquisar produto" disabled={!caixaAberto} />
          <input value={venda.produtoQtd} onChange={(e) => setVenda({ ...venda, produtoQtd: e.target.value })} type="number" min="1" disabled={!caixaAberto} className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50" />
          <button onClick={adicionarProduto} disabled={!caixaAberto || !venda.produtoId} className="min-h-11 rounded-lg border border-[#c59d5f]/50 px-5 py-3 font-bold text-[#c59d5f] disabled:cursor-not-allowed disabled:opacity-50">Adicionar</button>
        </div>

        {produtosVenda.length > 0 && (
          <div className="mt-3 grid gap-2 text-sm text-[#d1d5db]">
            {produtosVenda.map((item, index) => (
              <div key={`${item.produtoId}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2">
                <span>{produtos.find((p) => p.id === item.produtoId)?.nome} x{item.quantidade}</span>
                <button type="button" onClick={() => removerProduto(index)} className="min-h-11 rounded-lg px-3 font-bold text-red-200">Remover</button>
              </div>
            ))}
          </div>
        )}

        <textarea value={venda.observacao} onChange={(e) => setVenda({ ...venda, observacao: e.target.value })} placeholder="Observação" disabled={!caixaAberto} className="mt-4 w-full rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50" />

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <strong>Total: {formatarMoeda(totalVenda)}</strong>
          <button onClick={fecharAtendimento} disabled={!caixaAberto} className="min-h-11 w-full rounded-lg bg-[#c59d5f] px-6 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50 md:w-auto">Fechar venda</button>
        </div>
      </section>

      <form onSubmit={registrarMovimentacao} className="mt-6 rounded-lg border border-[#1f1f23] bg-[#121214] p-4 text-white sm:p-5">
        <h2 className="mb-4 text-xl font-bold text-[#c59d5f]">4. Movimentação manual</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Dropdown value={mov.tipo} disabled={!caixaAberto} onChange={(value) => setMov({ ...mov, tipo: value as CaixaMovimentacaoRequest["tipo"] })} options={[
            { label: "Entrada", value: "ENTRADA" },
            { label: "Saída", value: "SAIDA" },
            { label: "Suprimento", value: "SUPRIMENTO" },
            { label: "Sangria", value: "SANGRIA" },
          ]} />
          <Dropdown value={mov.formaPagamento} disabled={!caixaAberto || mov.tipo === "SAIDA" || mov.tipo === "SANGRIA"} onChange={(value) => setMov({ ...mov, formaPagamento: String(value) })} options={formas} />
          <input value={mov.valor} onChange={(e) => setMov({ ...mov, valor: e.target.value })} type="number" step="0.01" placeholder="Valor" disabled={!caixaAberto} className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50" />
          <input value={mov.descricao} onChange={(e) => setMov({ ...mov, descricao: e.target.value })} placeholder="Descrição/observação" disabled={!caixaAberto} className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50" />
        </div>
        <button disabled={!caixaAberto} className="mt-4 min-h-11 w-full rounded-lg bg-[#c59d5f] px-5 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">Registrar</button>
      </form>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_2fr]">
        <article className="rounded-lg border border-[#1f1f23] bg-[#121214] p-4 text-white">
          <h2 className="mb-3 text-lg font-bold text-[#c59d5f]">Total por forma</h2>
          {Object.entries(resumo?.entradasPorForma ?? {}).map(([forma, valor]) => (
            <p key={forma} className="flex justify-between border-b border-white/10 py-2 text-sm">
              <span>{forma}</span><strong>{formatarMoeda(valor)}</strong>
            </p>
          ))}
        </article>
        <article className="rounded-lg border border-[#1f1f23] bg-[#121214] p-4 text-white">
          <h2 className="mb-3 text-lg font-bold text-[#c59d5f]">Histórico do dia</h2>
          <div className="grid gap-2">
            {(resumo?.movimentacoes ?? []).map((m) => (
              <div key={m.id} className="rounded-lg border border-white/10 p-3">
                <div className="flex justify-between gap-3">
                  <span>{m.descricao}</span>
                  <strong>{formatarMoeda(m.valor)}</strong>
                </div>
                <p className="mt-1 text-xs text-[#9ca3af]">
                  {m.tipo} {m.formaPagamento ? `• ${m.formaPagamento}` : ""} {m.operador ? `• Operador: ${m.operador}` : ""}
                </p>
                {(Number(m.desconto ?? 0) > 0 || Number(m.lucroBruto ?? 0) !== 0) && (
                  <p className="mt-1 text-xs text-[#9ca3af]">
                    Desconto: {formatarMoeda(m.desconto ?? 0)} • Lucro bruto: {formatarMoeda(m.lucroBruto ?? 0)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function ResumoCard({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-lg border border-[#1f1f23] bg-[#121214] p-4 text-white sm:p-5">
      <p className="text-sm text-[#9ca3af]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#c59d5f]">{valor}</p>
    </div>
  );
}

function formatarMoeda(valor: number) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default Caixa;
