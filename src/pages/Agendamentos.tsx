import { useEffect, useState } from "react";
import { listarAgendamentos } from "../services/agendamentoService";

type Agendamento = {
  id: number;
  cliente?: string;
  funcionario?: string;
  data?: string;
  horaInicio?: string;
  status?: string;
  valorTotal?: number;
};

function Agendamentos() {

    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarAgendamentos() {
            try {
                const data = await listarAgendamentos();

                setAgendamentos(Array.isArray(data) ? data : []);
                setErro("");

            } catch (error) {

                console.error("Erro ao buscar agendamentos", error);
                setErro("Não foi possível carregar os agendamentos.");

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
                text-2xl sm:text-3xl
                font-bold
                text-[#c59d5f]
                mb-6
            ">
                Agendamentos
            </h1>


            {erro && (
                <p className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
                    {erro}
                </p>
            )}


            {agendamentos.length === 0 && (
                <p className="text-white">
                    Nenhum agendamento encontrado
                </p>
            )}


            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-4 sm:gap-5
            ">

                {agendamentos.map((agendamento) => (

                    <div
                        key={agendamento.id}
                        className="
                            bg-[#0b0b0c]/80
                            border
                            border-[#1f1f23]
                            rounded-lg
                            p-4 sm:p-5
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
                            {agendamento.cliente ?? "Cliente não informado"}
                        </p>

                        <p className="text-[#9ca3af] mt-2">
                            <strong>Funcionário:</strong>{" "}
                            {agendamento.funcionario ?? "Não informado"}
                        </p>

                        <p className="text-[#9ca3af]">
                            <strong>Data:</strong>{" "}
                            {agendamento.data
                                ? agendamento.data.split("-").reverse().join("/")
                                : "Não informado"}
                        </p>

                        <p className="text-[#9ca3af]">
                            <strong>Horário:</strong>{" "}
                            {agendamento.horaInicio
                                ? agendamento.horaInicio.substring(0, 5)
                                : "Não informado"}
                        </p>

                        <p className="text-[#9ca3af]">
                            <strong>Valor:</strong>{" "}
                            {agendamento.valorTotal !== undefined
                                ? `R$ ${Number(agendamento.valorTotal).toFixed(2).replace(".", ",")}`
                                : "Não informado"}
                        </p>

                        <div className="
                            mt-4
                            pt-4
                            border-t
                            border-[#1f1f23]
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
                                {agendamento.status ?? "AGENDADO"}
                            </span>
                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Agendamentos;
