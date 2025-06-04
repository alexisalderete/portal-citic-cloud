import { useEffect, useRef, useState } from 'react'

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  tipo = 'question', // Valor por defecto
  isLoading,
  error = null ,
}) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const modalRef = useRef(null)

  // Configuración de estilos según el tipo de alerta
  const alertConfig = {
    question: {
      bgFrom: 'from-blue-500',
      bgTo: 'to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    success: {
      bgFrom: 'from-green-500',
      bgTo: 'to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    warning: {
      bgFrom: 'from-yellow-500',
      bgTo: 'to-yellow-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    },
    error: {
      bgFrom: 'from-red-500',
      bgTo: 'to-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    },
    info: {
      bgFrom: 'from-blue-500',
      bgTo: 'to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }

  // Obtener la configuración según el tipo o usar question por defecto
  const config = alertConfig[tipo] || alertConfig.question

  // Manejar apertura/cierre con animaciones
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <>
      {/* Fondo difuminado */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/25 backdrop-blur-sm transition-opacity duration-300 ${
          !isOpen ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}
        onClick={onClose}
      />
      
      {/* Contenido del modal */}
      <div 
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 ${
          !isOpen ? 'animate-scaleOut' : 'animate-scaleIn'
        }`}
      >
        <div 
          ref={modalRef}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transition-all duration-300 transform"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado con gradiente */}
          <div className={`bg-gradient-to-r ${config.bgFrom} ${config.bgTo} p-2`}>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          
          {/* Contenido principal */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm mb-4">
                {error}
              </div>
            )}
            <div className="flex items-start">
              {/* Icono */}
              <div className="flex-shrink-0 mr-4">
                <div className={`flex items-center justify-center h-10 w-10 rounded-full ${config.iconBg}`}>
                  <svg
                    className={`h-6 w-6 ${config.iconColor}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={config.iconPath}
                    />
                  </svg>
                </div>
              </div>
              
              {/* Mensaje */}
              <div className="mt-1">
                <p className="text-gray-700">{message}</p>
              </div>
            </div>
            
            {/* Footer con botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  'Confirmar'
                )}
              </button>
            </div>
          </div>
          
          {/* Botón de cierre (X) */}
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50 cursor-pointer"
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