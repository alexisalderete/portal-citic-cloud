const API_URL = 'https://citicpy.com/api-portal/index.php'; // Reemplaza con la URL de tu API

export const getStudents = async (searchTerm = "") => {
  try {
    // Construir la URL con parámetros de búsqueda
    const params = new URLSearchParams();
    params.append('action', 'inscripciones');
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    console.log(params.toString())
    const response = await fetch(`${API_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error al buscar estudiantes: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data)

     // Verificar si la respuesta tiene la estructura esperada
     if (!data || !data.data) {
      throw new Error('Formato de respuesta inesperado');
    }
    
    // Mapear los datos de la API al formato esperado por el formulario
    return data.data.map(estudiante => ({
      inscripciones_id: estudiante.inscripciones_id,
      estudiantes_id: estudiante.estudiantes_id,
      estudiantes_nombre: estudiante.estudiantes_nombre,
      estudiantes_apellido: estudiante.estudiantes_apellido,
      estudiantes_dni: estudiante.estudiantes_dni,
      cursos_nombre: estudiante.cursos_nombre,
      cursos_id: estudiante.cursos_id
    }));
    
  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Error al buscar estudiantes: ${error.message}`);
  }
};