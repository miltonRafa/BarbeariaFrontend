import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Clientes from "./pages/Clientes";
import Dashboard from "./pages/Dashboard";
import Agendamentos from "./pages/Agendamentos"; 
import Funcionarios from "./pages/Funcionarios"; 
import Estoque from "./pages/Estoque"; 
import Financeiro from "./pages/admin/Financeiro"; 
import Servicos from "./pages/Servicos"; 
import Caixa from "./pages/Caixa";
import Relatorios from "./pages/admin/Relatorios";
import Login from "./pages/Login";
import Configuracoes from "./pages/Configuracoes";
import Agendar from "./pages/cliente/Agendar";
import Agenda from "./pages/funcionario/Agenda";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/caixa" element={<Caixa />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/cliente/agendar" element={<Agendar />} />
          <Route path="/funcionario/agenda" element={<Agenda />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;