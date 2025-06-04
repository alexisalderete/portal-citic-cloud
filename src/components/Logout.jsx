
import { useAuth } from "../contexts/AuthContext"
import ConfirmDialog from "../pages/modals/ConfirmDialog"
import { useNavigate } from "react-router-dom"

export default function LogoutModal({ 
  isOpen, 
  onClose, 
}) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleConfirm = () => {
    logout()
    navigate("/login")
    onClose()
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      tipo="question"
      title="Confirmar Cierre de Sesión"
      message={
        <>
          ¿Estás seguro que deseas cerrar sesión?
        </>
      }
    />
  )
}