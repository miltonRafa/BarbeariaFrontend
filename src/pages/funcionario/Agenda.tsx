import { useEffect, useState } from "react";
import { listarAgendamentos } from "../../services/agendamentoService";
import {
    criarHorarioDisponivel,
    listarHorariosDisponiveis,
} from "../../services/horarioDisponivelService";

type Agendamento = {
    id: number;
    clienteNome?: string;
    servicoNome?: string;
    inicio?: string;
    fim?: string;
    status?: string;
};

type HorarioDisponivel = {
    id: number;
    inicio: string;
    fim: string;
    status: string;
};

function Agenda() {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
    const [loading, setLoading] = useState(true);
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [dataHorarios, setDataHorarios] = useState("");

    useEffect(() => {
        carregarDados();
    }, [dataHorarios]);

    async function carregarDados() {
        try {

            const funcionarioIdSalvo = localStorage.getItem("funcionarioId");

            if (!funcionarioIdSalvo) {
                alert("Funcionário não identificado.");
                return;
            }

            const funcionarioId = Number(funcionarioIdSalvo);

            const agendamentosData =
                await listarAgendamentos(funcionarioId);

            setAgendamentos(agendamentosData);

            if (dataHorarios) {

                const horariosData =
                    await listarHorariosDisponiveis(
                        funcionarioId,
                        dataHorarios
                    );

                setHorarios(horariosData);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function disponibilizarHorario() {
        try {
            const funcionarioIdSalvo = localStorage.getItem("funcionarioId");

            if (!funcionarioIdSalvo) {
                alert("Funcionário não identificado. Faça login novamente.");
                return;
            }

            if (!inicio || !fim) {
                alert("Informe o início e o fim do horário.");
                return;
            }

            const funcionarioId = Number(funcionarioIdSalvo);

            await criarHorarioDisponivel({
                funcionarioId,
                inicio,
                fim,
            });

            alert("Horário disponibilizado com sucesso!");

            setInicio("");
            setFim("");

            await carregarDados();
        } catch (error) {
            console.error("Erro ao disponibilizar horário", error);
            alert("Erro ao disponibilizar horário");
        }
    }

    if (loading) {
        return <p className="text-white text-lg">Carregando...</p>;
    }

    return (
        <div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-8 text-white">
                <h2 className="text-2xl font-bold text-[#c59d5f] mb-4">
                    Disponibilizar Horário
                </h2>
                <h1 className="text-3xl font-bold text-[#c59d5f] mb-6">
                    Horários Disponíveis
                </h1>

                <div className="mb-6">
                    <label className="block text-zinc-300 mb-2">
                        Selecionar dia
                    </label>

                    <input
                        type="date"
                        value={dataHorarios}
                        onChange={(e) => setDataHorarios(e.target.value)}
                        className="
                            px-4 py-3
                            rounded-xl
                            bg-slate-900
                            border
                            border-slate-700
                            text-white
                            "
                    />
                </div>


                {horarios.length === 0 && dataHorarios && (
                    <p className="text-zinc-200 mb-8">
                        Nenhum horário disponível nesse dia
                    </p>
                )}


                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-5
                    mb-10
                    ">

                    {horarios.map((horario) => (
                        <div
                            key={horario.id}
                            className="
                            bg-slate-950/80
                            border border-slate-800
                            rounded-2xl
                            p-5
                            text-white
                            shadow-lg
                            "
                        >

                            <p className="
                                text-xl
                                font-semibold
                                text-[#c59d5f]
                                mb-3
                                ">
                                Horário disponível
                            </p>

                            <p className="text-zinc-300">
                                <strong>Início:</strong>{" "}
                                {new Date(horario.inicio)
                                    .toLocaleString("pt-BR")}
                            </p>

                            <p className="text-zinc-300">
                                <strong>Fim:</strong>{" "}
                                {new Date(horario.fim)
                                    .toLocaleString("pt-BR")}
                            </p>

                            <div className="
                                mt-4
                                pt-4
                                border-t
                                border-slate-800
                                ">

                                <span className="
                                    text-xs
                                    bg-emerald-500
                                    text-black
                                    px-3 py-1
                                    rounded-full
                                    font-semibold
                                    ">
                                    {horario.status}
                                </span>

                            </div>

                        </div>
                    ))}

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-zinc-300 mb-2">Início</label>
                        <input
                            type="datetime-local"
                            value={inicio}
                            onChange={(e) => setInicio(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-300 mb-2">Fim</label>
                        <input
                            type="datetime-local"
                            value={fim}
                            onChange={(e) => setFim(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                    </div>
                </div>

                <button
                    onClick={disponibilizarHorario}
                    className="bg-[#c59d5f] hover:bg-[#d6ae70] text-black font-bold px-6 py-3 rounded-xl"
                >
                    Disponibilizar horário
                </button>
            </div>

            <h1 className="text-3xl font-bold text-[#c59d5f] mb-6">
                Horários Disponíveis
            </h1>

            {horarios.length === 0 && (
                <p className="text-zinc-200 mb-8">
                    Nenhum horário disponível cadastrado
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {horarios.map((horario) => (
                    <div
                        key={horario.id}
                        className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg text-white hover:border-[#c59d5f] transition"
                    >
                        <p className="text-xl font-semibold text-[#c59d5f] mb-3">
                            Horário disponível
                        </p>

                        <p className="text-zinc-300">
                            <strong>Início:</strong>{" "}
                            {new Date(horario.inicio).toLocaleString("pt-BR")}
                        </p>

                        <p className="text-zinc-300">
                            <strong>Fim:</strong>{" "}
                            {new Date(horario.fim).toLocaleString("pt-BR")}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <span className="text-xs bg-emerald-500 text-black px-3 py-1 rounded-full font-semibold">
                                {horario.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <h1 className="text-3xl font-bold text-[#c59d5f] mb-6">
                Minha Agenda
            </h1>

            {agendamentos.length === 0 && (
                <p className="text-zinc-200">Nenhum agendamento encontrado</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {agendamentos.map((agendamento) => (
                    <div
                        key={agendamento.id}
                        className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg text-white hover:border-[#c59d5f] transition"
                    >
                        <p className="text-xl font-semibold text-[#c59d5f] mb-3">
                            {agendamento.clienteNome ?? "Cliente não informado"}
                        </p>

                        <p className="text-zinc-300">
                            <strong>Serviço:</strong>{" "}
                            {agendamento.servicoNome ?? "Não informado"}
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

export default Agenda;