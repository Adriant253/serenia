import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  filtrarRegistrosPorFecha,
  obtenerHistorialEmocional
} from '../services/emocionesService'

import {
  obtenerProgreso
} from '../services/progresoService'

import HistorialEmociones from '../estadoAnimo/components/HistorialEmociones'

import './Historial.css'

function obtenerUsuario() {
  try {
    return JSON.parse(
      localStorage.getItem('usuario') || 'null'
    )
  } catch {
    return null
  }
}

function HistorialPage() {

  const usuario = obtenerUsuario()

  const [fechaDesde, setFechaDesde] =
    useState('')

  const [fechaHasta, setFechaHasta] =
    useState('')

  const historialEmocional = useMemo(
    () =>
      usuario
        ? obtenerHistorialEmocional(
            usuario.id_usuario
          )
        : [],
    [usuario]
  )

  const registrosFiltrados = useMemo(
    () =>
      filtrarRegistrosPorFecha(
        historialEmocional,
        fechaDesde,
        fechaHasta
      ),
    [
      historialEmocional,
      fechaDesde,
      fechaHasta
    ]
  )

  const progreso = obtenerProgreso()

  if (!usuario) {
    return (
      <div className="historial-page">
        <p>Inicia sesión para ver tu historial.</p>
      </div>
    )
  }

  return (

    <div className="historial-page">

      <header className="historial-hero">

        <h1>Historial</h1>

        <p>
          Consulta tus registros emocionales y
          la actividad de ejercicios completados.
        </p>

      </header>

      <HistorialEmociones
        registros={registrosFiltrados}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onFechaDesdeChange={setFechaDesde}
        onFechaHastaChange={setFechaHasta}
        onLimpiarFiltros={() => {
          setFechaDesde('')
          setFechaHasta('')
        }}
      />

      <section className="historial-ejercicios">

        <h2>Ejercicios completados</h2>

        {progreso.historial.length > 0 ? (

          <ul className="historial-ejercicios-lista">
            {progreso.historial.map(
              (entrada, index) => (

                <li
                  key={`${entrada.fecha}-${index}`}
                >

                  <span>✓</span>

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
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }
                      )}
                    </span>
                  </div>

                </li>

              )
            )}
          </ul>

        ) : (

          <div className="historial-vacio-ejercicios">

            <p>
              Aún no has completado ejercicios.
            </p>

            <Link to="/dashboard/ejercicios">
              Ir a ejercicios →
            </Link>

          </div>

        )}

      </section>

    </div>

  )

}

export default HistorialPage
