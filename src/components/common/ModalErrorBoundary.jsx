import React from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

class ModalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ModalErrorBoundary - Error capturado:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
  };

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-lg w-full mx-4 bg-white rounded-lg shadow-xl p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Error en Modal de Matrícula
            </h2>
            
            <p className="text-gray-600 mb-4 text-center">
              Se produjo un error al cargar el modal de matrícula. Esto puede deberse a:
            </p>

            <ul className="text-sm text-gray-600 mb-6 space-y-1">
              <li>• Problemas de conexión con el servidor</li>
              <li>• Error al cargar aulas por grado</li>
              <li>• Problemas con la validación de formulario</li>
              <li>• Error en el hook useAulasAsignacion</li>
            </ul>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar nuevamente
              </button>
              
              <button
                onClick={() => {
                  this.handleRetry();
                  if (this.props.onClose) {
                    this.props.onClose();
                  }
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar modal
              </button>

              <button
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bug className="w-4 h-4 mr-2" />
                {this.state.showDetails ? 'Ocultar' : 'Ver'} detalles técnicos
              </button>
            </div>

            {/* Detalles técnicos del error */}
            {this.state.showDetails && this.state.error && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold text-sm text-red-800 mb-2">Detalles del error:</p>
                <p className="text-xs text-red-700 mb-2 font-mono break-all">
                  {this.state.error.toString()}
                </p>
                
                {this.state.errorInfo && (
                  <>
                    <p className="font-semibold text-sm text-red-800 mb-2">Stack trace:</p>
                    <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono max-h-32 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Consejo:</strong> Si el problema persiste, revisa la consola del navegador (F12) 
                para obtener más información o contacta al soporte técnico.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ModalErrorBoundary;
