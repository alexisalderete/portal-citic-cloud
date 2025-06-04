import { useState } from "react"
import MaterialList from "../../pages/admin/MaterialesList"
import { useAuth } from "../../contexts/AuthContext"
import MaterialForm from "./MaterialForm"
import Toast from "../modals/Toast"
import ConfirmDialog from "../modals/ConfirmDialog"
import { useMaterials } from "../../contexts/MaterialesContext";

export default function Home() {
  const { currentUser } = useAuth(); // para obtener el tipo de usuario
  const { deleteMaterial: deleteMaterialContext } = useMaterials(); 

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [materialToEdit, setMaterialToEdit] = useState(null);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const [toast, setToast] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const isAdmin = currentUser?.tipo === 'admin';
  const isProfesor = currentUser?.tipo === 'profesor';
  const isEstudiante = currentUser?.tipo === 'estudiante';

  const handleDeleteClick = (material) => {
    setMaterialToDelete(material);
  };

  const handleDeleteConfirm = async () => {
    if (!materialToDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deleteMaterialContext(materialToDelete.materiales_id);
      setToast({
        message: 'Material eliminado correctamente',
        type: 'success'
      });
    } catch (error) {
      console.error("Error deleting material:", error);
      setDeleteError(error.message || 'Error al eliminar el material');
      setToast({
        message: error.message || 'Error al eliminar el material',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
      setMaterialToDelete(null);
    }
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50">

        {/* Toast notification */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)}
          />
        )}

        <div className="container mx-auto px-4 ">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Materiales de Clase</h1>
            {(isAdmin || isProfesor) && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center cursor-pointer"
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

          <MaterialList
            onEdit={(material) => {
              setMaterialToEdit(material);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteClick}
          />
        </div>

        <MaterialForm
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
            setMaterialToEdit(null)
          }}
          mode={isEditModalOpen ? "edit" : "add"}
          material={materialToEdit}
        />

        {/* Confirmación de eliminación */}
        {materialToDelete && (
          <ConfirmDialog
            isOpen={!!materialToDelete}
            onClose={() => setMaterialToDelete(null)}
            onConfirm={handleDeleteConfirm}
            title="Confirmar eliminación"
            message={`¿Estás seguro de que deseas eliminar el material "${materialToDelete.materiales_nombre}"?`}
            tipo="error"
            isLoading={isDeleting}
            error={deleteError}
          />
        )}
      </div>
    </>
  )
}
