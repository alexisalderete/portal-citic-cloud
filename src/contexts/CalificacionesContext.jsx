

import { createContext, useState, useContext, useEffect } from "react"
import { getGrades, createGrade, updateGrade, deleteGrade } from "../services/CalificacionesService"

const GradesContext = createContext()

export function GradesProvider({ children }) {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0) // Nuevo estado para el total de registros

  const [currentPageState, setCurrentPageState] = useState(1)
  const [itemsPerPageState, setItemsPerPageState] = useState(5)
  const [searchTermState, setSearchTermState] = useState("")
  const [sortConfigState, setSortConfigState] = useState({ key: "estudiantes_nombre", direction: "asc" })






  // Función para cargar datos con paginación
  const loadGrades = async (page = 1, perPage = 5, search = '', sortConfig = sortConfigState) => {
    setLoading(true);
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams({
        page,
        perPage,
        search,
        sortBy: sortConfig.key,
        sortDir: sortConfig.direction
      });
      
      const data = await getGrades(params.toString());
      
      setGrades(data.data || []);
      setTotalCount(data.total || 0);
      setCurrentPageState(page);
      setItemsPerPageState(perPage);
      setSearchTermState(search);
      setSortConfigState(sortConfig);
      
    } catch (error) {
      console.error("Error loading grades:", error);
    } finally {
      setLoading(false);
    }
  };


  const addGrade = async (newGrade) => {
    try {
      const createdGrade = await createGrade(newGrade);
      await loadGrades(currentPageState, itemsPerPageState, searchTermState, sortConfigState);
      return createdGrade;
    } catch (error) {
      console.error("Error adding grade:", error);
      throw error;
    }
  }

  const updateGradeContext = async (id, updatedGrade) => {
    try {
      const updated = await updateGrade(id, updatedGrade);
      await loadGrades(currentPageState, itemsPerPageState, searchTermState, sortConfigState);
      return updated;
    } catch (error) {
      console.error("Error updating grade:", error);
      throw error;
    }
  }

  const deleteGradeContext = async (id) => {
    try {
      await deleteGrade(id);
      // Recalcular página actual si es necesario
      const newTotal = totalCount - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPageState);
      const newPage = currentPageState > newTotalPages ? Math.max(1, newTotalPages) : currentPageState;
      
      await loadGrades(newPage, itemsPerPageState, searchTermState, sortConfigState);
    } catch (error) {
      console.error("Error deleting grade:", error);
      throw error;
    }
  }

  const getGradeById = (id) => {
    return grades.find((grade) => grade.calificaciones_id === id);
  }

  useEffect(() => {
    loadGrades()
  }, [])

  return (
    <GradesContext.Provider
      value={{
        grades,
        loading,
        totalCount,
        loadGrades,
        addGrade,
        updateGrade: updateGradeContext,
        deleteGrade: deleteGradeContext,
        getGradeById,
      }}
    >
      {children}
    </GradesContext.Provider>
  )
}

export function useGrades() {
  const context = useContext(GradesContext)
  if (!context) {
    throw new Error("useGrades must be used within a GradesProvider")
  }
  return context
}
