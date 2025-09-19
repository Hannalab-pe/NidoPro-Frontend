import React, { useState, useEffect } from 'react';
import { UserCheck, RefreshCw } from 'lucide-react';
import EvaluacionDocenteModal from './modales/EvaluacionDocenteModal';
import ModalVerEvaluacion from './modales/ModalVerEvaluacion';
import TablaEvaluacionesDocente from './tablas/TablaEvaluacionesDocente';
import { evaluacionService } from '../../../services/evaluacionService';
import { toast } from 'sonner';

const BimestralDocente = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);

  const fetchEvaluaciones = async () => {
    try {
      setLoading(true);
      const data = await evaluacionService.getEvaluacionesDocente();
      console.log('Evaluaciones data:', data);
      console.log('Is array:', Array.isArray(data));
      setEvaluaciones(data);
    } catch (error) {
      console.error('Error fetching evaluaciones:', error);
      toast.error('Error al cargar las evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluaciones();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewEvaluacion = (evaluacion) => {
    setSelectedEvaluacion(evaluacion);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedEvaluacion(null);
  };

  const handleRefresh = () => {
    fetchEvaluaciones();
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Evaluación Bimestral Docente</h1>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md cursor-pointer flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer flex items-center gap-2"
            >
              <UserCheck size={20} />
              Evaluar Docente
            </button>
          </div>
        </div>

        <TablaEvaluacionesDocente
          evaluaciones={evaluaciones}
          loading={loading}
          onViewEvaluacion={handleViewEvaluacion}
        />
      </div>

      <EvaluacionDocenteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchEvaluaciones}
      />

      <ModalVerEvaluacion
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        evaluacion={selectedEvaluacion}
      />
    </>
  );
};

export default BimestralDocente;