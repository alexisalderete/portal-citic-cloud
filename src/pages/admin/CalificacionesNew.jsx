//"use client"

import { useState, useEffect } from "react"
import { useGrades } from "../../contexts/CalificacionesContext"
import { getStudents } from "../../services/EstudiantesService"

export default function GradeForm({ grade, onClose }) {
  const { addGrade, updateGrade } = useGrades()
  const [formData, setFormData] = useState({
    inscripciones_id: grade ? grade.inscripciones_id : "",
    calificaciones_primer: grade ? grade.calificaciones_primer : "",
    calificaciones_segundo: grade ? grade.calificaciones_segundo : "",
    estudiante_nombre: grade ? grade.estudiante_nombre : "",
    cursos_nombre: grade ? grade.cursos_nombre : ""
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado para la búsqueda de estudiantes
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

   // Manejar búsqueda de estudiantes
  useEffect(() => {
    const searchStudents = async () => {
      if (searchTerm.trim()) {
        setIsSearching(true)
        try {
          const results = await getStudents(searchTerm)
          setSearchResults(results)
        } catch (error) {
          console.error("Error buscando estudiantes:", error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }
    
    const timer = setTimeout(() => {
      searchStudents()
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleStudentSelect = (student) => {
    setFormData({
      ...formData,
      inscripciones_id: student.inscripciones_id,
      estudiante_nombre: `${student.estudiantes_nombre} ${student.estudiantes_apellido}`,
      cursos_nombre: student.cursos_nombre
    })
    setSearchTerm(`${student.estudiantes_nombre} ${student.estudiantes_apellido}`)
    setShowDropdown(false)
  }



  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "calificaciones_primer" || name === "calificaciones_segundo" 
        ? (value === "" ? "" : Number(value)) 
        : value,
    })

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // if (!formData.inscripciones_id) {
    //   newErrors.inscripciones_id = "Debe seleccionar un estudiante"
    // }

    if (formData.calificaciones_primer === "" || isNaN(formData.calificaciones_primer)) {
      newErrors.calificaciones_primer = "La calificación debe ser un número"
    } else if (formData.calificaciones_primer < 0 || formData.calificaciones_primer > 20) {
      newErrors.calificaciones_primer = "La calificación debe estar entre 0 y 20"
    }
    //se puede dejar vacio la calificacion 2
    if (formData.calificaciones_segundo !== "" && !isNaN(formData.calificaciones_segundo)) {
      if (formData.calificaciones_segundo < 0 || formData.calificaciones_segundo > 20) {
        newErrors.calificaciones_segundo = "La calificación debe estar entre 0 y 20"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const gradeData = {
        inscripciones_id: formData.inscripciones_id,
        calificaciones_primer: formData.calificaciones_primer,
        calificaciones_segundo: formData.calificaciones_segundo || null // Permitir null para segundo semestre
      }

      if (grade) {
        await updateGrade(grade.calificaciones_id, gradeData)
      } else {
        await addGrade(gradeData)
      }
      onClose()
    } catch (error) {
      console.error("Error al guardar la calificación:", error)
      setErrors({ submit: error.message || "Error al guardar la calificación. Intente nuevamente." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <label htmlFor="studentSearch" className="block text-sm font-medium text-gray-700">
          Buscar Estudiante
        </label>
        <input
          type="text"
          id="studentSearch"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          className={`w-full px-2 py-1 border ${errors.inscripciones_id ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Buscar estudiante por nombre o CI"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pt-5">
            <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
            {searchResults.map((student) => (
              <div
                key={`${student.estudiantes_id}-${student.inscripciones_id}`}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleStudentSelect(student)}
              >
                <div className="font-medium">{student.estudiantes_nombre} {student.estudiantes_apellido}</div>
                <div className="text-sm text-gray-500">CI: {student.estudiantes_dni} - Curso: {student.cursos_nombre}</div>
              </div>
            ))}
          </div>
        )}
        {errors.inscripciones_id && <p className="mt-1 text-sm text-red-600">{errors.inscripciones_id}</p>}
      </div>

      <div>
        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
          Estudiante seleccionado
        </label>
        <div className="p-2 bg-gray-50 rounded-md">
          {formData.estudiante_nombre ? (
            <>
              <p className="font-medium">{formData.estudiante_nombre}</p>
              <p className="text-sm text-gray-600">Curso: {formData.cursos_nombre}</p>
            </>
          ) : (
            <p className="text-gray-500">Ningún estudiante seleccionado</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="calificaciones_primer" className="block text-sm font-medium text-gray-700">
          Calificación Primer Semestre
        </label>
        <input
          type="number"
          id="calificaciones_primer"
          name="calificaciones_primer"
          min="1"
          max="5"
          step="1"
          value={formData.calificaciones_primer}
          onChange={handleChange}
          className={`w-full px-2 py-1 border ${errors.calificaciones_primer ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Ingrese calificación"
        />
        {errors.calificaciones_primer && <p className="mt-1 text-sm text-red-600">{errors.calificaciones_primer}</p>}
      </div>

      <div>
        <label htmlFor="calificaciones_segundo" className="block text-sm font-medium text-gray-700">
          Calificación Segundo Semestre
        </label>
        <input
          type="number"
          id="calificaciones_segundo"
          name="calificaciones_segundo"
          min="1"
          max="5"
          step="1"
          value={formData.calificaciones_segundo}
          onChange={handleChange}
          className={`w-full px-2 py-1 border ${errors.calificaciones_segundo ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Ingrese calificación"
        />
        {errors.calificaciones_segundo && <p className="mt-1 text-sm text-red-600">{errors.calificaciones_segundo}</p>}
      </div>

      {errors.submit && (
        <div className="p-2 bg-red-50 text-red-600 rounded-md text-sm">
          {errors.submit}
        </div>
      )}

      <p className="text-sm text-gray-700">Obs: la calificación del segundo semestre puede quedar en blanco</p>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Guardando...
            </span>
          ) : grade ? (
            "Actualizar"
          ) : (
            "Guardar"
          )}
        </button>
      </div>
    </form>
  )
}
