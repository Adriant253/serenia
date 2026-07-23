import './Recordatorios.css'

import {
  diasFormulario,
  nombresDias,
  obtenerTextoTiempoRestante,
  useRecordatoriosDescanso
} from '../../functions/recordatoriosF/recordatorios'

import type {
  RecordatorioDescanso
} from '../../functions/recordatoriosF/recordatorios'

import type {
  EstadoRecordatorio
} from '../../services/RecordatoriosService'

interface RecordatoriosProps {
  onIrSuscripcion: () => void
}

function Recordatorios({
  onIrSuscripcion
}: RecordatoriosProps) {
  const recordatorios =
    useRecordatoriosDescanso()

  const esEdicion =
    recordatorios.formulario.id_recordatorio !== ''

  const textoPlan =
    recordatorios.esUsuarioFree
      ? 'Free'
      : 'Premium'

  function irAVistaSuscripcion() {
    recordatorios
      .cerrarModalPremium()

    onIrSuscripcion()
  }

  function renderRecordatorio(
    recordatorio: RecordatorioDescanso
  ) {
    const claseApagada =
      recordatorio.estado === 'activo'
        ? ''
        : 'apagada'

    const claseConfirmando =
      recordatorios.recordatorioConfirmandoEliminar ===
      recordatorio.id
        ? 'confirmando'
        : ''

    const ordenDias = [
      1,
      2,
      3,
      4,
      5,
      6,
      0
    ]

    const diasTexto =
      [...recordatorio.dias]
        .sort((a, b) => {
          return (
            ordenDias.indexOf(a) -
            ordenDias.indexOf(b)
          )
        })
        .map((dia) => (
          <span
            className="dia-pill"
            key={`${recordatorio.id}-${dia}`}
          >
            {nombresDias[dia]}
          </span>
        ))

    return (
      <article
        className={
          `alarma ${claseApagada} ${claseConfirmando}`
        }
        id={`recordatorio-${recordatorio.id}`}
        key={recordatorio.id}
      >
        <div className="hora">
          {recordatorio.hora}
        </div>

        <div className="detalle">
          <strong>
            {recordatorio.nombre}
          </strong>

          <p>
            {
              recordatorio.mensaje ||
              'Sin mensaje personalizado.'
            }
          </p>

          <span className="tiempo-restante">
            ⏳{' '}
            {
              obtenerTextoTiempoRestante(
                recordatorio
              )
            }
          </span>

          <div className="dias">
            {diasTexto}
          </div>
        </div>

        {
          recordatorios.recordatorioConfirmandoEliminar ===
          recordatorio.id
            ? (
              <div className="confirmar-eliminar">
                <p>
                  ¿Seguro que deseas eliminar este
                  recordatorio?
                </p>

                <div className="botones-confirmar">
                  <button
                    className="btn-confirmar-no"
                    onClick={
                      recordatorios
                        .cancelarEliminarRecordatorio
                    }
                    title="Cancelar"
                    aria-label="Cancelar eliminación"
                    type="button"
                    disabled={
                      recordatorios.cargando
                    }
                  >
                    ✖
                  </button>

                  <button
                    className="btn-confirmar-si"
                    onClick={() => {
                      void recordatorios
                        .confirmarEliminarRecordatorio(
                          recordatorio.id
                        )
                    }}
                    title="Eliminar"
                    aria-label="Confirmar eliminación"
                    type="button"
                    disabled={
                      recordatorios.cargando
                    }
                  >
                    ✔
                  </button>
                </div>
              </div>
            )
            : (
              <div className="acciones-alarma">
                <button
                  className="btn-icono"
                  onClick={() => {
                    recordatorios.abrirModalEditar(
                      recordatorio.id
                    )
                  }}
                  title="Editar"
                  aria-label="Editar recordatorio"
                  type="button"
                  disabled={
                    recordatorios.cargando
                  }
                >
                  ✎
                </button>

                <button
                  className={
                    'btn-icono ' +
                    'btn-icono-eliminar'
                  }
                  onClick={() => {
                    recordatorios.eliminarRecordatorio(
                      recordatorio.id,
                      false
                    )
                  }}
                  title="Eliminar"
                  aria-label="Eliminar recordatorio"
                  type="button"
                  disabled={
                    recordatorios.cargando
                  }
                >
                  🗑
                </button>

                <label
                  className="switch"
                  title={
                    recordatorio.estado === 'activo'
                      ? 'Pausar recordatorio'
                      : 'Activar recordatorio'
                  }
                >
                  <input
                    type="checkbox"
                    checked={
                      recordatorio.estado === 'activo'
                    }
                    disabled={
                      recordatorios.cargando
                    }
                    onChange={() => {
                      recordatorios.cambiarEstado(
                        recordatorio.id
                      )
                    }}
                    aria-label={
                      recordatorio.estado === 'activo'
                        ? 'Pausar recordatorio'
                        : 'Activar recordatorio'
                    }
                  />

                  <span className="slider" />
                </label>
              </div>
            )
        }
      </article>
    )
  }

  return (
    <div className="recordatorios-page">
      <div
        className="recordatorios-toast-container"
        id="toastContainer"
        aria-live="polite"
        aria-atomic="false"
      >
        {
          recordatorios.toasts.map((toast) => (
            <div
              className="recordatorios-toast"
              key={toast.id}
              role="status"
            >
              <h3>
                🔔 {toast.titulo}
              </h3>

              <p>
                {toast.mensaje}
              </p>

              <button
                onClick={() => {
                  recordatorios.cerrarToast(
                    toast.id
                  )
                }}
                type="button"
              >
                Cerrar
              </button>
            </div>
          ))
        }
      </div>

      <main className="app">
        <div className="contenido">
          <section className="panel">

            {/* ===================================
                NUEVO ENCABEZADO
            ==================================== */}

            <header className="recordatorios-encabezado">
              <div className="recordatorios-encabezado-texto">
                <span className="recordatorios-sobretitulo">
                  Bienestar y productividad
                </span>

                <h1>
                  ⏰ Recordatorios para descanso
                </h1>

                <p>
                  Programa pausas durante tu jornada,
                  administra tus recordatorios y
                  mantén un mejor equilibrio.
                </p>
              </div>

              <div
                className={
                  recordatorios.esUsuarioFree
                    ? (
                      'recordatorios-plan ' +
                      'recordatorios-plan-free'
                    )
                    : (
                      'recordatorios-plan ' +
                      'recordatorios-plan-premium'
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

            {/* ===================================
                RESUMEN
            ==================================== */}

            <div className="resumen">
              <div className="resumen-card">
                <small>
                  Total
                </small>

                <strong id="totalRecordatorios">
                  {
                    recordatorios
                      .totalRecordatorios
                  }
                </strong>
              </div>

              <div className="resumen-card">
                <small>
                  Activos
                </small>

                <strong id="totalActivos">
                  {
                    recordatorios
                      .totalActivos
                  }
                </strong>
              </div>

              <div className="resumen-card">
                <small>
                  Próximo
                </small>

                <strong
                  id="proximoRecordatorio"
                  className="resumen-proximo"
                >
                  {
                    recordatorios
                      .proximoRecordatorio
                  }
                </strong>
              </div>
            </div>

            {/* ===================================
                BOTÓN AGREGAR
            ==================================== */}

            <div className="barra-acciones">
              <button
                className={
                  recordatorios.creacionBloqueadaFree
                    ? (
                      'btn-principal ' +
                      'btn-principal-bloqueado'
                    )
                    : 'btn-principal'
                }
                onClick={
                  recordatorios.abrirModalCrear
                }
                type="button"
                disabled={
                  recordatorios.cargando
                }
                aria-disabled={
                  recordatorios
                    .creacionBloqueadaFree
                }
                title={
                  recordatorios
                    .creacionBloqueadaFree
                    ? 'Cámbiate a premium'
                    : 'Agregar recordatorio'
                }
              >
                {
                  recordatorios
                    .creacionBloqueadaFree
                    ? '🔒 Agregar recordatorio'
                    : '＋ Agregar recordatorio'
                }
              </button>
            </div>

            {/* ===================================
                INFORMACIÓN PLAN FREE
            ==================================== */}

            {
              recordatorios.esUsuarioFree && (
                <div
                  className={
                    recordatorios.creacionBloqueadaFree
                      ? (
                        'recordatorios-limite-free ' +
                        'recordatorios-limite-free-completo'
                      )
                      : 'recordatorios-limite-free'
                  }
                >
                  Plan free:{' '}

                  <strong>
                    {
                      recordatorios
                        .totalRecordatorios
                    }
                  </strong>

                  {' '}de{' '}

                  <strong>
                    {
                      recordatorios
                        .limiteTotalRecordatoriosFree
                    }
                  </strong>

                  {' '}recordatorios utilizados.

                  {
                    recordatorios
                      .espaciosDisponiblesFree !==
                      null &&
                    recordatorios
                      .espaciosDisponiblesFree >
                      0 && (
                      <>
                        {' '}Te quedan{' '}

                        <strong>
                          {
                            recordatorios
                              .espaciosDisponiblesFree
                          }
                        </strong>

                        {' '}

                        {
                          recordatorios
                            .espaciosDisponiblesFree ===
                          1
                            ? 'espacio disponible.'
                            : 'espacios disponibles.'
                        }
                      </>
                    )
                  }
                </div>
              )
            }

            {/* ===================================
                LISTA DE ALARMAS
            ==================================== */}

            <h2 className="seccion-titulo">
              Alarmas programadas
            </h2>

            <div
              className="lista-alarmas"
              id="listaRecordatorios"
            >
              {
                recordatorios.cargando &&
                recordatorios
                  .recordatoriosOrdenados
                  .length === 0
                  ? (
                    <div className="sin-recordatorios">
                      <strong>
                        Cargando recordatorios...
                      </strong>
                    </div>
                  )
                  : recordatorios
                      .recordatoriosOrdenados
                      .length > 0
                    ? recordatorios
                        .recordatoriosPaginados
                        .map(renderRecordatorio)
                    : (
                      <div className="sin-recordatorios">
                        <strong>
                          No hay recordatorios
                          programados.
                        </strong>

                        <br />

                        Presiona el botón agregar para
                        crear varias horas de descanso
                        durante tu jornada.
                      </div>
                    )
              }
            </div>

            {/* ===================================
                PAGINACIÓN
            ==================================== */}

            {
              recordatorios
                .recordatoriosOrdenados
                .length > 5 && (
                <div className="recordatorios-paginacion">
                  <button
                    className="recordatorios-btn-salto-pagina"
                    onClick={
                      recordatorios.irPrimeraPagina
                    }
                    disabled={
                      recordatorios.paginaActual === 1
                    }
                    title="Ir al inicio"
                    type="button"
                  >
                    «
                  </button>

                  <div className="recordatorios-paginas">
                    {
                      recordatorios.paginasVisibles.map(
                        (numeroPagina) => (
                          <button
                            key={numeroPagina}
                            className={
                              recordatorios.paginaActual ===
                              numeroPagina
                                ? (
                                  'recordatorios-numero-pagina ' +
                                  'recordatorios-numero-pagina-activa'
                                )
                                : 'recordatorios-numero-pagina'
                            }
                            onClick={() => {
                              recordatorios.cambiarPagina(
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
                    className="recordatorios-btn-salto-pagina"
                    onClick={
                      recordatorios.irUltimaPagina
                    }
                    disabled={
                      recordatorios.paginaActual ===
                      recordatorios.totalPaginas
                    }
                    title="Ir al final"
                    type="button"
                  >
                    »
                  </button>
                </div>
              )
            }
          </section>
        </div>
      </main>

      {/* =====================================
          MODAL CREAR O EDITAR
      ====================================== */}

      <div
        className={
          recordatorios.modalActivo
            ? 'modal activo'
            : 'modal'
        }
        id="modalRecordatorio"
        onClick={
          recordatorios.cerrarModalDesdeFondo
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModal"
      >
        <div
          className="modal-contenido"
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <div className="modal-header">
            <h2 id="tituloModal">
              {recordatorios.tituloModal}
            </h2>

            <button
              className="btn-cerrar"
              onClick={
                recordatorios.cerrarModal
              }
              type="button"
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()

              void recordatorios
                .guardarRecordatorio()
            }}
          >
            <input
              type="hidden"
              id="idRecordatorio"
              value={
                recordatorios
                  .formulario
                  .id_recordatorio
              }
              readOnly
            />

            <div className="selector-hora">
              <div
                className="hora-preview"
                id="horaPreview"
              >
                {
                  recordatorios
                    .formulario.hora
                }
              </div>

              <label htmlFor="horaRecordatorio">
                Seleccionar hora
              </label>

              <input
                type="time"
                id="horaRecordatorio"
                value={
                  recordatorios
                    .formulario.hora
                }
                onChange={(event) => {
                  recordatorios
                    .actualizarFormulario(
                      'hora',
                      event.target.value
                    )
                }}
                required
              />
            </div>

            <label htmlFor="nombreRecordatorio">
              Nombre del recordatorio
            </label>

            <input
              type="text"
              id="nombreRecordatorio"
              placeholder="Ejemplo: Pausa activa, descanso visual, respirar..."
              value={
                recordatorios
                  .formulario.nombre
              }
              maxLength={150}
              onChange={(event) => {
                recordatorios
                  .actualizarFormulario(
                    'nombre',
                    event.target.value
                  )
              }}
              required
            />

            <label htmlFor="mensajeRecordatorio">
              Mensaje de la alerta
            </label>

            <textarea
              id="mensajeRecordatorio"
              placeholder="Ejemplo: Es momento de tomar un descanso y despejar la mente."
              value={
                recordatorios
                  .formulario.mensaje
              }
              maxLength={4000}
              onChange={(event) => {
                recordatorios
                  .actualizarFormulario(
                    'mensaje',
                    event.target.value
                  )
              }}
            />

            <label>
              Repetir
            </label>

            <div className="dias-form">
              {
                diasFormulario.map((dia) => (
                  <label
                    className="dia-check"
                    key={dia.valor}
                  >
                    <input
                      type="checkbox"
                      value={dia.valor}
                      checked={
                        recordatorios
                          .formulario
                          .dias
                          .includes(
                            dia.valor
                          )
                      }
                      onChange={() => {
                        recordatorios
                          .cambiarDiaFormulario(
                            dia.valor
                          )
                      }}
                    />

                    <span>
                      {dia.texto}
                    </span>
                  </label>
                ))
              }
            </div>

            <label htmlFor="estadoRecordatorio">
              Estado
            </label>

            <select
              id="estadoRecordatorio"
              value={
                recordatorios
                  .formulario.estado
              }
              onChange={(event) => {
                recordatorios
                  .actualizarFormulario(
                    'estado',
                    event.target
                      .value as EstadoRecordatorio
                  )
              }}
            >
              <option value="activo">
                Activo
              </option>

              <option value="pausado">
                Pausado
              </option>
            </select>

            <div className="modal-acciones">
              <button
                className="btn-cancelar"
                onClick={
                  recordatorios.cerrarModal
                }
                type="button"
              >
                Cancelar
              </button>

              {
                esEdicion && (
                  <button
                    className="btn-eliminar"
                    onClick={
                      recordatorios
                        .eliminarRecordatorioDesdeModal
                    }
                    type="button"
                    disabled={
                      recordatorios.cargando
                    }
                  >
                    Eliminar
                  </button>
                )
              }

              <button
                className="btn-guardar"
                type="submit"
                disabled={
                  recordatorios.cargando
                }
              >
                {
                  recordatorios.cargando
                    ? 'Guardando...'
                    : 'Guardar'
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
        recordatorios.modalPremiumActivo && (
          <div
            id="modalPremiumRecordatorios"
            className="recordatorios-premium-overlay"
            onClick={
              recordatorios
                .cerrarModalPremiumDesdeFondo
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloPremiumRecordatorios"
          >
            <div
              className="recordatorios-premium-card"
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <div className="recordatorios-premium-header">
                <h2 id="tituloPremiumRecordatorios">
                  Cámbiate a premium
                </h2>

                <button
                  className="recordatorios-premium-cerrar"
                  onClick={
                    recordatorios
                      .cerrarModalPremium
                  }
                  type="button"
                  aria-label="Cerrar modal premium"
                >
                  ×
                </button>
              </div>

              <div className="recordatorios-premium-body">
                <div className="recordatorios-premium-icono">
                  🔒
                </div>

                <h3 className="recordatorios-premium-titulo">
                  {
                    recordatorios
                      .tituloLimitePremium
                  }
                </h3>

                <p className="recordatorios-premium-descripcion">
                  {
                    recordatorios
                      .descripcionLimitePremium
                  }
                </p>

                <div className="recordatorios-premium-uso">
                  Recordatorios utilizados:{' '}

                  <strong>
                    {
                      recordatorios
                        .totalRecordatorios
                    }

                    {' / '}

                    {
                      recordatorios
                        .limiteTotalRecordatoriosFree
                    }
                  </strong>
                </div>
              </div>

              <div className="recordatorios-premium-acciones">
                <button
                  className="recordatorios-premium-btn-secundario"
                  onClick={
                    recordatorios
                      .cerrarModalPremium
                  }
                  type="button"
                >
                  Ahora no
                </button>

                <button
                  className="recordatorios-premium-btn-pagar"
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

export default Recordatorios