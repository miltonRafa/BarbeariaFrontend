import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Clientes from "./pages/Clientes";
import Dashboard from "./pages/Dashboard";
import Agendamentos from "./pages/Agendamentos"; 
import Funcionarios from "./pages/Funcionarios"; 
import Estoque from "./pages/Estoque"; 
import Financeiro from "./pages/Financeiro"; 
import Servicos from "./pages/Servicos"; 
import Vendas from "./pages/Caixa";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/vendas" element={<Vendas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;