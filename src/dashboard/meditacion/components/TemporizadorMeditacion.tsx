import {
  useEffect,
  useState
} from 'react'

import type {
  CSSProperties
} from 'react'

import {
  OPCIONES_DURACION_MEDITACION
} from '../../../functions/meditacionF/meditacionTypes'

import type {
  DuracionMeditacion,
  EstadoTemporizador
} from '../../../functions/meditacionF/meditacionTypes'

import {
  useTemporizadorMeditacion
} from '../../../functions/meditacionF/useTemporizadorMeditacion'

import {
  describirDuracionMeditacion,
  formatearTiempoMeditacion
} from '../../../functions/meditacionF/meditacionUtils'

import type {
  EstadoMeditacionServidor
} from '../../../services/meditacionService'

import './TemporizadorMeditacion.css'

interface TemporizadorMeditacionProps {
  idUsuario: number | null

  estadoMeditacion:
    EstadoMeditacionServidor | null

  cargandoEstado: boolean

  errorEstado: string

  onRecargarEstado:
    () => Promise<void>

  onActualizarEstado: (
    estado:
      EstadoMeditacionServidor
  ) => void

  onIrSuscripcion: () => void
}

const MENSAJES_ESTADO: Record<
  EstadoTemporizador,
  string
> = {
  listo:
    'Listo para comenzar',

  activo:
    'Respira y mantén la atención',

  pausado:
    'Sesión en pausa',

  finalizado:
    'Sesión finalizada'
}

