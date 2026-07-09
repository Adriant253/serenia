import {
  formatearDuracion,
  type ProgresoEjercicios
} from '../../services/progresoService'

interface ProgresoUsuarioProps {
  progreso: ProgresoEjercicios
  cargando?: boolean
  totalEjercicios: number
}

function ProgresoUsuario({
  progreso,
  cargando = false,
  totalEjercicios
}: ProgresoUsuarioProps) {

  const ejerciciosUnicos =
    Object.keys(progreso.completados).length

  const porcentajeCatalogo =
    totalEjercicios > 0
      ? Math.round(
          (ejerciciosUnicos /
            totalEjercicios) *
            100
        )
      : 0

  return (
    <div className="progreso-usuario">

      <h2 className="seccion-titulo">
        Tu progreso
      </h2>

      {cargando ? (
        <p className="progreso-vacio">
          Cargando tu progreso...
        </p>
      ) : (
        <>

      <div className="progreso-stats">

        <div className="progreso-stat">

          <span className="progreso-stat-numero">
            {progreso.totalCompletados}
          </span>

          <span className="progreso-stat-label">
            Sesiones completadas
          </span>

        </div>

        <div className="progreso-stat">

          <span className="progreso-stat-numero">
            {ejerciciosUnicos}
            /{totalEjercicios}
          </span>

          <span className="progreso-stat-label">
            Ejercicios probados
          </span>

        </div>

        <div className="progreso-stat">

          <span className="progreso-stat-numero">
            {porcentajeCatalogo}%
          </span>

          <span className="progreso-stat-label">
            Catálogo explorado
          </span>

        </div>

      </div>

      <div className="progreso-barra-general">

        <div
          className="progreso-barra-relleno"
          style={{
            width: `${porcentajeCatalogo}%`
          }}
        />

      </div>

      {progreso.historial.length > 0 ? (

        <div className="progreso-historial">

          <h3>Actividad reciente</h3>

          <ul>
            {progreso.historial
              .slice(0, 5)
              .map((entrada, index) => (

                <li key={`${entrada.fecha}-${index}`}>

                  <span className="historial-titulo">
                    {entrada.titulo}
                  </span>

                  <span className="historial-meta">
                    {new Date(
                      entrada.fecha
                    ).toLocaleDateString(
                      'es-MX',
                      {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}
                    {' · '}
                    {formatearDuracion(
                      entrada.duracionSegundos
                    )}
                  </span>

                </li>

              ))}
          </ul>

        </div>

      ) : (

        <p className="progreso-vacio">
          Aún no has completado ejercicios.
          Elige uno del catálogo para empezar.
        </p>

      )}

        </>
      )}

    </div>
  )

}

export default ProgresoUsuario
