import { useEffect, useState } from "react";
import { listarAgendamentos } from "../services/agendamentoService";

function Agendamentos() {

    const [agendamentos, setAgendamentos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarAgendamentos();
    }, []);

    const carregarAgendamentos = async () => {
        try {
            const data = await listarAgendamentos();

            console.log("Agendamentos recebidos:", data);

            setAgendamentos(data);
        } catch (error) {
            console.error("Erro ao buscar agendamentoss", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <h1>Agendamentos</h1>

            {agendamentos.length === 0 && <p>Nenhum agendamento encontrado</p>}

            {agendamentos.map((agendamentos) => (
                <div key={agendamentos.id}>
                    <p><strong>{agendamentos.nome}</strong></p>
                    <p><strong>{agendamentos.email}</strong></p>
                    <p><strong>{agendamentos.telefone}</strong></p>
                </div>
            ))}
        </div>
    );
}

export default Agendamentos;