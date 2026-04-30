function Caixa() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#c59d5f] mb-6">
        Caixa do dia
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-5">
          <p className="text-sm text-[#9ca3af]">Saldo atual</p>
          <p className="text-2xl font-bold text-green-400">R$ 0,00</p>
        </div>

        <div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-5">
          <p className="text-sm text-[#9ca3af]">Entradas</p>
          <p className="text-2xl font-bold text-blue-400">R$ 0,00</p>
        </div>

        <div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-5">
          <p className="text-sm text-[#9ca3af]">Saídas</p>
          <p className="text-2xl font-bold text-red-400">R$ 0,00</p>
        </div>

      </div>

      <div className="mt-8">
        <button className="bg-[#c59d5f] hover:bg-[#d6ae70] text-black px-6 py-3 rounded-xl font-bold">
          Registrar movimentação
        </button>
      </div>
    </div>
  );
}

export default Caixa;