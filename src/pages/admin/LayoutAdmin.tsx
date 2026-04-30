import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function LayoutAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

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
      rounded-xl
      transition
      font-semibold
      border
      ${
        active
          ? "bg-[#c59d5f]/20 text-[#c59d5f] border-[#c59d5f]/60 shadow-[inset_3px_0_0_#c59d5f]"
          : "text-zinc-300 border-transparent hover:bg-white/5 hover:text-[#c59d5f]"
      }
    `;
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
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
          <h2 className="text-3xl font-extrabold tracking-wide text-[#c59d5f]">
            HONORATO
          </h2>

          <p className="text-zinc-400 text-sm mt-1">
            Barber Management
          </p>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <Link className={menuClass("/dashboard")} to="/dashboard">
            Dashboard
          </Link>

          <Link className={menuClass("/agenda-admin")} to="/agenda-admin">
            Minha Agenda
          </Link>

          <Link className={menuClass("/agendamentos")} to="/agendamentos">
            Agendamentos
          </Link>

          <Link className={menuClass("/clientes")} to="/clientes">
            Clientes
          </Link>

          <Link className={menuClass("/servicos")} to="/servicos">
            Serviços
          </Link>

          <Link className={menuClass("/estoque")} to="/estoque">
            Estoque
          </Link>

          <Link className={menuClass("/funcionarios")} to="/funcionarios">
            Funcionários
          </Link>

          <Link className={menuClass("/caixa")} to="/caixa">
            Caixa
          </Link>

          <Link className={menuClass("/relatorios")} to="/relatorios">
            Relatórios
          </Link>

          <Link className={menuClass("/configuracoes")} to="/configuracoes">
            Configurações
          </Link>
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
            rounded-xl
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
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-black/80"></div>

        <div className="relative z-10 px-5 py-6 lg:px-14 lg:py-10">
          <div className="max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default LayoutAdmin;