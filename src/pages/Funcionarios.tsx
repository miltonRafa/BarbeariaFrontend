import { useEffect, useState } from "react";
import {
  atualizarFuncionario,
  criarFuncionario,
  excluirFuncionario,
  listarFuncionarios,
} from "../services/funcionarioService";

type Perfil = "ADMIN" | "FUNCIONARIO" | "CAIXA";

type Funcionario = {
  id: number;
  nome: string;
  email: string;
  perfil?: Perfil;
  ativo?: boolean;
  servicosConcluidos?: number;
  valorServicosConcluidos?: number;
};

const vazio = {
  nome: "",
  email: "",
  senha: "123456",
  perfil: "FUNCIONARIO" as Perfil,
};

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState<Funcionario | null>(null);

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

    if (editando) {
      await atualizarFuncionario(editando.id, { ...form, ativo: editando.ativo });
    } else {
      await criarFuncionario({ ...form, ativo: true });
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
    });
  }

  async function excluir(id: number) {
    if (!confirm("Desativar este usuário/funcionário?")) return;
    await excluirFuncionario(id);
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
          <select id="funcionario-perfil" name="perfil" value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value as Perfil })} className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3">
            <option value="FUNCIONARIO">FUNCIONARIO</option>
            <option value="ADMIN">ADMIN</option>
            <option value="CAIXA">CAIXA</option>
          </select>
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
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#1f1f23] pt-4">
              <button onClick={() => editar(funcionario)} className="rounded-lg border border-[#c59d5f]/50 px-3 py-2 text-sm font-semibold text-[#c59d5f]">Editar</button>
              <button onClick={() => excluir(funcionario.id)} className="rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-200">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Funcionarios;
