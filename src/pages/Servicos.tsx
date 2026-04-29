import { useEffect, useState } from "react";
import { listarServicos } from "../services/servicoService";

type Servico = {
    id: number;
    nome: string;
    preco: number;
    duracao: string;
};

function Servicos() {

    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarServicos();
    }, []);


    async function carregarServicos() {

        try {

            const data = await listarServicos();

            console.log(
                "Serviços recebidos:",
                data
            );

            setServicos(data);

        } catch (error) {

            console.error(
                "Erro ao buscar serviços",
                error
            );

        } finally {

            setLoading(false);

        }

    }


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
                Serviços
            </h1>


            {servicos.length === 0 && (
                <p className="text-zinc-200">
                    Nenhum serviço encontrado
                </p>
            )}


            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-5
                ">

                {servicos.map((servico) => (

                    <div
                        key={servico.id}
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
                            {servico.nome}
                        </p>


                        <p className="text-zinc-300">
                            <strong>Preço:</strong>
                            {" "}
                            R$ {servico.preco}
                        </p>


                        <p className="text-zinc-300">
                            <strong>Duração:</strong>
                            {" "}
                            {servico.duracao}
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
                                px-3 py-1
                                rounded-full
                                font-semibold
                                ">
                                Serviço ativo
                            </span>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );

}

export default Servicos;