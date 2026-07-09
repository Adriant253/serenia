import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import PanelPlanDiario from './components/PanelPlanDiario'
import { EJERCICIOS } from '../data/ejerciciosData'
import {
  contarEjercicios
} from '../services/ejerciciosService'
import {
  generarPlanDiario
} from '../logic/recomendacionesEstres'
import {
  obtenerProgreso,
  type ProgresoEjercicios
} from '../services/progresoService'

import {
  obtenerUsuarioSesion
} from '../utils/sesionUsuario'

import {
  obtenerNombreMostrar,
  obtenerPreferencias
} from '../services/perfilService'

import './Inicio.css'

function obtenerSaludo(): string {
  const hora = new Date().getHours()

  if (hora < 12) {
    return 'Buenos días'
  }

  if (hora < 19) {
    return 'Buenas tardes'
  }

  return 'Buenas noches'
}

function Datos() {

  const usuario = obtenerUsuarioSesion()

  const [progreso, setProgreso] =
    useState<ProgresoEjercicios>({
      completados: {},
      totalCompletados: 0,
      historial: []
    })

  const [totalEjercicios, setTotalEjercicios] =
    useState(EJERCICIOS.length)

  useEffect(() => {
    if (!usuario?.id_usuario) {
      return
    }

    obtenerProgreso(usuario.id_usuario)
      .then(setProgreso)

    contarEjercicios()
      .then(setTotalEjercicios)
  }, [usuario?.id_usuario])

  const plan = usuario
    ? generarPlanDiario(
        usuario.id_usuario,
        usuario.nombre,
        progreso.totalCompletados
      )
    : null

  const prefs = obtenerPreferencias()

  const nombreVisible = usuario
    ? obtenerNombreMostrar(usuario.nombre)
    : ''

  const ejerciciosProbados =
    Object.keys(progreso.completados).length

  const porcentajeCatalogo =
    totalEjercicios > 0
      ? Math.round(
          (ejerciciosProbados /
            totalEjercicios) *
            100
        )
      : 0

  const fechaHoy =
    new Date().toLocaleDateString(
      'es-MX',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }
    )

  if (!usuario) {
    return (
      <div className="inicio-container">
        <div className="inicio-hero">
          <h1>Bienvenido a Serenia</h1>
          <p>Tu espacio de calma te espera.</p>
        </div>
      </div>
    )
  }

  const inicial =
    usuario.nombre
      .charAt(0)
      .toUpperCase()

  return (

    <div className="inicio-container">

      <section className="inicio-hero">

        <div className="inicio-hero-texto">

          <span className="inicio-fecha">
            {fechaHoy}
          </span>

          <h1>
            {obtenerSaludo()},{' '}
            {nombreVisible} 👋
          </h1>

          <p>
            {prefs.mensajeMotivacion ||
              'Tu aliado para manejar el estrés laboral.'}
          </p>

        </div>

        <div className="inicio-avatar">
          {inicial}
        </div>

      </section>

      {plan && (
        <PanelPlanDiario
          idUsuario={usuario.id_usuario}
          nombreUsuario={usuario.nombre}
        />
      )}

      <section className="inicio-stats">

        <article className="inicio-stat">

          <span className="inicio-stat-icono">
            ✓
          </span>

          <div>
            <strong>
              {progreso.totalCompletados}
            </strong>
            <span>
              Sesiones completadas
            </span>
          </div>

        </article>

        <article className="inicio-stat">

          <span className="inicio-stat-icono">
            🧘
          </span>

          <div>
            <strong>
              {ejerciciosProbados}
              /{totalEjercicios}
            </strong>
            <span>
              Ejercicios explorados
            </span>
          </div>

        </article>

        <article className="inicio-stat">

          <span className="inicio-stat-icono">
            {plan?.nivelEstresSemanal === 'alto'
              ? '🔴'
              : plan?.nivelEstresSemanal === 'moderado'
                ? '🟡'
                : '🟢'}
          </span>

          <div>
            <strong>
              {plan?.promedioEstres
                ? `${plan.promedioEstres}/10`
                : '—'}
            </strong>
            <span>
              Estrés laboral (7 días)
            </span>
          </div>

        </article>

        <article className="inicio-stat">

          <span className="inicio-stat-icono">
            📈
          </span>

          <div>
            <strong>
              {porcentajeCatalogo}%
            </strong>
            <span>
              Progreso del catálogo
            </span>
          </div>

        </article>

      </section>

      <div className="inicio-grid inicio-grid-solo">

        <section className="inicio-panel">

          <h2>Accesos rápidos</h2>

          <div className="inicio-acciones">

            <Link
              to={`/dashboard/ejercicios?ejercicio=${plan?.ejercicioRecomendado.id ?? 'respiracion-478'}`}
              className="inicio-accion destacada"
            >

              <span className="inicio-accion-icono">
                {plan?.ejercicioRecomendado.icono ?? '🌿'}
              </span>

              <div>
                <h3>
                  {plan?.ejercicioRecomendado.titulo ?? 'Ejercicio recomendado'}
                </h3>
                <p>
                  {plan?.ejercicioRecomendado.razon ?? 'Técnica sugerida para ti hoy'}
                </p>
              </div>

              <span className="inicio-accion-flecha">
                →
              </span>

            </Link>

            <Link
              to="/dashboard/estado-animo"
              className="inicio-accion"
            >

              <span className="inicio-accion-icono">
                😊
              </span>

              <div>
                <h3>
                  Estado de ánimo
                </h3>
                <p>
                  Registra y consulta tu
                  historial emocional
                </p>
              </div>

              <span className="inicio-accion-flecha">
                →
              </span>

            </Link>

            <Link
              to="/dashboard/ejercicios"
              className="inicio-accion"
            >

              <span className="inicio-accion-icono">
                🌬️
              </span>

              <div>
                <h3>
                  Respiración 4-7-8
                </h3>
                <p>
                  Calma rápida en 3 minutos
                </p>
              </div>

              <span className="inicio-accion-flecha">
                →
              </span>

            </Link>

            <Link
              to="/dashboard/ejercicios"
              className="inicio-accion"
            >

              <span className="inicio-accion-icono">
                🌍
              </span>

              <div>
                <h3>
                  Grounding 5-4-3-2-1
                </h3>
                <p>
                  Vuelve al presente en
                  momentos difíciles
                </p>
              </div>

              <span className="inicio-accion-flecha">
                →
              </span>

            </Link>

            <Link
              to="/dashboard/historial"
              className="inicio-accion"
            >

              <span className="inicio-accion-icono">
                📋
              </span>

              <div>
                <h3>Ver historial</h3>
                <p>
                  Registros emocionales y
                  ejercicios completados
                </p>
              </div>

              <span className="inicio-accion-flecha">
                →
              </span>

            </Link>

            <Link
              to="/dashboard/perfil"
              className="inicio-accion"
            >

              <span className="inicio-accion-icono">
                👤
              </span>

              <div>
                <h3>Mi perfil</h3>
                <p>
                  Personaliza tu experiencia
                  en Serenia
                </p>
              </div>

              <span className="inicio-accion-flecha">
                →
              </span>

            </Link>

          </div>

        </section>

      </div>

      <section className="inicio-panel inicio-actividad">

        <h2>Actividad reciente</h2>

        {progreso.historial.length > 0 ? (

          <ul className="inicio-historial">

            {progreso.historial
              .slice(0, 4)
              .map((entrada, index) => (

                <li
                  key={`${entrada.fecha}-${index}`}
                >

                  <span className="inicio-historial-icono">
                    ✓
                  </span>

                  <div>

                    <strong>
                      {entrada.titulo}
                    </strong>

                    <span>
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
                    </span>

                  </div>

                </li>

              ))}

          </ul>

        ) : (

          <div className="inicio-vacio">

            <p>
              Aún no has completado ejercicios.
              ¡Empieza con uno hoy!
            </p>

            <Link
              to="/dashboard/ejercicios"
              className="inicio-btn-principal"
            >
              Explorar ejercicios
            </Link>

          </div>

        )}

      </section>

    </div>

  )

}

export default Datos
