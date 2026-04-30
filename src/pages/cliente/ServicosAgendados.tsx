import { useEffect, useState } from "react";
import { listarAgendamentos } from "../../services/agendamentoService";

type Agendamento = {
    id: number;
    funcionarioNome?: string;
    servicoNome?: string;
    inicio?: string;
    fim?: string;
    status?: string;
};

function ServicosAgendados() {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarAgendamentos() {
            try {
                const data = await listarAgendamentos();
                setAgendamentos(data);
            } catch (error) {
                console.error("Erro ao buscar serviços agendados", error);
            } finally {
                setLoading(false);
            }
        }

        carregarAgendamentos();
    }, []);

    if (loading) {
        return <p className="text-white text-lg">Carregando...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#c59d5f] mb-6">
                Meus Serviços Agendados
            </h1>

            {agendamentos.length === 0 && (
                <p className="text-zinc-200">
                    Nenhum serviço agendado encontrado
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {agendamentos.map((agendamento) => (
                    <div
                        key={agendamento.id}
                        className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg text-white hover:border-[#c59d5f] transition"
                    >
                        <p className="text-xl font-semibold text-[#c59d5f] mb-3">
                            {agendamento.servicoNome ?? "Serviço agendado"}
                        </p>

                        <p className="text-zinc-300">
                            <strong>Funcionário:</strong>{" "}
                            {agendamento.funcionarioNome ?? "Não informado"}
                        </p>

                        <p className="text-zinc-300">
                            <strong>Início:</strong>{" "}
                            {agendamento.inicio
                                ? new Date(agendamento.inicio).toLocaleString("pt-BR")
                                : "Não informado"}
                        </p>

                        <p className="text-zinc-300">
                            <strong>Fim:</strong>{" "}
                            {agendamento.fim
                                ? new Date(agendamento.fim).toLocaleString("pt-BR")
                                : "Não informado"}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <span className="text-xs bg-[#c59d5f] text-black px-3 py-1 rounded-full font-semibold">
                                {agendamento.status ?? "Agendado"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServicosAgendados;
