function Expediente() {
  function encerrarExpediente() {
    alert("Funcionalidade de encerrar expediente ainda será integrada ao backend.");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#c59d5f] mb-6">
        Expediente
      </h1>

      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-white">
        <p className="text-zinc-300 mb-5">
          Use esta opção para encerrar o expediente do dia.
        </p>

        <button
          onClick={encerrarExpediente}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl"
        >
          Encerrar expediente
        </button>
      </div>
    </div>
  );
}

export default Expediente;