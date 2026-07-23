import './Suscripcion.css'

import {
  useSuscripcion
} from '../../functions/suscripcionF/suscripcion'

interface SuscripcionProps {
  onVolver: () => void
}

function Suscripcion({
  onVolver
}: SuscripcionProps) {
  const suscripcion =
    useSuscripcion()

  if (!suscripcion.usuario) {
    return (
      <main className="suscripcion-pagina">
        <section className="suscripcion-contenedor">
          <div className="suscripcion-error-sesion">
            <div className="suscripcion-error-icono">
              ⚠
            </div>

            <h1>
              Usuario no encontrado
            </h1>

            <p>
              No se encontró información de una
              sesión activa. Inicia sesión
              nuevamente para continuar.
            </p>

            <button
              type="button"
              className="suscripcion-boton-secundario"
              onClick={
                onVolver
              }
            >
              Regresar
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="suscripcion-pagina">
      <section className="suscripcion-contenedor">
        <header className="suscripcion-encabezado">
          <button
            type="button"
            className="suscripcion-volver"
            onClick={
              onVolver
            }
            aria-label="Volver al módulo anterior"
          >
            ←
          </button>

          <div>
            <span className="suscripcion-etiqueta">
              Serenia Premium
            </span>

            <h1>
              Mejora tu experiencia
            </h1>

            <p>
              Desbloquea las funciones Premium
              de Serenia y elimina los límites
              del plan gratuito.
            </p>
          </div>
        </header>

        <div className="suscripcion-columnas">
          <article className="suscripcion-plan">
            <div className="suscripcion-plan-superior">
              <div className="suscripcion-icono-premium">
                ✦
              </div>

              <div>
                <span className="suscripcion-plan-tipo">
                  Plan seleccionado
                </span>

                <h2>
                  Premium
                </h2>
              </div>
            </div>

            <div className="suscripcion-precio">
              <span className="suscripcion-precio-simbolo">
                99$
              </span>

              <span className="suscripcion-precio-texto">
                /mes
              </span>
            </div>

            <div className="suscripcion-usuario">
              <div className="suscripcion-avatar">
                {
                  suscripcion
                    .usuario
                    .nombre
                    ?.charAt(0)
                    .toUpperCase() ||
                  'U'
                }
              </div>

              <div>
                <small>
                  Suscripción para
                </small>

                <strong>
                  {
                    suscripcion
                      .usuario
                      .nombre
                  }
                </strong>

                <span>
                  {
                    suscripcion
                      .usuario
                      .email
                  }
                </span>
              </div>
            </div>

            <div className="suscripcion-estado">
              <span>
                Estado actual
              </span>

              <strong
                className={
                  suscripcion.esPremium
                    ? 'suscripcion-estado-premium'
                    : 'suscripcion-estado-free'
                }
              >
                {
                  suscripcion.esPremium
                    ? 'Premium'
                    : 'Free'
                }
              </strong>
            </div>
          </article>

          <article className="suscripcion-beneficios">
            <div className="suscripcion-beneficios-encabezado">
              <span>
                ✨
              </span>

              <div>
                <h2>
                  Beneficios Premium
                </h2>

                <p>
                  Obtendrás acceso a más
                  funciones dentro de Serenia.
                </p>
              </div>
            </div>

            <ul className="suscripcion-lista-beneficios">
              <li>
                <span>
                  ✓
                </span>

                <div>
                  <strong>
                    Recordatorios sin límite
                  </strong>

                  <p>
                    Crea todos los recordatorios
                    de descanso que necesites.
                  </p>
                </div>
              </li>

              <li>
                <span>
                  ✓
                </span>

                <div>
                  <strong>
                    Organizador Premium
                  </strong>

                  <p>
                    Accede a más tareas y a las
                    notificaciones de vencimiento.
                  </p>
                </div>
              </li>

              <li>
                <span>
                  ✓
                </span>

                <div>
                  <strong>
                    Más opciones de meditación
                  </strong>

                  <p>
                    Utiliza duraciones y ejercicios
                    reservados para usuarios
                    Premium.
                  </p>
                </div>
              </li>

              <li>
                <span>
                  ✓
                </span>

                <div>
                  <strong>
                    Historial completo
                  </strong>

                  <p>
                    Consulta tu actividad y tus
                    sesiones guardadas.
                  </p>
                </div>
              </li>
            </ul>

            {
              !suscripcion.esPremium &&
              !suscripcion.pagoCompletado && (
                <form
                  className="suscripcion-pago"
                  onSubmit={(evento) => {
                    evento.preventDefault()
                    void suscripcion
                      .realizarPagoSimulado()
                  }}
                >
                  <div className="suscripcion-pago-encabezado">
                    <h3>
                      Método de pago
                    </h3>

                    <p>
                      Completa los datos de tu
                      tarjeta para activar Premium.
                    </p>
                  </div>

                  <div className="suscripcion-pago-campo">
                    <label htmlFor="pago-titular">
                      Nombre del titular
                    </label>

                    <input
                      id="pago-titular"
                      type="text"
                      autoComplete="cc-name"
                      placeholder="Como aparece en la tarjeta"
                      value={
                        suscripcion
                          .datosPago
                          .nombreTitular
                      }
                      onChange={(evento) => {
                        suscripcion
                          .actualizarCampoPago(
                            'nombreTitular',
                            evento.target.value
                          )
                      }}
                      disabled={
                        suscripcion.cargando
                      }
                    />

                    {
                      suscripcion
                        .erroresPago
                        .nombreTitular && (
                        <span className="suscripcion-pago-error">
                          {
                            suscripcion
                              .erroresPago
                              .nombreTitular
                          }
                        </span>
                      )
                    }
                  </div>

                  <div className="suscripcion-pago-campo">
                    <label htmlFor="pago-tarjeta">
                      Número de tarjeta
                    </label>

                    <input
                      id="pago-tarjeta"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={
                        suscripcion
                          .datosPago
                          .numeroTarjeta
                      }
                      onChange={(evento) => {
                        suscripcion
                          .actualizarCampoPago(
                            'numeroTarjeta',
                            evento.target.value
                          )
                      }}
                      disabled={
                        suscripcion.cargando
                      }
                    />

                    {
                      suscripcion
                        .erroresPago
                        .numeroTarjeta && (
                        <span className="suscripcion-pago-error">
                          {
                            suscripcion
                              .erroresPago
                              .numeroTarjeta
                          }
                        </span>
                      )
                    }
                  </div>

                  <div className="suscripcion-pago-fila">
                    <div className="suscripcion-pago-campo">
                      <label htmlFor="pago-vencimiento">
                        Vencimiento
                      </label>

                      <input
                        id="pago-vencimiento"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/AA"
                        value={
                          suscripcion
                            .datosPago
                            .vencimiento
                        }
                        onChange={(evento) => {
                          suscripcion
                            .actualizarCampoPago(
                              'vencimiento',
                              evento.target.value
                            )
                        }}
                        disabled={
                          suscripcion.cargando
                        }
                      />

                      {
                        suscripcion
                          .erroresPago
                          .vencimiento && (
                          <span className="suscripcion-pago-error">
                            {
                              suscripcion
                                .erroresPago
                                .vencimiento
                            }
                          </span>
                        )
                      }
                    </div>

                    <div className="suscripcion-pago-campo">
                      <label htmlFor="pago-cvv">
                        CVV
                      </label>

                      <input
                        id="pago-cvv"
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        value={
                          suscripcion
                            .datosPago
                            .cvv
                        }
                        onChange={(evento) => {
                          suscripcion
                            .actualizarCampoPago(
                              'cvv',
                              evento.target.value
                            )
                        }}
                        disabled={
                          suscripcion.cargando
                        }
                      />

                      {
                        suscripcion
                          .erroresPago
                          .cvv && (
                          <span className="suscripcion-pago-error">
                            {
                              suscripcion
                                .erroresPago
                                .cvv
                            }
                          </span>
                        )
                      }
                    </div>
                  </div>

                  <p className="suscripcion-seguridad">
                    Tus datos se usan solo para
                    validar el pago dentro de Serenia.
                    No se almacenan en el servidor.
                  </p>

                  {
                    suscripcion.error && (
                      <div
                        className={
                          'suscripcion-mensaje ' +
                          'suscripcion-mensaje-error'
                        }
                        role="alert"
                      >
                        <strong>
                          No se pudo completar
                        </strong>

                        <p>
                          {suscripcion.error}
                        </p>
                      </div>
                    )
                  }

                  <div className="suscripcion-acciones">
                    <button
                      type="submit"
                      className="suscripcion-boton-principal"
                      disabled={
                        suscripcion.cargando
                      }
                    >
                      {
                        suscripcion.cargando
                          ? 'Procesando pago...'
                          : 'Pagar y activar Premium'
                      }
                    </button>

                    <button
                      type="button"
                      className="suscripcion-boton-secundario"
                      onClick={
                        onVolver
                      }
                      disabled={
                        suscripcion.cargando
                      }
                    >
                      Ahora no
                    </button>
                  </div>
                </form>
              )
            }

            {
              (
                suscripcion.esPremium ||
                suscripcion.pagoCompletado
              ) && (
                <>
                  {
                    suscripcion.mensaje && (
                      <div
                        className={
                          'suscripcion-mensaje ' +
                          'suscripcion-mensaje-exito'
                        }
                        role="status"
                      >
                        <strong>
                          Premium activado
                        </strong>

                        <p>
                          {suscripcion.mensaje}
                        </p>
                      </div>
                    )
                  }

                  <div className="suscripcion-acciones">
                    <button
                      type="button"
                      className="suscripcion-boton-principal"
                      onClick={
                        onVolver
                      }
                    >
                      Volver al módulo anterior
                    </button>
                  </div>
                </>
              )
            }
          </article>
        </div>
      </section>
    </main>
  )
}

export default Suscripcion
