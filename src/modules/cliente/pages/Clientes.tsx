import { useEffect, useState } from "react";
import {
  ativarCliente,
  atualizarCliente,
  criarCliente,
  desativarCliente,
  listarClientes,
} from "../services/clienteService";

type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
  cancelamentos?: number;
  taxaCancelamento?: number;
  valorGasto?: number;
};

const vazio = { nome: "", email: "", telefone: "", senha: "123456" };

function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [erro, setErro] = useState("");

  async function carregarClientes() {
    try {
      setLoading(true);
      const data = await listarClientes();
      setClientes(Array.isArray(data) ? data : []);
      setErro("");
    } catch (error) {
      console.error("Erro ao buscar clientes", error);
      setClientes([]);
      setErro("Não foi possível carregar os clientes. Verifique a conexão com a API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function salvar(event: React.FormEvent) {
    event.preventDefault();
    if (!form.nome || !form.email || !form.telefone) {
      alert("Preencha nome, email e telefone.");
      return;
    }

    if (editando) {
      await atualizarCliente(editando.id, { ...form, ativo: editando.ativo });
    } else {
      await criarCliente({ ...form, ativo: true });
    }

    setForm(vazio);
    setEditando(null);
    await carregarClientes();
  }

  function editar(cliente: Cliente) {
    setEditando(cliente);
    setForm({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      senha: "",
    });
  }

  async function desativar(id: number) {
    await desativarCliente(id);
    await carregarClientes();
  }

  async function ativar(id: number) {
    await ativarCliente(id);
    await carregarClientes();
  }

  if (loading) return <p className="text-white text-lg">Carregando...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#c59d5f] sm:text-3xl">
        Clientes
      </h1>

      {erro && (
        <p className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
          {erro}
        </p>
      )}

      <form onSubmit={salvar} className="mb-8 rounded-lg border border-[#1f1f23] bg-[#0b0b0c]/80 p-4 text-white sm:p-5">
        <h2 className="mb-4 text-xl font-semibold text-[#c59d5f]">
          {editando ? "Editar cliente" : "Cadastrar cliente"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input id="cliente-nome" name="nome" autoComplete="name" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
          <input id="cliente-email" name="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
          <input id="cliente-telefone" name="telefone" autoComplete="tel" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="Telefone" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
          <input id="cliente-senha" name="senha" autoComplete="new-password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} placeholder="Senha" type="password" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="rounded-lg bg-[#c59d5f] px-6 py-3 font-bold text-black">
            {editando ? "Salvar edição" : "Criar cliente"}
          </button>
          {editando && (
            <button type="button" onClick={() => { setEditando(null); setForm(vazio); }} className="rounded-lg border border-white/10 px-6 py-3 font-bold text-white">
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      {!erro && clientes.length === 0 && (
        <p className="text-white">
          Nenhum cliente cadastrado ainda.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clientes.map((cliente) => (
          <div key={cliente.id} className="rounded-lg border border-[#1f1f23] bg-[#0b0b0c]/80 p-4 text-white shadow-lg sm:p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <p className="text-xl font-semibold text-[#c59d5f]">{cliente.nome}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${cliente.ativo ? "bg-emerald-500 text-black" : "bg-red-500/20 text-red-200"}`}>
                {cliente.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
            <p className="text-[#9ca3af]"><strong>Email:</strong> {cliente.email}</p>
            <p className="text-[#9ca3af]"><strong>Telefone:</strong> {cliente.telefone}</p>
            <p className="mt-3 text-sm text-[#9ca3af]">Cancelamentos: {cliente.cancelamentos ?? 0} ({Number(cliente.taxaCancelamento ?? 0).toFixed(1)}%)</p>
            <p className="text-sm text-[#9ca3af]">Valor gasto: R$ {Number(cliente.valorGasto ?? 0).toFixed(2).replace(".", ",")}</p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#1f1f23] pt-4">
              <button onClick={() => editar(cliente)} className="rounded-lg border border-[#c59d5f]/50 px-3 py-2 text-sm font-semibold text-[#c59d5f]">Editar</button>
              {cliente.ativo && <button onClick={() => desativar(cliente.id)} className="rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-200">Desativar</button>}
              {!cliente.ativo && <button onClick={() => ativar(cliente.id)} className="rounded-lg border border-emerald-500/40 px-3 py-2 text-sm font-semibold text-emerald-200">Ativar</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clientes;
