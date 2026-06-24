import {
  useEffect,
  useRef,
  useState
} from 'react'
import { GoogleLogin } from '@react-oauth/google'

import {
  guardarSesion,
  loginGoogle
} from '../../services/googleAuthService'

interface GoogleLoginButtonProps {
  onError: (mensaje: string) => void
  disabled?: boolean
}

export function GoogleLoginButton({
  onError,
  disabled = false
}: GoogleLoginButtonProps) {

  const containerRef =
    useRef<HTMLDivElement>(null)

  const [ancho, setAncho] = useState(0)

  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!containerRef.current) return

    const medir = () => {
      if (containerRef.current) {
        setAncho(
          containerRef.current.offsetWidth
        )
      }
    }

    medir()
    window.addEventListener('resize', medir)

    return () => {
      window.removeEventListener('resize', medir)
    }
  }, [])

  if (!clientId) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="auth-google-wrap"
      style={{
        width: '100%',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled
          ? 'none'
          : 'auto'
      }}
    >
      {ancho > 0 && (
        <GoogleLogin
          onSuccess={async (response) => {
            if (!response.credential) {
              onError(
                'No se recibió credencial de Google'
              )
              return
            }

            try {
              const data = await loginGoogle(
                response.credential
              )

              if (data.success === 1) {
                guardarSesion(data)
                return
              }

              onError(
                String(
                  data.mensaje ||
                  'No se pudo iniciar sesión'
                )
              )
            } catch (error) {
              onError(
                error instanceof Error
                  ? error.message
                  : 'Error al conectar con Google'
              )
            }
          }}
          onError={() => {
            onError(
              'No se pudo completar el inicio con Google'
            )
          }}
          theme="outline"
          size="large"
          width={ancho}
          text="continue_with"
          useOneTap={false}
        />
      )}
    </div>
  )
}
