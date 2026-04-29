import { useEffect, useState } from "react";
import { listarServicos } from "../services/servicoService";

function Servicos() {

    const [servicos, setServicos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarServicos();
    }, []);

    const carregarServicos = async () => {
        try {
            const data = await listarServicos();

            console.log("Servicos recebidos:", data);

            setServicos(data);
        } catch (error) {
            console.error("Erro ao buscar servicoss", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <h1>Servicos</h1>

            {servicos.length === 0 && <p>Nenhum agendamento encontrado</p>}

            {servicos.map((servicos) => (
                <div key={servicos.id}>
                    <p><strong>{servicos.nome}</strong></p>
                    <p><strong>{servicos.email}</strong></p>
                    <p><strong>{servicos.telefone}</strong></p>
                </div>
            ))}
        </div>
    );
}

export default Servicos;