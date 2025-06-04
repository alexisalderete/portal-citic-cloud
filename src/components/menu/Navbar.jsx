// "use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useState, useEffect } from "react"
import LogoutModal from "../../components/Logout"
import { getUserProfile } from "../../services/api"

const Navbar = () => {
  const { isAuthenticated } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

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

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-end py-2">
          {/* <Link to="/welcome" className="text-xl font-bold text-white">
            CITIC
          </Link> */}

          <div className="flex space-x-">
            {isAuthenticated ? (
              <>             
              {profileData && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 text-lg">{profileData.username || ''}</span>
                </div>
              )}
              

              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-2 rounded-full ml-2 text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <svg
                  className="h-6 w-6 text-gray-800"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>


              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors "
                >
                  Iniciar Sesión
                </Link>
                {/* <Link
                  to="/register"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Registrarse
                </Link> */}
              </>
            )}
          </div>
        </div>
      </div>

    </nav>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  )
}

export default Navbar
