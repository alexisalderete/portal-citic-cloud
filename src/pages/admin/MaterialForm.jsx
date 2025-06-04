// "use client"

import { useEffect, useState, useContext } from "react"
import { MaterialContext } from "../../contexts/MaterialesContext"
import Modal from "../modals/Modal"
import { useAuth } from "../../contexts/AuthContext"

export default function MaterialFormModal({ 
  isOpen, 
  onClose, 
  mode = "add",
  material = null
}) {
  const { addMaterial, updateMaterial, loadCursos } = useContext(MaterialContext)
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado inicial vacío
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    driveLink: "",
    visibilityType: "publico",
    visibilityValue: ""
  })

  const [cursos, setCursos] = useState([])

  // Efecto para cargar datos cuando cambia el modo o el material
  useEffect(() => {
    if (mode === "edit" && material) {
      setFormData({
        title: material.materiales_nombre,
        description: material.materiales_descripcion,
        driveLink: material.materiales_url,
        visibilityType: "curso", // Valor fijo según tu estructura actual
        visibilityValue: material.cursos_nombre
      })
    } else {
      // Resetear para modo "add"
      setFormData({
        title: "",
        description: "",
        driveLink: "",
        visibilityType: "curso",
        visibilityValue: ""
      })
    }
  }, [mode, material])

   // Cargar cursos cuando el modal se abre
   useEffect(() => {
    if (isOpen) {
      loadCursos().then(data => {
        setCursos(data.data || []);
      });
    }
  }, [isOpen, loadCursos])

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria"
    }

    if (!formData.driveLink.trim()) {
      newErrors.driveLink = "El enlace de Drive es obligatorio"
    } else if (!formData.driveLink.includes("drive.google.com")) {
      newErrors.driveLink = "Debe ser un enlace válido de Google Drive"
    }

    if (formData.visibilityType !== "publico" && !formData.visibilityValue.trim()) {
      newErrors.visibilityValue = "Este campo es obligatorio para el tipo de visibilidad seleccionado"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const materialData = {
        title: formData.title,
        description: formData.description,
        driveLink: formData.driveLink,
        visibilityValue: formData.visibilityValue
      }

      if (mode === "add") {
        await addMaterial(materialData)
      } else {
        // Asegúrate de que material.materiales_id existe
        if (!material?.materiales_id) {
          throw new Error("No se encontró el ID del material a editar");
        }
        await updateMaterial(material.materiales_id, materialData)
      }
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Ocurrió un error al guardar el material. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // const visibilityLabel = () => {
  //   switch(formData.visibilityType) {
  //     case "curso": return "Nombre del Curso"
  //     case "sede": return "Nombre de la Sede"
  //     case "estudiante": return "Nombre del Estudiante"
  //     default: return ""
  //   }
  // }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Agregar Nuevo Material" : "Editar Material"}

    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-2 py-1 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Ej: Guía de Ejercicios"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={`w-full px-3 py-1 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Breve descripción del material"
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="driveLink" className="block text-sm font-medium text-gray-700 mb-1">
            Enlace de Google Drive <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="driveLink"
            name="driveLink"
            value={formData.driveLink}
            onChange={handleChange}
            className={`w-full px-3 py-1 border ${errors.driveLink ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="https://drive.google.com/..."
          />
          {errors.driveLink && <p className="mt-1 text-sm text-red-500">{errors.driveLink}</p>}
        </div>

        {/* <div>
          <label htmlFor="visibilityType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Visibilidad <span className="text-red-500">*</span>
          </label>
          <select
            id="visibilityType"
            name="visibilityType"
            value={formData.visibilityType}
            onChange={handleChange}
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="publico">Público (Todos)</option>
            <option value="curso">Curso Específico</option>
            <option value="sede">Sede Específica</option>
            <option value="estudiante">Estudiante Específico</option>
          </select>
        </div> */}

        {/* {formData.visibilityType !== "publico" && (
        )} */}
        <div>
          <label htmlFor="visibilityValue" className="block text-sm font-medium text-gray-700 mb-1">
            {"Seleccionar Curso"} <span className="text-red-500">*</span>
          </label>
          {/* <input
            type="text"
            id="visibilityValue"
            name="visibilityValue"
            value={formData.visibilityValue}
            onChange={handleChange}
            className={`w-full px-3 py-1 border ${errors.visibilityValue ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Ej: Kids 1"
          />
          {errors.visibilityValue && <p className="mt-1 text-sm text-red-500">{errors.visibilityValue}</p>} */}
          <select
            id="visibilityValue"
            name="visibilityValue"
            value={formData.visibilityValue}
            onChange={handleChange}
            className={`w-full px-3 py-1 border ${errors.visibilityValue ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">Seleccione un curso</option>
            {cursos.map((curso) => (
              <option key={curso.cursos_id} value={curso.cursos_nombre}>
                {curso.cursos_nombre}
              </option>
            ))}
          </select>
        </div>


      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-1 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-1 text-white rounded-md cursor-pointer ${
            isSubmitting 
              ? 'bg-blue-400' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === "add" ? "Agregando..." : "Guardando..."}
              </span>
            ) : (
              mode === "add" ? "Agregar" : "Guardar"
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}