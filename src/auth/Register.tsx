import { DarkAuthShell } from '../components/auth/DarkAuthShell'
import { AuthVolverLink } from '../components/auth/AuthVolverLink'
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton'
import { registerFunctions } from '../functions/auth/registerFunctions'

function Register() {

  const {
    nombre,
    setNombre,
    email,
    setEmail,
    fechaNacimiento,
    setFechaNacimiento,
    contrasena,
    setContrasena,
    confirmarContrasena,
    setConfirmarContrasena,
    errores,
    mostrarModal,
    errorGeneral,
    cargando,
    limpiarError,
    validarEmailCampo,
    setErrorGeneral,
    registrarUsuario
  } = registerFunctions()

  const tieneGoogle =
    !!import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <>
      <DarkAuthShell
        titulo="Crear cuenta"
        subtitulo="Únete a Serenia en segundos"
        formularioLargo
      >
        <form onSubmit={registrarUsuario}>

          {tieneGoogle && (
            <>
              <GoogleLoginButton
                onError={setErrorGeneral}
                disabled={cargando}
              />
              <div className="auth-divider">
                o regístrate con correo
              </div>
            </>
          )}

          <div className="auth-field">
            <label htmlFor="nombre">
              Nombre completo
            </label>
            <input
              id="nombre"
              type="text"
              autoComplete="name"
              placeholder="Tu nombre"
              value={nombre}
              className={
                errores.nombre ? 'input-error' : ''
              }
              onChange={(e) => {
                setNombre(e.target.value)
                limpiarError('nombre')
              }}
            />
            {errores.nombre && (
              <p className="auth-error">
                {errores.nombre}
              </p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
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
            <label htmlFor="fecha">
              Fecha de nacimiento
            </label>
            <input
              id="fecha"
              type="date"
              value={fechaNacimiento}
              className={
                errores.fecha_nacimiento
                  ? 'input-error'
                  : ''
              }
              onChange={(e) => {
                setFechaNacimiento(e.target.value)
                limpiarError('fecha_nacimiento')
              }}
            />
            {errores.fecha_nacimiento && (
              <p className="auth-error">
                {errores.fecha_nacimiento}
              </p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="contrasena">
              Contraseña
            </label>
            <input
              id="contrasena"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              value={contrasena}
              className={
                errores.contrasena
                  ? 'input-error'
                  : ''
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

          <div className="auth-field">
            <label htmlFor="confirmar">
              Confirmar contraseña
            </label>
            <input
              id="confirmar"
              type="password"
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
              value={confirmarContrasena}
              className={
                errores.confirmar
                  ? 'input-error'
                  : ''
              }
              onChange={(e) => {
                setConfirmarContrasena(e.target.value)
                limpiarError('confirmar')
              }}
            />
            {errores.confirmar && (
              <p className="auth-error">
                {errores.confirmar}
              </p>
            )}
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
              ? 'Creando cuenta...'
              : 'Crear cuenta'}
          </button>

          <AuthVolverLink />

        </form>
      </DarkAuthShell>

      {mostrarModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h2>¡Cuenta creada!</h2>
            <p>
              Tu registro fue exitoso.
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        </div>
      )}
    </>
  )

}

export default Register
