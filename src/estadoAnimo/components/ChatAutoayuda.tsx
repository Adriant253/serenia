import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Link } from 'react-router-dom'

import {
  obtenerSaludoChat,
  procesarAccionRapida,
  procesarMensaje,
  type RespuestaBot
} from '../../logic/chatbotAutoayuda'

import {
  obtenerHistorialEmocional
} from '../../services/emocionesService'

import '../ChatAutoayuda.css'

interface Mensaje {
  id: string
  rol: 'usuario' | 'bot'
  texto: string
  hora: string
  acciones?: {
    etiqueta: string
    respuesta: string
  }[]
  enlaceEjercicio?: string
}

interface UsuarioChat {
  id_usuario: number
  nombre: string
}

function obtenerUsuario(): UsuarioChat | null {
  try {
    return JSON.parse(
      localStorage.getItem('usuario') || 'null'
    )
  } catch {
    return null
  }
}

function horaActual(): string {
  return new Date().toLocaleTimeString(
    'es-MX',
    {
      hour: '2-digit',
      minute: '2-digit'
    }
  )
}

function crearMensajeBot(
  respuesta: RespuestaBot
): Mensaje {
  return {
    id: `${Date.now()}-${Math.random()}`,
    rol: 'bot',
    texto: respuesta.texto,
    hora: horaActual(),
    acciones: respuesta.acciones,
    enlaceEjercicio: respuesta.enlaceEjercicio
  }
}

function crearSaludoInicial(
  usuario: UsuarioChat
): Mensaje {
  const historial =
    obtenerHistorialEmocional(
      usuario.id_usuario
    )

  const ultimo = historial[0]

  const saludo = obtenerSaludoChat({
    nombre: usuario.nombre,
    ultimaEmocion: ultimo?.etiqueta,
    ultimoEstres: ultimo?.nivelEstres
  })

  return crearMensajeBot(saludo)
}

function ChatAutoayuda({
  variant = 'embedded'
}: {
  variant?: 'embedded' | 'page'
}) {

  const usuario = useMemo(
    () => obtenerUsuario(),
    []
  )

  const [mensajes, setMensajes] = useState<
    Mensaje[]
  >(() =>
    usuario
      ? [crearSaludoInicial(usuario)]
      : []
  )

  const [input, setInput] = useState('')

  const [escribiendo, setEscribiendo] =
    useState(false)

  const chatRef =
    useRef<HTMLDivElement>(null)

  const idContador = useRef(0)

  const contextoChat = useMemo(
    () => {
      if (!usuario) {
        return undefined
      }

      const historial =
        obtenerHistorialEmocional(
          usuario.id_usuario
        )

      const ultimo = historial[0]

      return {
        nombre: usuario.nombre,
        ultimaEmocion: ultimo?.etiqueta,
        ultimoEstres: ultimo?.nivelEstres,
        causaFrecuente:
          ultimo?.causaEstresEtiqueta
      }
    },
    [usuario]
  )

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight
    }
  }, [mensajes, escribiendo])

  const responderBot = (
    respuesta: RespuestaBot
  ) => {
    setEscribiendo(true)

    window.setTimeout(() => {
      setMensajes((prev) => [
        ...prev,
        crearMensajeBot(respuesta)
      ])
      setEscribiendo(false)
    }, 500)
  }

  const enviarMensaje = (
    texto: string,
    claveAccion?: string
  ) => {
    const limpio = texto.trim()

    if (!limpio || escribiendo) {
      return
    }

    idContador.current += 1

    const msgUsuario: Mensaje = {
      id: `user-${idContador.current}`,
      rol: 'usuario',
      texto: limpio,
      hora: horaActual()
    }

    setMensajes((prev) => [
      ...prev,
      msgUsuario
    ])

    setInput('')

    const respuesta = claveAccion
      ? procesarAccionRapida(claveAccion)
      : procesarMensaje(
          limpio,
          undefined,
          contextoChat
        )

    responderBot(respuesta)
  }

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    enviarMensaje(input)
  }

  if (!usuario) {
    return (
      <div className="chat-embedded">
        <p className="historial-vacio">
          Inicia sesión para usar el asistente.
        </p>
      </div>
    )
  }

  return (

    <div
      className={
        variant === 'page'
          ? 'chat-embedded chat-embedded--page'
          : 'chat-embedded'
      }
    >

      <div className="chat-embedded-header">

        <span className="chat-embedded-icono">
          🌿
        </span>

        <div>
          <h3>
            Asistente de autoayuda
          </h3>
          <p>
            {variant === 'page'
              ? 'Escribe con detalle: te responderé según tu situación (reuniones, jefe, tareas, ansiedad…).'
              : 'Apoyo inmediato para manejar el estrés laboral.'}
          </p>
        </div>

        <span className="chat-estado-mini">
          En línea
        </span>

      </div>

      <div
        className="chat-mensajes-embedded"
        ref={chatRef}
      >

        {mensajes.map((msg) => (

          <div
            key={msg.id}
            className={
              msg.rol === 'bot'
                ? 'chat-burbuja bot'
                : 'chat-burbuja usuario'
            }
          >

            {msg.rol === 'bot' && (
              <span className="chat-bot-icono">
                🌿
              </span>
            )}

            <div className="chat-contenido">

              <p className="chat-texto">
                {msg.texto}
              </p>

              {msg.enlaceEjercicio && (
                <Link
                  to={`/dashboard/ejercicios?ejercicio=${msg.enlaceEjercicio}`}
                  className="chat-link-ejercicio"
                >
                  Ir al ejercicio guiado →
                </Link>
              )}

              {msg.acciones && (
                <div className="chat-acciones">
                  {msg.acciones.map((accion) => (
                    <button
                      key={accion.respuesta}
                      type="button"
                      className="chat-accion-btn"
                      onClick={() =>
                        enviarMensaje(
                          accion.etiqueta,
                          accion.respuesta
                        )
                      }
                    >
                      {accion.etiqueta}
                    </button>
                  ))}
                </div>
              )}

              <span className="chat-hora">
                {msg.hora}
              </span>

            </div>

          </div>

        ))}

        {escribiendo && (
          <div className="chat-burbuja bot">
            <span className="chat-bot-icono">
              🌿
            </span>
            <div className="chat-escribiendo">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

      </div>

      <form
        className="chat-input-embedded"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Escribe aquí... ej: estoy estresado por una reunión"
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
        />

        <button
          type="submit"
          className="chat-btn-enviar"
          disabled={escribiendo}
        >
          Enviar
        </button>

      </form>

      <p className="chat-disclaimer-mini">
        Asistente de autoayuda. No reemplaza
        atención psicológica profesional.
      </p>

    </div>

  )

}

export default ChatAutoayuda
