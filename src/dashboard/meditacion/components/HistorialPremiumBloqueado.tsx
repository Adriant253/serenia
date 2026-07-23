interface HistorialPremiumBloqueadoProps {
  onIrTemporizador: () => void
  onIrGuia: () => void
  onIrSuscripcion: () => void
}

function HistorialPremiumBloqueado({
  onIrTemporizador,
  onIrGuia,
  onIrSuscripcion
}: HistorialPremiumBloqueadoProps) {
  return (
    <section className="historial-meditacion-bloqueado">
      <div className="historial-meditacion-bloqueado-icono">
        🔒
      </div>

      <span className="historial-meditacion-bloqueado-etiqueta">
        Función Premium
      </span>

      <h2>
        Consulta tu progreso de meditación
      </h2>

      <p>
        Tus sesiones realizadas con el plan
        Free se guardan correctamente. La
        consulta, las estadísticas y la
        eliminación del historial están
        disponibles para usuarios Premium.
      </p>

      <div className="historial-meditacion-bloqueado-beneficios">
        <article>
          <span aria-hidden="true">
            📊
          </span>

          <div>
            <h3>
              Estadísticas personales
            </h3>

            <p>
              Revisa cuántas sesiones has
              completado y cuánto tiempo has
              meditado.
            </p>
          </div>
        </article>

        <article>
          <span aria-hidden="true">
            🔍
          </span>

          <div>
            <h3>
              Búsqueda y filtros
            </h3>

            <p>
              Localiza sesiones por fecha,
              duración o estado.
            </p>
          </div>
        </article>

        <article>
          <span aria-hidden="true">
            🗑️
          </span>

          <div>
            <h3>
              Administración del historial
            </h3>

            <p>
              Elimina registros que ya no
              deseas conservar.
            </p>
          </div>
        </article>
      </div>

      <div className="historial-meditacion-bloqueado-acciones">
        <button
          className="historial-meditacion-boton historial-meditacion-boton-principal"
          type="button"
          onClick={onIrSuscripcion}
        >
          Hacerme Premium
        </button>

        <button
          className="historial-meditacion-boton historial-meditacion-boton-secundario"
          type="button"
          onClick={onIrTemporizador}
        >
          Ir al temporizador
        </button>

        <button
          className="historial-meditacion-boton historial-meditacion-boton-secundario"
          type="button"
          onClick={onIrGuia}
        >
          Ver guías disponibles
        </button>
      </div>

      <small className="historial-meditacion-bloqueado-nota">
        Puedes regresar a esta misma sección
        después de activar tu plan.
      </small>
    </section>
  )
}

export default HistorialPremiumBloqueado