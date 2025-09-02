import React, { useState } from "react";
import { useAuthStore } from "../../store";

const SpecialistDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const { logout, user } = useAuthStore();

  const menuItems = [
    { id: "overview", label: "Resumen", icon: "📊" },
    { id: "evaluations", label: "Evaluaciones", icon: "📋" },
    { id: "appointments", label: "Citas", icon: "📅" },
    { id: "students", label: "Estudiantes", icon: "👶" },
    { id: "reports", label: "Informes", icon: "📄" },
    { id: "resources", label: "Recursos", icon: "📚" },
    { id: "consultations", label: "Consultas", icon: "💬" }
  ];

  const todayStats = [
    { title: "Citas de Hoy", value: "6", icon: "📅", color: "#667eea" },
    { title: "Evaluaciones Pendientes", value: "3", icon: "📋", color: "#d69e2e" },
    { title: "Informes por Entregar", value: "2", icon: "📄", color: "#9f7aea" },
    { title: "Casos Activos", value: "12", icon: "👶", color: "#38a169" }
  ];

  return (
    <div className="specialist-dashboard">
      <aside className="specialist-sidebar">
        <div className="specialist-sidebar-header">
          <div className="specialist-logo">
            <span className="specialist-logo-icon">🏫</span>
            <span className="specialist-logo-text">NidoPro</span>
          </div>
          <div className="specialist-info">
            <h3>{user?.specialty}</h3>
            <p>Departamento de Especialistas</p>
          </div>
        </div>
        
        <nav className="specialist-sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`specialist-nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="specialist-nav-icon">{item.icon}</span>
              <span className="specialist-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="specialist-sidebar-footer">
          <button className="specialist-logout-btn" onClick={logout}>
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="specialist-main-content">
        <header className="specialist-main-header">
          <div className="specialist-header-content">
            <h1>Panel de Especialista</h1>
            <div className="specialist-header-actions">
              <button className="specialist-notification-btn">
                <span>🔔</span>
                <span className="specialist-notification-badge">4</span>
              </button>
              <div className="specialist-user-profile">
                <div className="specialist-user-avatar">{user?.avatar}</div>
                <div className="specialist-user-info">
                  <span className="specialist-user-name">{user?.fullName || user?.nombre || user?.name}</span>
                  <span className="specialist-user-role">{user?.specialty}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="specialist-content-area">
          {activeSection === "overview" && (
            <div className="specialist-overview-section">
              <div className="specialist-welcome-card">
                <h2>Bienvenido(a), {user?.fullName || user?.nombre || user?.name}</h2>
                <p>Especialista en {user?.specialty}</p>
              </div>

              <div className="specialist-stats-grid">
                {todayStats.map((stat, index) => (
                  <div key={index} className="specialist-stat-card">
                    <div className="specialist-stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div className="specialist-stat-content">
                      <h3>{stat.title}</h3>
                      <div className="specialist-stat-value">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="specialist-dashboard-widgets">
                <div className="specialist-widget">
                  <h3>Agenda de Hoy</h3>
                  <div className="specialist-schedule-list">
                    <div className="specialist-schedule-item">
                      <span className="specialist-schedule-time">9:00 - 9:30</span>
                      <div className="specialist-schedule-content">
                        <h4>Evaluación - Sofía Pérez</h4>
                        <p>Evaluación psicológica inicial</p>
                      </div>
                    </div>
                    <div className="specialist-schedule-item">
                      <span className="specialist-schedule-time">10:00 - 10:30</span>
                      <div className="specialist-schedule-content">
                        <h4>Consulta - Familia García</h4>
                        <p>Seguimiento de caso</p>
                      </div>
                    </div>
                    <div className="specialist-schedule-item">
                      <span className="specialist-schedule-time">11:00 - 11:30</span>
                      <div className="specialist-schedule-content">
                        <h4>Reunión - Equipo Docente</h4>
                        <p>Estrategias de intervención</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="specialist-widget">
                  <h3>Casos Prioritarios</h3>
                  <div className="specialist-cases-list">
                    <div className="specialist-case-item high">
                      <div className="specialist-case-priority">🔴</div>
                      <div className="specialist-case-content">
                        <h4>Diego Martínez</h4>
                        <p>Seguimiento de adaptación</p>
                        <span className="specialist-case-date">Iniciado: 10 Ago</span>
                      </div>
                    </div>
                    <div className="specialist-case-item medium">
                      <div className="specialist-case-priority">🟡</div>
                      <div className="specialist-case-content">
                        <h4>Ana García</h4>
                        <p>Evaluación de desarrollo</p>
                        <span className="specialist-case-date">Iniciado: 12 Ago</span>
                      </div>
                    </div>
                    <div className="specialist-case-item low">
                      <div className="specialist-case-priority">🟢</div>
                      <div className="specialist-case-content">
                        <h4>Carlos López</h4>
                        <p>Consulta preventiva</p>
                        <span className="specialist-case-date">Iniciado: 14 Ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="specialist-widget">
                  <h3>Informes Recientes</h3>
                  <div className="specialist-reports-list">
                    <div className="specialist-report-item">
                      <div className="specialist-report-header">
                        <h4>Informe de Evaluación</h4>
                        <span className="specialist-report-status completed">Completado</span>
                      </div>
                      <p>Estudiante: María González</p>
                      <span className="specialist-report-date">Fecha: 13 Ago 2025</span>
                    </div>
                    <div className="specialist-report-item">
                      <div className="specialist-report-header">
                        <h4>Plan de Intervención</h4>
                        <span className="specialist-report-status pending">Pendiente</span>
                      </div>
                      <p>Estudiante: Luis Ramírez</p>
                      <span className="specialist-report-date">Vence: 16 Ago 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection !== "overview" && (
            <div className="specialist-section-placeholder">
              <div className="specialist-placeholder-content">
                <h2>Sección en desarrollo</h2>
                <p>La sección "{menuItems.find(item => item.id === activeSection)?.label}" está en construcción.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SpecialistDashboard;
