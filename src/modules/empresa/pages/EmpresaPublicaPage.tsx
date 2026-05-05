import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { buscarEmpresaPublica, type EmpresaPublica } from "../services/empresaPublicaService";
import "../../auth/pages/Login.css";

function EmpresaPublicaPage() {
  const { slugPublico } = useParams();
  const [empresa, setEmpresa] = useState<EmpresaPublica | null>(null);
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

  return (
    <div className="login-page">
      <main className="login-page__main login-page__main--center">
        <section className="login-page__login-panel">
          <div className="login-page__panel-header">
            {empresa?.logo && <img src={empresa.logo} alt={empresa.nomeFantasia} />}
            <p className="login-page__panel-title">
              {empresa?.nomeFantasia ?? "Área do cliente"}
            </p>
            <span className="login-page__panel-subtitle">
              Entre ou crie sua conta para agendar seu horário.
            </span>
          </div>

          {erro && <p className="login-page__error">{erro}</p>}

          {!erro && (
            <>
              <Link className="login-page__button" to={`/login-cliente/${slugPublico}`}>
                Entrar como cliente
              </Link>
              <Link className="login-page__secondary-button" to={`/cadastro-cliente/${slugPublico}`}>
                Criar conta
              </Link>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default EmpresaPublicaPage;
