//const API_URL = "https://citicpy.com/api-portal"
// const API_URL = "http://localhost/api-portal"

const API_URL = "https://citicpy.com/api-portal/index.php";
//const API_URL = "http://localhost/api-portal/index.php";

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/?action=login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al iniciar sesión")
    }

    return data
  } catch (error) {
    console.log("ERROR LOGIN", error)
    throw error.message
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/?action=register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al registrar usuario")
    }

    return data
  } catch (error) {
    console.log("ERROR REGISTER", error)
    throw error.message
  }
}


export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("authToken");
    console.log("Token recuperado de localStorage:", token); // Para depuración
    if (!token){
      throw new Error("No hay token de autenticación");
    } 
    

    const response = await fetch(`${API_URL}?action=profile`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("Respuesta del perfil:", response); // Para depuración

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        console.error("Token inválido - Limpiando localStorage");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener perfil");
    }

    return await response.json();
  } catch (error) {
    console.log("ERROR PROFILE", error);
    throw error.message;
  }
};