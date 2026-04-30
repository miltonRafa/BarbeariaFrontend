import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const perfil = localStorage.getItem("perfil");

    if (!token) return;

    if (perfil === "CLIENTE") {
      navigate("/cliente");
      return;
    }

    if (perfil === "FUNCIONARIO") {
      navigate("/funcionario");
      return;
    }

    if (perfil === "CAIXA") {
      navigate("/caixa");
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

      localStorage.setItem("token", data.token);
      localStorage.setItem("nome", data.nome);
      localStorage.setItem("perfil", data.perfil);

      if (data.funcionarioId !== null && data.funcionarioId !== undefined) {
        localStorage.setItem("funcionarioId", String(data.funcionarioId));
      }

      if (data.clienteId !== null && data.clienteId !== undefined) {
        localStorage.setItem("clienteId", String(data.clienteId));
      }

      if (data.perfil === "CLIENTE") {
        navigate("/cliente");
        return;
      }

      if (data.perfil === "FUNCIONARIO") {
        navigate("/funcionario");
        return;
      }

      if (data.perfil === "CAIXA") {
        navigate("/caixa");
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
    <div style={styles.container}>
      <section style={styles.apresentacao}>
        <h1 style={styles.titulo}>Barbearia System</h1>

        <p style={styles.subtitulo}>
          Sistema de gestão para barbearias, com controle de clientes,
          agendamentos, serviços, caixa, estoque e funcionários.
        </p>

        <div style={styles.cards}>
          <div style={styles.card}>Agenda organizada</div>
          <div style={styles.card}>Controle de caixa</div>
          <div style={styles.card}>Gestão de estoque</div>
        </div>
      </section>

      <section style={styles.loginBox}>
        <h2>Entrar no sistema</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@barbearia.com"
          />

          <label>Senha</label>
          <input
            style={styles.input}
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
          />

          {erro && <p style={styles.erro}>{erro}</p>}

          <button style={styles.botao} type="submit">
            Entrar
          </button>
        </form>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    background: "#111827",
    color: "#fff",
  },
  apresentacao: {
    flex: 1,
    padding: "80px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  titulo: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  subtitulo: {
    fontSize: "20px",
    maxWidth: "600px",
    lineHeight: "1.6",
    color: "#d1d5db",
  },
  cards: {
    display: "flex",
    gap: "16px",
    marginTop: "40px",
  },
  card: {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
  },
  loginBox: {
    width: "380px",
    background: "#fff",
    color: "#111827",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  botao: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  erro: {
    color: "red",
  },
};

export default Login;
