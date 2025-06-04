// Simulación de una API con persistencia en localStorage
// const STORAGE_KEY = "materiales_api"


// // Datos iniciales que se cargarán solo si no hay datos guardados
// const initialMaterials = [
//   {
//     id: "1",
//     title: "Guía de Ejercicios Matemáticas",
//     description: "Ejercicios prácticos para reforzar los conceptos de álgebra y geometría vistos en clase.",
//     driveLink: "https://drive.google.com/file/d/1example",
//     visibilityType: "curso",
//     visibilityValue: "Matemáticas 101",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     id: "2",
//     title: "Presentación Historia del Arte",
//     description: "Presentación sobre los principales movimientos artísticos del siglo XX.",
//     driveLink: "https://drive.google.com/file/d/2example",
//     visibilityType: "sede",
//     visibilityValue: "Campus Norte",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     id: "3",
//     title: "Taller de Escritura Creativa",
//     description: "Material complementario para el taller de escritura creativa con ejemplos y ejercicios.",
//     driveLink: "https://drive.google.com/file/d/3example",
//     visibilityType: "publico",
//     visibilityValue: "",
//   },
//   {
//     id: "4",
//     title: "Plan de Estudio Personalizado",
//     description: "Plan de estudio adaptado a las necesidades específicas del estudiante.",
//     driveLink: "https://drive.google.com/file/d/4example",
//     visibilityType: "estudiante",
//     visibilityValue: "Ana García",
//   },
//   {
//     id: "5",
//     title: "Recursos de Programación",
//     description: "Colección de enlaces y documentos para aprender programación desde cero.",
//     driveLink: "https://drive.google.com/file/d/5example",
//     visibilityType: "publico",
//     visibilityValue: "",
//   },
//   {
//     id: "6",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   },
//   {
//     id: "7",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   },
//   {
//     id: "8",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   },
//   {
//     id: "9",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   },
//   {
//     id: "10",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   },
//   {
//     id: "11",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   },
//   {
//     id: "12",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   },
//   {
//     id: "13",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   },
//   {
//     id: "14",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   },
//   {
//     id: "15",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   },
//   {
//     id: "16",
//     title: "Guía de Laboratorio Química",
//     description: "Instrucciones detalladas para realizar los experimentos de laboratorio de química orgánica.",
//     driveLink: "https://drive.google.com/file/d/6example",
//     visibilityType: "curso",
//     visibilityValue: "Química Orgánica",
//   }

// ]

// Función para inicializar los datos
// const initializeData = async () => {
//   const storedData = localStorage.getItem(STORAGE_KEY)
//   if (!storedData) {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMaterials))
//     return initialMaterials
//   }
//   return JSON.parse(storedData)
// }

// // Función para guardar todos los materiales
// const saveAllMaterials = async (materials) => {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(materials))
//   return materials
// }

const API_URL = 'https://citicpy.com/api-portal/index.php';

// Función para obtener todos los materiales
export const getAllMaterials = async (params = '') => {
  try {
    const url = `${API_URL}/?action=materiales${params ? `&${params}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener materiales');
    }
    console.log(response)
    return await response.json();
  } catch (error) {
    console.error('Error en getAllMaterials:', error);
    throw error;
  }
}

// Función para obtener un material por su ID
export const getMaterialById = async (id) => {
  try {
    const url = `${API_URL}/?action=materiales&id=${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener material por ID');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getMaterialById:', error);
    throw error;
  }
}

// Función para obtener todos los cursos
export const getAllCursos = async () => {
  try {
    const url = `${API_URL}/?action=cursos`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener cursos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getAllCursos:', error);
    throw error;
  }
}

// Función para crear un nuevo material
export const createMaterial = async (materialData) => {
  try {
    // Mapear los campos del formulario a los que espera el backend
    const requestData = {
      materiales_nombre: materialData.title,
      materiales_descripcion: materialData.description,
      materiales_url: materialData.driveLink,
      cursos_nombre: materialData.visibilityValue
    };
    console.log(requestData)
    const response = await fetch(`${API_URL}/?action=create_materiales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    console.log(response)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear material');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createMaterial:', error);
    throw error;
  }
}

// Función para crear un nuevo material
export const createMaterialCursos = async (materialData) => {
  try {
    const response = await fetch(`${API_URL}/?action=create_materiales_cursos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materialData),
    });
    if (!response.ok) {
      throw new Error('Error al crear material');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createMaterial:', error);
    throw error;
  }
}

// Función para crear un nuevo material
export const updateMaterialCursos = async (materialData) => {
  try {
    const response = await fetch(`${API_URL}/?action=update_materiales_cursos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materialData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar material');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateMaterialCursos:', error);
    throw error;
  }
}

// Función para crear un nuevo material
// Función para actualizar un material
export const updateMaterial = async (id, materialData) => {
  try {
    // Mapear los campos del formulario a los que espera el backend
    const requestData = {
      materiales_id: id,
      materiales_nombre: materialData.title,
      materiales_descripcion: materialData.description,
      materiales_url: materialData.driveLink,
      cursos_nombre: materialData.visibilityValue
    };
    console.log(requestData)

    const response = await fetch(`${API_URL}/?action=update_materiales`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar material');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateMaterial:', error);
    throw error;
  }
}



// Función para eliminar un material
// Función para eliminar un material
export const deleteMaterial = async (id) => {
  if (!id) {
    throw new Error('ID de material no proporcionado');
  }
  try {
    console.log('ID enviado al backend:', id);  // Debug
    const response = await fetch(`${API_URL}/?action=delete_materiales&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar material');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}