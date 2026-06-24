import { Link } from 'react-router-dom'

import {
  generarPlanDiario,
  type PlanDiarioEstrés
} from '../../logic/recomendacionesEstres'

import './PanelPlanDiario.css'

interface PanelPlanDiarioProps {
  idUsuario: number
  nombreUsuario: string
}

function PanelPlanDiario({
  idUsuario,
  nombreUsuario
}: PanelPlanDiarioProps) {

  const plan: PlanDiarioEstrés =
    generarPlanDiario(
      idUsuario,
      nombreUsuario
    )

  const nivelClase =
    plan.nivelEstresSemanal === 'alto'
      ? 'nivel-alto'
      : plan.nivelEstresSemanal === 'moderado'
        ? 'nivel-moderado'
        : 'nivel-bajo'

  const nivelTexto =
    plan.nivelEstresSemanal === 'alto'
      ? 'Estrés alto'
      : plan.nivelEstresSemanal === 'moderado'
        ? 'Estrés moderado'
        : 'Estrés bajo'

  return (

    <section className="plan-diario">

      <div className="plan-diario-header">

        <div>

          <span className="plan-etiqueta">
            Tu plan anti-estrés laboral
          </span>

          <p className="plan-mensaje">
            {plan.mensajePrincipal}
          </p>

        </div>

        <div
          className={`plan-nivel ${nivelClase}`}
        >
          <span>{nivelTexto}</span>
          <strong>
            {plan.promedioEstres > 0
              ? `${plan.promedioEstres}/10`
              : '—'}
          </strong>
        </div>

      </div>

      {plan.necesitaCheckIn && (

        <div className="plan-alerta">

          <span>⚠️</span>

          <p>
            No has registrado tu estado de ánimo
            hoy. Hazlo para recibir ayuda personalizada.
          </p>

          <Link
            to="/dashboard/estado-animo"
            className="plan-btn-checkin"
          >
            Check-in ahora
          </Link>

        </div>

      )}

      <div className="plan-recomendacion">

        <div className="plan-ejercicio-card">

          <span className="plan-ejercicio-icono">
            {plan.ejercicioRecomendado.icono}
          </span>

          <div>

            <span className="plan-subtitulo">
              Ejercicio recomendado para ti
            </span>

            <h3>
              {plan.ejercicioRecomendado.titulo}
            </h3>

            <p>
              {plan.ejercicioRecomendado.razon}
            </p>

          </div>

          <Link
            to={`/dashboard/ejercicios?ejercicio=${plan.ejercicioRecomendado.id}`}
            className="plan-btn-ejercicio"
          >
            Empezar
          </Link>

        </div>

      </div>

      {plan.acciones.length > 0 && (

        <div className="plan-acciones">

          <h3>Acciones sugeridas</h3>

          <ul>
            {plan.acciones.map((accion) => (

              <li
                key={accion.titulo}
                className={`accion-${accion.prioridad}`}
              >

                <div>

                  <strong>
                    {accion.titulo}
                  </strong>

                  <p>
                    {accion.descripcion}
                  </p>

                </div>

                {accion.enlace && (
                  <Link to={accion.enlace}>
                    Ir →
                  </Link>
                )}

              </li>

            ))}
          </ul>

        </div>

      )}

      {plan.registrosEstresSemana > 0 && (

        <p className="plan-resumen-semana">
          Esta semana registraste{' '}
          <strong>
            {plan.registrosEstresSemana}
          </strong>
          {' '}momento{plan.registrosEstresSemana !== 1 ? 's' : ''} de estrés laboral.
          {plan.causaFrecuente && (
            <>
              {' '}La causa más frecuente:{' '}
              <strong>
                {plan.causaFrecuente.etiqueta}
              </strong>.
            </>
          )}
        </p>

      )}

    </section>

  )

}

export default PanelPlanDiario
