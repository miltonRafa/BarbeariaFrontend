import { Link, Outlet, useNavigate } from "react-router-dom";

function Layout() {

  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  const menuClass = `
  w-full
  block
  px-4 py-3
  rounded-xl
  text-zinc-300
  hover:bg-slate-800
  hover:text-[#c59d5f]
  transition
  font-medium
  break-words
  `;
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      <aside className="
 w-full
 lg:w-80
 bg-slate-950
 text-white
 lg:min-h-screen
 p-6
 flex
 flex-col
 border-r
 border-slate-800
">

        <div className="mb-8">
          <h2 className="
 text-3xl
 font-bold
 text-[#c59d5f]
">
            HONORATO
          </h2>

          <p className="text-zinc-400 text-sm">
            Barber Management
          </p>
        </div>


        <nav className="
 flex
 flex-col
 gap-2
 flex-1
">

          <Link className={menuClass} to="/">
            Dashboard
          </Link>

          <Link className={menuClass} to="/agendamentos">
            Agendamentos
          </Link>

          <Link className={menuClass} to="/clientes">
            Clientes
          </Link>

          <Link className={menuClass} to="/servicos">
            Serviços
          </Link>

          <Link className={menuClass} to="/estoque">
            Estoque
          </Link>

          <Link className={menuClass} to="/funcionarios">
            Funcionários
          </Link>

          <Link className={menuClass} to="/caixa">
            Caixa
          </Link>

          <Link className={menuClass} to="/relatorios">
            Relatórios
          </Link>

          <Link className={menuClass} to="/configuracoes">
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
 font-semibold
 px-4 py-3
 rounded-xl
"
        >
          Sair
        </button>

      </aside>


      <main className="
 flex-1
 min-h-screen
 p-8
 bg-[linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('/barbearia-bg.jpg')]
 bg-cover
 bg-center
 bg-fixed
 text-white
">

        <div className="max-w-7xl">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default Layout;