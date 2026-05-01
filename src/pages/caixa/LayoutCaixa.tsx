import { Outlet, useNavigate } from "react-router-dom";

function LayoutCaixa() {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#1a1a1d] text-white flex flex-col">
      {/* Header compacto mantem a operacao do caixa confortavel em telas estreitas. */}
      <header className="sticky top-0 z-40 border-b border-[#1f1f23] bg-black/90 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#c59d5f]">Caixa</h1>
            <p className="text-xs text-[#9ca3af]">Operação diária</p>
          </div>

          <button
            onClick={logout}
            className="shrink-0 rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-5 sm:px-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutCaixa;
