import { useState } from 'react'
import { Link } from 'react-router-dom'

import { GoogleLoginButton } from './GoogleLoginButton'
import { loginFunctions } from '../../functions/auth/loginFunctions'

import '../../styles/Auth.css'

export function LoginForm({
  onClose
}: {
  onClose?: () => void
}) {

  const {
    email,
    setEmail,
    contrasena,
    setContrasena,
    errores,
    mensaje,
    cargando,
    limpiarError,
    validarEmailCampo,
    handleSubmit
  } = loginFunctions()

  const [errorGoogle, setErrorGoogle] =
    useState('')

  const errorGeneral =
    mensaje || errorGoogle

  const tieneGoogle =
    !!import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <div className="login-form-inner">

      {onClose && (
        <button
          type="button"
          className="login-form-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}

      <header className="login-form-header">
        <h2>Iniciar sesión</h2>
        <p>Bienvenido de vuelta a Serenia</p>
      </header>

      <form onSubmit={handleSubmit}>

        <div className="auth-field">
          <label htmlFor="correo">
            Correo electrónico
          </label>
          <input
            id="correo"
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            value={email}
            className={
              errores.email ? 'input-error' : ''
            }
            onChange={(e) => {
              setEmail(e.target.value)
              limpiarError('email')
              setErrorGoogle('')
            }}
            onBlur={validarEmailCampo}
          />
          {errores.email && (
            <p className="auth-error">
              {errores.email}
            </p>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            value={contrasena}
            className={
              errores.contrasena ? 'input-error' : ''
            }
            onChange={(e) => {
              setContrasena(e.target.value)
              limpiarError('contrasena')
            }}
          />
          {errores.contrasena && (
            <p className="auth-error">
              {errores.contrasena}
            </p>
          )}
        </div>

        <div className="auth-link-row">
          <Link
            to="/recuperar-contrasena"
            className="auth-link landing-link"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {errorGeneral && (
          <p className="auth-alert auth-alert--error">
            {errorGeneral}
          </p>
        )}

        <button
          type="submit"
          className="auth-btn landing-btn"
          disabled={cargando}
        >
          {cargando
            ? 'Iniciando sesión...'
            : 'Entrar'}
        </button>

        {tieneGoogle && (
          <div className="auth-google-section">
            <div className="auth-divider landing-divider">
              o continúa con Google
            </div>

            <GoogleLoginButton
              onError={setErrorGoogle}
              disabled={cargando}
            />
          </div>
        )}

        <p className="auth-footer landing-footer">
          ¿No tienes cuenta?
          <Link to="/registro">Crear cuenta</Link>
        </p>

      </form>
    </div>
  )
}