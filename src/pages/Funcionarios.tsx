import { useEffect, useState } from "react";
import { listarFuncionarios } from "../services/funcionarioService";

type Funcionario = {
  id: number;
  nome: string;
  email: string;
  especialidade: string;
};

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  async function carregarFuncionarios() {
    try {
      const data = await listarFuncionarios();
      console.log("Funcionários recebidos:", data);
      setFuncionarios(data);
    } catch (error) {
      console.error("Erro ao buscar funcionários", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="text-white">Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#c59d5f] mb-6">
        Funcionários
      </h1>

      {funcionarios.length === 0 && (
        <p className="text-zinc-200">Nenhum funcionário encontrado</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funcionarios.map((funcionario) => (
          <div
            key={funcionario.id}
            className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-white shadow-lg"
          >
            <p className="text-xl font-semibold text-[#c59d5f]">
              {funcionario.nome}
            </p>

            <p className="text-zinc-300 mt-2">
              <strong>Email:</strong> {funcionario.email}
            </p>

            <p className="text-zinc-300">
              <strong>Especialidade:</strong> {funcionario.especialidade}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Funcionarios;