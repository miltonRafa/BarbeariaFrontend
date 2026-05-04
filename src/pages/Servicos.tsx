import { useEffect, useState } from "react";
import {
  atualizarServico,
  criarServico,
  desativarServico,
  listarServicos,
} from "../services/servicoService";

type Servico = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
  ativo: boolean;
};

const vazio = {
  nome: "",
  descricao: "",
  preco: "",
  duracaoMinutos: "",
};

function ServicosDashboard() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState<Servico | null>(null);

  async function carregarServicos() {
    const data = await listarServicos();
    setServicos(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    carregarServicos();
  }, []);

  async function salvarServico(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nome || !form.preco || !form.duracaoMinutos) {
      alert("Preencha nome, preço e duração.");
      return;
    }

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      preco: Number(form.preco),
      duracaoMinutos: Number(form.duracaoMinutos),
      ativo: editando?.ativo ?? true,
    };

    if (editando) {
      await atualizarServico(editando.id, payload);
    } else {
      await criarServico(payload);
    }

    setForm(vazio);
    setEditando(null);
    await carregarServicos();
  }

  function preencherEdicao(servico: Servico) {
    setEditando(servico);
    setForm({
      nome: servico.nome,
      descricao: servico.descricao ?? "",
      preco: String(servico.preco),
      duracaoMinutos: String(servico.duracaoMinutos),
    });
  }

  async function desativar(id: number) {
    await desativarServico(id);
    await carregarServicos();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#c59d5f] sm:text-3xl">
        Serviços
      </h1>

      <form
        onSubmit={salvarServico}
        className="mb-8 rounded-lg border border-[#1f1f23] bg-[#0b0b0c]/80 p-4 text-white backdrop-blur-xl sm:p-5"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">
          {editando ? "Editar serviço" : "Cadastrar serviço"}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input id="servico-nome" name="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
          <input id="servico-preco" name="preco" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} placeholder="Preço" type="number" step="0.01" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
          <input id="servico-duracao" name="duracaoMinutos" value={form.duracaoMinutos} onChange={(e) => setForm({ ...form, duracaoMinutos: e.target.value })} placeholder="Duração em minutos" type="number" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
          <input id="servico-descricao" name="descricao" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição" className="rounded-lg border border-[#1f1f23] bg-[#121214] px-4 py-3" />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="rounded-lg bg-[#c59d5f] px-6 py-3 font-bold text-black hover:bg-[#d6ae70]">
            {editando ? "Salvar edição" : "Criar serviço"}
          </button>
          {editando && (
            <button type="button" onClick={() => { setEditando(null); setForm(vazio); }} className="rounded-lg border border-white/10 px-6 py-3 font-bold text-white">
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {servicos.map((servico) => (
          <div key={servico.id} className="rounded-lg border border-[#1f1f23] bg-[#0b0b0c]/80 p-4 text-white backdrop-blur-xl sm:p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <p className="text-lg font-semibold">{servico.nome}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${servico.ativo ? "bg-emerald-500 text-black" : "bg-red-500/20 text-red-200"}`}>
                {servico.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
            <p className="text-sm text-[#9ca3af]">{servico.descricao}</p>
            <p className="mt-3 text-sm">R$ {servico.preco}</p>
            <p className="text-sm">{servico.duracaoMinutos} min</p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#1f1f23] pt-4">
              <button onClick={() => preencherEdicao(servico)} className="rounded-lg border border-[#c59d5f]/50 px-3 py-2 text-sm font-semibold text-[#c59d5f]">
                Editar
              </button>
              {servico.ativo && (
                <button onClick={() => desativar(servico.id)} className="rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-200">
                  Desativar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicosDashboard;
