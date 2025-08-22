import React from "react";
import { useAuthStore } from "../../store";
import AdminDashboard from "../dashboards/AdminDashboard";
import TeacherDashboard from "../dashboards/TeacherDashboard";
import ParentDashboard from "../dashboards/ParentDashboard";
import SpecialistDashboard from "../dashboards/SpecialistDashboard";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">⏳</div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  // Renderizar dashboard según el rol del usuario
  const roleName = user.role?.nombre;
  
  switch (roleName) {
    case 'admin':
    case 'administrador':
    case 'DIRECTORA':
      return <AdminDashboard />;
    case 'trabajador':
    case 'docente':
    case 'Docente':
      return <TeacherDashboard />;
    case 'padre':
    case 'ESTUDIANTE':
      return <ParentDashboard />;
    case 'especialista':
      return <SpecialistDashboard />;
    default:
      return (
        <div className="dashboard-error">
          <h2>Error: Rol no reconocido ({roleName})</h2>
          <p>Por favor, contacta al administrador del sistema.</p>
          <p>Usuario: {user.nombre}</p>
          <p>Tipo: {user.role?.nombre}</p>
        </div>
      );
  }
};

export default Dashboard;
