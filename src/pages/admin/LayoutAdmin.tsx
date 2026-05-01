import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

type MenuItem = {
  label: string;
  path: string;
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Minha Agenda", path: "/agenda-admin" },
  { label: "Agendamentos", path: "/agendamentos" },
  { label: "Clientes", path: "/clientes" },
  { label: "Serviços", path: "/servicos" },
  { label: "Estoque", path: "/estoque" },
  { label: "Funcionários", path: "/funcionarios" },
  { label: "Caixa", path: "/caixa" },
  { label: "Relatórios", path: "/relatorios" },
  { label: "Configurações", path: "/configuracoes" },
];

function LayoutAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  const menuClass = (path: string) => {
    const active =
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path));

    return `
      w-full
      flex
      items-center
      gap-3
      px-4 py-3
      rounded-lg
      transition
      font-semibold
      border
      ${
        active
          ? "bg-[#c59d5f]/20 text-[#c59d5f] border-[#c59d5f]/60 shadow-[inset_3px_0_0_#c59d5f]"
          : "text-[#9ca3af] border-transparent hover:bg-white/5 hover:text-[#c59d5f]"
      }
    `;
  };

  return (
    <div className="min-h-screen bg-black text-white lg:flex">
      {/* No mobile, a sidebar vira um header expansivel para preservar espaco util. */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl lg:hidden">
        <div className="flex min-h-16 items-center justify-between px-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-wide text-[#c59d5f]">
              HONORATO
            </h2>
            <p className="text-xs text-[#9ca3af]">Barber Management</p>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="admin-mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-2xl leading-none text-white transition hover:border-[#c59d5f] hover:text-[#c59d5f]"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        <div
          id="admin-mobile-menu"
          className={`grid transition-[grid-template-rows] duration-300 ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <nav className="grid gap-2 px-4 pb-4 pt-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  className={menuClass(item.path)}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <button
                onClick={logout}
                className="mt-2 rounded-lg bg-[#c59d5f] px-4 py-3 font-bold text-black transition hover:bg-[#d6ae70]"
              >
                Sair
              </button>
            </nav>
          </div>
        </div>
      </header>

      <aside
        className="
          hidden
          lg:flex
          w-72
          min-h-screen
          fixed
          left-0
          top-0
          z-30
          bg-black/80
          backdrop-blur-xl
          border-r
          border-white/10
          p-6
          flex-col
        "
      >
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-[#c59d5f]">
            HONORATO
          </h2>

          <p className="text-[#9ca3af] text-sm mt-1">
            Barber Management
          </p>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => (
            <Link key={item.path} className={menuClass(item.path)} to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="
            mt-8
            bg-[#c59d5f]
            hover:bg-[#d6ae70]
            text-black
            font-bold
            px-4 py-3
            rounded-lg
            transition
          "
        >
          Sair
        </button>
      </aside>

      <main
        className="
          flex-1
          min-h-screen
          relative
          text-white
          bg-cover
          bg-center
          bg-fixed
          lg:ml-72
        "
        style={{
          backgroundImage: "url('/barbearia-bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/35"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/30 to-black/40"></div>

        <div className="relative z-10 px-4 py-5 sm:px-6 md:py-8 lg:px-14 lg:py-10">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default LayoutAdmin;
