"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getUserProfile } from "../services/api"
import { useNavigate } from "react-router-dom"

const Welcome = () => {
  const { currentUser } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getUserProfile()
        setProfileData(data)
      } catch (error) {
        setError("Error al cargar los datos del perfil")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const quickActions = [
    {
      title: "Calificaciones",
      path: "/calificaciones",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600"
    },
    {
      title: "Materiales",
      path: "/materiales",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Asistencias",
      path: "#",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Horarios",
      path: "#",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-amber-100",
      textColor: "text-amber-600"
    },
    {
      title: "Avisos",
      path: "#",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      bgColor: "bg-red-100",
      textColor: "text-red-600"
    },
    {
      title: "Perfil",
      path: "#",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-6">{error}</div>
        <p>No se pudieron cargar los datos del perfil. Por favor, intente nuevamente más tarde.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-6 mb-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta, {profileData?.username || 'Usuario'}!</h1>
        <p className="opacity-90">Aquí puedes acceder rápidamente a todas las herramientas del portal</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div 
              key={index}
              onClick={() => action.path !== "#" && navigate(action.path)}
              className={`${action.bgColor} p-6 rounded-xl shadow-md cursor-pointer transition-all hover:shadow-lg hover:transform hover:-translate-y-1 ${action.path === "#" ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${action.textColor}`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{action.title}</h3>
                  <p className="text-sm text-gray-600">Ir a {action.title.toLowerCase()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Information */}
      {/* {profileData && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Tu información</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Nombre de usuario</p>
                <p className="font-medium text-gray-900">{profileData.username}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Correo electrónico</p>
                <p className="font-medium text-gray-900">{profileData.email}</p>
              </div>
              {profileData.createdAt && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Miembro desde</p>
                  <p className="font-medium text-gray-900">{new Date(profileData.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Si necesitas ayuda con el portal, por favor contacta al soporte técnico.
            </p>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default Welcome