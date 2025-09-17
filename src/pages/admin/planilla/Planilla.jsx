// src/pages/admin/planilla/Planilla.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useTrabajadoresTipoContratoPlanilla } from '../../../hooks/queries/usePlanillaQueries';
import { useAuthStore } from '../../../store';
import {
  Users,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  FileText,
  Plus,
  CheckSquare,
  Square,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import planillaService from '../../../services/planillaService';

const Planilla = () => {
  // Obtener fecha actual para valores por defecto
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1
  const currentYear = currentDate.getFullYear();

  // Estados para filtros
  const [selectedMes, setSelectedMes] = useState(currentMonth.toString());
  const [selectedAnio, setSelectedAnio] = useState(currentYear.toString());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para selección de trabajadores
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTrabajadores, setSelectedTrabajadores] = useState([]);
  const [isCreatingPlanilla, setIsCreatingPlanilla] = useState(false);

  // Obtener usuario del store
  const { user } = useAuthStore();

  // Hook para obtener trabajadores con contrato planilla
  const {
    data: trabajadores = [],
    isLoading: loading,
    error,
    refetch
  } = useTrabajadoresTipoContratoPlanilla({
    mes: selectedMes,
    anio: selectedAnio
  });

  // Filtrar trabajadores por búsqueda local
  const filteredTrabajadores = useMemo(() => {
    if (!searchTerm) return trabajadores;
    return trabajadores.filter(trabajador =>
      trabajador.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.nroDocumento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.correo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trabajadores, searchTerm]);

  // Función para refrescar datos
  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Datos actualizados correctamente');
    } catch (error) {
      toast.error('Error al actualizar los datos');
    }
  };

  // Función para cambiar período
  const handlePeriodoChange = async () => {
    if (!selectedMes || !selectedAnio) {
      toast.error('Debe seleccionar mes y año');
      return;
    }
    await refetch();
  };

  // Función para activar modo selección
  const handleEnableSelection = () => {
    setIsSelectionMode(true);
    setSelectedTrabajadores([]);
  };

  // Función para cancelar selección
  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedTrabajadores([]);
  };

  // Función para seleccionar/deseleccionar trabajador
  const handleToggleTrabajador = (trabajador) => {
    setSelectedTrabajadores(prev => {
      const isSelected = prev.some(t => t.idTrabajador === trabajador.idTrabajador);
      if (isSelected) {
        return prev.filter(t => t.idTrabajador !== trabajador.idTrabajador);
      } else {
        return [...prev, trabajador];
      }
    });
  };

  // Función para seleccionar todos los trabajadores
  const handleSelectAll = () => {
    if (selectedTrabajadores.length === filteredTrabajadores.length) {
      setSelectedTrabajadores([]);
    } else {
      setSelectedTrabajadores(filteredTrabajadores);
    }
  };

  // Función para crear planilla con trabajadores seleccionados
  const handleCreatePlanilla = async () => {
    if (selectedTrabajadores.length === 0) {
      toast.error('Debe seleccionar al menos un trabajador');
      return;
    }

    // Obtener entidadId - primero del store, luego del localStorage
    console.log('🔍 Verificando información del usuario...');
    console.log('📋 user del store:', user);
    
    let entidadId = user?.entidadId;
    
    if (!entidadId) {
      console.log('⚠️ No se encontró entidadId en el store, intentando localStorage...');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('📋 userData del localStorage:', userData);
      entidadId = userData?.entidadId;
    }
    
    console.log('🆔 entidadId final:', entidadId);

    if (!entidadId) {
      console.error('❌ No se pudo encontrar entidadId ni en store ni en localStorage');
      console.log('🔍 Store user keys:', user ? Object.keys(user) : 'user is null');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('🔍 localStorage user keys:', Object.keys(userData));
      toast.error('No se pudo obtener la información del usuario');
      return;
    }

    // Calcular fecha de pago programada (último día del mes)
    // JavaScript usa meses 0-11, así que restamos 1 al mes seleccionado
    const fechaPagoProgramada = new Date(parseInt(selectedAnio), parseInt(selectedMes) - 1, 0);
    const fechaPagoString = fechaPagoProgramada.toISOString().split('T')[0];
    
    console.log('📅 Fecha de pago calculada:', {
      selectedMes,
      selectedAnio,
      mesJS: parseInt(selectedMes) - 1,
      fechaPagoProgramada,
      fechaPagoString
    });

    const payload = {
      mes: parseInt(selectedMes),
      anio: parseInt(selectedAnio),
      fechaPagoProgramada: fechaPagoString,
      trabajadores: selectedTrabajadores.map(t => t.idTrabajador),
      generadoPor: entidadId
    };

    // Validar que tenemos todos los datos necesarios
    if (!entidadId) {
      console.error('❌ No se pudo obtener entidadId para crear la planilla');
      toast.error('No se pudo obtener la información del usuario. Por favor, recarga la página e intenta nuevamente.');
      return;
    }

    if (selectedTrabajadores.length === 0) {
      console.error('❌ No hay trabajadores seleccionados');
      toast.error('Debe seleccionar al menos un trabajador para crear la planilla');
      return;
    }

    console.log('📤 Enviando payload a crear planilla:', payload);
    console.log('👥 Detalles de trabajadores seleccionados:', {
      cantidad: selectedTrabajadores.length,
      trabajadores: selectedTrabajadores.map(t => ({ idTrabajador: t.idTrabajador, nombre: t.nombre, apellido: t.apellido }))
    });
    console.log('🆔 entidadId usado:', entidadId);

    setIsCreatingPlanilla(true);
    try {
      const response = await planillaService.generarPlanillasConTrabajadores(payload);
      console.log('✅ Respuesta del servidor:', response);

      toast.success(`Planilla creada exitosamente con ${selectedTrabajadores.length} trabajadores`);
      
      // Limpiar selección y salir del modo selección
      setIsSelectionMode(false);
      setSelectedTrabajadores([]);
      
      // Refrescar datos
      await refetch();
    } catch (error) {
      console.error('❌ Error al crear planilla:', error);
      
      // Si el error es 409 (Conflict) o es un error de conflicto personalizado
      if (error.response?.status === 409 || error.status === 409 || error.isConflict || error.message.includes('Ya existe una planilla')) {
        console.log('🔄 Detectado error de conflicto - Planilla ya existe para este período');
        console.log('📊 Detalles del error:', { status: error.status, isConflict: error.isConflict, message: error.message });
        console.log('🔄 Planilla ya existe para este período, intentando agregar trabajadores...');
        
        try {
          // Obtener la planilla existente por período
          const planillaExistente = await planillaService.obtenerPlanillaPorPeriodo(selectedMes, selectedAnio);
          console.log('📋 Planilla existente encontrada:', planillaExistente);
          
          if (planillaExistente && planillaExistente.idPlanillaMensual) {
            console.log('✅ Planilla existente válida con ID:', planillaExistente.idPlanillaMensual);
            // Agregar trabajadores a la planilla existente
            // Extraer solo los IDs de los trabajadores seleccionados
            const trabajadoresIds = selectedTrabajadores.map(trabajador => trabajador.idTrabajador);
            
            const agregarPayload = {
              trabajadores: trabajadoresIds,
              generadoPor: entidadId
            };
            
            console.log('📤 Agregando trabajadores a planilla existente:', agregarPayload);
            
            const responseAgregar = await planillaService.agregarTrabajadoresAPlanilla(
              planillaExistente.idPlanillaMensual, 
              trabajadoresIds,
              entidadId
            );
            
            console.log('✅ Trabajadores agregados exitosamente:', responseAgregar);
            toast.success(`Trabajadores agregados exitosamente a la planilla existente`);
            
            // Limpiar selección y salir del modo selección
            setIsSelectionMode(false);
            setSelectedTrabajadores([]);
            
            // Refrescar datos
            await refetch();
          } else {
            console.error('❌ Planilla existente no tiene ID válido:', planillaExistente);
            toast.error('La planilla existente no tiene un ID válido. Contacte al administrador.');
          }
        } catch (agregarError) {
          console.error('❌ Error al agregar trabajadores a planilla existente:', agregarError);
          
          // Si el error es 404, significa que no existe planilla para este período
          if (agregarError.response?.status === 404) {
            toast.error('No se encontró una planilla existente para este período. Intente crear una nueva planilla.');
          } else {
            toast.error(agregarError.response?.data?.message || 'Error al agregar trabajadores a la planilla existente');
          }
        }
      } else {
        // Error diferente a 409
        toast.error(error.response?.data?.message || 'Error al crear la planilla');
      }
    } finally {
      setIsCreatingPlanilla(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Usuario no autenticado
          </h3>
          <p className="text-gray-600">
            Debe iniciar sesión para acceder a esta funcionalidad
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar los datos
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || 'Ha ocurrido un error inesperado'}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Planillas</h1>
          <p className="text-gray-600 mt-1">
            Trabajadores con contrato de planilla - {selectedMes}/{selectedAnio}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isSelectionMode ? (
            <>
              <button
                onClick={handleEnableSelection}
                disabled={loading || filteredTrabajadores.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Agregar a Planilla
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancelSelection}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {selectedTrabajadores.length === filteredTrabajadores.length ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    Deseleccionar Todos
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    Seleccionar Todos
                  </>
                )}
              </button>
              <button
                onClick={handleCreatePlanilla}
                disabled={selectedTrabajadores.length === 0 || isCreatingPlanilla}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isCreatingPlanilla ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Crear Planilla ({selectedTrabajadores.length})
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trabajadores</p>
              <p className="text-2xl font-bold text-gray-900">{trabajadores.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">Con contrato planilla</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Período Actual</p>
              <p className="text-2xl font-bold text-gray-900">{selectedMes}/{selectedAnio}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FileText className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-blue-600">Listos para planilla</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estado del Sistema</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? 'Cargando...' : 'Activo'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">Sistema operativo</span>
          </div>
        </div>
      </div>

      {/* Controles de búsqueda y filtros */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar trabajadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Controles de período */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Mes:</label>
              <select
                value={selectedMes}
                onChange={(e) => setSelectedMes(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Año:</label>
              <select
                value={selectedAnio}
                onChange={(e) => setSelectedAnio(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>

            <button
              onClick={handlePeriodoChange}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de trabajadores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isSelectionMode ? 'Seleccionar Trabajadores para Planilla' : 'Trabajadores con Contrato Planilla'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isSelectionMode 
                  ? `${selectedTrabajadores.length} de ${filteredTrabajadores.length} trabajadores seleccionados`
                  : `${filteredTrabajadores.length} trabajadores encontrados`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Cargando trabajadores...</span>
            </div>
          ) : filteredTrabajadores.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay trabajadores con contrato planilla
              </h3>
              <p className="text-gray-600">
                No se encontraron trabajadores para el período {selectedMes}/{selectedAnio}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {isSelectionMode && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seleccionar
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trabajador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contrato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sueldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTrabajadores.map((trabajador) => (
                    <tr key={trabajador.idTrabajador} className="hover:bg-gray-50">
                      {/* Checkbox de selección */}
                      {isSelectionMode && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedTrabajadores.some(t => t.idTrabajador === trabajador.idTrabajador)}
                            onChange={() => handleToggleTrabajador(trabajador)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                      )}
                      {/* Trabajador */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {trabajador.nombre?.charAt(0)}{trabajador.apellido?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {trabajador.nombre} {trabajador.apellido}
                            </div>
                            <div className="text-sm text-gray-500">
                              {trabajador.direccion}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Documento */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {trabajador.tipoDocumento}: {trabajador.nroDocumento}
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {trabajador.telefono}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trabajador.correo}
                        </div>
                      </td>

                      {/* Contrato */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {trabajador.contratoTrabajadors3?.[0]?.numeroContrato || 'Sin contrato'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trabajador.contratoTrabajadors3?.[0]?.cargoContrato || ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trabajador.contratoTrabajadors3?.[0]?.lugarTrabajo || ''}
                        </div>
                      </td>

                      {/* Sueldo */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          S/ {trabajador.contratoTrabajadors3?.[0]?.sueldoContratado || '0.00'}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trabajador.estaActivo
                            ? 'text-green-700 bg-green-100'
                            : 'text-red-700 bg-red-100'
                        }`}>
                          {trabajador.estaActivo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Planilla;