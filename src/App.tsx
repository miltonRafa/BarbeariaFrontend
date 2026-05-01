import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import LayoutCliente from "./pages/cliente/LayoutCliente";
import Agendar from "./pages/cliente/Agendar";
import ServicosAgendados from "./pages/cliente/ServicosAgendados";

import LayoutAdmin from "./pages/admin/LayoutAdmin";
import Clientes from "./pages/Clientes";
import Agendamentos from "./pages/Agendamentos";
import Funcionarios from "./pages/Funcionarios";
import Estoque from "./pages/Estoque";
import Financeiro from "./pages/admin/Financeiro";
import Relatorios from "./pages/admin/Relatorios";
import Login from "./pages/Login";
import Configuracoes from "./pages/Configuracoes";
import Servicos from "./pages/Servicos";

import LayoutFuncionario from "./pages/funcionario/LayoutFuncionario";
import MeusAgendamentos from "./pages/funcionario/MeusAgendamentos";
import MeusHorarios from "./pages/funcionario/MeusHorarios";
import MeusServicos from "./pages/funcionario/MeusServicos";
import Expediente from "./pages/funcionario/Expediente";

import LayoutCaixa from "./pages/caixa/LayoutCaixa";
import Caixa from "./pages/caixa/Caixa";

import AgendaAdmin from "./pages/admin/AgendaAdmin";
import Dashboard from "./pages/admin/Dashboard";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/cliente" element={<LayoutCliente />}>
          <Route index element={<Navigate to="agendamentos" replace />} />
          <Route path="agendar" element={<Agendar />} />
          <Route path="agendamentos" element={<ServicosAgendados />} />
        </Route>

        <Route path="/funcionario" element={<LayoutFuncionario />}>
          <Route index element={<Navigate to="agendamentos" replace />} />
          <Route path="agendamentos" element={<MeusAgendamentos />} />
          <Route path="horarios" element={<MeusHorarios />} />
          <Route path="servicos" element={<MeusServicos />} />
          <Route path="expediente" element={<Expediente />} />
        </Route>

        <Route path="/caixa" element={<LayoutCaixa />}>
          <Route index element={<Caixa />} />
        </Route>

        <Route path="/" element={<LayoutAdmin />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="agenda-admin" element={<AgendaAdmin />}>
            <Route index element={<Navigate to="agendamentos" replace />} />
            <Route path="agendamentos" element={<MeusAgendamentos />} />
            <Route path="horarios" element={<MeusHorarios />} />
            <Route path="servicos" element={<MeusServicos />} />
            <Route path="expediente" element={<Expediente />} />
          </Route>

          <Route path="clientes" element={<Clientes />} />
          <Route path="funcionarios" element={<Funcionarios />} />
          <Route path="agendamentos" element={<Agendamentos />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="configuracoes" element={<Configuracoes />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;