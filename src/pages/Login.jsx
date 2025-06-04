import { Link } from "react-router-dom"
import LoginForm from "../components/LoginForm"

const Login = () => {
  return (
    <div className="max-w-md mx-auto my-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
        <p className="mt-2 text-gray-600">Ingresa tus credenciales para acceder a tu cuenta</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <LoginForm />

        <div className="mt-6 text-center">
          {/* <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  )
}

export default Login
