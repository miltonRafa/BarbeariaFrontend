import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import LayoutCliente from "./modules/cliente/pages/LayoutCliente";
import Agendar from "./modules/cliente/pages/Agendar";
import ServicosAgendados from "./modules/cliente/pages/ServicosAgendados";

import LayoutAdmin from "./modules/admin/pages/LayoutAdmin";
import Clientes from "./modules/cliente/pages/Clientes";
import Agendamentos from "./modules/agendamento/pages/Agendamentos";
import Funcionarios from "./modules/funcionario/pages/Funcionarios";
import Estoque from "./modules/estoque/pages/Estoque";
import Financeiro from "./modules/financeiro/pages/Financeiro";
import Relatorios from "./modules/relatorio/pages/Relatorios";
import Login from "./modules/auth/pages/Login";
import CadastroClientePage from "./modules/auth/pages/CadastroClientePage";
import ConfirmarEmailPage from "./modules/auth/pages/ConfirmarEmailPage";
import LoginClientePage from "./modules/auth/pages/LoginClientePage";
import EmpresaPublicaPage from "./modules/empresa/pages/EmpresaPublicaPage";
import Configuracoes from "./modules/configuracoes/pages/Configuracoes";
import Servicos from "./modules/servico/pages/Servicos";

import LayoutFuncionario from "./modules/funcionario/pages/LayoutFuncionario";
import MeusAgendamentos from "./modules/funcionario/pages/MeusAgendamentos";
import MeusHorarios from "./modules/funcionario/pages/MeusHorarios";
import MeusServicos from "./modules/funcionario/pages/MeusServicos";
import Expediente from "./modules/funcionario/pages/Expediente";

import LayoutCaixa from "./modules/caixa/pages/LayoutCaixa";
import Caixa from "./modules/caixa/pages/Caixa";

import AgendaAdmin from "./modules/agendamento/pages/AgendaAdmin";
import Dashboard from "./modules/dashboard/pages/Dashboard";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cliente/:slugPublico" element={<EmpresaPublicaPage />} />
        <Route path="/cadastro-cliente/:slugPublico" element={<CadastroClientePage />} />
        <Route path="/login-cliente/:slugPublico" element={<LoginClientePage />} />
        <Route path="/confirmar-email" element={<ConfirmarEmailPage />} />

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

        <Route path="/caixa-operacao" element={<LayoutCaixa />}>
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
          <Route path="caixa" element={<Caixa />} />
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
