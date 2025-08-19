import React from 'react';

const Evaluaciones = () => {
  return (
    <div className="evaluations-page">
      <div className="page-header">
        <h1>Evaluaciones Psicopedagógicas</h1>
        <p>Seguimiento y evaluación del desarrollo estudiantil</p>
      </div>
      
      <div className="evaluations-content">
        <div className="evaluations-stats">
          <div className="stat-card">
            <h3>23</h3>
            <p>Casos Activos</p>
          </div>
          <div className="stat-card">
            <h3>8</h3>
            <p>Evaluaciones Pendientes</p>
          </div>
          <div className="stat-card">
            <h3>15</h3>
            <p>Reportes Este Mes</p>
          </div>
          <div className="stat-card">
            <h3>5</h3>
            <p>Reuniones Programadas</p>
          </div>
        </div>
        
        <div className="recent-cases">
          <h3>Casos Recientes</h3>
          <div className="cases-list">
            <div className="case-item">
              <div className="case-info">
                <h4>Ana Martínez - 4to A</h4>
                <p>Dificultades de atención - Seguimiento mensual</p>
                <span className="case-status active">Activo</span>
              </div>
              <div className="case-actions">
                <button className="btn-small">Ver Historial</button>
                <button className="btn-small">Nueva Evaluación</button>
              </div>
            </div>
            
            <div className="case-item">
              <div className="case-info">
                <h4>Pedro López - 3ro B</h4>
                <p>Evaluación de desarrollo cognitivo</p>
                <span className="case-status pending">Pendiente</span>
              </div>
              <div className="case-actions">
                <button className="btn-small">Ver Historial</button>
                <button className="btn-small">Nueva Evaluación</button>
              </div>
            </div>
            
            <div className="case-item">
              <div className="case-info">
                <h4>Sofia García - 5to A</h4>
                <p>Apoyo en habilidades sociales</p>
                <span className="case-status completed">Completado</span>
              </div>
              <div className="case-actions">
                <button className="btn-small">Ver Historial</button>
                <button className="btn-small">Nueva Evaluación</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="upcoming-appointments">
          <h3>Próximas Citas</h3>
          <div className="appointment-item">
            <div className="appointment-time">
              <span className="time">09:00</span>
              <span className="date">Hoy</span>
            </div>
            <div className="appointment-info">
              <h4>Reunión con padres - Ana Martínez</h4>
              <p>Evaluación de progreso y estrategias</p>
            </div>
          </div>
          
          <div className="appointment-item">
            <div className="appointment-time">
              <span className="time">14:30</span>
              <span className="date">Mañana</span>
            </div>
            <div className="appointment-info">
              <h4>Evaluación inicial - Pedro López</h4>
              <p>Primera sesión de evaluación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluaciones;
