import { useEffect, useState } from "react";
import { criarServico, listarServicos } from "../../../services/servicoService";

type Servico = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
  ativo: boolean;
};

function ServicosDashboard() {
  const [servicos, setServicos] = useState<Servico[]>([]);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState("");

  async function carregarServicos() {
        const data = await listarServicos();
        setServicos(Array.isArray(data) ? data : []);
    }

  useEffect(() => {
    async function carregarServicos() {
        const data = await listarServicos();
        setServicos(Array.isArray(data) ? data : []);
    }
    carregarServicos();
  }, []);

  async function salvarServico(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !preco || !duracaoMinutos) {
      alert("Preencha nome, preço e duração.");
      return;
    }

    await criarServico({
      nome,
      descricao,
      preco: Number(preco),
      duracaoMinutos: Number(duracaoMinutos),
      ativo: true,
    });

    alert("Serviço criado com sucesso!");

    setNome("");
    setDescricao("");
    setPreco("");
    setDuracaoMinutos("");

    carregarServicos();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#c59d5f] mb-6">
        Serviços
      </h1>

      <form
        onSubmit={salvarServico}
        className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-2xl p-5 mb-8"
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Cadastrar serviço
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do serviço"
            className="px-4 py-3 rounded-xl bg-[#121214] text-white border border-[#1f1f23]"
          />

          <input
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Preço"
            type="number"
            step="0.01"
            className="px-4 py-3 rounded-xl bg-[#121214] text-white border border-[#1f1f23]"
          />

          <input
            value={duracaoMinutos}
            onChange={(e) => setDuracaoMinutos(e.target.value)}
            placeholder="Duração em minutos"
            type="number"
            className="px-4 py-3 rounded-xl bg-[#121214] text-white border border-[#1f1f23]"
          />

          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            className="px-4 py-3 rounded-xl bg-[#121214] text-white border border-[#1f1f23]"
          />
        </div>

        <button
          type="submit"
          className="mt-5 bg-[#c59d5f] hover:bg-[#d6ae70] text-black font-bold px-6 py-3 rounded-xl"
        >
          Salvar serviço
        </button>
      </form>

      <h2 className="text-xl font-semibold text-white mb-3">
        Serviços cadastrados
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {servicos.map((servico) => (
          <div
            key={servico.id}
            className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-2xl p-5 text-white"
          >
            <p className="text-lg font-semibold">{servico.nome}</p>
            <p className="text-sm opacity-80">{servico.descricao}</p>
            <p className="text-sm opacity-80">R$ {servico.preco}</p>
            <p className="text-sm opacity-80">
              {servico.duracaoMinutos} min
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicosDashboard;