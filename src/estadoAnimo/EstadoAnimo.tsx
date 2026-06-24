import { useState } from 'react'

import {
  obtenerHistorialEmocional,
  type RegistroEmocion
} from '../services/emocionesService'

import InformeClinicoPanel from './components/InformeClinico'
import RegistroEmocionForm from './components/RegistroEmocionForm'

import './EstadoAnimo.css'

interface Usuario {
  id_usuario: number
  nombre: string
}

function obtenerUsuario(): Usuario | null {
  try {
    return JSON.parse(
      localStorage.getItem('usuario') || 'null'
    )
  } catch {
    return null
  }
}

function EstadoAnimo() {

  const usuario = obtenerUsuario()

  const [historial, setHistorial] = useState<
    RegistroEmocion[]
  >(() =>
    usuario
      ? obtenerHistorialEmocional(
          usuario.id_usuario
        )
      : []
  )

  const [vistaActiva, setVistaActiva] =
    useState<'usuario' | 'consulta'>('usuario')

  const handleRegistroGuardado = (
    registro: RegistroEmocion
  ) => {
    setHistorial((prev) => [
      registro,
      ...prev
    ])
  }

  if (!usuario) {
    return (
      <div className="estado-animo-container">
        <p className="historial-vacio">
          Inicia sesión para registrar tu
          estado de ánimo.
        </p>
      </div>
    )
  }

  return (

    <div className="estado-animo-container">

      <header className="estado-animo-hero">

        <h1>Estado de ánimo</h1>

        <p>
          Registra tu check-in laboral y recibe
          orientación personalizada para manejar
          el estrés.
        </p>

      </header>

      <div className="estado-animo-tabs">

        <button
          type="button"
          className={
            vistaActiva === 'usuario'
              ? 'tab-btn activo'
              : 'tab-btn'
          }
          onClick={() =>
            setVistaActiva('usuario')
          }
        >
          Mi registro
        </button>

        <button
          type="button"
          className={
            vistaActiva === 'consulta'
              ? 'tab-btn activo'
              : 'tab-btn'
          }
          onClick={() =>
            setVistaActiva('consulta')
          }
        >
          Vista psicológica
        </button>

      </div>

      {vistaActiva === 'usuario' && (

        <RegistroEmocionForm
          idUsuario={usuario.id_usuario}
          onRegistroGuardado={
            handleRegistroGuardado
          }
        />

      )}

      {vistaActiva === 'consulta' && (

        <div className="estado-animo-consulta">

          <InformeClinicoPanel
            registros={historial}
            nombreUsuario={usuario.nombre}
          />

        </div>

      )}

    </div>

  )

}

export default EstadoAnimo
