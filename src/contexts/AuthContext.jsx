// "use client"

import { createContext, useState, useContext, useEffect } from "react"
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState(null);

  const getTokenData = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("userData");

    if (token && username) {
      const tokenData = getTokenData(token);
      if (tokenData && tokenData.data && tokenData.data.tipo) {
        setCurrentUser(JSON.parse(username));
        setUserType(tokenData.data.tipo);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  /*const login = (userData, token) => {
    console.log("Guardando en localStorage - userData:", userData, "token:", token);
    localStorage.setItem("authToken", token)
    localStorage.setItem("userData", JSON.stringify(userData))
    setCurrentUser(userData)
    setIsAuthenticated(true)
    // Verificar inmediatamente después de guardar
    console.log("Verificación localStorage:", {
      authToken: localStorage.getItem("authToken"),
      userData: localStorage.getItem("userData")
    });
  }*/

  const login = (userData, token, tipo) => {
    try {
      // Verificar que el token sea válido antes de guardar
      if (!token || typeof token !== 'string') {
        throw new Error('Token no válido recibido');
      }
      
      // Guardar en localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify({
        username: userData,
        tipo: tipo
      }));
      
      // Verificar que se guardó correctamente
      const storedToken = localStorage.getItem("authToken");
      if (storedToken !== token) {
        throw new Error('Error al guardar el token en localStorage');
      }
      
      setCurrentUser({
        username: userData,
        tipo: tipo // Establecer el tipo en el estado
      });
      setIsAuthenticated(true);
      
      console.log('Login exitoso - Token guardado:', {
        token: storedToken,
        userData: JSON.parse(localStorage.getItem("userData"))
      });
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
