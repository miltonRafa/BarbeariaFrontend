import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function LayoutFuncionario() {
  const location = useLocation();
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  const linkClass = (path: string) =>
    `px-4 py-3 rounded-xl font-semibold text-center transition ${
      location.pathname === path
        ? "bg-[#c59d5f] text-black"
        : "text-white hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-black/90 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[#c59d5f]">
              Área do Funcionário
            </h1>
            <p className="text-xs text-slate-400">
              Horários, serviços e expediente
            </p>
          </div>

          <button
            onClick={logout}
            className="hidden sm:block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-28">
        <Outlet />
      </main>

      <nav className="hidden md:flex fixed left-1/2 -translate-x-1/2 bottom-6 z-50 bg-black/90 border border-slate-800 rounded-2xl p-2 gap-2 shadow-xl">
        <Link to="/funcionario/agendamentos" className={linkClass("/funcionario/agendamentos")}>
          Agendamentos
        </Link>

        <Link to="/funcionario/horarios" className={linkClass("/funcionario/horarios")}>
          Horários
        </Link>

        <Link to="/funcionario/servicos" className={linkClass("/funcionario/servicos")}>
          Serviços
        </Link>

        <Link to="/funcionario/expediente" className={linkClass("/funcionario/expediente")}>
          Expediente
        </Link>

        <button
          onClick={logout}
          className="px-4 py-3 rounded-xl font-semibold text-white hover:bg-red-700"
        >
          Sair
        </button>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-slate-800 px-2 py-2">
        <div className="grid grid-cols-4 gap-1 text-xs">
          <Link to="/funcionario/agendamentos" className={linkClass("/funcionario/agendamentos")}>
            Agenda
          </Link>

          <Link to="/funcionario/horarios" className={linkClass("/funcionario/horarios")}>
            Horários
          </Link>

          <Link to="/funcionario/servicos" className={linkClass("/funcionario/servicos")}>
            Serviços
          </Link>

          <Link to="/funcionario/expediente" className={linkClass("/funcionario/expediente")}>
            Exp.
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default LayoutFuncionario;