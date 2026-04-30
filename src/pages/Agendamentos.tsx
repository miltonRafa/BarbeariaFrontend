import { useEffect, useState } from "react";
import { listarAgendamentos } from "../services/agendamentoService";

type Agendamento = {
    id: number;
    nome: string;
    email: string;
    telefone: string;
};

function Agendamentos() {

    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarAgendamentos() {
            try {
                const data = await listarAgendamentos();

                setAgendamentos(data);

            } catch (error) {

                console.error("Erro ao buscar agendamentos", error);

            } finally {

                setLoading(false);

            }
        }

        carregarAgendamentos();
    }, []);

    if (loading) {
        return (
            <p className="text-white text-lg">
                Carregando...
            </p>
        );
    }

    return (
        <div>

            <h1 className="
                text-3xl
                font-bold
                text-[#c59d5f]
                mb-6
            ">
                Agendamentos
            </h1>


            {agendamentos.length === 0 && (
                <p className="text-zinc-200">
                    Nenhum agendamento encontrado
                </p>
            )}


            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-5
            ">

                {agendamentos.map((agendamento) => (

                    <div
                        key={agendamento.id}
                        className="
                            bg-slate-950/80
                            border
                            border-slate-800
                            rounded-2xl
                            p-5
                            shadow-lg
                            text-white
                            hover:border-[#c59d5f]
                            transition
                            "
                    >

                        <p className="
                            text-xl
                            font-semibold
                            text-[#c59d5f]
                            mb-3
                            ">
                            {agendamento.nome}
                        </p>

                        <p className="text-zinc-300 mt-2">
                            <strong>Email:</strong> {agendamento.email}
                        </p>

                        <p className="text-zinc-300">
                            <strong>Telefone:</strong> {agendamento.telefone}
                        </p>

                        <div className="
                            mt-4
                            pt-4
                            border-t
                            border-slate-800
                            ">
                            <span className="
                                text-xs
                                bg-[#c59d5f]
                                text-black
                                px-3
                                py-1
                                rounded-full
                                font-semibold
                            ">
                                Agendado
                            </span>
                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Agendamentos;
