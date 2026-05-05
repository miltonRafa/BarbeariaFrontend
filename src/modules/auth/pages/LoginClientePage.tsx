import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { loginCliente } from "../services/authService";
import { buscarEmpresaPublica, type EmpresaPublica } from "../../empresa/services/empresaPublicaService";
import "./Login.css";

function LoginClientePage() {
  const { slugPublico } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<EmpresaPublica | null>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!slugPublico) return;
    buscarEmpresaPublica(slugPublico)
      .then(setEmpresa)
      .catch(() => setErro("Empresa não encontrada ou indisponível."));
  }, [slugPublico]);

  if (!slugPublico) {
    return <Navigate to="/login" replace />;
  }

  const slugEmpresa = slugPublico;

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setErro("");

    try {
      const data = await loginCliente({ email, senha, slugPublicoEmpresa: slugEmpresa });
      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.nome);
      localStorage.setItem("perfil", data.perfil);
      localStorage.setItem("usuarioId", String(data.usuarioId));
      localStorage.setItem("clienteId", String(data.clienteId));
      localStorage.setItem("empresaId", String(data.empresaId));
      localStorage.setItem("nomeEmpresa", data.nomeEmpresa ?? "");
      localStorage.setItem("planoSistema", data.planoSistema ?? "");
      localStorage.setItem("slugPublicoEmpresa", slugEmpresa);
      localStorage.removeItem("funcionarioId");
      navigate("/cliente/agendamentos");
    } catch {
      setErro("Email, senha ou empresa inválidos.");
    }
  }

  return (
    <div className="login-page">
      <main className="login-page__main login-page__main--center">
        <section className="login-page__login-panel">
          <div className="login-page__panel-header">
            <p className="login-page__panel-title">
              {empresa?.nomeFantasia ?? "Login do cliente"}
            </p>
            <span className="login-page__panel-subtitle">
              Acesse sua conta de cliente nesta empresa.
            </span>
          </div>

          <form onSubmit={handleLogin} className="login-page__form">
            <label className="login-page__label" htmlFor="cliente-login-email">Email</label>
            <input id="cliente-login-email" className="login-page__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label className="login-page__label" htmlFor="cliente-login-senha">Senha</label>
            <input id="cliente-login-senha" className="login-page__input" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />

            {erro && <p className="login-page__error">{erro}</p>}

            <button className="login-page__button" type="submit">
              Entrar
            </button>
          </form>

          <Link className="login-page__create-account" to={`/cadastro-cliente/${slugEmpresa}`}>
            Criar conta de cliente
          </Link>
        </section>
      </main>
    </div>
  );
}

export default LoginClientePage;
