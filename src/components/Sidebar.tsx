import { Link } from "react-router-dom";

function Sidebar(){

 return(
  <aside className="
   w-64
   bg-gray-900
   text-white
   min-h-screen
   p-6
  ">

   <h2 className="text-2xl font-bold mb-8">
      Barbearia
   </h2>

   <nav className="flex flex-col gap-4">

    <Link to="/">Dashboard</Link>
    <Link to="/clientes">Clientes</Link>
    <Link to="/agendamentos">Agendamentos</Link>
    <Link to="/estoque">Estoque</Link>
    <Link to="/caixa">Caixa</Link>

   </nav>

  </aside>
 )
}

export default Sidebar;