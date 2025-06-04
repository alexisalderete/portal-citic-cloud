import { useEffect, useState } from 'react'

const Toast = ({ message, type = 'success', duration = 5000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false)
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    // Iniciar el temporizador para cierre automático
    const autoCloseTimer = setTimeout(() => {
      startExitAnimation()
    }, duration)

    setTimer(autoCloseTimer)

    return () => {
      clearTimeout(autoCloseTimer)
    }
  }, [duration])

  const startExitAnimation = () => {
    setIsExiting(true)
    // Esperar a que termine la animación antes de llamar a onClose
    setTimeout(() => {
      if (onClose) onClose()
    }, 300) // Debe coincidir con la duración de la animación
  }

  const handleClose = () => {
    // Limpiar el temporizador de cierre automático si se cierra manualmente
    if (timer) clearTimeout(timer)
    startExitAnimation()
  }

  const config = {
    success: {
      icon: (
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
      ),
      iconColor: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    error: {
      icon: (
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
      ),
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    warning: {
      icon: (
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
        </svg>
      ),
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-100',
    }
  }[type]

  return (
    <div className={`fixed top-4 right-4 z-[9999] ${
        isExiting ? 
          'animate-toast-exit' : 
          'animate-toast-enter'
      }`}>
        <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm" role="alert">
        <div className={`inline-flex items-center justify-center shrink-0 w-8 h-8 ${config.iconColor} ${config.bgColor} rounded-lg`}>
          {config.icon}
          <span className="sr-only">{type} icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">{message}</div>
        <button 
          type="button" 
          className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" 
          onClick={handleClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>

      <style jsx="true">{`
            @keyframes toast-enter {
                from {
                transform: translateY(-100%);
                opacity: 0;
                }
                to {
                transform: translateY(0);
                opacity: 1;
                }
            }

            @keyframes toast-exit {
                from {
                transform: translateY(0);
                opacity: 1;
                }
                to {
                transform: translateY(-100%);
                opacity: 0;
                }
            }

            .animate-toast-enter {
                animation: toast-enter 0.3s ease-out forwards;
            }

            .animate-toast-exit {
                animation: toast-exit 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  )
}

export default Toast