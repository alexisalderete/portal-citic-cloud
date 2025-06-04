

import { useState, useEffect } from "react"
import { useGrades } from "../../contexts/CalificacionesContext"
import ConfirmDialog from "../modals/ConfirmDialog"

import GradeForm from "./CalificacionesNew"
import Modal from "../modals/Modal"
import { useAuth } from "../../contexts/AuthContext"
import Toast from "../modals/Toast"


// Hook para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function GradesList({ onEdit }) {
  const { grades, deleteGrade, loading, totalCount, loadGrades } = useGrades();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "estudiantes_nombre", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGrade, setEditingGrade] = useState(null)

  const { currentUser } = useAuth(); // para obtener el tipo de usuario

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    
    // Opcional: Eliminar automáticamente después de 5 segundos
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Determinar permisos basados en el tipo de usuario
  const isAdmin = currentUser?.tipo === 'admin';
  const isProfesor = currentUser?.tipo === 'profesor';
  const isEstudiante = currentUser?.tipo === 'estudiante';

      // Filtrar calificaciones si es estudiante
  // useEffect(() => {
  //   if (isEstudiante) {
  //     // Filtrar para mostrar solo las calificaciones del estudiante actual
  //     // Esto depende de cómo identifiques al estudiante en tus datos
  //     const filtered = grades.filter(grade => 
  //       grade.estudiantes_nombre === currentUser.username
  //     );
  //     loadGrades(filtered);
  //     //setGrades(filtered);
  //   }
  // }, [grades, isEstudiante, currentUser]);

  // Efecto para manejar la búsqueda con debounce
  useEffect(() => {
    setCurrentPage(1);
    loadGrades(1, itemsPerPage, debouncedSearchTerm, sortConfig);
  }, [debouncedSearchTerm, itemsPerPage, sortConfig]);
  

  const handleEdit = (grade) => {
    setEditingGrade(grade)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingGrade(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }



  // Función para manejar cambios de página
  const handlePageChange = (page) => {
    setCurrentPage(page)
    loadGrades(page, itemsPerPage, debouncedSearchTerm, sortConfig)
  }

  // Función para manejar búsqueda con debounce
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    loadGrades(1, itemsPerPage, term, sortConfig);
  };

  // Función para cambiar el orden
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    const newSortConfig = { key, direction }
    setSortConfig(newSortConfig)
    setCurrentPage(1)
    loadGrades(1, itemsPerPage, searchTerm, newSortConfig)
  }

  // Función para formatear la fecha
  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "short", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString("es-ES", options);
  // };

  // Función para obtener el color de la calificación
  const getGradeColor1 = (grade1) => {
    if (grade1 >= 5) return "text-green-600";
    if (grade1 >= 4) return "text-blue-600";
    if (grade1 >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor2 = (grade2) => {
    if (grade2 >= 5) return "text-green-600";
    if (grade2 >= 4) return "text-blue-600";
    if (grade2 >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  // Función para confirmar eliminación
// Modifica la función handleConfirmDelete
const handleConfirmDelete = async () => {
  if (confirmDelete) {
    setIsDeleteLoading(true);
    setDeleteError(null);
    
    try {
      await deleteGrade(confirmDelete);
      setConfirmDelete(null);
      addToast("Calificación eliminada exitosamente", "success");
    } catch (error) {
      addToast(error.message || 'Error al eliminar la calificación', 'error')
    }
    finally {
      setIsDeleteLoading(false);
    }
  }
};

  // Componente de paginación
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxVisiblePages = 5; // Número máximo de páginas visibles
    const showEdgeButtons = true; // Mostrar botones de primera/última página
    const showEllipsis = true; // Mostrar puntos suspensivos



    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    // Calcula el rango de páginas a mostrar
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajusta si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            Anterior
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalCount)}
              </span>{' '}
              de <span className="font-medium">{totalCount}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {/* Botón Primera página */}
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
              >
                <span className="sr-only">Primera</span>
                <span>&laquo;</span>
              </button>
              
              {/* Botón Anterior */}
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
              >
                <span className="sr-only">Anterior</span>
                <span>&lsaquo;</span>
              </button>
  
              {/* Mostrar puntos suspensivos si hay páginas antes del rango visible */}
              {startPage > 1 && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              )}
  
              {/* Números de página */}
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => onPageChange(number)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === number
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 cursor-pointer'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  {number}
                </button>
              ))}
  
              {/* Mostrar puntos suspensivos si hay páginas después del rango visible */}
              {endPage < totalPages && (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              )}
  
              {/* Botón Siguiente */}
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
              >
                <span className="sr-only">Siguiente</span>
                <span>&rsaquo;</span>
              </button>
  
              {/* Botón Última página */}
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
              >
                <span className="sr-only">Última</span>
                <span>&raquo;</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
  <div className="relative">

    {toasts.map(toast => (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => removeToast(toast.id)}
      />
    ))}

    <div className={` ${isFormOpen ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
      <div className="flex-col md:flex-row md:items-center justify-between gap-4"> {/* flex quitado */}
        {/* <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Calificaciones</h1>
          <p className="text-gray-600 mt-1">Gestiona las calificaciones de tus estudiantes</p>
        </div> */}

        {(isAdmin || isProfesor) && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center cursor-pointer mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
            Agregar
          </button>
        )}

      </div>

      {/* <StatsCards grades={grades} /> */}

      {/* <GradesList onEdit={handleEdit} /> */}

      
    </div>
    
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Listado de Calificaciones</h2>
          {(isAdmin || isProfesor) && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Estudiante o curso..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-sm text-gray-700">Items por página:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const newItemsPerPage = Number(e.target.value);
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1);
              loadGrades(1, newItemsPerPage, searchTerm, sortConfig);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      

      <div className="overflow-x-auto">
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {(isAdmin || isProfesor) && (
                <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("estudiantes_nombre")}
              >
                <div className="flex items-center">
                  Estudiante
                  {sortConfig.key === "estudiantes_nombre" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={sortConfig.direction === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                      />
                    </svg>
                  )}
                </div>
              </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("cursos_nombre")}
              >
                <div className="flex items-center">
                  Curso
                  {sortConfig.key === "cursos_nombre" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={sortConfig.direction === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                      />
                    </svg>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("calificaciones_primer")}
              >
                <div className="flex items-center">
                  CAL. 1ER SEMESTRE
                  {sortConfig.key === "calificaciones_primer" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={sortConfig.direction === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                      />
                    </svg>
                  )}
                </div>
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("calificaciones_segundo")}
              >
                <div className="flex items-center">
                  CAL. 2DO SEMESTRE
                  {sortConfig.key === "calificaciones_segundo" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={sortConfig.direction === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                      />
                    </svg>
                  )}
                </div>
              </th>


              {/* <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center">
                  Fecha
                  {sortConfig.key === "date" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={sortConfig.direction === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                      />
                    </svg>
                  )}
                </div>
              </th> */}
              {(isAdmin) && (
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grades.length > 0 ? (
              grades.map((grade) => (
                <tr key={grade.calificaciones_id} className="hover:bg-gray-50">
                  {(isAdmin || isProfesor) && (
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {grade.estudiantes_nombre} {grade.estudiantes_apellido}
                    </div>
                  </td>
                  )}
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{grade.cursos_nombre}</div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getGradeColor1(grade.calificaciones_primer)}`}>{grade.calificaciones_primer}</div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getGradeColor2(grade.calificaciones_segundo)}`}>{grade.calificaciones_segundo}</div>
                  </td>
                  {/* <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(grade.date)}</div>
                  </td> */}
                  {(isAdmin) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(grade)} className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      
                        <path
                          fillRule="evenodd"
                          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button onClick={() => setConfirmDelete(grade.calificaciones_id)} className="text-red-600 hover:text-red-900 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron calificaciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        {/* Paginación - usa totalCount en lugar de filteredGrades.length */}
        {totalCount > itemsPerPage && (
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      )}



    {showSuccessModal && (
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Éxito"
      >
        <div className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-gray-700">La calificación se eliminó correctamente.</p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
    )}


    <ConfirmDialog
      isOpen={confirmDelete !== null}
      onClose={() => {
        setConfirmDelete(null);
        setDeleteError(null);
      }}
      onConfirm={handleConfirmDelete}
      tipo={deleteError ? 'error' : 'question'}
      title={deleteError ? "Error al eliminar" : "Eliminar Calificación"}
      message={deleteError || "¿Estás seguro de que deseas eliminar esta calificación? Esta acción no se puede deshacer."}
      isLoading={isDeleteLoading}
      error={deleteError}
    />
    </div>




      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingGrade ? "Editar Calificación" : "Agregar Calificación"}
      >
        <GradeForm grade={editingGrade} onClose={handleCloseForm} />
      </Modal>

      <div className={` ${isFormOpen ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
        {/* ... resto del código ... */}
      </div>

    </div>
  )
}