import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  atribuirServicosAoFuncionario,
  desativarServicoDoFuncionario,
  listarServicosDoFuncionario,
} from "../../services/funcionarioService";
import { listarServicos } from "../../services/servicoService";

type Servico = {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  duracaoMinutos: number;
  ativo: boolean;
};

type AgendaContext = {
  funcionarioId?: number | null;
};

function MeusServicos() {
  const agendaContext = useOutletContext<AgendaContext | null>();
  const funcionarioContextId = agendaContext?.funcionarioId;
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [meusServicos, setMeusServicos] = useState<Servico[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarServicos = useCallback(async () => {
    try {
      const funcionarioId =
        funcionarioContextId ||
        Number(localStorage.getItem("funcionarioAgendaId")) ||
        Number(localStorage.getItem("funcionarioId"));

      if (!funcionarioId) {
        setServicos([]);
        setMeusServicos([]);
        setServicosSelecionados([]);
        return;
      }

      const todosServicos = await listarServicos();
      setServicos(
        Array.isArray(todosServicos)
          ? todosServicos.filter((servico: Servico) => servico.ativo)
          : []
      );

      const servicosDoFuncionario =
        await listarServicosDoFuncionario(funcionarioId);

      setMeusServicos(
        Array.isArray(servicosDoFuncionario) ? servicosDoFuncionario : []
      );

      setServicosSelecionados(
        Array.isArray(servicosDoFuncionario)
          ? servicosDoFuncionario.map((servico: Servico) => servico.id)
          : []
      );
    } catch (error) {
      console.error("Erro ao carregar serviços", error);
      alert("Erro ao carregar serviços.");
    } finally {
      setLoading(false);
    }
  }, [funcionarioContextId]);

  useEffect(() => {
    // Carregamento inicial mantido isolado para preservar o fluxo existente da pagina.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarServicos();
  }, [carregarServicos]);

  function alternarServico(servicoId: number) {
    setServicosSelecionados((atual) => {
      if (atual.includes(servicoId)) {
        return atual.filter((id) => id !== servicoId);
      }

      return [...atual, servicoId];
    });
  }

  async function salvarServicos() {
    const funcionarioId =
      funcionarioContextId ||
      Number(localStorage.getItem("funcionarioAgendaId")) ||
      Number(localStorage.getItem("funcionarioId"));

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

      const servicosAtualizados =
        await listarServicosDoFuncionario(funcionarioId);

      setMeusServicos(
        Array.isArray(servicosAtualizados) ? servicosAtualizados : []
      );

      setServicosSelecionados(
        Array.isArray(servicosAtualizados)
          ? servicosAtualizados.map((servico: Servico) => servico.id)
          : []
      );

      alert("Serviços atribuídos com sucesso!");
    } catch (error) {
      console.error("Erro ao atribuir serviços", error);
      alert("Erro ao atribuir serviços.");
    }
  }

  async function desativarMeuServico(servicoId: number) {
    const funcionarioId =
      funcionarioContextId ||
      Number(localStorage.getItem("funcionarioAgendaId")) ||
      Number(localStorage.getItem("funcionarioId"));
    await desativarServicoDoFuncionario(funcionarioId, servicoId);
    await carregarServicos();
  }

  if (loading) {
    return <p className="text-white">Carregando serviços...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#c59d5f] mb-6">
        Meus Serviços
      </h1>

      <div className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-lg p-4 sm:p-5 text-white mb-6">
        <p className="text-[#9ca3af]">
          Selecione os serviços que você realiza na barbearia.
        </p>
      </div>

      {servicos.length === 0 && (
        <p className="text-[#9ca3af] mb-6">
          Nenhum serviço cadastrado pela empresa.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {servicos.map((servico) => {
          const selecionado = servicosSelecionados.includes(servico.id);

          return (
            <button
              key={servico.id}
              onClick={() => alternarServico(servico.id)}
              className={`text-left rounded-lg p-4 sm:p-5 border transition ${
                selecionado
                  ? "bg-[#c59d5f] text-black border-[#c59d5f]"
                  : "bg-[#0b0b0c]/80 text-white border-[#1f1f23] hover:border-[#c59d5f]"
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
        className="bg-[#c59d5f] hover:bg-[#d6ae70] text-black font-bold px-6 py-3 rounded-lg mb-10"
      >
        Salvar meus serviços
      </button>

      <h2 className="text-2xl font-bold text-[#c59d5f] mb-4">
        Meus serviços atribuídos
      </h2>

      {meusServicos.length === 0 && (
        <p className="text-[#9ca3af] mb-6">
          Nenhum serviço atribuído ainda.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {meusServicos.map((servico) => (
          <div
            key={servico.id}
            className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-lg p-4 sm:p-5 text-white"
          >
            <p className="text-xl font-semibold text-[#c59d5f] mb-2">
              {servico.nome}
            </p>

            {servico.descricao && (
              <p className="text-sm text-[#9ca3af] mb-2">
                {servico.descricao}
              </p>
            )}

            <p className="text-sm">
              <strong>Preço:</strong> R$ {servico.preco}
            </p>

            <p className="text-sm">
              <strong>Duração:</strong> {servico.duracaoMinutos} min
            </p>
            <button
              type="button"
              onClick={() => desativarMeuServico(servico.id)}
              className="mt-4 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10"
            >
              Desativar para mim
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MeusServicos;
