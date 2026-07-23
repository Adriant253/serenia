import {
  useEffect
} from 'react'

import {
  useHistorialMeditacion
} from '../../../functions/meditacionF/useHistorialMeditacion'

import type {
  FiltroEstadoHistorial,
  OrdenHistorial
} from '../../../functions/meditacionF/useHistorialMeditacion'

import {
  describirDuracionMeditacion,
  formatearFechaMeditacion,
  formatearHoraMeditacion,
  formatearTiempoMeditacion
} from '../../../functions/meditacionF/meditacionUtils'

import './HistorialMeditacion.css'

interface HistorialMeditacionProps {
  idUsuario: number
  activo: boolean
}

function HistorialMeditacion({
  idUsuario,
  activo
}: HistorialMeditacionProps) {
  const historial =
    useHistorialMeditacion({
      idUsuario,
      activo
    })

  useEffect(() => {
    if (
      !historial.sesionAEliminar
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
        historial
          .cancelarEliminacion()
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
  }, [
    historial.sesionAEliminar,
    historial.cancelarEliminacion
  ])

  const tieneFiltros =
    Boolean(
      historial.busqueda ||
      historial.filtroEstado !==
        'todos' ||
      historial.orden !==
        'recientes'
    )

  return (
    <section className="historial-meditacion">
      <div className="historial-meditacion-introduccion">
        <div>
          <span className="historial-meditacion-etiqueta">
            Progreso personal
          </span>

          <h2>
            Historial de meditación
          </h2>

          <p>
            Consulta las sesiones creadas
            desde el temporizador, revisa
            tu progreso y administra tus
            registros guardados.
          </p>
        </div>

        <button
          className="historial-meditacion-boton historial-meditacion-boton-actualizar"
          type="button"
          disabled={
            historial.cargando
          }
          onClick={() => {
            void historial
              .cargarHistorial()
          }}
        >
          {
            historial.cargando
              ? 'Actualizando...'
              : '↻ Actualizar'
          }
        </button>
      </div>

      {
        historial.mensajeAccion && (
          <div className="historial-meditacion-aviso historial-meditacion-aviso-exito">
            <span aria-hidden="true">
              ✓
            </span>

            <p>
              {historial.mensajeAccion}
            </p>
          </div>
        )
      }

      {
        historial.error && (
          <div className="historial-meditacion-aviso historial-meditacion-aviso-error">
            <span aria-hidden="true">
              ⚠️
            </span>

            <div>
              <strong>
                No se pudo completar la
                operación
              </strong>

              <p>
                {historial.error}
              </p>
            </div>

            <button
              type="button"
              disabled={
                historial.cargando
              }
              onClick={() => {
                void historial
                  .cargarHistorial()
              }}
            >
              Reintentar
            </button>
          </div>
        )
      }

      <div className="historial-meditacion-estadisticas">
        <article className="historial-meditacion-estadistica">
          <span>
            Total de sesiones
          </span>

          <strong>
            {
              historial.estadisticas
                .totalSesiones
            }
          </strong>

          <small>
            registros guardados
          </small>
        </article>

        <article className="historial-meditacion-estadistica">
          <span>
            Tiempo meditado
          </span>

          <strong>
            {
              describirDuracionMeditacion(
                historial.estadisticas
                  .totalSegundos
              )
            }
          </strong>

          <small>
            tiempo acumulado
          </small>
        </article>

        <article className="historial-meditacion-estadistica historial-meditacion-estadistica-completada">
          <span>
            Completadas
          </span>

          <strong>
            {
              historial.estadisticas
                .sesionesCompletadas
            }
          </strong>

          <small>
            tiempo alcanzado
          </small>
        </article>

        <article className="historial-meditacion-estadistica historial-meditacion-estadistica-interrumpida">
          <span>
            Interrumpidas
          </span>

          <strong>
            {
              historial.estadisticas
                .sesionesInterrumpidas
            }
          </strong>

          <small>
            finalizadas antes
          </small>
        </article>
      </div>

      <div className="historial-meditacion-filtros">
        <div className="historial-meditacion-filtro historial-meditacion-filtro-busqueda">
          <label htmlFor="historial-meditacion-busqueda">
            Buscar
          </label>

          <div className="historial-meditacion-campo-busqueda">
            <span aria-hidden="true">
              ⌕
            </span>

            <input
              id="historial-meditacion-busqueda"
              type="search"
              placeholder="Fecha, duración o estado..."
              value={historial.busqueda}
              onChange={(evento) => {
                historial
                  .cambiarBusqueda(
                    evento.target.value
                  )
              }}
            />
          </div>
        </div>

        <div className="historial-meditacion-filtro">
          <label htmlFor="historial-meditacion-estado">
            Estado
          </label>

          <select
            id="historial-meditacion-estado"
            value={
              historial.filtroEstado
            }
            onChange={(evento) => {
              historial
                .cambiarFiltroEstado(
                  evento.target
                    .value as
                    FiltroEstadoHistorial
                )
            }}
          >
            <option value="todos">
              Todas
            </option>

            <option value="completadas">
              Completadas
            </option>

            <option value="interrumpidas">
              Interrumpidas
            </option>
          </select>
        </div>

        <div className="historial-meditacion-filtro">
          <label htmlFor="historial-meditacion-orden">
            Orden
          </label>

          <select
            id="historial-meditacion-orden"
            value={historial.orden}
            onChange={(evento) => {
              historial
                .cambiarOrden(
                  evento.target
                    .value as
                    OrdenHistorial
                )
            }}
          >
            <option value="recientes">
              Más recientes
            </option>

            <option value="antiguas">
              Más antiguas
            </option>

            <option value="mayor-duracion">
              Mayor duración
            </option>

            <option value="menor-duracion">
              Menor duración
            </option>
          </select>
        </div>

        <button
          className="historial-meditacion-boton historial-meditacion-boton-limpiar"
          type="button"
          disabled={!tieneFiltros}
          onClick={
            historial.limpiarFiltros
          }
        >
          Limpiar filtros
        </button>
      </div>

      <div className="historial-meditacion-resultados-cabecera">
        <div>
          <span>
            Sesiones encontradas
          </span>

          <strong>
            {
              historial
                .sesionesFiltradas
                .length
            }
          </strong>
        </div>

        {
          historial.estadisticas
            .totalSesiones > 0 && (
            <small>
              Promedio por sesión:{' '}
              {
                describirDuracionMeditacion(
                  historial.estadisticas
                    .promedioSegundos
                )
              }
            </small>
          )
        }
      </div>

      {
        historial.cargando &&
        historial.sesiones.length === 0 && (
          <div className="historial-meditacion-cargando">
            <div className="historial-meditacion-spinner" />

            <h3>
              Consultando tu historial
            </h3>

            <p>
              Estamos obteniendo las
              sesiones guardadas.
            </p>
          </div>
        )
      }

      {
        !historial.cargando &&
        historial.sesiones.length === 0 &&
        !historial.error && (
          <div className="historial-meditacion-vacio">
            <div className="historial-meditacion-vacio-icono">
              🧘
            </div>

            <h3>
              Todavía no hay sesiones
              guardadas
            </h3>

            <p>
              Completa o finaliza una
              sesión desde el temporizador
              para que aparezca en este
              historial.
            </p>
          </div>
        )
      }

      {
        !historial.cargando &&
        historial.sesiones.length > 0 &&
        historial.sesionesFiltradas
          .length === 0 && (
          <div className="historial-meditacion-vacio">
            <div className="historial-meditacion-vacio-icono">
              🔍
            </div>

            <h3>
              No se encontraron resultados
            </h3>

            <p>
              Cambia la búsqueda o limpia
              los filtros para mostrar más
              sesiones.
            </p>

            <button
              className="historial-meditacion-boton historial-meditacion-boton-secundario"
              type="button"
              onClick={
                historial.limpiarFiltros
              }
            >
              Limpiar filtros
            </button>
          </div>
        )
      }

      {
        historial.sesionesFiltradas
          .length > 0 && (
          <div className="historial-meditacion-grid">
            {
              historial
                .sesionesFiltradas
                .map((sesion) => {
                  const progreso =
                    Math.min(
                      100,
                      Math.max(
                        0,
                        (
                          sesion
                            .duracion_real_segundos /
                          sesion
                            .duracion_programada_segundos
                        ) * 100
                      )
                    )

                  const completada =
                    sesion.completado === 1

                  return (
                    <article
                      className={
                        completada
                          ? (
                            'historial-meditacion-card ' +
                            'historial-meditacion-card-completada'
                          )
                          : (
                            'historial-meditacion-card ' +
                            'historial-meditacion-card-interrumpida'
                          )
                      }
                      key={
                        sesion
                          .id_meditacion
                      }
                    >
                      <div className="historial-meditacion-card-cabecera">
                        <div className="historial-meditacion-card-icono">
                          {
                            completada
                              ? '✓'
                              : '◷'
                          }
                        </div>

                        <div>
                          <span>
                            Sesión #
                            {
                              sesion
                                .id_meditacion
                            }
                          </span>

                          <h3>
                            Meditación con
                            temporizador
                          </h3>
                        </div>

                        <span
                          className={
                            completada
                              ? (
                                'historial-meditacion-estado ' +
                                'historial-meditacion-estado-completada'
                              )
                              : (
                                'historial-meditacion-estado ' +
                                'historial-meditacion-estado-interrumpida'
                              )
                          }
                        >
                          {
                            completada
                              ? 'Completada'
                              : 'Interrumpida'
                          }
                        </span>
                      </div>

                      <div className="historial-meditacion-card-duraciones">
                        <article>
                          <span>
                            Tiempo elegido
                          </span>

                          <strong>
                            {
                              describirDuracionMeditacion(
                                sesion
                                  .duracion_programada_segundos
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
                                sesion
                                  .duracion_real_segundos
                              )
                            }
                          </strong>
                        </article>
                      </div>

                      <div className="historial-meditacion-card-progreso">
                        <div>
                          <span>
                            Progreso
                          </span>

                          <strong>
                            {
                              Math.round(
                                progreso
                              )
                            }%
                          </strong>
                        </div>

                        <div className="historial-meditacion-card-barra">
                          <span
                            style={{
                              width:
                                `${progreso}%`
                            }}
                          />
                        </div>
                      </div>

                      <div className="historial-meditacion-card-fecha">
                        <div>
                          <span>
                            Fecha
                          </span>

                          <strong>
                            {
                              formatearFechaMeditacion(
                                sesion
                                  .fecha_fin
                              )
                            }
                          </strong>
                        </div>

                        <div>
                          <span>
                            Inicio
                          </span>

                          <strong>
                            {
                              formatearHoraMeditacion(
                                sesion
                                  .fecha_inicio
                              )
                            }
                          </strong>
                        </div>

                        <div>
                          <span>
                            Fin
                          </span>

                          <strong>
                            {
                              formatearHoraMeditacion(
                                sesion
                                  .fecha_fin
                              )
                            }
                          </strong>
                        </div>
                      </div>

                      <button
                        className="historial-meditacion-boton-eliminar"
                        type="button"
                        onClick={() => {
                          historial
                            .solicitarEliminacion(
                              sesion
                            )
                        }}
                      >
                        🗑 Eliminar registro
                      </button>
                    </article>
                  )
                })
            }
          </div>
        )
      }

      {
        historial.sesionAEliminar && (
          <div
            className="historial-meditacion-modal-fondo"
            role="presentation"
            onMouseDown={(evento) => {
              if (
                evento.target ===
                evento.currentTarget
              ) {
                historial
                  .cancelarEliminacion()
              }
            }}
          >
            <div
              className="historial-meditacion-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="historial-eliminar-titulo"
              aria-describedby="historial-eliminar-descripcion"
            >
              <button
                className="historial-meditacion-modal-cerrar"
                type="button"
                disabled={
                  historial.eliminando
                }
                aria-label="Cerrar confirmación"
                onClick={
                  historial
                    .cancelarEliminacion
                }
              >
                ×
              </button>

              <div className="historial-meditacion-modal-icono">
                🗑️
              </div>

              <span className="historial-meditacion-modal-etiqueta">
                Confirmar eliminación
              </span>

              <h2 id="historial-eliminar-titulo">
                ¿Eliminar esta sesión?
              </h2>

              <p id="historial-eliminar-descripcion">
                Esta acción eliminará
                permanentemente el registro
                del historial. No restaurará
                una sesión Free utilizada.
              </p>

              <div className="historial-meditacion-modal-resumen">
                <div>
                  <span>
                    Sesión
                  </span>

                  <strong>
                    #
                    {
                      historial
                        .sesionAEliminar
                        .id_meditacion
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Tiempo meditado
                  </span>

                  <strong>
                    {
                      describirDuracionMeditacion(
                        historial
                          .sesionAEliminar
                          .duracion_real_segundos
                      )
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Fecha
                  </span>

                  <strong>
                    {
                      formatearFechaMeditacion(
                        historial
                          .sesionAEliminar
                          .fecha_fin
                      )
                    }
                  </strong>
                </div>
              </div>

              <div className="historial-meditacion-modal-acciones">
                <button
                  className="historial-meditacion-boton historial-meditacion-boton-secundario"
                  type="button"
                  disabled={
                    historial.eliminando
                  }
                  onClick={
                    historial
                      .cancelarEliminacion
                  }
                >
                  Cancelar
                </button>

                <button
                  className="historial-meditacion-boton historial-meditacion-boton-peligro"
                  type="button"
                  disabled={
                    historial.eliminando
                  }
                  onClick={() => {
                    void historial
                      .confirmarEliminacion()
                  }}
                >
                  {
                    historial.eliminando
                      ? 'Eliminando...'
                      : 'Eliminar definitivamente'
                  }
                </button>
              </div>
            </div>
          </div>
        )
      }
    </section>
  )
}

export default HistorialMeditacion