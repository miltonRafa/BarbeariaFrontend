import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { confirmarEmailCliente, reenviarCodigoCliente } from "../services/authService";
import "./Login.css";

function ConfirmarEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; slugPublico?: string } | null;
  const emailInicial = state?.email ?? "";
  const slugPublico = state?.slugPublico;
  const [email, setEmail] = useState(emailInicial);
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleConfirmar(event: React.FormEvent) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    try {
      await confirmarEmailCliente({ email, codigo });
      setSucesso("E-mail confirmado com sucesso. Você já pode fazer login.");
      window.setTimeout(() => navigate(slugPublico ? `/login-cliente/${slugPublico}` : "/login"), 1200);
    } catch {
      setErro("Código inválido ou expirado.");
    }
  }

  async function handleReenviar() {
    setErro("");
    setSucesso("");

    try {
      await reenviarCodigoCliente(email);
      setSucesso("Novo código enviado.");
    } catch {
      setErro("Não foi possível reenviar o código.");
    }
  }

  return (
    <div className="login-page">
      <main className="login-page__main login-page__main--center">
        <section className="login-page__login-panel">
          <div className="login-page__panel-header">
            <p className="login-page__panel-title">Confirmar e-mail</p>
            <span className="login-page__panel-subtitle">
              Digite o código de 6 dígitos enviado para seu e-mail.
            </span>
          </div>

          <form onSubmit={handleConfirmar} className="login-page__form">
            <label className="login-page__label" htmlFor="confirmar-email">Email</label>
            <input id="confirmar-email" className="login-page__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label className="login-page__label" htmlFor="confirmar-codigo">Código</label>
            <input id="confirmar-codigo" className="login-page__input" inputMode="numeric" maxLength={6} value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))} />

            {erro && <p className="login-page__error">{erro}</p>}
            {sucesso && <p className="login-page__success">{sucesso}</p>}

            <button className="login-page__button" type="submit">
              Confirmar
            </button>
          </form>

          <button className="login-page__secondary-button" type="button" onClick={handleReenviar}>
            Reenviar código
          </button>

          <Link className="login-page__create-account" to={slugPublico ? `/login-cliente/${slugPublico}` : "/login"}>
            Voltar para login
          </Link>
        </section>
      </main>
    </div>
  );
}

export default ConfirmarEmailPage;
