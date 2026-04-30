import { useEffect, useState } from "react";
import {
  listarFuncionarios,
  criarFuncionario,
} from "../services/funcionarioService";
import { criarUsuario } from "../services/usuarioService";

type Funcionario = {
  id: number;
  nome: string;
  email: string;
};

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("123456");

  useEffect(() => {
    async function carregar() {
      try {
        const data = await listarFuncionarios();
        setFuncionarios(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar funcionários", error);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  async function recarregarFuncionarios() {
    const data = await listarFuncionarios();
    setFuncionarios(Array.isArray(data) ? data : []);
  }

  async function cadastrarFuncionario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (salvando) return;

    try {
      setSalvando(true);

      if (!nome.trim() || !email.trim() || !senha.trim()) {
        alert("Preencha nome, email e senha.");
        return;
      }

      const usuario = await criarUsuario({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        perfil: "FUNCIONARIO",
        ativo: true,
      });

      await criarFuncionario({
        usuarioId: usuario.id,
      });

      alert("Funcionário cadastrado com sucesso!");

      setNome("");
      setEmail("");
      setSenha("123456");

      await recarregarFuncionarios();
    } catch (error) {
      console.error("Erro ao cadastrar funcionário", error);
      alert("Erro ao cadastrar funcionário. Verifique se o email já existe.");
    } finally {
      setSalvando(false);
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

      <form
        onSubmit={cadastrarFuncionario}
        className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-2xl p-5 mb-8 text-white"
      >
        <h2 className="text-xl font-semibold text-[#c59d5f] mb-4">
          Cadastrar funcionário
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            disabled={salvando}
            className="px-4 py-3 rounded-xl bg-[#121214] border border-[#1f1f23] disabled:opacity-50"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            disabled={salvando}
            className="px-4 py-3 rounded-xl bg-[#121214] border border-[#1f1f23] disabled:opacity-50"
          />

          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            type="password"
            disabled={salvando}
            className="px-4 py-3 rounded-xl bg-[#121214] border border-[#1f1f23] disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={salvando}
          className="mt-5 bg-[#c59d5f] hover:bg-[#d6ae70] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-6 py-3 rounded-xl"
        >
          {salvando ? "Cadastrando..." : "Cadastrar funcionário"}
        </button>
      </form>

      {funcionarios.length === 0 && (
        <p className="text-white">Nenhum funcionário encontrado.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funcionarios.map((funcionario) => (
          <div
            key={funcionario.id}
            className="bg-[#0b0b0c]/80 backdrop-blur-xl border border-[#1f1f23] rounded-2xl p-5 text-white shadow-lg"
          >
            <p className="text-xl font-semibold text-[#c59d5f]">
              {funcionario.nome}
            </p>

            <p className="text-[#9ca3af] mt-2">
              <strong>Email:</strong> {funcionario.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Funcionarios;