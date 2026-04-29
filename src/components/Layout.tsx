import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/clientes">Clientes</Link>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

export default Layout;