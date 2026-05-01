import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const funcionarioMenuItems = [
  {
    label: "Agendamentos",
    shortLabel: "Agenda",
    path: "/funcionario/agendamentos",
  },
  { label: "Horários", shortLabel: "Horários", path: "/funcionario/horarios" },
  { label: "Serviços", shortLabel: "Serviços", path: "/funcionario/servicos" },
  {
    label: "Expediente",
    shortLabel: "Expediente",
    path: "/funcionario/expediente",
  },
];

function LayoutFuncionario() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  const linkClass = (path: string) =>
    `rounded-lg px-4 py-3 text-center font-semibold transition ${
      location.pathname === path
        ? "bg-[#c59d5f] text-black"
        : "text-white hover:bg-white/5"
    }`;

  return (
    <div className="min-h-screen bg-[#1a1a1d] text-white">
      <header className="sticky top-0 z-40 border-b border-[#1f1f23] bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4">
          <div>
            <h1 className="text-xl font-bold text-[#c59d5f]">
              Área do Funcionário
            </h1>
            <p className="text-xs text-[#9ca3af]">
              Horários, serviços e expediente
            </p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {funcionarioMenuItems.map((item) => (
              <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                {item.label}
              </Link>
            ))}

            <button
              onClick={logout}
              className="rounded-lg px-4 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Sair
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="funcionario-mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-2xl leading-none transition hover:border-[#c59d5f] hover:text-[#c59d5f] md:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {/* Header expansivel deixa a navegacao consistente em celulares e tablets pequenos. */}
        <div
          id="funcionario-mobile-menu"
          className={`grid transition-[grid-template-rows] duration-300 md:hidden ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <nav className="grid gap-2 overflow-hidden px-4">
            <div className="grid gap-2 pb-4 pt-1">
              {funcionarioMenuItems.map((item) => (
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
                className="rounded-lg px-4 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutFuncionario;
