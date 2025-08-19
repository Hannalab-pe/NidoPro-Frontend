import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  AlertCircle, 
  Loader,
  Image as ImageIcon,
  CheckCircle
} from 'lucide-react';
import { uploadStudentImage } from '../../services/cloudinaryService';

const ImageUploader = ({ 
  onImageUpload, 
  currentImage = null, 
  className = '',
  disabled = false,
  required = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImage);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Actualizar preview cuando cambia currentImage
  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setError('');
    setUploadSuccess(false);
    
    // Validar archivo localmente primero
    if (!file || !file.type.startsWith('image/')) {
      setError('Archivo no válido. Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Archivo muy grande. Máximo 5MB permitido');
      return;
    }

    setUploading(true);

    try {
      // Crear URL local para preview inmediato
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Subir a Cloudinary
      const result = await uploadStudentImage(file);
      
      if (result.success) {
        setUploadSuccess(true);
        setPreview(result.thumbnailUrl);
        
        // Llamar callback con los datos de la imagen
        if (onImageUpload) {
          onImageUpload({
            url: result.url,
            publicId: result.publicId,
            thumbnailUrl: result.thumbnailUrl,
            detailUrl: result.detailUrl
          });
        }

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Error al subir la imagen');
      setPreview(null);
      
      // Llamar callback con null para indicar error
      if (onImageUpload) {
        onImageUpload(null);
      }
    } finally {
      setUploading(false);
      // Limpiar input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError('');
    setUploadSuccess(false);
    
    if (onImageUpload) {
      onImageUpload(null);
    }
  };

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`image-uploader ${className}`}>
      <div className="space-y-3">
        {/* Área de upload */}
        <div 
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
            ${preview ? 'border-gray-300' : 'border-gray-400 hover:border-blue-500'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${error ? 'border-red-400' : ''}
            ${uploadSuccess ? 'border-green-400' : ''}
          `}
          onClick={!preview ? triggerFileInput : undefined}
        >
          {/* Preview de imagen */}
          {preview ? (
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-white shadow-lg"
              />
              
              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={disabled || uploading}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                    title="Cambiar imagen"
                  >
                    <Camera size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={disabled || uploading}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    title="Eliminar imagen"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Indicador de carga */}
              {uploading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
                  <Loader className="animate-spin text-blue-500" size={24} />
                </div>
              )}

              {/* Indicador de éxito */}
              {uploadSuccess && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                  <CheckCircle size={16} />
                </div>
              )}
            </div>
          ) : (
            /* Área de drop/upload */
            <div className="py-8">
              {uploading ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader className="animate-spin text-blue-500" size={32} />
                  <p className="text-gray-600">Subiendo imagen...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-gray-100 rounded-full p-4">
                    <ImageIcon className="text-gray-400" size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-700 font-medium">
                      Subir foto del estudiante {required && <span className="text-red-500">*</span>}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Haz clic o arrastra una imagen aquí
                    </p>
                    <p className="text-gray-400 text-xs">
                      PNG, JPG hasta 5MB
                    </p>
                  </div>
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    disabled={disabled}
                  >
                    <Upload size={16} />
                    <span>Seleccionar archivo</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {/* Mensaje de error */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Mensaje de éxito */}
        {uploadSuccess && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
            <CheckCircle size={16} />
            <span className="text-sm">¡Imagen subida exitosamente!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
