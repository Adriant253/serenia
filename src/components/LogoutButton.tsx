interface LogoutButtonProps {
  onLogout: () => void
}

function LogoutButton({
  onLogout
}: LogoutButtonProps) {
  return (
    <button
      className="logout-button"
      onClick={onLogout}
    >
      Cerrar sesión
    </button>
  )
}

export default LogoutButton