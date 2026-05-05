import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { solicitarCadastroCliente } from "../services/authService";
import "./Login.css";

function CadastroClientePage() {
  const navigate = useNavigate();
  const { slugPublico } = useParams();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  if (!slugPublico) {
    return <Navigate to="/login" replace />;
  }

  const slugEmpresa = slugPublico;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await solicitarCadastroCliente({
        nome,
        email,
        telefone,
        senha,
        confirmarSenha,
        slugPublicoEmpresa: slugEmpresa,
      });

      navigate("/confirmar-email", { state: { email, slugPublico: slugEmpresa } });
    } catch (error) {
      setErro("Não foi possível iniciar o cadastro. Confira os dados informados.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">
      <main className="login-page__main login-page__main--center">
        <section className="login-page__login-panel">
          <div className="login-page__panel-header">
            <p className="login-page__panel-title">Criar conta de cliente</p>
            <span className="login-page__panel-subtitle">
              Informe seus dados para criar sua conta nesta empresa.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="login-page__form">
            <label className="login-page__label" htmlFor="cadastro-nome">Nome</label>
            <input id="cadastro-nome" className="login-page__input" value={nome} onChange={(e) => setNome(e.target.value)} />

            <label className="login-page__label" htmlFor="cadastro-email">Email</label>
            <input id="cadastro-email" className="login-page__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label className="login-page__label" htmlFor="cadastro-telefone">Telefone</label>
            <input id="cadastro-telefone" className="login-page__input" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

            <label className="login-page__label" htmlFor="cadastro-senha">Senha</label>
            <input id="cadastro-senha" className="login-page__input" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />

            <label className="login-page__label" htmlFor="cadastro-confirmar-senha">Confirmar senha</label>
            <input id="cadastro-confirmar-senha" className="login-page__input" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />

            {erro && <p className="login-page__error">{erro}</p>}

            <button className="login-page__button" type="submit" disabled={carregando}>
              {carregando ? "Enviando..." : "Enviar código"}
            </button>
          </form>

          <Link className="login-page__create-account" to={`/login-cliente/${slugEmpresa}`}>
            Voltar para login do cliente
          </Link>
        </section>
      </main>
    </div>
  );
}

export default CadastroClientePage;
