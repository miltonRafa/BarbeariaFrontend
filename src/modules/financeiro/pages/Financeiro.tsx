import { useEffect, useState } from "react";
import Button from "../../../shared/components/Button";
import EmptyState from "../../../shared/components/EmptyState";
import Input from "../../../shared/components/Input";
import ListItem from "../../../shared/components/ListItem";
import Loading from "../../../shared/components/Loading";
import Section from "../../../shared/components/Section";
import Dropdown from "../../../shared/components/Dropdown";
import {
  atualizarContaFinanceira,
  criarContaFinanceira,
  excluirContaFinanceira,
  gerarRelatorioFinanceiro,
  getFinanceiro,
} from "../services/financeiroService";
import { getResumoFinanceiroFuncionarios } from "../../funcionario/services/funcionarioService";

type Conta = {
  id: number;
  tipo: "PAGAR" | "RECEBER";
  status: "PENDENTE" | "CONCLUIDO";
  descricao: string;
  valor: number;
  vencimento: string;
  pagamento?: string;
};

const hoje = new Date().toISOString().split("T")[0];
const inicioMes = hoje.slice(0, 8) + "01";

function Financeiro() {
  const [inicio, setInicio] = useState(inicioMes);
  const [fim, setFim] = useState(hoje);
  const [resumo, setResumo] = useState<any>(null);
  const [resumoFuncionarios, setResumoFuncionarios] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState({
    tipo: "PAGAR",
    status: "PENDENTE",
    descricao: "",
    valor: "",
    vencimento: hoje,
  });

  async function carregar() {
    setCarregando(true);
    try {
      const [financeiro, funcionarios] = await Promise.all([
        getFinanceiro(inicio, fim),
        getResumoFinanceiroFuncionarios(inicio, fim),
      ]);
      setResumo(financeiro);
      setResumoFuncionarios(funcionarios);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [inicio, fim]);

  async function salvar(event: React.FormEvent) {
    event.preventDefault();
    if (!form.descricao || !form.valor || !form.vencimento) {
      alert("Preencha descrição, valor e vencimento.");
      return;
    }

    await criarContaFinanceira({
      tipo: form.tipo as "PAGAR" | "RECEBER",
      status: form.status as "PENDENTE" | "CONCLUIDO",
      descricao: form.descricao,
      valor: Number(form.valor),
      vencimento: form.vencimento,
      pagamento: form.status === "CONCLUIDO" ? hoje : undefined,
    });

    setForm({ tipo: "PAGAR", status: "PENDENTE", descricao: "", valor: "", vencimento: hoje });
    await carregar();
  }

  async function gerarRelatorio() {
    await gerarRelatorioFinanceiro(inicio, fim);
    alert("Relatório financeiro gerado e enviado para a tela Relatórios.");
  }

  const contas: Conta[] = resumo?.contas ?? [];
  const contasPagar = contas.filter((conta) => conta.tipo === "PAGAR");
  const contasReceber = contas.filter((conta) => conta.tipo === "RECEBER");

  return (
    <div>
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#c59d5f] sm:text-3xl">
            Financeiro
          </h1>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Visão administrativa para dono/admin: contas a pagar, contas a receber e controle de pendências.
          </p>
        </div>
      </div>

      <Section title="Filtros financeiros">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input label="Data inicial" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          <Input label="Data final" type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
          <div className="md:self-end">
            <Button onClick={gerarRelatorio}>Gerar relatório</Button>
          </div>
        </div>
      </Section>

      {carregando ? (
        <div className="mt-6">
          <Loading label="Atualizando financeiro..." />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <CardResumo label="Faturamento" value={formatarMoeda(resumo?.faturamento ?? 0)} />
          <CardResumo label="Despesas" value={formatarMoeda(resumo?.despesas ?? 0)} />
          <CardResumo label="Lucro" value={formatarMoeda(resumo?.lucroPrejuizo ?? 0)} destaque={(resumo?.lucroPrejuizo ?? 0) >= 0} />
        </div>
      )}

      <Section title="Registrar conta" className="mt-8">
        <form onSubmit={salvar} className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Dropdown value={form.tipo} onChange={(v) => setForm({ ...form, tipo: String(v) })} options={[{ label: "Conta a pagar", value: "PAGAR" }, { label: "Conta a receber", value: "RECEBER" }]} />
          <Dropdown value={form.status} onChange={(v) => setForm({ ...form, status: String(v) })} options={[{ label: "Pendente", value: "PENDENTE" }, { label: "Concluído", value: "CONCLUIDO" }]} />
          <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição" />
          <Input value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} type="number" step="0.01" placeholder="Valor" />
          <Input value={form.vencimento} onChange={(e) => setForm({ ...form, vencimento: e.target.value })} type="date" />
          </div>
          <Button type="submit">Salvar conta</Button>
        </form>
      </Section>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <ContaLista
          title="Contas a pagar"
          contas={contasPagar}
          onToggleStatus={async (conta) => { await alternarStatusConta(conta); }}
          onDelete={async (id) => { await excluirContaFinanceira(id); await carregar(); }}
        />
        <ContaLista
          title="Contas a receber"
          contas={contasReceber}
          onToggleStatus={async (conta) => { await alternarStatusConta(conta); }}
          onDelete={async (id) => { await excluirContaFinanceira(id); await carregar(); }}
        />
      </div>

      <Section title="Folha e comissões" className="mt-8">
        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <CardResumo label="Salários fixos" value={formatarMoeda(resumoFuncionarios?.totalSalariosFixos ?? 0)} />
          <CardResumo label="Comissões" value={formatarMoeda(resumoFuncionarios?.totalComissoes ?? 0)} />
          <CardResumo label="Total a pagar" value={formatarMoeda(resumoFuncionarios?.totalAPagarFuncionarios ?? 0)} />
          <CardResumo label="Custo total" value={formatarMoeda(resumoFuncionarios?.custoTotalFuncionarios ?? 0)} />
        </div>
        <div className="grid gap-3 lg:hidden">
          {(resumoFuncionarios?.funcionarios ?? []).length === 0 ? (
            <EmptyState title="Sem dados de funcionários" description="O período selecionado ainda não possui atendimentos financeiros." />
          ) : (
            (resumoFuncionarios?.funcionarios ?? []).map((funcionario: any) => (
              <ListItem
                key={funcionario.funcionarioId}
                title={funcionario.nome}
                subtitle={funcionario.tipoRemuneracao}
                meta={formatarMoeda(funcionario.totalAPagar)}
              >
                <div className="grid gap-2">
                  <p><strong>Faturamento:</strong> {formatarMoeda(funcionario.faturamentoGerado)}</p>
                  <p><strong>Salário:</strong> {formatarMoeda(funcionario.salarioFixo)}</p>
                  <p><strong>Comissão:</strong> {formatarMoeda(funcionario.comissao)}</p>
                  <p><strong>Rentabilidade:</strong> {formatarMoeda(funcionario.rentabilidade)}</p>
                </div>
              </ListItem>
            ))
          )}
        </div>
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-[#9ca3af]">
              <tr>
                <th className="py-2">Funcionário</th>
                <th>Tipo</th>
                <th>Faturamento</th>
                <th>Salário</th>
                <th>Comissão</th>
                <th>Total a pagar</th>
                <th>Rentabilidade</th>
              </tr>
            </thead>
            <tbody>
              {(resumoFuncionarios?.funcionarios ?? []).map((funcionario: any) => (
                <tr key={funcionario.funcionarioId} className="border-t border-white/10">
                  <td className="py-3 font-semibold text-white">{funcionario.nome}</td>
                  <td>{funcionario.tipoRemuneracao}</td>
                  <td>{formatarMoeda(funcionario.faturamentoGerado)}</td>
                  <td>{formatarMoeda(funcionario.salarioFixo)}</td>
                  <td>{formatarMoeda(funcionario.comissao)}</td>
                  <td>{formatarMoeda(funcionario.totalAPagar)}</td>
                  <td className="text-[#c59d5f]">{formatarMoeda(funcionario.rentabilidade)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <ResumoLista title="Resumo por funcionário" data={resumo?.porFuncionario ?? {}} />
        <ResumoLista title="Resumo por serviço" data={resumo?.porServico ?? {}} />
        <ResumoLista title="Resumo por forma de pagamento" data={resumo?.porFormaPagamento ?? {}} />
      </div>
    </div>
  );

  async function alternarStatusConta(conta: Conta) {
    const concluindo = conta.status === "PENDENTE";
    await atualizarContaFinanceira(conta.id, {
      tipo: conta.tipo,
      status: concluindo ? "CONCLUIDO" : "PENDENTE",
      descricao: conta.descricao,
      valor: conta.valor,
      vencimento: conta.vencimento,
      pagamento: concluindo ? hoje : undefined,
    });
    await carregar();
  }
}

function CardResumo({ label, value, destaque = true }: { label: string; value: string; destaque?: boolean }) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/30 p-4">
      <p className="text-sm text-[#9ca3af]">{label}</p>
      <strong className={`mt-2 block text-lg ${destaque ? "text-[#c59d5f]" : "text-red-200"}`}>{value}</strong>
    </article>
  );
}

function ContaLista({
  title,
  contas,
  onToggleStatus,
  onDelete,
}: {
  title: string;
  contas: Conta[];
  onToggleStatus: (conta: Conta) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  return (
    <section className="rounded-lg border border-[#1f1f23] bg-[#121214] p-4 text-white sm:p-5">
      <h2 className="mb-4 text-xl font-bold text-[#c59d5f]">{title}</h2>
      <div className="grid gap-3">
        {contas.length === 0 ? (
          <p className="text-sm text-[#9ca3af]">Nenhum registro no período.</p>
        ) : (
          contas.map((conta) => (
            <article key={conta.id} className="rounded-lg border border-white/10 p-4">
              <div className="grid gap-4 md:flex md:items-center md:justify-between">
                <div>
                  <p className="font-bold">{conta.descricao}</p>
                  <p className="text-sm text-[#9ca3af]">{conta.status} • vence {conta.vencimento}</p>
                </div>
                <div className="grid gap-2 sm:flex sm:items-center sm:gap-3">
                  <strong>{formatarMoeda(conta.valor)}</strong>
                  <button onClick={() => onToggleStatus(conta)} className="min-h-11 rounded-lg border border-[#c59d5f]/50 px-3 py-2 text-sm font-bold text-[#c59d5f]">
                    {conta.status === "PENDENTE" ? "Concluir" : "Reabrir"}
                  </button>
                  <button onClick={() => onDelete(conta.id)} className="min-h-11 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-bold text-red-200">Excluir</button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function ResumoLista({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data);

  return (
    <section className="rounded-lg border border-[#1f1f23] bg-[#121214] p-4 text-white sm:p-5">
      <h2 className="mb-4 text-xl font-bold text-[#c59d5f]">{title}</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-[#9ca3af]">Sem dados no período.</p>
      ) : (
        <div className="grid gap-2">
          {entries.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 border-b border-white/10 py-2 text-sm">
              <span className="min-w-0 truncate">{label}</span>
              <strong>{formatarMoeda(value)}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function formatarMoeda(valor: number) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default Financeiro;
