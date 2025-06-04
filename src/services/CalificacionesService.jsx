// Simulación de una API usando localStorage

const API_URL = 'https://citicpy.com/api-portal/index.php';

export const getGrades = async (params = '') => {
  try {
    const url = `${API_URL}/?action=calificaciones${params ? `&${params}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener calificaciones');
    }
    const data = await response.json()
    console.log(data)
    console.log(response)
    return data
  } catch (error) {
    console.error("Error al obtener calificaciones:", error)
    throw error
  }
}

export const createGrade = async (gradeData) => {
  try {
    console.log("Datos a enviar:", {
      inscripciones_id: gradeData.inscripciones_id,
      calificaciones_primer: gradeData.calificaciones_primer,
      calificaciones_segundo: gradeData.calificaciones_segundo || null
    });
    const response = await fetch(`${API_URL}?action=create_calificaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inscripciones_id: gradeData.inscripciones_id,
        calificaciones_primer: gradeData.calificaciones_primer,
        calificaciones_segundo: gradeData.calificaciones_segundo || null
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear calificación');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createGrade:', error);
    throw new Error(`Error al crear calificación: ${error.message}`);
  }
};

export const updateGrade = async (id, gradeData) => {
  try {
    const response = await fetch(`${API_URL}?action=update_calificaciones`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...gradeData, id }),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar calificación');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deleteGrade = async (id) => {
  try {
    const response = await fetch(`${API_URL}?action=delete_calificaciones`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    const responseData = await response.json();
    console.log("Respuesta del servidor:", responseData);
    
    if (!response.ok) {
      throw new Error('Error al eliminar calificación');
    }
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};