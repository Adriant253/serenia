import {
  type RegistroEmocion
} from '../../services/emocionesService'

import FiltroFechas from './FiltroFechas'

interface HistorialEmocionesProps {
  registros: RegistroEmocion[]
  fechaDesde: string
  fechaHasta: string
  onFechaDesdeChange: (valor: string) => void
  onFechaHastaChange: (valor: string) => void
  onLimpiarFiltros: () => void
}

function HistorialEmociones({
  registros,
  fechaDesde,
  fechaHasta,
  onFechaDesdeChange,
  onFechaHastaChange,
  onLimpiarFiltros
}: HistorialEmocionesProps) {

  return (

    <div className="historial-emociones">

      <div className="historial-header">

        <h2>Historial de emociones</h2>

        <p>
          Consulta tus registros anteriores y
          filtra por rango de fechas.
        </p>

      </div>

      <FiltroFechas
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onFechaDesdeChange={
          onFechaDesdeChange
        }
        onFechaHastaChange={
          onFechaHastaChange
        }
        onLimpiar={onLimpiarFiltros}
      />

      {registros.length > 0 ? (

        <ul className="historial-lista">

          {registros.map((registro) => (

            <li
              key={registro.id}
              className="historial-item"
            >

              <div
                className="historial-item-icono"
                style={{
                  background: `${registro.color}22`,
                  borderColor: registro.color
                }}
              >
                {registro.emoji}
              </div>

              <div className="historial-item-contenido">

                <div className="historial-item-top">

                  <strong>
                    {registro.etiqueta}
                  </strong>

                  <span>
                    {new Date(
                      registro.fecha
                    ).toLocaleDateString(
                      'es-MX',
                      {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}
                  </span>

                </div>

                {registro.nota && (
                  <p className="historial-nota">
                    {registro.nota}
                  </p>
                )}

                <div className="historial-meta-tags">

                  {registro.nivelEstres != null && (
                    <span className="historial-tag">
                      Estrés: {registro.nivelEstres}/10
                    </span>
                  )}

                  {registro.causaEstresEtiqueta && (
                    <span className="historial-tag">
                      {registro.causaEstresEtiqueta}
                    </span>
                  )}

                  {registro.momentoLaboralEtiqueta && (
                    <span className="historial-tag">
                      {registro.momentoLaboralEtiqueta}
                    </span>
                  )}

                </div>

              </div>

            </li>

          ))}

        </ul>

      ) : (

        <p className="historial-vacio">
          No hay registros para mostrar.
          Registra tu primer estado de ánimo
          arriba.
        </p>

      )}

    </div>

  )

}

export default HistorialEmociones
