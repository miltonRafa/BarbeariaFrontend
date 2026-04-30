import { useEffect, useState } from "react";
import { listarClientes } from "../services/clienteService";

type Cliente = {
    id: number;
    nome: string;
    email: string;
    telefone: string;
};

function Clientes() {

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarClientes() {

            try {

                const data = await listarClientes();

                console.log("Clientes recebidos:", data);

                setClientes(data);

            } catch (error) {

                console.error(
                    "Erro ao buscar clientes",
                    error
                );

            } finally {

                setLoading(false);

            }

        }

        carregarClientes();
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
                Clientes
            </h1>


            {clientes.length === 0 && (
                <p className="text-zinc-200">
                    Nenhum cliente encontrado
                </p>
            )}


            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-5
                ">

                {clientes.map((cliente) => (

                    <div
                        key={cliente.id}

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
                            {cliente.nome}
                        </p>

                        <p className="text-zinc-300 mt-2">
                            <strong>Email:</strong>
                            {" "}
                            {cliente.email}
                        </p>

                        <p className="text-zinc-300">
                            <strong>Telefone:</strong>
                            {" "}
                            {cliente.telefone}
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
                                Cliente ativo
                            </span>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );

}

export default Clientes;
