import { createContext, useState, useEffect, useContext } from "react"
import { getAllMaterials, createMaterial, updateMaterial, deleteMaterial, createMaterialCursos,updateMaterialCursos, getAllCursos } from "../services/MaterialesService"

// Crear el contexto
export const MaterialContext = createContext()

// Proveedor del contexto
export const MaterialProvider = ({ children }) => {
  const [materials, setMaterials] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0) // Nuevo estado para el total de registros

  const [currentPageState, setCurrentPageState] = useState(1)
  const [itemsPerPageState, setItemsPerPageState] = useState(6)
  const [searchTermState, setSearchTermState] = useState("")
  const [sortConfigState, setSortConfigState] = useState({ key: "materiales_created_at", direction: "desc" })

  const loadMaterials = async (page = 1, perPage = 6, search = '', sortConfig = sortConfigState) => {
    setLoading(true);
        try {
          // Construir parámetros de consulta
          const params = new URLSearchParams({
            page,
            perPage,
            search,
            sortBy: sortConfig.key || "materiales_created_at",
            sortDir: sortConfig.direction || "desc"
          });
          
          const data = await getAllMaterials(params.toString());
          
          setMaterials(data.data || []);
          setTotalCount(data.total || 0);
          setCurrentPageState(page);
          setItemsPerPageState(perPage);
          setSearchTermState(search);
          setSortConfigState(sortConfig);
          
        } catch (error) {
          console.error("Error loading materials:", error);
        } finally {
          setLoading(false);
        }
  }

  const loadCursos = async () => {
    try {
      const data = await getAllCursos();
      setCursos(data.data || []);
      return data;
    } catch (error) {
      console.error("Error loading cursos:", error);
    }
  }


 const addMaterial = async (materialData) => {
    try {
      const createdMaterial = await createMaterial(materialData);
      await loadMaterials(currentPageState, itemsPerPageState, searchTermState, sortConfigState);
      return createdMaterial;
    } catch (error) {
      console.error("Error adding material:", error);
      throw error;
    }
  }

  const updateMaterialContext = async (id, updatedMaterial) => {
    try {
      const updated = await updateMaterial(id, updatedMaterial);
      await loadMaterials(currentPageState, itemsPerPageState, searchTermState, sortConfigState);
      return updated;
    } catch (error) {
      console.error("Error updating material:", error);
      throw error;
    }
  }

  const deleteMaterialContext = async (id) => {
    console.log('ID recibido en contexto:', id); 
    try {
      await deleteMaterial(id);
      // Recalcular página actual si es necesario
      const newTotal = totalCount - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPageState);
      const newPage = currentPageState > newTotalPages ? Math.max(1, newTotalPages) : currentPageState;
      
      await loadMaterials(newPage, itemsPerPageState, searchTermState, sortConfigState);
    } catch (error) {
      console.error("Error deleting material:", error);
      throw error;
    }
  }

  // const getMaterialById = (id) => {
  //   return materials.find((material) => material.materiales_id === id);
  // }

  useEffect(() => {
    loadMaterials()
  }, [])


  return (
    <MaterialContext.Provider
      value={{
        materials,
        loading,
        totalCount,
        loadMaterials,
        cursos,
        loadCursos,
        addMaterial,
        updateMaterial: updateMaterialContext,
        deleteMaterial: deleteMaterialContext,
      }}
    >
      {children}
    </MaterialContext.Provider>
  )
}


export function useMaterials() {
  const context = useContext(MaterialContext)
  if (!context) {
    throw new Error("useMaterials must be used within a MaterialsProvider")
  }
  return context
}
