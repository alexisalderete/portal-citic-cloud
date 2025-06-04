import { useState } from "react"
import { Link } from "react-router-dom"

export function SidebarItem({ title, icon, active, childIcon, path }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubmenu = childIcon !== undefined

  // Función para renderizar el icono adecuadamente
  const renderIcon = (icon, active) => {
    if (typeof icon === 'string') {
      // Para compatibilidad con iconos antiguos (strings)
      return (
        <svg
          className={`w-5 h-5 mr-3 ${active ? "text-indigo-600" : "text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      )
    }
    // Para nuevos iconos (componentes React)
    return (
      <div className={`w-5 h-5 mr-3 ${active ? "text-indigo-600" : "text-gray-500"}`}>
        {icon}
      </div>
    )
  }

  return (
    <div className="relative">
      {hasSubmenu ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-200
            ${
              active
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          {renderIcon(icon, active)}
          <span className="flex-1 text-left">{title}</span>
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      ) : (
        <Link
          to={path}
          className={`
            flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-200
            ${
              active
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          {renderIcon(icon, active)}
          <span className="flex-1 text-left">{title}</span>
        </Link>
      )}

      {hasSubmenu && (
        <div
          className={`
            pl-10 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          {["Perfil", "Preferencias", "Seguridad"].map((item, index) => (
            <Link
              key={index}
              to={`/configuracion/${item.toLowerCase()}`}
              className="flex items-center py-2 text-sm text-gray-600 hover:text-indigo-600"
            >
              <span className="w-1 h-1 mr-3 bg-gray-400 rounded-full"></span>
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default SidebarItem