import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const perfil = localStorage.getItem("perfil");

    if (!token) return;

    if (perfil === "FUNCIONARIO") {
      navigate("/funcionario");
      return;
    }

    if (perfil === "CAIXA") {
      navigate("/caixa-operacao");
      return;
    }

    if (perfil === "ADMIN") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    try {
      const data = await login({ email, senha });

      console.log("RESPOSTA LOGIN:", data);

      // 🔥 salva dados principais
      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.nome);
      localStorage.setItem("perfil", data.perfil);
      localStorage.setItem("usuarioId", String(data.usuarioId));
      if (data.empresaId !== null && data.empresaId !== undefined) {
        localStorage.setItem("empresaId", String(data.empresaId));
      } else {
        localStorage.removeItem("empresaId");
      }
      if (data.nomeEmpresa) {
        localStorage.setItem("nomeEmpresa", data.nomeEmpresa);
      } else {
        localStorage.removeItem("nomeEmpresa");
      }
      if (data.planoSistema) {
        localStorage.setItem("planoSistema", data.planoSistema);
      } else {
        localStorage.removeItem("planoSistema");
      }

      // 🔥 salva IDs corretamente
      if (data.funcionarioId !== null && data.funcionarioId !== undefined) {
        localStorage.setItem("funcionarioId", String(data.funcionarioId));
      } else {
        localStorage.removeItem("funcionarioId");
      }

      if (data.clienteId !== null && data.clienteId !== undefined) {
        localStorage.setItem("clienteId", String(data.clienteId));
      } else {
        localStorage.removeItem("clienteId");
      }

      // 🔥 redirecionamento
      if (data.perfil === "FUNCIONARIO") {
        navigate("/funcionario");
        return;
      }

      if (data.perfil === "CAIXA") {
        navigate("/caixa-operacao");
        return;
      }

      if (data.perfil === "ADMIN") {
        navigate("/dashboard");
        return;
      }

    } catch {
      setErro("Email ou senha inválidos");
    }
  }

  return (
    <div className="login-page">
      <nav className="login-page__navbar">
        <div className="login-page__brand">
          <span className="login-page__eyebrow">Gestão de negócios</span>
          <h1 className="login-page__title">Controle total do seu negócio</h1>
        </div>

        <button
          type="button"
          className="login-page__hamburger"
          onClick={() => setShowLogin((prev) => !prev)}
          aria-expanded={showLogin}
          aria-controls="login-mobile-menu"
        >
          {showLogin ? "×" : "☰"}
        </button>
      </nav>

      <main className="login-page__main">
        <div
          id="login-mobile-menu"
          className={`login-page__login-collapse ${showLogin ? "open" : ""}`}
        >
          <section className="login-page__login-panel">
            <div className="login-page__panel-header">
              <p className="login-page__panel-title">Acesse sua conta</p>
              <span className="login-page__panel-subtitle">
                Insira seu email e senha para entrar no sistema.
              </span>
            </div>

            <form onSubmit={handleLogin} className="login-page__form">
              <label className="login-page__label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                className="login-page__input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@barbearia.com"
              />

              <label className="login-page__label" htmlFor="login-senha">Senha</label>
              <input
                id="login-senha"
                name="senha"
                className="login-page__input"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
              />

              {erro && <p className="login-page__error">{erro}</p>}

              <button className="login-page__button" type="submit">
                Entrar
              </button>
            </form>

            <div className="login-page__footer">
              <p>
                Quer saber mais ou agendar uma demonstração? Entre em contato:
              </p>
              <a href="mailto:miltonrs.dev@gmail.com">
                miltonrs.dev@gmail.com
              </a>
            </div>
          </section>
        </div>

        <section className="login-page__content">
          <p className="login-page__hero-text">
            Um painel completo para agendamentos, financeiro, clientes,
            estoque e equipe em uma única experiência.
          </p>
          <div className="login-page__cards">
            <div className="login-page__card">
              <h3>Agenda inteligente</h3>
              <p>
                Evite conflitos de horários, visualize disponibilidade e
                gerencie a agenda de toda a equipe com clareza.
              </p>
            </div>
            <div className="login-page__card">
              <h3>Caixa e financeiro</h3>
              <p>
                Controle entradas, saídas e vendas em tempo real para deixar o
                fluxo de caixa sempre organizado.
              </p>
            </div>
            <div className="login-page__card">
              <h3>Estoque automatizado</h3>
              <p>
                Acompanhe o uso de produtos, receba alertas de reposição e
                evite perdas por falta de controle.
              </p>
            </div>
            <div className="login-page__card">
              <h3>Clientes fidelizados</h3>
              <p>
                Tenha histórico de atendimentos, preferências e perfil de cada
                cliente em um único lugar.
              </p>
            </div>
            <div className="login-page__card">
              <h3>Equipe organizada</h3>
              <p>
                Defina disponibilidade, acompanhe horários e distribua serviços
                com agilidade.
              </p>
            </div>
            <div className="login-page__card">
              <h3>Visão estratégica</h3>
              <p>
                Identifique os serviços mais rentáveis, o desempenho da equipe e
                os pontos que precisam de atenção.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
