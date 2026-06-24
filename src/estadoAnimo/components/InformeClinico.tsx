import {
  generarInformeClinico,
  type NivelRiesgo,
  type TendenciaEmocional
} from '../../logic/informeClinico'

import {
  generarResumenEmocional,
  type RegistroEmocion
} from '../../services/emocionesService'

interface InformeClinicoProps {
  registros: RegistroEmocion[]
  nombreUsuario: string
}

function etiquetaRiesgo(
  nivel: NivelRiesgo
): string {
  if (nivel === 'alto') {
    return 'Riesgo alto'
  }

  if (nivel === 'moderado') {
    return 'Riesgo moderado'
  }

  return 'Riesgo bajo'
}

function etiquetaTendencia(
  tendencia: TendenciaEmocional
): string {
  const mapa: Record<
    TendenciaEmocional,
    string
  > = {
    mejorando: '📈 Mejorando',
    estable: '➡️ Estable',
    empeorando: '📉 Empeorando',
    insuficiente: '❓ Datos insuficientes'
  }

  return mapa[tendencia]
}

function InformeClinicoPanel({
  registros,
  nombreUsuario
}: InformeClinicoProps) {

  const informe = generarInformeClinico(
    registros,
    nombreUsuario
  )

  const resumen =
    generarResumenEmocional(registros)

  const emocionesOrdenadas =
    Object.values(resumen.porEmocion).sort(
      (a, b) =>
        b.cantidad - a.cantidad
    )

  const maxCantidad =
    emocionesOrdenadas[0]?.cantidad ?? 1

  const claseRiesgo =
    informe.nivelRiesgo === 'alto'
      ? 'riesgo-alto'
      : informe.nivelRiesgo === 'moderado'
        ? 'riesgo-moderado'
        : 'riesgo-bajo'

  return (

    <div className="informe-clinico">

      <header className="informe-header">

        <div>

          <span className="informe-badge">
            Informe clínico — estrés laboral
          </span>

          <h2>
            Paciente: {nombreUsuario}
          </h2>

          <p className="informe-periodo">
            {registros.length > 0
              ? `${informe.totalRegistros} registros en ${informe.diasConRegistro} día(s)`
              : 'Sin registros en el periodo filtrado'}
          </p>

        </div>

        <div
          className={`informe-riesgo ${claseRiesgo}`}
        >
          <span>
            {etiquetaRiesgo(
              informe.nivelRiesgo
            )}
          </span>
          <strong>
            {informe.promedioEstres > 0
              ? `${informe.promedioEstres}/10`
              : '—'}
          </strong>
        </div>

      </header>

      <section className="informe-seccion">

        <h3>Interpretación clínica</h3>

        <p className="informe-texto">
          {informe.interpretacion}
        </p>

        <span className="informe-tendencia">
          Tendencia:{' '}
          {etiquetaTendencia(
            informe.tendencia
          )}
        </span>

      </section>

      <div className="informe-grid">

        <section className="informe-seccion">

          <h3>Hallazgos clave</h3>

          <ul className="informe-lista">
            {informe.hallazgos.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

        </section>

        <section className="informe-seccion">

          <h3>Causas laborales reportadas</h3>

          {informe.distribucionCausas.length > 0 ? (

            <ul className="informe-causas">
              {informe.distribucionCausas.map(
                (causa) => (

                  <li key={causa.etiqueta}>

                    <div className="informe-causa-top">

                      <span>
                        {causa.etiqueta}
                      </span>

                      <span>
                        {causa.cantidad}x ({causa.porcentaje}%)
                      </span>

                    </div>

                    <div className="informe-barra-fondo">

                      <div
                        className="informe-barra-relleno"
                        style={{
                          width: `${causa.porcentaje}%`
                        }}
                      />

                    </div>

                  </li>

                )
              )}
            </ul>

          ) : (

            <p className="informe-vacio">
              El paciente no registró causas
              específicas de estrés.
            </p>

          )}

        </section>

      </div>

      {emocionesOrdenadas.length > 0 && (

        <section className="informe-seccion">

          <h3>Distribución emocional</h3>

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

        </section>

      )}

      {informe.momentosCriticos.length > 0 && (

        <section className="informe-seccion">

          <h3>Momentos de mayor tensión</h3>

          <ul className="informe-criticos">
            {informe.momentosCriticos.map(
              (momento, i) => (

                <li key={i}>

                  <div className="critico-fecha">
                    {new Date(
                      momento.fecha
                    ).toLocaleDateString(
                      'es-MX',
                      {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}
                  </div>

                  <strong>
                    {momento.emocion} — Estrés {momento.nivelEstres}/10
                  </strong>

                  {momento.causa && (
                    <span className="critico-causa">
                      Causa: {momento.causa}
                    </span>
                  )}

                  {momento.nota && (
                    <p className="critico-nota">
                      "{momento.nota}"
                    </p>
                  )}

                </li>

              )
            )}
          </ul>

        </section>

      )}

      <div className="informe-grid">

        <section className="informe-seccion informe-preguntas">

          <h3>Preguntas sugeridas en consulta</h3>

          <ol>
            {informe.preguntasSugeridas.map(
              (p) => (
                <li key={p}>{p}</li>
              )
            )}
          </ol>

        </section>

        <section className="informe-seccion informe-recomendaciones">

          <h3>Recomendaciones clínicas</h3>

          <ul>
            {informe.recomendacionesClinicas.map(
              (r) => (
                <li key={r}>{r}</li>
              )
            )}
          </ul>

        </section>

      </div>

      <p className="informe-disclaimer">
        Este informe es generado automáticamente
        a partir de los check-ins del paciente en
        Serenia. Complementa, pero no reemplaza,
        la evaluación clínica profesional.
      </p>

    </div>

  )

}

export default InformeClinicoPanel
