import React from 'react';

const Hijos = () => {
  return (
    <div className="children-page">
      <div className="page-header">
        <h1>Mis Hijos</h1>
        <p>Seguimiento académico y desarrollo de tus hijos</p>
      </div>
      
      <div className="children-content">
        <div className="children-grid">
          <div className="child-card">
            <div className="child-header">
              <div className="child-avatar">
                <span>👧</span>
              </div>
              <div className="child-info">
                <h3>María González</h3>
                <p>5to Grado A - 10 años</p>
              </div>
            </div>
            
            <div className="child-stats">
              <div className="stat-item">
                <span className="stat-label">Promedio General</span>
                <span className="stat-value good">8.7</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Asistencia</span>
                <span className="stat-value excellent">98%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tareas Entregadas</span>
                <span className="stat-value good">15/16</span>
              </div>
            </div>
            
            <div className="child-actions">
              <button className="btn-small">Ver Calificaciones</button>
              <button className="btn-small">Comunicar con Docente</button>
            </div>
          </div>
          
          <div className="child-card">
            <div className="child-header">
              <div className="child-avatar">
                <span>👦</span>
              </div>
              <div className="child-info">
                <h3>Carlos González</h3>
                <p>3er Grado B - 8 años</p>
              </div>
            </div>
            
            <div className="child-stats">
              <div className="stat-item">
                <span className="stat-label">Promedio General</span>
                <span className="stat-value excellent">9.2</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Asistencia</span>
                <span className="stat-value good">95%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tareas Entregadas</span>
                <span className="stat-value excellent">14/14</span>
              </div>
            </div>
            
            <div className="child-actions">
              <button className="btn-small">Ver Calificaciones</button>
              <button className="btn-small">Comunicar con Docente</button>
            </div>
          </div>
        </div>
        
        <div className="recent-notifications">
          <h3>Notificaciones Recientes</h3>
          <div className="notification-item">
            <span className="notification-icon">📝</span>
            <div className="notification-content">
              <p><strong>Nueva tarea asignada</strong> - Matemáticas 5A</p>
              <span className="notification-time">Hace 2 horas</span>
            </div>
          </div>
          <div className="notification-item">
            <span className="notification-icon">📊</span>
            <div className="notification-content">
              <p><strong>Calificación publicada</strong> - Ciencias 3B</p>
              <span className="notification-time">Ayer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hijos;

