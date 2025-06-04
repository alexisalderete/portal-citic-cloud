// "use client"
import { Routes, Route, Navigate, BrowserRouter as Router, useLocation } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Navbar from "./components/menu/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Welcome from "./pages/Welcome"
import Sidebar from "./components/menu/sidebar"
import Calificaciones from "./pages/admin/CalificacionesList"
import {GradesProvider} from "./contexts/CalificacionesContext"

import Materiales from "./pages/admin/MaterialesHome"
import {MaterialProvider} from "./contexts/MaterialesContext"

//en caso de que no este autenticado redirige a login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  return children
}

// proteger rutas por roles
const ProtectedRouteWithRole = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(currentUser?.tipo)) {
    return <Navigate to="/welcome" />; // O a una página de "no autorizado"
  }

  return children;
};



const RouteWrapper = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  
  // Verifica si la ruta es exactamente "/portal"
  const isPortalRoute = location.pathname === '/portal'
  
  return (
    <div className={`flex min-h-screen bg-gray-50 ${isAuthenticated ? "pt-0" : "pt-0"}`}>
      {isAuthenticated && !isPortalRoute && <Navbar />}
      {isAuthenticated && !isPortalRoute && <Sidebar />}
      
      <div className={`flex-1 overflow-y-auto pl-0 ${isAuthenticated && !isPortalRoute ? "md:pl-64" : "pl-0"} relative`}>
        <div className="container mx-auto px-4 py-20 ">
          {children}
        </div>
      </div>
    </div>
  )
}



function App() {
  return (
    <Router basename="/portal">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome"
          element={
            <ProtectedRouteWithRole allowedRoles={["admin", "profesor", "estudiante"]}>
              <RouteWrapper>
                <Welcome />
              </RouteWrapper>
            </ProtectedRouteWithRole>
          }
        />
        <Route path="/calificaciones" 
        element={
          <ProtectedRouteWithRole allowedRoles={["admin", "profesor", "estudiante"]}>
              <GradesProvider>
                <RouteWrapper>
                  <Calificaciones />
                </RouteWrapper>
              </GradesProvider>
          </ProtectedRouteWithRole>

        } /> 
        <Route path="/materiales" 
        element={
          <ProtectedRouteWithRole allowedRoles={["admin", "profesor", "estudiante"]}>
            <MaterialProvider>
              <RouteWrapper>
                <Materiales />
              </RouteWrapper>
            </MaterialProvider>
          </ProtectedRouteWithRole>
        } /> 
      </Routes>
    </Router>
    
  )
}

export default App