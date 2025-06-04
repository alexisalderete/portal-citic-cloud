import { useAuth } from "../contexts/AuthContext"
import { MaterialContext } from "../contexts/MaterialesContext"
import { useContext, useState } from "react"

export default function MaterialCard({ material, onEdit, onDelete }) {
  const { currentUser } = useAuth(); // para obtener el tipo de usuario
  
  // const { deleteMaterial } = useContext(MaterialContext)
  // const [isDeleting, setIsDeleting] = useState(false)

    // Determinar permisos basados en el tipo de usuario
    const isAdmin = currentUser?.tipo === 'admin';
    const isProfesor = currentUser?.tipo === 'profesor';
    const isEstudiante = currentUser?.tipo === 'estudiante';

  // Función para determinar el color del badge según el tipo de visibilidad
  // const getBadgeColor = (visibilityType) => {
  //   switch (visibilityType) {
  //     case "curso":
  //       return "bg-green-100 text-green-800"
  //     case "sede":
  //       return "bg-blue-100 text-blue-800"
  //     case "estudiante":
  //       return "bg-purple-100 text-purple-800"
  //     case "publico":
  //       return "bg-yellow-100 text-yellow-800"
  //     default:
  //       return "bg-gray-100 text-gray-800"
  //   }
  // }

  // Función para obtener el texto de visibilidad
  // const getVisibilityText = (material) => {
  //   switch (material.visibilityType) {
  //     case "curso":
  //       return `Curso: ${material.visibilityValue}`
  //     case "sede":
  //       return `Sede: ${material.visibilityValue}`
  //     case "estudiante":
  //       return `Estudiante: ${material.visibilityValue}`
  //     case "publico":
  //       return "Público general"
  //     default:
  //       return "Desconocido"
  //   }
  // }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{material.materiales_nombre}</h3>
          {(isAdmin || isProfesor) && (
            <div className="flex space-x-2">  
                <button
                onClick={onEdit}
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                aria-label="Editar material"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(material)}
                className="text-gray-500 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                aria-label="Eliminar material"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{material.materiales_descripcion}</p>

        <div className="flex items-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs text-gray-500">Google Drive</span>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
               ${//getBadgeColor(material.visibilityType)
               'bg-green-100 text-green-800'}`
                }
          >
            {material.cursos_nombre}
          </span>

          <a
            href={material.materiales_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            Ver material
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
