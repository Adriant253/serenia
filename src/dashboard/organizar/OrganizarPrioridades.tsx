import './OrganizarPrioridades.css'

import {
  obtenerClaseEtiqueta,
  obtenerClasePrioridad,
  useOrganizarPrioridades
} from '../../functions/organizarF/organizarPrioridades'

import type {
  FiltroEstado,
  FiltroPrioridad,
  TareaPrioridad
} from '../../functions/organizarF/organizarPrioridades'

import type {
  PrioridadTarea
} from '../../services/organizarPrioridadesService'

interface OrganizarPrioridadesProps {
  onIrSuscripcion: () => void
}

function OrganizarPrioridades({
  onIrSuscripcion
}: OrganizarPrioridadesProps) {
  const organizar =
    useOrganizarPrioridades()

  const esEdicion =
    organizar.formulario.id_tarea !== ''

  const tareasVista =
    organizar.tareasPaginadas

  const textoPlan =
    organizar.esUsuarioPremium
      ? 'Premium'
      : 'Free'

  function irAVistaSuscripcion() {
    organizar.cerrarModalPremium()

    onIrSuscripcion()
  }


  function renderTarea(
    tarea: TareaPrioridad,
    index: number
  ) {
    const prioridadClase =
      obtenerClasePrioridad(
        tarea.prioridad
      )

    const etiquetaClase =
      obtenerClaseEtiqueta(
        tarea.prioridad
      )

    const estadoClase =
      tarea.estado === 'Completada'
        ? 'organizar-completada'
        : ''

    const textoBotonEstado =
      tarea.estado === 'Pendiente'
        ? 'Completar'
        : 'Pendiente'

    return (
      <div
        className={
          `organizar-tarea ` +
          `organizar-${prioridadClase} ` +
          `${estadoClase}`
        }
        key={
          `${organizar.buscar}-` +
          `${organizar.filtroPrioridad}-` +
          `${organizar.filtroEstado}-` +
          `${organizar.paginaActual}-` +
          `${tarea.id}`
        }
        style={{
          animationDelay:
            `${index * 0.06}s`
        }}
      >
        <div className="organizar-tarea-header">
          <h3>
            {tarea.titulo}
          </h3>

          <span
            className={
              `organizar-etiqueta ` +
              `organizar-${etiquetaClase}`
            }
          >
            {tarea.prioridad}
          </span>
        </div>

        <p className="organizar-descripcion">
          {
            tarea.descripcion ||
            'Sin descripción'
          }
        </p>

        <div className="organizar-meta">
          <span className="organizar-prioridad-texto">
            Prioridad: {tarea.prioridad}
          </span>

          <span className="organizar-estado">
            {tarea.estado}
          </span>
        </div>

        <p className="organizar-fecha">
          <strong>
            Fecha inicio:
          </strong>{' '}

          {
            tarea.fechaInicio ||
            'Sin fecha'
          }
        </p>

        <p className="organizar-fecha">
          <strong>
            Fecha límite:
          </strong>{' '}

          {
            tarea.fecha ||
            'Sin fecha'
          }
        </p>

        {
          tarea.notificarVencimiento === 1 && (
            <p className="organizar-notificacion-card-activa">
              🔔 Notificación por correo activa
            </p>
          )
        }

        {
          organizar.tareaConfirmandoEliminar ===
          tarea.id
            ? (
              <div className="organizar-confirmar-eliminar">
                <p>
                  ¿Seguro que quieres eliminar
                  esta tarea?
                </p>

                <div className="organizar-botones-confirmar">
                  <button
                    className="organizar-btn-confirmar-no"
                    onClick={
                      organizar.cancelarEliminarTarea
                    }
                    title="Cancelar"
                    type="button"
                  >
                    ✖
                  </button>

                  <button
                    className="organizar-btn-confirmar-si"
                    onClick={() => {
                      void organizar
                        .confirmarEliminarTarea(
                          tarea.id
                        )
                    }}
                    title="Eliminar"
                    type="button"
                  >
                    ✔
                  </button>
                </div>
              </div>
            )
            : (
              <div className="organizar-acciones">
                <button
                  className="organizar-btn-completar"
                  onClick={() => {
                    void organizar
                      .cambiarEstado(
                        tarea.id
                      )
                  }}
                  type="button"
                >
                  {textoBotonEstado}
                </button>

                <button
                  className="organizar-btn-editar"
                  onClick={() => {
                    organizar.editarTarea(
                      tarea.id
                    )
                  }}
                  type="button"
                >
                  Editar
                </button>

                <button
                  className="organizar-btn-eliminar"
                  onClick={() => {
                    organizar.eliminarTarea(
                      tarea.id
                    )
                  }}
                  type="button"
                >
                  Eliminar
                </button>
              </div>
            )
        }
      </div>
    )
  }

  return (
    <div className="organizar-page">
      {
        organizar.aviso && (
          <div
            className="organizar-aviso"
            id="aviso"
            style={{
              display: 'block'
            }}
          >
            {organizar.aviso}
          </div>
        )
      }

      <div className="organizar-contenedor">

        {/* =====================================
            ENCABEZADO ORGANIZAR PRIORIDADES
        ====================================== */}

        <header className="organizar-encabezado">
          <div className="organizar-encabezado-texto">
            <span className="organizar-sobretitulo">
              Productividad y organización
            </span>

            <h1>
              📌 Organizar Prioridades
            </h1>

            <p>
              Visualiza tus tareas, establece
              prioridades y mantén el control de
              tus actividades.
            </p>
          </div>

          <div
            className={
              organizar.esUsuarioPremium
                ? (
                  'organizar-plan ' +
                  'organizar-plan-premium'
                )
                : (
                  'organizar-plan ' +
                  'organizar-plan-free'
                )
            }
          >
            <span>
              Plan
            </span>

            <strong>
              {textoPlan}
            </strong>
          </div>
        </header>

        {/* =====================================
            RESUMEN DE TAREAS
        ====================================== */}

        <section className="organizar-resumen">
          <div
            className={
              organizar.filtroPrioridad ===
              'Todas'
                ? (
                  'organizar-resumen-card ' +
                  'organizar-activo'
                )
                : 'organizar-resumen-card'
            }
            id="cardTodas"
            onClick={() => {
              organizar.aplicarFiltroRapido(
                'Todas'
              )
            }}
          >
            <h3>
              Total
            </h3>

            <p id="totalTareas">
              {organizar.totalTareas}
            </p>
          </div>

          <div
            className={
              organizar.filtroPrioridad ===
              'Alta'
                ? (
                  'organizar-resumen-card ' +
                  'organizar-alta ' +
                  'organizar-activo'
                )
                : (
                  'organizar-resumen-card ' +
                  'organizar-alta'
                )
            }
            id="cardAlta"
            onClick={() => {
              organizar.aplicarFiltroRapido(
                'Alta'
              )
            }}
          >
            <h3>
              Alta
            </h3>

            <p id="totalAlta">
              {organizar.totalAlta}
            </p>
          </div>

          <div
            className={
              organizar.filtroPrioridad ===
              'Media'
                ? (
                  'organizar-resumen-card ' +
                  'organizar-media ' +
                  'organizar-activo'
                )
                : (
                  'organizar-resumen-card ' +
                  'organizar-media'
                )
            }
            id="cardMedia"
            onClick={() => {
              organizar.aplicarFiltroRapido(
                'Media'
              )
            }}
          >
            <h3>
              Media
            </h3>

            <p id="totalMedia">
              {organizar.totalMedia}
            </p>
          </div>

          <div
            className={
              organizar.filtroPrioridad ===
              'Baja'
                ? (
                  'organizar-resumen-card ' +
                  'organizar-baja ' +
                  'organizar-activo'
                )
                : (
                  'organizar-resumen-card ' +
                  'organizar-baja'
                )
            }
            id="cardBaja"
            onClick={() => {
              organizar.aplicarFiltroRapido(
                'Baja'
              )
            }}
          >
            <h3>
              Baja
            </h3>

            <p id="totalBaja">
              {organizar.totalBaja}
            </p>
          </div>
        </section>

        {/* =====================================
            BOTÓN CREAR TAREA
        ====================================== */}

        <div className="organizar-acciones-debajo-resumen">
          <button
            className={
              organizar.creacionBloqueadaFree
                ? (
                  'organizar-btn-principal ' +
                  'organizar-btn-principal-bloqueado'
                )
                : 'organizar-btn-principal'
            }
            onClick={
              organizar.abrirModalCrear
            }
            type="button"
            disabled={
              organizar.cargando
            }
            aria-disabled={
              organizar.creacionBloqueadaFree
            }
            title={
              organizar.creacionBloqueadaFree
                ? (
                  `Límite diario de ` +
                  `${organizar.limiteDiarioTareasFree} ` +
                  `tareas alcanzado`
                )
                : organizar.cargando
                  ? 'Cargando tareas'
                  : 'Crear tarea'
            }
          >
            {
              organizar.creacionBloqueadaFree
                ? '🔒 Límite alcanzado'
                : organizar.cargando
                  ? 'Cargando...'
                  : '➕ Crear tarea'
            }
          </button>
        </div>

        {/* =====================================
            FILTROS
        ====================================== */}

        <section className="organizar-panel-filtros-compacto">
          <div className="organizar-filtros">
            <div>
              <label htmlFor="buscarTarea">
                Buscar:
              </label>

              <input
                type="text"
                id="buscarTarea"
                placeholder="Buscar..."
                value={
                  organizar.buscar
                }
                onChange={(event) => {
                  organizar.setBuscar(
                    event.target.value
                  )
                }}
              />
            </div>

            <div>
              <label htmlFor="filtroPrioridad">
                Prioridad:
              </label>

              <select
                id="filtroPrioridad"
                value={
                  organizar.filtroPrioridad
                }
                onChange={(event) => {
                  organizar
                    .setFiltroPrioridad(
                      event.target
                        .value as FiltroPrioridad
                    )
                }}
              >
                <option value="Todas">
                  Todas
                </option>

                <option value="Alta">
                  Alta
                </option>

                <option value="Media">
                  Media
                </option>

                <option value="Baja">
                  Baja
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="filtroEstado">
                Estado:
              </label>

              <select
                id="filtroEstado"
                value={
                  organizar.filtroEstado
                }
                onChange={(event) => {
                  organizar.setFiltroEstado(
                    event.target
                      .value as FiltroEstado
                  )
                }}
              >
                <option value="Todos">
                  Todos
                </option>

                <option value="Pendiente">
                  Pendiente
                </option>

                <option value="Completada">
                  Completada
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* =====================================
            LISTADO DE TAREAS
        ====================================== */}

        <section className="organizar-tablero-lista">
          {
            tareasVista.length > 0
              ? tareasVista.map(
                  renderTarea
                )
              : (
                <div className="organizar-mensaje-vacio-general">
                  <h3>
                    No hay tareas para mostrar.
                  </h3>

                  <p>
                    Cambia los filtros o crea
                    una nueva tarea.
                  </p>
                </div>
              )
          }
        </section>

        {/* =====================================
            PAGINACIÓN
        ====================================== */}

        {
          organizar.tareasFiltradas.length >
          6 && (
            <div className="organizar-paginacion">
              <button
                className="organizar-btn-salto-pagina"
                onClick={
                  organizar.irPrimeraPagina
                }
                disabled={
                  organizar.paginaActual === 1
                }
                title="Ir al inicio"
                type="button"
              >
                «
              </button>

              <div className="organizar-paginas">
                {
                  organizar.paginasVisibles.map(
                    (
                      numeroPagina
                    ) => (
                      <button
                        key={
                          numeroPagina
                        }
                        className={
                          organizar.paginaActual ===
                          numeroPagina
                            ? (
                              'organizar-numero-pagina ' +
                              'organizar-numero-pagina-activa'
                            )
                            : 'organizar-numero-pagina'
                        }
                        onClick={() => {
                          organizar.cambiarPagina(
                            numeroPagina
                          )
                        }}
                        type="button"
                      >
                        {numeroPagina}
                      </button>
                    )
                  )
                }
              </div>

              <button
                className="organizar-btn-salto-pagina"
                onClick={
                  organizar.irUltimaPagina
                }
                disabled={
                  organizar.paginaActual ===
                  organizar.totalPaginas
                }
                title="Ir al final"
                type="button"
              >
                »
              </button>
            </div>
          )
        }
      </div>

      {/* =====================================
          MODAL CREAR O EDITAR TAREA
      ====================================== */}

      <div
        className={
          organizar.modalActivo
            ? (
              'organizar-modal ' +
              'organizar-activo'
            )
            : 'organizar-modal'
        }
        id="modalTarea"
        onClick={
          organizar.cerrarModalDesdeFondo
        }
      >
        <div className="organizar-modal-contenido">
          <div className="organizar-modal-header">
            <h2 id="tituloModal">
              {organizar.tituloModal}
            </h2>

            <button
              className="organizar-btn-cerrar"
              onClick={
                organizar.cerrarModal
              }
              type="button"
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </div>

          <form
            className="organizar-formulario-tarea"
            onSubmit={(event) => {
              event.preventDefault()

              void organizar.guardarTarea()
            }}
          >
            <input
              type="hidden"
              id="idTarea"
              value={
                organizar.formulario.id_tarea
              }
              readOnly
            />

            <div
              className={
                'organizar-form-grid ' +
                'organizar-form-grid-tres'
              }
            >
              <div>
                <label htmlFor="tituloTarea">
                  Título de la tarea:
                </label>

                <input
                  type="text"
                  id="tituloTarea"
                  placeholder="Ejemplo: Terminar reporte, estudiar, entregar proyecto..."
                  value={
                    organizar.formulario.titulo
                  }
                  onChange={(event) => {
                    organizar
                      .actualizarFormulario(
                        'titulo',
                        event.target.value
                      )
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="fechaInicioTarea">
                  Fecha inicio:
                </label>

                <input
                  type="date"
                  id="fechaInicioTarea"
                  value={
                    organizar.formulario
                      .fechaInicio
                  }
                  onChange={(event) => {
                    organizar
                      .actualizarFormulario(
                        'fechaInicio',
                        event.target.value
                      )
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="fechaTarea">
                  Fecha límite:
                </label>

                <input
                  type="date"
                  id="fechaTarea"
                  value={
                    organizar.formulario.fecha
                  }
                  onChange={(event) => {
                    organizar
                      .actualizarFormulario(
                        'fecha',
                        event.target.value
                      )
                  }}
                  required
                />
              </div>
            </div>

            <label htmlFor="descripcionTarea">
              Descripción:
            </label>

            <textarea
              id="descripcionTarea"
              placeholder="Escribe una breve descripción de la tarea..."
              value={
                organizar.formulario.descripcion
              }
              onChange={(event) => {
                organizar
                  .actualizarFormulario(
                    'descripcion',
                    event.target.value
                  )
              }}
            />

            <div
              className={
                'organizar-form-grid ' +
                'organizar-form-grid-doble'
              }
            >
              <div>
                <label htmlFor="prioridadTarea">
                  Prioridad:
                </label>

                <select
                  id="prioridadTarea"
                  value={
                    organizar.formulario.prioridad
                  }
                  onChange={(event) => {
                    organizar
                      .actualizarFormulario(
                        'prioridad',
                        event.target
                          .value as PrioridadTarea
                      )
                  }}
                  required
                >
                  <option value="Alta">
                    Alta
                  </option>

                  <option value="Media">
                    Media
                  </option>

                  <option value="Baja">
                    Baja
                  </option>
                </select>
              </div>

              <div>
                <label htmlFor="notificarVencimiento">
                  Notificación:
                </label>

                <div className="organizar-switch-contenedor">
                  {
                    organizar.esUsuarioFree && (
                      <span
                        className="organizar-switch-candado"
                        title="Función premium"
                      >
                        🔒
                      </span>
                    )
                  }

                  <label
                    className={
                      organizar.esUsuarioPremium
                        ? 'organizar-switch'
                        : (
                          'organizar-switch ' +
                          'organizar-switch-bloqueado'
                        )
                    }
                    title={
                      organizar.esUsuarioPremium
                        ? (
                          'Activar notificación ' +
                          'por correo'
                        )
                        : (
                          'Función disponible ' +
                          'solo para premium'
                        )
                    }
                  >
                    <input
                      type="checkbox"
                      id="notificarVencimiento"
                      checked={
                        organizar.esUsuarioPremium &&
                        organizar.formulario
                          .notificarVencimiento
                      }
                      disabled={
                        organizar.esUsuarioFree
                      }
                      onChange={(event) => {
                        organizar
                          .actualizarFormulario(
                            'notificarVencimiento',
                            organizar.esUsuarioPremium
                              ? event.target.checked
                              : false
                          )
                      }}
                    />

                    <span className="organizar-switch-slider" />
                  </label>
                </div>
              </div>
            </div>

            <div className="organizar-botones-modal">
              <button
                className="organizar-btn-cancelar"
                onClick={
                  organizar.cerrarModal
                }
                type="button"
              >
                Cancelar
              </button>

              {
                esEdicion && (
                  <button
                    className="organizar-btn-limpiar"
                    onClick={
                      organizar.limpiarFormulario
                    }
                    type="button"
                  >
                    Limpiar
                  </button>
                )
              }

              <button
                className="organizar-btn-guardar"
                type="submit"
                disabled={
                  organizar.cargando
                }
              >
                {
                  organizar.cargando
                    ? 'Guardando...'
                    : 'Guardar tarea'
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* =====================================
          MODAL PREMIUM
      ====================================== */}

      {
        organizar.modalPremiumActivo && (
          <div
            id="modalPremium"
            className="organizar-premium-overlay"
            onClick={(event) => {
              if (
                (
                  event.target as
                  HTMLDivElement
                ).id === 'modalPremium'
              ) {
                organizar
                  .cerrarModalPremium()
              }
            }}
          >
            <div
              className="organizar-premium-card"
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <div className="organizar-premium-header">
                <h2>
                  Cámbiate a premium
                </h2>

                <button
                  className="organizar-premium-cerrar"
                  onClick={
                    organizar.cerrarModalPremium
                  }
                  type="button"
                  aria-label="Cerrar modal premium"
                >
                  ×
                </button>
              </div>

              <div className="organizar-premium-body">
                <div className="organizar-premium-icono">
                  🔒
                </div>

                <h3 className="organizar-premium-titulo">
                  {
                    organizar
                      .tituloLimitePremium
                  }
                </h3>

                <p className="organizar-premium-descripcion">
                  {
                    organizar
                      .descripcionLimitePremium
                  }
                </p>

                {
                  organizar
                    .tiempoRestantePremium && (
                    <div className="organizar-premium-tiempo">
                      Disponible de nuevo en:{' '}

                      <strong>
                        {
                          organizar
                            .tiempoRestantePremium
                        }
                      </strong>
                    </div>
                  )
                }
              </div>

              <div className="organizar-premium-acciones">
                <button
                  className="organizar-premium-btn-secundario"
                  onClick={
                    organizar.cerrarModalPremium
                  }
                  type="button"
                >
                  Ahora no
                </button>
<button
  className="organizar-premium-btn-pagar"
  onClick={
    irAVistaSuscripcion
  }
  type="button"
>
  Pagar
</button>




              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default OrganizarPrioridades