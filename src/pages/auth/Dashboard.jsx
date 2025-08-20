import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import AdminDashboard from "../dashboards/AdminDashboard";
import TeacherDashboard from "../dashboards/TeacherDashboard";
import ParentDashboard from "../dashboards/ParentDashboard";
import SpecialistDashboard from "../dashboards/SpecialistDashboard";

const Dashboard = () => {
  const { getCurrentUser, isAuthenticated } = useAuth();
  const user = getCurrentUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirigir al login si no está autenticado
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">⏳</div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  // Renderizar dashboard según el rol del usuario
  switch (user.role) {
    case 'administracion':
      return <AdminDashboard />;
    case 'docente':
      return <TeacherDashboard />;
    case 'padre':
      return <ParentDashboard />;
    case 'especialista':
      return <SpecialistDashboard />;
    default:
      return (
        <div className="dashboard-error">
          <h2>Error: Rol no reconocido</h2>
          <p>Por favor, contacta al administrador del sistema.</p>
        </div>
      );
  }
};

export default Dashboard;
