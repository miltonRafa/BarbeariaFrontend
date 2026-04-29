import { useEffect, useState } from "react";
import { listarClientes } from "../services/clienteService";

function Clientes() {

    const [clientes, setClientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarClientes();
    }, []);

    const carregarClientes = async () => {
        try {
            const data = await listarClientes();

            console.log("Clientes recebidos:", data);

            setClientes(data);
        } catch (error) {
            console.error("Erro ao buscar clientes", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <h1>Clientes</h1>

            {clientes.length === 0 && <p>Nenhum cliente encontrado</p>}

            {clientes.map((cliente) => (
                <div key={cliente.id}>
                    <p><strong>{cliente.nome}</strong></p>
                    <p><strong>{cliente.email}</strong></p>
                    <p><strong>{cliente.telefone}</strong></p>
                </div>
            ))}
        </div>
    );
}

export default Clientes;