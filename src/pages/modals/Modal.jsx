// "use client"

import { useEffect, useRef, useState } from 'react'

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  onCancel, // Nueva prop para manejar cancelación
  onSave    // Nueva prop para manejar guardado
}) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const modalRef = useRef(null)

  // Manejar apertura/cierre con animaciones
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      // Iniciar animación de salida
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Función para cerrar con animación
  const handleClose = () => {
    if (onClose) onClose()
  }

  // Función para cancelar con animación
  const handleCancel = () => {
    if (onCancel) {
      onCancel() // Ejecuta la lógica de cancelación
    } else {
      handleClose() // Fallback al cierre normal
    }
  }

  // Función para guardar con animación
  const handleSave = () => {
    if (onSave) {
      onSave() // Ejecuta la lógica de guardado
    }
    // No cerramos automáticamente después de guardar
    // (dependerá de la lógica del padre)
  }

  if (!shouldRender) return null

  return (
    <>
      {/* Fondo difuminado */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/25 backdrop-blur-sm transition-opacity duration-300 ${
          !isOpen ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}
        // onClick={handleCancel}
      />
      
      {/* Contenido del modal */}
      <div 
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 ${
          !isOpen ? 'animate-scaleOut' : 'animate-scaleIn'
        }`}
      >
        <div 
          ref={modalRef}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-none overflow-hidden transition-all duration-300 transform"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          
          {/* Contenido principal */}
          <div className="p-4 space-y-4">
            {children}
            
            {/* Footer con botones (opcional) */}
            {(onSave || onCancel) && (
              <div className="flex justify-end space-x-3 pt-4">
                {onCancel && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
                {onSave && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Guardar
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Botón de cierre (X) */}
          <button 
            onClick={handleCancel}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Estilos para las animaciones */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-scaleOut {
          animation: scaleOut 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}