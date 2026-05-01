import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { listarFuncionarios } from "../../services/funcionarioService";
import Dropdown from "../../components/Dropdown";

type FuncionarioAgenda = {
  id: number;
  nome: string;
};

function AgendaAdmin() {
  const location = useLocation();

  const [funcionarios, setFuncionarios] = useState<FuncionarioAgenda[]>([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<
    number | null
  >(null);

  useEffect(() => {
    async function carregarFuncionarios() {
      try {
        const data = await listarFuncionarios();
        const lista: FuncionarioAgenda[] = Array.isArray(data) ? data : [];

        setFuncionarios(lista);

        if (lista.length > 0) {
          const funcionarioSalvo = Number(
            localStorage.getItem("funcionarioAgendaId")
          );

          const funcionarioExiste = lista.some(
            (funcionario) => funcionario.id === funcionarioSalvo
          );

          const funcionarioIdInicial = funcionarioExiste
            ? funcionarioSalvo
            : lista[0].id;

          setFuncionarioSelecionado(funcionarioIdInicial);
          localStorage.setItem(
            "funcionarioAgendaId",
            String(funcionarioIdInicial)
          );
        }
      } catch (error) {
        console.error("Erro ao carregar funcionários", error);
      }
    }

    carregarFuncionarios();
  }, []);

  function handleSelect(id: number) {
    setFuncionarioSelecionado(id);
    localStorage.setItem("funcionarioAgendaId", String(id));
  }

  const linkClass = (path: string) =>
    `px-4 py-3 rounded-lg font-semibold border transition ${location.pathname.endsWith(path)
      ? "bg-[#c6a15b] text-black border-[#c6a15b]"
      : "bg-[#121214]/80 text-white border-white/10 hover:border-[#c6a15b]"
    }`;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#c6a15b] mb-6">
        Agenda Geral
      </h1>

      <div className="relative z-50 bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-lg p-4 sm:p-5 mb-6">
        <Dropdown
          label="Funcionário selecionado"
          value={funcionarioSelecionado}
          onChange={(id) => handleSelect(Number(id))}
          options={funcionarios.map((funcionario) => ({
            label: funcionario.nome,
            value: funcionario.id,
          }))}
        />
      </div>

      <div className="bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-lg p-4 sm:p-5 mb-6">
        <p className="text-[#9ca3af] mb-4">
          Gerencie os dados do funcionário selecionado.
        </p>

        <nav className="flex flex-wrap gap-3">
          <Link to="agendamentos" className={linkClass("agendamentos")}>
            Agendamentos
          </Link>

          <Link to="horarios" className={linkClass("horarios")}>
            Horários
          </Link>

          <Link to="servicos" className={linkClass("servicos")}>
            Serviços
          </Link>

          <Link to="expediente" className={linkClass("expediente")}>
            Expediente
          </Link>
        </nav>
      </div>

      <Outlet />
    </div>
  );
}

export default AgendaAdmin;
