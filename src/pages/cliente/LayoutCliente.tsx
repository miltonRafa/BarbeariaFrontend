import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function LayoutCliente() {
  const location = useLocation();
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  const linkClass = (path: string) =>
    `flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition ${
      location.pathname === path
        ? "bg-[#c59d5f] text-black"
        : "text-white hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen bg-[linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.75)),url('/barbearia-bg.jpg')] bg-cover bg-center bg-fixed text-white">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#c59d5f]">Barbearia</h1>
            <p className="text-xs text-slate-300">Área do cliente</p>
          </div>

          <button
            onClick={logout}
            className="hidden sm:block bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-28">
        <Outlet />
      </main>

      {/* Menu desktop */}
      <nav className="hidden md:flex fixed left-1/2 -translate-x-1/2 bottom-6 z-50 bg-black/90 border border-slate-800 rounded-2xl p-2 gap-2 shadow-xl">
        <Link to="/cliente/agendar" className={linkClass("/cliente/agendar")}>
          Novo agendamento
        </Link>

        <Link
          to="/cliente/agendamentos"
          className={linkClass("/cliente/agendamentos")}
        >
          Meus agendamentos
        </Link>

        <button
          onClick={logout}
          className="px-4 py-3 rounded-xl font-semibold text-white hover:bg-red-700 transition"
        >
          Sair
        </button>
      </nav>

      {/* Menu mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-slate-800 px-3 py-2">
        <div className="grid grid-cols-3 gap-2">
          <Link
            to="/cliente/agendar"
            className={linkClass("/cliente/agendar")}
          >
            Agendar
          </Link>

          <Link
            to="/cliente/agendamentos"
            className={linkClass("/cliente/agendamentos")}
          >
            Ativos
          </Link>

          <button
            onClick={logout}
            className="flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-white hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>
      </nav>
    </div>
  );
}

export default LayoutCliente;