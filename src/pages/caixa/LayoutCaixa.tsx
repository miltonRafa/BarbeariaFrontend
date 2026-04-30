import { Outlet, useNavigate } from "react-router-dom";

function LayoutCaixa() {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      
      {/* HEADER */}
      <header className="bg-black border-b border-slate-800 px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#c59d5f]">Caixa</h1>
          <p className="text-xs text-slate-400">Operação diária</p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold"
        >
          Sair
        </button>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 p-4 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutCaixa;