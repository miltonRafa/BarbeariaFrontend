import { useEffect, useState } from "react";
import { listarFuncionarios } from "../services/funcionarioService";

function Funcionarios() {

    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    const carregarFuncionarios = async () => {
        try {
            const data = await listarFuncionarios();

            console.log("funcionários recebidos:", data);

            setFuncionarios(data);
        } catch (error) {
            console.error("Erro ao buscar funcionarioss", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <h1>Funcionarios</h1>

            {funcionarios.length === 0 && <p>Nenhum funcionário encontrado</p>}

            {funcionarios.map((funcionarios) => (
                <div key={funcionarios.id}>
                    <p><strong>{funcionarios.nome}</strong></p>
                    <p><strong>{funcionarios.email}</strong></p>
                    <p><strong>{funcionarios.especialidade}</strong></p>
                </div>
            ))}
        </div>
    );
}

export default Funcionarios;