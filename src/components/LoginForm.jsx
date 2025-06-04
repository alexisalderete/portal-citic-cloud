"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Por favor, complete todos los campos")
      return
    }

    try {
      setError("")
      setLoading(true)

      const response = await loginUser(username, password)

      // Añade console.log para depuración
      console.log("Respuesta del login:", response);

      // Verifica que response tenga token y username
      if (response && response.token && response.username) {
        login(response.username, response.token, response.tipo);
        console.log("Token guardado en localStorage:", localStorage.getItem("authToken"));
        navigate("/welcome");
      } else {
        throw new Error("La respuesta del servidor no contiene token");
      }

    } catch (error) {
      console.error("Error en login:", error);
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded">{error}</div>}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Usuario
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          
        />
      </div>


      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
            text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </div>
    </form>
  )
}

export default LoginForm
