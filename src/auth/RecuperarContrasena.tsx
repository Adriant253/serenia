import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DarkAuthShell } from '../components/auth/DarkAuthShell'
import { AuthVolverLink } from '../components/auth/AuthVolverLink'
import { validarEmail } from '../utils/validations'
import {
  solicitarTokenRecuperacion
} from '../functions/auth/reccontrFunctions'

function RecuperarContrasena() {

  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [esExito, setEsExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    solicitarTokenRecuperacion(
      correo,
      setMensaje,
      setEsExito,
      navigate,
      setCargando,
      setErrorEmail
    )
  }

  const validarCorreoCampo = () => {
    const emailError = validarEmail(correo)
    setErrorEmail(emailError || '')
  }

  return (
    <DarkAuthShell
      titulo="Recuperar acceso"
      subtitulo="Te enviaremos un código a tu correo"
    >
      <form onSubmit={handleSubmit}>

        <div className="auth-field">
          <label htmlFor="correo">
            Correo electrónico
          </label>
          <input
            id="correo"
            type="text"
            inputMode="email"
            placeholder="nombre@correo.com"
            value={correo}
            disabled={cargando}
            className={
              errorEmail ? 'input-error' : ''
            }
            onChange={(e) => {
              setCorreo(e.target.value)
              setErrorEmail('')
              setMensaje('')
            }}
            onBlur={validarCorreoCampo}
          />
          {errorEmail && (
            <p className="auth-error">
              {errorEmail}
            </p>
          )}
        </div>

        {mensaje && (
          <p
            className={
              esExito
                ? 'auth-alert auth-alert--success'
                : 'auth-alert auth-alert--error'
            }
          >
            {mensaje}
          </p>
        )}

        <button
          type="submit"
          className="auth-btn landing-btn"
          disabled={cargando}
        >
          {cargando
            ? 'Enviando código...'
            : 'Enviar código'}
        </button>

        <AuthVolverLink />

      </form>
    </DarkAuthShell>
  )

}

export default RecuperarContrasena
