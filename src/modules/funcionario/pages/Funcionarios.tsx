import { useEffect, useState, type ReactNode } from "react";
import {
  ativarFuncionario,
  atualizarFuncionario,
  criarFuncionario,
  excluirFuncionario,
  getDesempenhoFuncionario,
  listarFuncionarios,
} from "../services/funcionarioService";
import Dropdown from "../../../shared/components/Dropdown";

type Perfil = "ADMIN" | "FUNCIONARIO" | "CAIXA";

type Funcionario = {
  id: number;
  nome: string;
  email: string;
  perfil?: Perfil;
  ativo?: boolean;
  servicosConcluidos?: number;
  valorServicosConcluidos?: number;
  tipoRemuneracao?: "FIXO" | "COMISSIONADO" | "FIXO_COMISSIONADO";
  salarioFixo?: number;
  percentualComissao?: number;
};

const vazio = {
  nome: "",
  email: "",
  senha: "123456",
  perfil: "FUNCIONARIO" as Perfil,
  tipoRemuneracao: "FIXO" as "FIXO" | "COMISSIONADO" | "FIXO_COMISSIONADO",
  salarioFixo: "",
  percentualComissao: "",
};

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [desempenho, setDesempenho] = useState<any>(null);
  const [periodo, setPeriodo] = useState({ inicio: new Date().toISOString().slice(0, 8) + "01", fim: new Date().toISOString().split("T")[0] });

  async function carregar() {
    const data = await listarFuncionarios();
    setFuncionarios(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.nome || !form.email || (!editando && !form.senha)) {
      alert("Preencha nome, email e senha.");
      return;
    }
    if ((form.tipoRemuneracao === "FIXO" || form.tipoRemuneracao === "FIXO_COMISSIONADO") && !form.salarioFixo) {
      alert("Informe o salário fixo.");
      return;
    }
    if ((form.tipoRemuneracao === "COMISSIONADO" || form.tipoRemuneracao === "FIXO_COMISSIONADO") && !form.percentualComissao) {
      alert("Informe o percentual de comissão.");
      return;
    }

    const payload = {
      ...form,
      salarioFixo: Number(form.salarioFixo || 0),
      percentualComissao: Number(form.percentualComissao || 0),
    };

    if (editando) {
      await atualizarFuncionario(editando.id, { ...payload, ativo: editando.ativo });
    } else {
      await criarFuncionario({ ...payload, ativo: true });
    }

    setForm(vazio);
    setEditando(null);
    await carregar();
  }

  function editar(funcionario: Funcionario) {
    setEditando(funcionario);
    setForm({
      nome: funcionario.nome,
      email: funcionario.email,
      senha: "",
      perfil: funcionario.perfil ?? "FUNCIONARIO",
      tipoRemuneracao: funcionario.tipoRemuneracao ?? "FIXO",
      salarioFixo: String(funcionario.salarioFixo ?? 0),
      percentualComissao: String(funcionario.percentualComissao ?? 0),
    });
  }

  async function abrirDesempenho(funcionario: Funcionario) {
    setDesempenho(await getDesempenhoFuncionario(funcionario.id, periodo.inicio, periodo.fim));
  }

  async function excluir(id: number) {
    if (!confirm("Desativar este usuário/funcionário?")) return;
    await excluirFuncionario(id);
    await carregar();
  }

  async function ativar(id: number) {
    await ativarFuncionario(id);
    await carregar();
  }

  if (loading) return <p className="text-white">Carregando...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#c59d5f] sm:text-3xl">
        Funcionários
      </h1>

      <form onSubmit={salvar} className="mb-8 rounded-lg border border-[#1f1f23] bg-[#0b0b0c]/80 p-4 text-white sm:p-5">
        <h2 className="mb-4 text-xl font-semibold text-[#c59d5f]">
          {editando ? "Editar funcionário" : "Cadastrar funcionário"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input id="funcionario-nome" name="nome" autoComplete="name" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
          <input id="funcionario-email" name="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
          <input id="funcionario-senha" name="senha" autoComplete="new-password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} placeholder="Senha" type="password" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
          <Dropdown
            value={form.perfil}
            onChange={(value) => setForm({ ...form, perfil: value as Perfil })}
            options={[
              { label: "FUNCIONARIO", value: "FUNCIONARIO" },
              { label: "ADMIN", value: "ADMIN" },
              { label: "CAIXA", value: "CAIXA" },
            ]}
          />
          <Dropdown
            value={form.tipoRemuneracao}
            onChange={(value) => setForm({ ...form, tipoRemuneracao: value as typeof form.tipoRemuneracao })}
            options={[
              { label: "Fixo", value: "FIXO" },
              { label: "Comissionado", value: "COMISSIONADO" },
              { label: "Fixo + comissão", value: "FIXO_COMISSIONADO" },
            ]}
          />
          <input value={form.salarioFixo} onChange={(e) => setForm({ ...form, salarioFixo: e.target.value })} type="number" step="0.01" placeholder="Salário fixo" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
          <input value={form.percentualComissao} onChange={(e) => setForm({ ...form, percentualComissao: e.target.value })} type="number" step="0.01" placeholder="% comissão" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="rounded-lg bg-[#c59d5f] px-6 py-3 font-bold text-black">
            {editando ? "Salvar edição" : "Cadastrar"}
          </button>
          {editando && <button type="button" onClick={() => { setEditando(null); setForm(vazio); }} className="rounded-lg border border-white/10 px-6 py-3 font-bold">Cancelar edição</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {funcionarios.map((funcionario) => (
          <div key={funcionario.id} className="rounded-lg border border-[#1f1f23] bg-[#0b0b0c]/80 p-4 text-white shadow-lg sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xl font-semibold text-[#c59d5f]">{funcionario.nome}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${funcionario.ativo === false ? "bg-red-500/20 text-red-200" : "bg-emerald-500 text-black"}`}>
                {funcionario.ativo === false ? "Inativo" : "Ativo"}
              </span>
            </div>
            <p className="mt-2 text-[#9ca3af]"><strong>Email:</strong> {funcionario.email}</p>
            <p className="text-[#9ca3af]"><strong>Perfil:</strong> {funcionario.perfil ?? "FUNCIONARIO"}</p>
            <p className="mt-3 text-sm text-[#9ca3af]">Serviços concluídos: {funcionario.servicosConcluidos ?? 0}</p>
            <p className="text-sm text-[#9ca3af]">Valor gerado: R$ {Number(funcionario.valorServicosConcluidos ?? 0).toFixed(2).replace(".", ",")}</p>
            <p className="text-sm text-[#9ca3af]">Remuneração: {funcionario.tipoRemuneracao ?? "FIXO"}</p>
            <p className="text-sm text-[#9ca3af]">Salário: {formatarMoeda(funcionario.salarioFixo ?? 0)} • Comissão: {Number(funcionario.percentualComissao ?? 0).toFixed(2)}%</p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#1f1f23] pt-4">
              <button onClick={() => editar(funcionario)} className="rounded-lg border border-[#c59d5f]/50 px-3 py-2 text-sm font-semibold text-[#c59d5f]">Editar</button>
              <button onClick={() => abrirDesempenho(funcionario)} className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white">Desempenho</button>
              {funcionario.ativo === false ? (
                <button onClick={() => ativar(funcionario.id)} className="rounded-lg border border-emerald-500/40 px-3 py-2 text-sm font-semibold text-emerald-200">Ativar</button>
              ) : (
                <button onClick={() => excluir(funcionario.id)} className="rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-200">Desativar</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {desempenho && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4">
          <section className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg border border-[#1f1f23] bg-[#121214] p-5 text-white">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#c59d5f]">{desempenho.nome}</h2>
                <p className="text-sm text-[#9ca3af]">Serviços: {(desempenho.servicos ?? []).join(", ") || "Nenhum serviço vinculado"}</p>
              </div>
              <button onClick={() => setDesempenho(null)} className="rounded-lg border border-white/10 px-3 py-2">Fechar</button>
            </div>
            <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input type="date" value={periodo.inicio} onChange={(e) => setPeriodo({ ...periodo, inicio: e.target.value })} className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3" />
              <input type="date" value={periodo.fim} onChange={(e) => setPeriodo({ ...periodo, fim: e.target.value })} className="rounded-lg border border-[#1f1f23] bg-black/40 px-4 py-3" />
              <button onClick={() => getDesempenhoFuncionario(desempenho.funcionarioId, periodo.inicio, periodo.fim).then(setDesempenho)} className="rounded-lg bg-[#c59d5f] px-4 py-3 font-bold text-black">Filtrar</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Tipo de remuneração" value={desempenho.tipoRemuneracao} />
              <Info label="Atendimentos" value={desempenho.atendimentos} />
              <Info label="Faturamento" value={formatarMoeda(desempenho.faturamentoGerado)} />
              <Info label="Comissão" value={formatarMoeda(desempenho.comissao)} />
              <Info label="Total a pagar" value={formatarMoeda(desempenho.totalAPagar)} />
              <Info label="Rentabilidade" value={formatarMoeda(desempenho.rentabilidade)} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return <div className="rounded-lg border border-white/10 p-4"><p className="text-sm text-[#9ca3af]">{label}</p><strong className="mt-1 block text-[#c59d5f]">{value}</strong></div>;
}

function formatarMoeda(valor: number) {
  return Number(valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default Funcionarios;
