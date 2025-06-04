import { Link } from "react-router-dom"
import RegisterForm from "../components/RegisterForm"

const Register = () => {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
        <p className="mt-2 text-gray-600">Regístrate para acceder a todas las funcionalidades</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
