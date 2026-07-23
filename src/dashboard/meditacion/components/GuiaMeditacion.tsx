import {
  useEffect,
  useRef,
  useState
} from 'react'

import {
  CONSEJOS_GUIA_MEDITACION,
  GUIAS_MEDITACION
} from '../../../data/guiasMeditacionData'

import type {
  GuiaMeditacionItem
} from '../../../functions/meditacionF/meditacionTypes'

import {
  agregarFavoritoGuiaMeditacion,
  eliminarFavoritoGuiaMeditacion,
  obtenerFavoritosGuiasMeditacion
} from '../../../services/favoritosGuiasMeditacionService'

import './GuiaMeditacion.css'
import './GuiaMeditacionFavoritos.css'

type FiltroGuias =
  | 'todas'
  | 'favoritos'

interface GuiaMeditacionProps {
  idUsuario: number
  esPremium: boolean
  onIrSuscripcion: () => void
}

function GuiaMeditacion({
  idUsuario,
  esPremium,
  onIrSuscripcion
}: GuiaMeditacionProps) {
  const [guiaActiva, setGuiaActiva] =
    useState<GuiaMeditacionItem | null>(null)

  const [guiaPremium, setGuiaPremium] =
    useState<GuiaMeditacionItem | null>(null)

  const [pasoActual, setPasoActual] =
    useState(0)

  const [filtroGuias, setFiltroGuias] =
    useState<FiltroGuias>('todas')

  const [favoritos, setFavoritos] =
    useState<Set<number>>(new Set())

  const [cargandoFavoritos, setCargandoFavoritos] =
    useState(true)

  const [guardandoFavorito, setGuardandoFavorito] =
    useState<number | null>(null)

  const [errorFavoritos, setErrorFavoritos] =
    useState('')

  const botonCerrarRef =
    useRef<HTMLButtonElement | null>(null)

  const modalAbierto =
    guiaActiva !== null ||
    guiaPremium !== null

  useEffect(() => {
    let componenteActivo = true

    async function cargarFavoritos() {
      setCargandoFavoritos(true)
      setErrorFavoritos('')

      try {
        const idsFavoritos =
          await obtenerFavoritosGuiasMeditacion(
            idUsuario
          )

        if (!componenteActivo) {
          return
        }

        setFavoritos(
          new Set(idsFavoritos)
        )

      } catch (error) {
        if (!componenteActivo) {
          return
        }

        setErrorFavoritos(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los favoritos.'
        )

      } finally {
        if (componenteActivo) {
          setCargandoFavoritos(false)
        }
      }
    }

    void cargarFavoritos()

    return () => {
      componenteActivo = false
    }
  }, [idUsuario])

  useEffect(() => {
    if (!modalAbierto) {
      return undefined
    }

    const overflowAnterior =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const cerrarConEscape = (
      evento: KeyboardEvent
    ) => {
      if (evento.key !== 'Escape') {
        return
      }

      setGuiaActiva(null)
      setGuiaPremium(null)
      setPasoActual(0)
    }

    document.addEventListener(
      'keydown',
      cerrarConEscape
    )

    window.setTimeout(() => {
      botonCerrarRef.current?.focus()
    }, 0)

    return () => {
      document.body.style.overflow =
        overflowAnterior

      document.removeEventListener(
        'keydown',
        cerrarConEscape
      )
    }
  }, [modalAbierto])

  async function cambiarFavorito(
    guia: GuiaMeditacionItem
  ) {
    if (guardandoFavorito !== null) {
      return
    }

    const yaEsFavorita =
      favoritos.has(guia.id)

    setGuardandoFavorito(guia.id)
    setErrorFavoritos('')

    try {
      const respuesta = yaEsFavorita
        ? await eliminarFavoritoGuiaMeditacion(
          idUsuario,
          guia.id
        )
        : await agregarFavoritoGuiaMeditacion(
          idUsuario,
          guia.id
        )

      if (!respuesta.exito) {
        throw new Error(
          respuesta.mensaje
        )
      }

      setFavoritos((favoritosActuales) => {
        const favoritosActualizados =
          new Set(favoritosActuales)

        if (yaEsFavorita) {
          favoritosActualizados.delete(
            guia.id
          )
        } else {
          favoritosActualizados.add(
            guia.id
          )
        }

        return favoritosActualizados
      })

    } catch (error) {
      setErrorFavoritos(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el favorito.'
      )

    } finally {
      setGuardandoFavorito(null)
    }
  }

  function abrirGuia(
    guia: GuiaMeditacionItem
  ) {
    const estaBloqueada =
      !esPremium &&
      !guia.disponibleFree

    if (estaBloqueada) {
      setGuiaPremium(guia)
      return
    }

    setPasoActual(0)
    setGuiaActiva(guia)
  }

  function cerrarGuia() {
    setGuiaActiva(null)
    setPasoActual(0)
  }

  function cerrarPremium() {
    setGuiaPremium(null)
  }

  function irPasoAnterior() {
    setPasoActual((actual) =>
      Math.max(0, actual - 1)
    )
  }

  function irPasoSiguiente() {
    if (!guiaActiva) {
      return
    }

    const ultimoIndice =
      guiaActiva.pasos.length - 1

    if (pasoActual >= ultimoIndice) {
      cerrarGuia()
      return
    }

    setPasoActual(
      (actual) => actual + 1
    )
  }

  const pasoSeleccionado =
    guiaActiva?.pasos[pasoActual]

  const esUltimoPaso = Boolean(
    guiaActiva &&
    pasoActual ===
      guiaActiva.pasos.length - 1
  )

  const progreso = guiaActiva
    ? (
      (pasoActual + 1) /
      guiaActiva.pasos.length
    ) * 100
    : 0

  const guiasDisponibles = esPremium
    ? GUIAS_MEDITACION.length
    : GUIAS_MEDITACION.filter(
      (guia) =>
        guia.disponibleFree
    ).length

  const guiasFiltradas =
    filtroGuias === 'favoritos'
      ? GUIAS_MEDITACION.filter(
        (guia) =>
          favoritos.has(guia.id)
      )
      : GUIAS_MEDITACION

  const cantidadFavoritos =
    favoritos.size

  return (
    <section className="guia-meditacion">
      <div className="guia-meditacion-introduccion">
        <div>
          <span className="guia-meditacion-etiqueta">
            Prácticas paso a paso
          </span>

          <h2>
            Elige una guía para comenzar
          </h2>

          <p>
            Sigue instrucciones escritas a tu
            propio ritmo. Estas guías no
            reproducen audio y no generan
            registros en el historial.
          </p>
        </div>

        <div className="guia-meditacion-resumen-plan">
          <span>
            {
              esPremium
                ? 'Plan Premium'
                : 'Plan Free'
            }
          </span>

          <strong>
            {guiasDisponibles} de{' '}
            {GUIAS_MEDITACION.length}
          </strong>

          <small>
            guías disponibles
          </small>
        </div>
      </div>

      <div className="guia-meditacion-filtros">
        <div
          className="guia-meditacion-filtros-grupo"
          role="group"
          aria-label="Filtrar guías de meditación"
        >
          <button
            className={
              filtroGuias === 'todas'
                ? 'guia-meditacion-filtro activo'
                : 'guia-meditacion-filtro'
            }
            type="button"
            onClick={() => {
              setFiltroGuias('todas')
            }}
          >
            Todas
            <span>
              {GUIAS_MEDITACION.length}
            </span>
          </button>

          <button
            className={
              filtroGuias === 'favoritos'
                ? 'guia-meditacion-filtro activo'
                : 'guia-meditacion-filtro'
            }
            type="button"
            onClick={() => {
              setFiltroGuias('favoritos')
            }}
          >
            <span aria-hidden="true">
              ♥
            </span>
            Favoritos
            <span>
              {cantidadFavoritos}
            </span>
          </button>
        </div>

        <div className="guia-meditacion-filtros-estado">
          {
            cargandoFavoritos
              ? 'Cargando favoritos…'
              : `${cantidadFavoritos} guardada${
                cantidadFavoritos === 1
                  ? ''
                  : 's'
              }`
          }
        </div>
      </div>

      {
        errorFavoritos && (
          <div
            className="guia-meditacion-favoritos-error"
            role="alert"
          >
            <span aria-hidden="true">
              ⚠️
            </span>

            <p>
              {errorFavoritos}
            </p>
          </div>
        )
      }

      <div className="guia-meditacion-grid">
        {
          guiasFiltradas.map(
            (guia) => {
              const estaBloqueada =
                !esPremium &&
                !guia.disponibleFree

              return (
                <article
                  className={
                    `guia-meditacion-card ` +
                    `guia-meditacion-card-${guia.tono}` +
                    (
                      estaBloqueada
                        ? ' guia-meditacion-card-bloqueada'
                        : ''
                    ) +
                    (
                      favoritos.has(guia.id)
                        ? ' guia-meditacion-card-favorita'
                        : ''
                    )
                  }
                  key={guia.id}
                >
                  <div className="guia-meditacion-card-superior">
                    <div
                      className="guia-meditacion-card-icono"
                      aria-hidden="true"
                    >
                      {guia.icono}
                    </div>

                    <span className="guia-meditacion-card-etiqueta">
                      {guia.etiqueta}
                    </span>

                    <div className="guia-meditacion-card-acciones-superiores">
                      {
                        estaBloqueada && (
                          <span className="guia-meditacion-candado">
                            🔒 Premium
                          </span>
                        )
                      }

                      <button
                        className={
                          favoritos.has(guia.id)
                            ? 'guia-meditacion-favorito activo'
                            : 'guia-meditacion-favorito'
                        }
                        type="button"
                        onClick={() => {
                          void cambiarFavorito(guia)
                        }}
                        disabled={
                          cargandoFavoritos ||
                          guardandoFavorito !== null
                        }
                        aria-pressed={
                          favoritos.has(guia.id)
                        }
                        aria-label={
                          favoritos.has(guia.id)
                            ? `Quitar ${guia.titulo} de favoritos`
                            : `Agregar ${guia.titulo} a favoritos`
                        }
                        title={
                          favoritos.has(guia.id)
                            ? 'Quitar de favoritos'
                            : 'Agregar a favoritos'
                        }
                      >
                        <span aria-hidden="true">
                          {
                            guardandoFavorito === guia.id
                              ? '…'
                              : favoritos.has(guia.id)
                                ? '♥'
                                : '♡'
                          }
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="guia-meditacion-card-contenido">
                    <h3>
                      {guia.titulo}
                    </h3>

                    <p>
                      {guia.descripcion}
                    </p>
                  </div>

                  <div className="guia-meditacion-card-datos">
                    <span>
                      ⏱ {guia.duracion}
                    </span>

                    <span>
                      ◎ {guia.idealPara}
                    </span>
                  </div>

                  <button
                    className={
                      estaBloqueada
                        ? 'guia-meditacion-boton guia-meditacion-boton-bloqueado'
                        : 'guia-meditacion-boton'
                    }
                    type="button"
                    onClick={() =>
                      abrirGuia(guia)
                    }
                  >
                    {
                      estaBloqueada
                        ? 'Ver acceso Premium'
                        : 'Comenzar guía'
                    }
                  </button>
                </article>
              )
            }
          )
        }
      </div>

      {
        !cargandoFavoritos &&
        filtroGuias === 'favoritos' &&
        guiasFiltradas.length === 0 && (
          <div className="guia-meditacion-favoritos-vacio">
            <div aria-hidden="true">
              ♡
            </div>

            <h3>
              Todavía no tienes guías favoritas
            </h3>

            <p>
              Marca el corazón de una guía para
              guardarla y encontrarla rápidamente
              en este filtro.
            </p>

            <button
              type="button"
              onClick={() => {
                setFiltroGuias('todas')
              }}
            >
              Ver todas las guías
            </button>
          </div>
        )
      }

      <div className="guia-meditacion-consejos">
        <div className="guia-meditacion-consejos-cabecera">
          <span aria-hidden="true">
            💡
          </span>

          <div>
            <h2>
              Consejos para tu práctica
            </h2>

            <p>
              No necesitas hacerlo perfecto
              para obtener una pausa útil
              durante el día.
            </p>
          </div>
        </div>

        <div className="guia-meditacion-consejos-grid">
          {
            CONSEJOS_GUIA_MEDITACION.map(
              (consejo) => (
                <article
                  className="guia-meditacion-consejo"
                  key={consejo.titulo}
                >
                  <span aria-hidden="true">
                    {consejo.icono}
                  </span>

                  <div>
                    <h3>
                      {consejo.titulo}
                    </h3>

                    <p>
                      {consejo.descripcion}
                    </p>
                  </div>
                </article>
              )
            )
          }
        </div>
      </div>

      {
        guiaActiva &&
        pasoSeleccionado && (
          <div
            className="guia-meditacion-modal-fondo"
            role="presentation"
            onMouseDown={(evento) => {
              if (
                evento.target ===
                evento.currentTarget
              ) {
                cerrarGuia()
              }
            }}
          >
            <div
              className="guia-meditacion-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="guia-meditacion-modal-titulo"
              aria-describedby="guia-meditacion-modal-descripcion"
            >
              <header
                className={
                  `guia-meditacion-modal-cabecera ` +
                  `guia-meditacion-modal-${guiaActiva.tono}`
                }
              >
                <div className="guia-meditacion-modal-titulo-grupo">
                  <span
                    className="guia-meditacion-modal-icono"
                    aria-hidden="true"
                  >
                    {guiaActiva.icono}
                  </span>

                  <div>
                    <span>
                      {guiaActiva.etiqueta}
                    </span>

                    <h2 id="guia-meditacion-modal-titulo">
                      {guiaActiva.titulo}
                    </h2>
                  </div>
                </div>

                <button
                  ref={botonCerrarRef}
                  className="guia-meditacion-modal-cerrar"
                  type="button"
                  onClick={cerrarGuia}
                  aria-label="Cerrar guía de meditación"
                >
                  ×
                </button>
              </header>

              <div className="guia-meditacion-modal-cuerpo">
                <div className="guia-meditacion-modal-progreso-texto">
                  <span>
                    Paso {pasoActual + 1} de{' '}
                    {guiaActiva.pasos.length}
                  </span>

                  <strong>
                    {Math.round(progreso)}%
                  </strong>
                </div>

                <div
                  className="guia-meditacion-modal-barra"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={
                    Math.round(progreso)
                  }
                  aria-label="Progreso de la guía"
                >
                  <div
                    style={{
                      width: `${progreso}%`
                    }}
                  />
                </div>

                <div className="guia-meditacion-modal-layout">
                  <ol
                    className="guia-meditacion-modal-indice"
                    aria-label="Pasos de la guía"
                  >
                    {
                      guiaActiva.pasos.map(
                        (
                          paso,
                          indice
                        ) => (
                          <li
                            className={
                              indice ===
                              pasoActual
                                ? 'activo'
                                : (
                                  indice <
                                  pasoActual
                                    ? 'completado'
                                    : ''
                                )
                            }
                            key={paso.titulo}
                          >
                            <span>
                              {
                                indice <
                                pasoActual
                                  ? '✓'
                                  : indice + 1
                              }
                            </span>

                            <small>
                              {paso.titulo}
                            </small>
                          </li>
                        )
                      )
                    }
                  </ol>

                  <div className="guia-meditacion-modal-paso">
                    <span className="guia-meditacion-modal-paso-numero">
                      Paso {pasoActual + 1}
                    </span>

                    <h3>
                      {
                        pasoSeleccionado
                          .titulo
                      }
                    </h3>

                    <p id="guia-meditacion-modal-descripcion">
                      {
                        pasoSeleccionado
                          .descripcion
                      }
                    </p>

                    {
                      pasoSeleccionado
                        .consejo && (
                        <div className="guia-meditacion-modal-consejo">
                          <span aria-hidden="true">
                            💡
                          </span>

                          <p>
                            {
                              pasoSeleccionado
                                .consejo
                            }
                          </p>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>

              <footer className="guia-meditacion-modal-acciones">
                <button
                  className="guia-meditacion-boton-secundario"
                  type="button"
                  onClick={
                    irPasoAnterior
                  }
                  disabled={
                    pasoActual === 0
                  }
                >
                  ← Anterior
                </button>

                <button
                  className="guia-meditacion-boton-principal"
                  type="button"
                  onClick={
                    irPasoSiguiente
                  }
                >
                  {
                    esUltimoPaso
                      ? 'Finalizar guía'
                      : 'Siguiente paso →'
                  }
                </button>
              </footer>
            </div>
          </div>
        )
      }

      {
        guiaPremium && (
          <div
            className="guia-meditacion-modal-fondo"
            role="presentation"
            onMouseDown={(evento) => {
              if (
                evento.target ===
                evento.currentTarget
              ) {
                cerrarPremium()
              }
            }}
          >
            <div
              className="guia-meditacion-premium-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="guia-meditacion-premium-titulo"
              aria-describedby="guia-meditacion-premium-descripcion"
            >
              <button
                ref={botonCerrarRef}
                className="guia-meditacion-premium-cerrar"
                type="button"
                onClick={cerrarPremium}
                aria-label="Cerrar aviso Premium"
              >
                ×
              </button>

              <div
                className="guia-meditacion-premium-icono"
                aria-hidden="true"
              >
                🔒
              </div>

              <span className="guia-meditacion-premium-etiqueta">
                Función Premium
              </span>

              <h2 id="guia-meditacion-premium-titulo">
                Esta guía requiere el plan
                Premium
              </h2>

              <p id="guia-meditacion-premium-descripcion">
                <strong>
                  {guiaPremium.titulo}
                </strong>{' '}
                forma parte del catálogo
                Premium. Tu plan Free conserva
                el acceso a la meditación
                básica consciente.
              </p>

              <div className="guia-meditacion-premium-beneficios">
                <span>
                  ✓ Acceso a todas las guías
                  escritas
                </span>

                <span>
                  ✓ Prácticas para diferentes
                  momentos
                </span>

                <span>
                  ✓ Consulta del historial de
                  sesiones
                </span>
              </div>

              <div className="premium-meditacion-acciones">
                <button
                  className="guia-meditacion-boton-secundario"
                  type="button"
                  onClick={cerrarPremium}
                >
                  Ahora no
                </button>

                <button
                  className="guia-meditacion-boton-principal"
                  type="button"
                  onClick={() => {
                    cerrarPremium()
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

export default GuiaMeditacion