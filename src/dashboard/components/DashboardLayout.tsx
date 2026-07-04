import "./DashboardLayout.css";
import { Outlet } from "react-router-dom";
import SidebarNav from "../../components/SidebarNav";

function DashboardLayout() {
  const handleLogout = () => {
    console.log("Cerrar sesión");
  };

  return (
    <div className="dashboard">
      {/* ✅ Usa el nombre exacto del componente exportado */}
      <SidebarNav onLogout={handleLogout} /> 
      
      <main className="dashboard-content">
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </main>
    </div>
  );
}

export default DashboardLayout;
