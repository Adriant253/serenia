import { useState } from 'react'

import { DarkAuthShell } from '../components/auth/DarkAuthShell'
import { AuthVolverLink } from '../components/auth/AuthVolverLink'
import {
  cambiarContrasena
} from '../functions/auth/cambiarcontrFunctions'

function CambiarContrasena() {

  const [token, setToken] = useState('')
  const [nuevaPassword, setNuevaPassword] =
    useState('')
  const [confirmarPassword, setConfirmarPassword] =
    useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [esExito, setEsExito] = useState(false)
  const [mostrarModal, setMostrarModal] =
    useState(false)

  return (
    <>
      {mostrarModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h2>Contraseña actualizada</h2>
            <p>{mensaje}</p>
          </div>
        </div>
      )}

      <DarkAuthShell
        titulo="Nueva contraseña"
        subtitulo="Ingresa el código que recibiste por correo"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            cambiarContrasena(
              token,
              nuevaPassword,
              confirmarPassword,
              setMensaje,
              setCargando,
              (ruta) => {
                window.location.href = ruta
              },
              setEsExito,
              setMostrarModal
            )
          }}
        >

          <div className="auth-field">
            <label htmlFor="token">
              Código de recuperación
            </label>
            <input
              id="token"
              type="text"
              placeholder="Ej: AB12CD34"
              value={token}
              onChange={(e) =>
                setToken(e.target.value)
              }
            />
          </div>

          <div className="auth-field">
            <label htmlFor="nueva">
              Nueva contraseña
            </label>
            <input
              id="nueva"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={nuevaPassword}
              onChange={(e) =>
                setNuevaPassword(e.target.value)
              }
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmar">
              Confirmar contraseña
            </label>
            <input
              id="confirmar"
              type="password"
              placeholder="Repite la contraseña"
              value={confirmarPassword}
              onChange={(e) =>
                setConfirmarPassword(
                  e.target.value
                )
              }
            />
          </div>

          {mensaje && !mostrarModal && (
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
              ? 'Procesando...'
              : 'Guardar contraseña'}
          </button>

          <AuthVolverLink />

        </form>
      </DarkAuthShell>
    </>
  )

}

export default CambiarContrasena