function TemporizadorMeditacion({
  idUsuario,
  estadoMeditacion,
  cargandoEstado,
  errorEstado,
  onRecargarEstado,
  onActualizarEstado,
  onIrSuscripcion
}: TemporizadorMeditacionProps) {
  const [
    duracionPremium,
    setDuracionPremium
  ] = useState<
    DuracionMeditacion | null
  >(null)

  const temporizador =
    useTemporizadorMeditacion({
      idUsuario,
      estadoMeditacion,
      onActualizarEstado,
      onRecargarEstado
    })

  useEffect(() => {
    if (
      duracionPremium === null
    ) {
      return undefined
    }

    const overflowAnterior =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    const cerrarConEscape = (
      evento: KeyboardEvent
    ) => {
      if (
        evento.key === 'Escape'
      ) {
        setDuracionPremium(
          null
        )
      }
    }

    document.addEventListener(
      'keydown',
      cerrarConEscape
    )

    return () => {
      document.body.style.overflow =
        overflowAnterior

      document.removeEventListener(
        'keydown',
        cerrarConEscape
      )
    }
  }, [duracionPremium])

  const estaEnCurso =
    temporizador.estado ===
      'activo' ||
    temporizador.estado ===
      'pausado'

  const estiloProgreso = {
    '--meditacion-progreso':
      `${temporizador.progreso}%`
  } as CSSProperties

  const mensajeEstado =
    temporizador.guardandoSesion
      ? 'Guardando sesión...'
      : MENSAJES_ESTADO[
        temporizador.estado
      ]

  const puedeIniciar =
    Boolean(
      idUsuario &&
      estadoMeditacion &&
      !cargandoEstado &&
      !errorEstado &&
      !temporizador
        .estaBloqueado &&
      !temporizador
        .guardandoSesion
    )

  function seleccionarOpcion(
    segundos:
      DuracionMeditacion,

    disponibleFree: boolean
  ) {
    if (
      !temporizador.esPremium &&
      !disponibleFree
    ) {
      setDuracionPremium(
        segundos
      )

      return
    }

    temporizador
      .seleccionarDuracion(
        segundos
      )
  }

  return (
    <section className="temporizador-meditacion">
      <div className="temporizador-meditacion-introduccion">
        <div>
          <span className="temporizador-meditacion-etiqueta">
            Sesión personal
          </span>

          <h2>
            Elige cuánto tiempo deseas
            meditar
          </h2>

          <p>
            Tus sesiones y límites se
            validan directamente con tu
            cuenta. Puedes pausar,
            reanudar o terminar la sesión
            antes de tiempo.
          </p>
        </div>

        <div
          className={
            temporizador.esPremium
              ? (
                'temporizador-meditacion-plan ' +
                'temporizador-meditacion-plan-premium'
              )
              : (
                'temporizador-meditacion-plan ' +
                'temporizador-meditacion-plan-free'
              )
          }
        >
          <span>
            {
              cargandoEstado
                ? 'Consultando'
                : temporizador
                  .esPremium
                  ? 'Premium'
                  : 'Free'
            }
          </span>

          <strong>
            {
              cargandoEstado
                ? '...'
                : temporizador
                  .esPremium
                  ? 'Sin límite'
                  : (
                    `${temporizador.sesionesFreeDisponibles} de ` +
                    `${estadoMeditacion?.limiteSesiones ?? 3}`
                  )
            }
          </strong>

          <small>
            {
              temporizador.esPremium
                ? 'sesiones disponibles'
                : 'sesiones restantes'
            }
          </small>
        </div>
      </div>

      {
        errorEstado && (
          <div className="temporizador-meditacion-bloqueo">
            <div className="temporizador-meditacion-bloqueo-icono">
              ⚠️
            </div>

            <div className="temporizador-meditacion-bloqueo-texto">
              <span>
                No se pudo consultar
                la cuenta
              </span>

              <h3>
                El temporizador está
                temporalmente deshabilitado
              </h3>

              <p>
                {errorEstado}
              </p>
            </div>

            <button
              className={
                'temporizador-meditacion-boton ' +
                'temporizador-meditacion-boton-secundario'
              }
              type="button"
              disabled={cargandoEstado}
              onClick={() => {
                void onRecargarEstado()
              }}
            >
              {
                cargandoEstado
                  ? 'Consultando...'
                  : 'Reintentar'
              }
            </button>
          </div>
        )
      }

      {
        temporizador.estaBloqueado && (
          <div className="temporizador-meditacion-bloqueo">
            <div className="temporizador-meditacion-bloqueo-icono">
              🔒
            </div>

            <div className="temporizador-meditacion-bloqueo-texto">
              <span>
                Límite Free alcanzado
              </span>

              <h3>
                Tus sesiones se
                restaurarán pronto
              </h3>

              <p>
                Utilizaste las tres
                sesiones disponibles.
                La restauración es
                administrada por el
                servidor y continuará
                aunque cierres la página.
              </p>
            </div>

            <div className="temporizador-meditacion-bloqueo-reloj">
              <small>
                Tiempo restante
              </small>

              <strong>
                {
                  formatearTiempoMeditacion(
                    temporizador
                      .segundosParaDesbloqueo
                  )
                }
              </strong>
            </div>
          </div>
        )
      }

      <div className="temporizador-meditacion-duraciones">
        <div className="temporizador-meditacion-seccion-titulo">
          <div>
            <span>
              Duración
            </span>

            <h3>
              Selecciona una opción
            </h3>
          </div>

          {
            estaEnCurso && (
              <small>
                Finaliza o reinicia para
                cambiar la duración.
              </small>
            )
          }
        </div>

        <div className="temporizador-meditacion-duraciones-grid">
          {
            OPCIONES_DURACION_MEDITACION
              .map((opcion) => {
                const estaBloqueada =
                  !temporizador
                    .esPremium &&
                  !opcion
                    .disponibleFree

                const estaSeleccionada =
                  temporizador
                    .duracionSeleccionada ===
                  opcion.segundos

                return (
                  <button
                    className={
                      'temporizador-meditacion-duracion' +
                      (
                        estaSeleccionada
                          ? (
                            ' temporizador-meditacion-duracion-activa'
                          )
                          : ''
                      ) +
                      (
                        estaBloqueada
                          ? (
                            ' temporizador-meditacion-duracion-bloqueada'
                          )
                          : ''
                      )
                    }
                    key={
                      opcion.segundos
                    }
                    type="button"
                    disabled={
                      estaEnCurso ||
                      temporizador
                        .guardandoSesion
                    }
                    onClick={() => {
                      seleccionarOpcion(
                        opcion.segundos,
                        opcion
                          .disponibleFree
                      )
                    }}
                  >
                    <span className="temporizador-meditacion-duracion-tiempo">
                      {opcion.etiqueta}
                    </span>

                    <span className="temporizador-meditacion-duracion-descripcion">
                      {
                        opcion.descripcion
                      }
                    </span>

                    {
                      estaBloqueada && (
                        <span className="temporizador-meditacion-duracion-candado">
                          🔒 Premium
                        </span>
                      )
                    }
                  </button>
                )
              })
          }
        </div>
      </div>

      <div className="temporizador-meditacion-principal">
        <div className="temporizador-meditacion-reloj-card">
          <div className="temporizador-meditacion-estado">
            <span
              className={
                `temporizador-meditacion-estado-punto ` +
                `temporizador-meditacion-estado-${temporizador.estado}`
              }
            />

            {mensajeEstado}
          </div>

          <div
            className={
              `temporizador-meditacion-reloj ` +
              `temporizador-meditacion-reloj-${temporizador.estado}`
            }
            style={estiloProgreso}
            role="timer"
            aria-live="polite"
            aria-label={
              `${formatearTiempoMeditacion(
                temporizador
                  .segundosRestantes
              )} restantes`
            }
          >
            <div className="temporizador-meditacion-reloj-interior">
              <span>
                Tiempo restante
              </span>

              <strong>
                {
                  formatearTiempoMeditacion(
                    temporizador
                      .segundosRestantes
                  )
                }
              </strong>

              <small>
                {
                  temporizador.estado ===
                  'activo'
                    ? (
                      'Inhala y exhala con calma'
                    )
                    : describirDuracionMeditacion(
                      temporizador
                        .duracionSeleccionada
                    )
                }
              </small>
            </div>
          </div>

          <div className="temporizador-meditacion-progreso-texto">
            <span>
              Progreso de la sesión
            </span>

            <strong>
              {
                Math.round(
                  temporizador.progreso
                )
              }%
            </strong>
          </div>

          <div
            className="temporizador-meditacion-barra"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              Math.round(
                temporizador.progreso
              )
            }
          >
            <div
              style={{
                width:
                  `${temporizador.progreso}%`
              }}
            />
          </div>
        </div>

        <div className="temporizador-meditacion-controles-card">
          <div className="temporizador-meditacion-seccion-titulo">
            <div>
              <span>
                Controles
              </span>

              <h3>
                Administra tu sesión
              </h3>
            </div>
          </div>

          <div className="temporizador-meditacion-resumen-grid">
            <article>
              <span>
                Duración elegida
              </span>

              <strong>
                {
                  describirDuracionMeditacion(
                    temporizador
                      .duracionSeleccionada
                  )
                }
              </strong>
            </article>

            <article>
              <span>
                Tiempo meditado
              </span>

              <strong>
                {
                  formatearTiempoMeditacion(
                    temporizador
                      .segundosMeditados
                  )
                }
              </strong>
            </article>

            <article>
              <span>
                Estado
              </span>

              <strong>
                {
                  temporizador
                    .guardandoSesion
                    ? 'Guardando'
                    : temporizador
                      .estado ===
                      'listo'
                      ? 'Preparado'
                      : temporizador
                        .estado ===
                        'activo'
                        ? 'En curso'
                        : temporizador
                          .estado ===
                          'pausado'
                          ? 'Pausado'
                          : 'Finalizado'
                }
              </strong>
            </article>
          </div>

          <div className="temporizador-meditacion-controles">
            {
              temporizador.estado ===
              'listo' && (
                <button
                  className={
                    'temporizador-meditacion-boton ' +
                    'temporizador-meditacion-boton-principal'
                  }
                  type="button"
                  disabled={
                    !puedeIniciar
                  }
                  onClick={
                    temporizador.iniciar
                  }
                >
                  {
                    cargandoEstado
                      ? 'Consultando cuenta...'
                      : '▶ Iniciar sesión'
                  }
                </button>
              )
            }

            {
              temporizador.estado ===
              'finalizado' && (
                <button
                  className={
                    'temporizador-meditacion-boton ' +
                    'temporizador-meditacion-boton-principal'
                  }
                  type="button"
                  disabled={
                    temporizador
                      .guardandoSesion ||
                    (
                      temporizador
                        .resultado !== null &&
                      !temporizador
                        .resultado
                        .guardada
                    )
                  }
                  onClick={
                    temporizador
                      .prepararOtraSesion
                  }
                >
                  Preparar otra sesión
                </button>
              )
            }

            {
              temporizador.estado ===
              'activo' && (
                <button
                  className={
                    'temporizador-meditacion-boton ' +
                    'temporizador-meditacion-boton-principal'
                  }
                  type="button"
                  disabled={
                    temporizador
                      .guardandoSesion
                  }
                  onClick={
                    temporizador.pausar
                  }
                >
                  Ⅱ Pausar
                </button>
              )
            }

            {
              temporizador.estado ===
              'pausado' && (
                <button
                  className={
                    'temporizador-meditacion-boton ' +
                    'temporizador-meditacion-boton-principal'
                  }
                  type="button"
                  disabled={
                    temporizador
                      .guardandoSesion
                  }
                  onClick={
                    temporizador.reanudar
                  }
                >
                  ▶ Reanudar
                </button>
              )
            }

            {
              estaEnCurso && (
                <button
                  className={
                    'temporizador-meditacion-boton ' +
                    'temporizador-meditacion-boton-secundario'
                  }
                  type="button"
                  disabled={
                    temporizador
                      .guardandoSesion
                  }
                  onClick={
                    temporizador.reiniciar
                  }
                >
                  ↻ Reiniciar
                </button>
              )
            }

            {
              estaEnCurso && (
                <button
                  className={
                    'temporizador-meditacion-boton ' +
                    'temporizador-meditacion-boton-finalizar'
                  }
                  type="button"
                  disabled={
                    temporizador
                      .guardandoSesion
                  }
                  onClick={
                    temporizador.finalizar
                  }
                >
                  ■ Finalizar
                </button>
              )
            }
          </div>

          <div className="temporizador-meditacion-recomendacion">
            <span aria-hidden="true">
              🌿
            </span>

            <p>
              La sesión se registra cuando
              termina el contador o cuando
              presionas Finalizar después
              de haber meditado al menos
              un segundo.
            </p>
          </div>
        </div>
      </div>

      {
        temporizador.resultado && (
          <div
            className={
              temporizador
                .resultado
                .guardada &&
              temporizador
                .resultado
                .completada
                ? (
                  'temporizador-meditacion-resultado ' +
                  'temporizador-meditacion-resultado-completo'
                )
                : (
                  'temporizador-meditacion-resultado ' +
                  'temporizador-meditacion-resultado-parcial'
                )
            }
          >
            <div className="temporizador-meditacion-resultado-icono">
              {
                temporizador
                  .resultado
                  .guardada
                  ? temporizador
                    .resultado
                    .completada
                    ? '✓'
                    : '◷'
                  : '!'
              }
            </div>

            <div>
              <span>
                {
                  temporizador
                    .resultado
                    .guardada
                    ? temporizador
                      .resultado
                      .completada
                      ? 'Sesión completada y guardada'
                      : 'Sesión finalizada y guardada'
                    : 'La sesión no se guardó'
                }
              </span>

              <h3>
                Meditaste{' '}
                {
                  describirDuracionMeditacion(
                    temporizador
                      .resultado
                      .duracionRealSegundos
                  )
                }
              </h3>

              <p>
                {
                  temporizador
                    .resultado
                    .mensaje
                }
              </p>

              {
                !temporizador
                  .resultado
                  .guardada && (
                  <div className="temporizador-meditacion-controles">
                    <button
                      className={
                        'temporizador-meditacion-boton ' +
                        'temporizador-meditacion-boton-principal'
                      }
                      type="button"
                      disabled={
                        temporizador
                          .guardandoSesion
                      }
                      onClick={
                        temporizador
                          .reintentarGuardado
                      }
                    >
                      {
                        temporizador
                          .guardandoSesion
                          ? 'Guardando...'
                          : 'Reintentar guardado'
                      }
                    </button>

                    <button
                      className={
                        'temporizador-meditacion-boton ' +
                        'temporizador-meditacion-boton-secundario'
                      }
                      type="button"
                      disabled={
                        temporizador
                          .guardandoSesion
                      }
                      onClick={
                        temporizador
                          .prepararOtraSesion
                      }
                    >
                      Descartar resultado
                    </button>
                  </div>
                )
              }
            </div>
          </div>
        )
      }

      {
        duracionPremium !== null && (
          <div
            className="temporizador-meditacion-modal-fondo"
            role="presentation"
            onMouseDown={(
              evento
            ) => {
              if (
                evento.target ===
                evento.currentTarget
              ) {
                setDuracionPremium(
                  null
                )
              }
            }}
          >
            <div
              className="temporizador-meditacion-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="temporizador-premium-titulo"
            >
              <button
                className="temporizador-meditacion-modal-cerrar"
                type="button"
                aria-label="Cerrar aviso Premium"
                onClick={() => {
                  setDuracionPremium(
                    null
                  )
                }}
              >
                ×
              </button>

              <div className="temporizador-meditacion-modal-icono">
                🔒
              </div>

              <span className="temporizador-meditacion-modal-etiqueta">
                Duración Premium
              </span>

              <h2 id="temporizador-premium-titulo">
                {
                  describirDuracionMeditacion(
                    duracionPremium
                  )
                }{' '}
                requiere Premium
              </h2>

              <p>
                El plan Free permite
                sesiones de 30 segundos y
                1 minuto. Con Premium se
                habilitan también las
                sesiones de 2, 3 y 5
                minutos.
              </p>

              <div className="temporizador-meditacion-modal-beneficios">
                <span>
                  ✓ Duraciones extendidas
                </span>

                <span>
                  ✓ Sesiones sin límite
                </span>

                <span>
                  ✓ Historial completo
                </span>
              </div>

              <div className="premium-meditacion-acciones">
                <button
                  className={
                    'temporizador-meditacion-boton ' +
                    'temporizador-meditacion-boton-secundario'
                  }
                  type="button"
                  onClick={() => {
                    setDuracionPremium(
                      null
                    )
                  }}
                >
                  Ahora no
                </button>

                <button
                  className={
                    'temporizador-meditacion-boton ' +
                    'temporizador-meditacion-boton-principal'
                  }
                  type="button"
                  onClick={() => {
                    setDuracionPremium(
                      null
                    )

                    onIrSuscripcion()
                  }}
                >
                  Pagar Premium
                </button>
              </div>
            </div>
          </div>
        )
      }
    </section>
  )
}

export default TemporizadorMeditacion