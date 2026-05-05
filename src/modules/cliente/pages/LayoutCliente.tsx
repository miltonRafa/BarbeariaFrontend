import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const clienteMenuItems = [
  { label: "Novo agendamento", shortLabel: "Agendar", path: "/cliente/agendar" },
  {
    label: "Meus agendamentos",
    shortLabel: "Agendamentos",
    path: "/cliente/agendamentos",
  },
];

function LayoutCliente() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    const slugPublico = localStorage.getItem("slugPublicoEmpresa");
    localStorage.clear();
    navigate(slugPublico ? `/cliente/${slugPublico}` : "/login");
  }

  const linkClass = (path: string) =>
    `flex items-center justify-center rounded-lg border px-4 py-3 text-center font-semibold transition ${
      location.pathname === path
        ? "border-[#c59d5f] bg-[#c59d5f] text-black"
        : "border-transparent text-white sm:hover:border-white/10 sm:hover:bg-white/5"
    }`;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(197,157,95,.16),transparent_34%),linear-gradient(rgba(0,0,0,.62),rgba(0,0,0,.82)),url('/barbearia-bg.png')] bg-cover bg-center bg-fixed text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between px-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide text-[#c59d5f]">
              HONORATO
            </h1>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9ca3af]">
              Área do cliente
            </p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {clienteMenuItems.map((item) => (
              <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                {item.label}
              </Link>
            ))}

            <button
              onClick={logout}
              className="min-h-11 rounded-lg px-4 py-3 font-semibold text-white transition sm:hover:bg-red-700"
            >
              Sair
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="cliente-mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-2xl leading-none transition sm:hover:border-[#c59d5f] sm:hover:text-[#c59d5f] md:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {/* Menu superior expansivel evita esconder acoes atras de barras inferiores. */}
        <div
          id="cliente-mobile-menu"
          className={`grid transition-[grid-template-rows] duration-300 md:hidden ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <nav className="grid gap-2 overflow-hidden px-4">
            <div className="grid gap-2 pb-4 pt-1">
              {clienteMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={linkClass(item.path)}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.shortLabel}
                </Link>
              ))}

              <button
                onClick={logout}
                className="min-h-11 rounded-lg px-4 py-3 font-semibold text-white transition sm:hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-10">
        <div className="mb-8 rounded-lg border border-white/10 bg-black/45 p-5 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c59d5f]">
            Agendamento online
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Escolha seu horário com praticidade
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9ca3af]">
            Selecione profissional, serviços e o melhor início dentro dos horários disponíveis.
          </p>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutCliente;
