import {
  generarResumenEmocional,
  type RegistroEmocion
} from '../../services/emocionesService'

interface ResumenConsultaProps {
  registros: RegistroEmocion[]
  nombreUsuario: string
}

function ResumenConsulta({
  registros,
  nombreUsuario
}: ResumenConsultaProps) {

  const resumen =
    generarResumenEmocional(registros)

  const emocionesOrdenadas =
    Object.values(resumen.porEmocion).sort(
      (a, b) =>
        b.cantidad - a.cantidad
    )

  const maxCantidad =
    emocionesOrdenadas[0]?.cantidad ?? 1

  const promedioEstres =
    registros.length > 0
      ? Math.round(
          (registros.reduce(
            (sum, r) =>
              sum + (r.nivelEstres ?? 5),
            0
          ) / registros.length) * 10
        ) / 10
      : 0

  const causasConteo: Record<string, number> = {}

  for (const r of registros) {
    if (r.causaEstresEtiqueta) {
      causasConteo[r.causaEstresEtiqueta] =
        (causasConteo[r.causaEstresEtiqueta] ?? 0) + 1
    }
  }

  const causaLaboral = Object.entries(causasConteo).sort(
    (a, b) => b[1] - a[1]
  )[0]

  return (

    <div className="resumen-consulta">

      <div className="resumen-consulta-header">

        <span className="resumen-badge">
          Vista consulta
        </span>

        <h2>
          Historial emocional — {nombreUsuario}
        </h2>

        <p>
          Resumen del estrés laboral para apoyar
          el diagnóstico en sesión de consulta.
        </p>

      </div>

      <div className="resumen-stats">

        <div className="resumen-stat">
          <strong>{resumen.total}</strong>
          <span>Registros en el periodo</span>
        </div>

        <div className="resumen-stat">
          <strong>
            {promedioEstres > 0
              ? `${promedioEstres}/10`
              : '—'}
          </strong>
          <span>Estrés laboral promedio</span>
        </div>

        <div className="resumen-stat">
          <strong>
            {causaLaboral
              ? causaLaboral[0]
              : '—'}
          </strong>
          <span>Causa laboral frecuente</span>
        </div>

        <div className="resumen-stat">
          <strong>
            {emocionesOrdenadas[0]
              ? `${emocionesOrdenadas[0].emoji} ${emocionesOrdenadas[0].etiqueta}`
              : '—'}
          </strong>
          <span>Emoción predominante</span>
        </div>

      </div>

      {emocionesOrdenadas.length > 0 ? (

        <div className="resumen-barras">

          {emocionesOrdenadas.map((item) => (

            <div
              key={item.etiqueta}
              className="resumen-barra-item"
            >

              <div className="resumen-barra-label">

                <span>
                  {item.emoji} {item.etiqueta}
                </span>

                <span>{item.cantidad}</span>

              </div>

              <div className="resumen-barra-fondo">

                <div
                  className="resumen-barra-relleno"
                  style={{
                    width: `${(item.cantidad / maxCantidad) * 100}%`,
                    background: item.color
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      ) : (

        <p className="historial-vacio">
          No hay registros en el rango de fechas
          seleccionado.
        </p>

      )}

    </div>

  )

}

export default ResumenConsulta
