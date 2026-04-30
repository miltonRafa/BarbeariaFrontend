import { useEffect, useState } from "react";
import { listarServicos } from "../../services/servicoService";
import { atribuirServicosAoFuncionario } from "../../services/funcionarioService";

type Servico = {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  duracaoMinutos: number;
  ativo: boolean;
};

function MeusServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarServicos() {
      try {
        const data = await listarServicos();
        setServicos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar serviços", error);
        alert("Erro ao carregar serviços.");
      } finally {
        setLoading(false);
      }
    }

    carregarServicos();
  }, []);

  function alternarServico(servicoId: number) {
    setServicosSelecionados((atual) => {
      if (atual.includes(servicoId)) {
        return atual.filter((id) => id !== servicoId);
      }

      return [...atual, servicoId];
    });
  }

  async function salvarServicos() {
    const funcionarioId = Number(localStorage.getItem("funcionarioId"));

    if (!funcionarioId) {
      alert("Funcionário não identificado. Faça login novamente.");
      return;
    }

    if (servicosSelecionados.length === 0) {
      alert("Selecione pelo menos um serviço.");
      return;
    }

    try {
      await atribuirServicosAoFuncionario(funcionarioId, servicosSelecionados);
      alert("Serviços atribuídos com sucesso!");
    } catch (error) {
      console.error("Erro ao atribuir serviços", error);
      alert("Erro ao atribuir serviços.");
    }
  }

  if (loading) {
    return <p className="text-white">Carregando serviços...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#c59d5f] mb-6">
        Meus Serviços
      </h1>

      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-white mb-6">
        <p className="text-zinc-300">
          Selecione os serviços que você realiza na barbearia.
        </p>
      </div>

      {servicos.length === 0 && (
        <p className="text-zinc-300">
          Nenhum serviço cadastrado pela empresa.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {servicos.map((servico) => {
          const selecionado = servicosSelecionados.includes(servico.id);

          return (
            <button
              key={servico.id}
              onClick={() => alternarServico(servico.id)}
              className={`text-left rounded-2xl p-5 border transition ${
                selecionado
                  ? "bg-[#c59d5f] text-black border-[#c59d5f]"
                  : "bg-slate-950/80 text-white border-slate-800 hover:border-[#c59d5f]"
              }`}
            >
              <p className="text-xl font-semibold mb-2">{servico.nome}</p>

              {servico.descricao && (
                <p className="text-sm opacity-80 mb-2">{servico.descricao}</p>
              )}

              <p className="text-sm">
                <strong>Preço:</strong> R$ {servico.preco}
              </p>

              <p className="text-sm">
                <strong>Duração:</strong> {servico.duracaoMinutos} min
              </p>

              <p className="text-sm mt-3 font-semibold">
                {selecionado ? "Selecionado" : "Clique para selecionar"}
              </p>
            </button>
          );
        })}
      </div>

      <button
        onClick={salvarServicos}
        className="bg-[#c59d5f] hover:bg-[#d6ae70] text-black font-bold px-6 py-3 rounded-xl"
      >
        Salvar meus serviços
      </button>
    </div>
  );
}

export default MeusServicos;