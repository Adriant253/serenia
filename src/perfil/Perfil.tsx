import { useState } from 'react'

import {
  guardarPreferencias,
  obtenerPreferencias,
  type PreferenciasPerfil
} from '../services/perfilService'

import { useTheme } from '../context/ThemeContext'
import { TEMAS, type TemaApp } from '../services/themeService'

import './Perfil.css'

interface Usuario {
  id_usuario: number
  nombre: string
  email: string
  fecha_nacimiento: string
  fecha_registro: string
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

function Perfil() {

  const usuario = obtenerUsuario()

  const { tema, setTema } = useTheme()

  const [prefs, setPrefs] =
    useState<PreferenciasPerfil>(
      obtenerPreferencias
    )

  const [guardado, setGuardado] =
    useState(false)

  const [temaAplicado, setTemaAplicado] =
    useState(false)

  const cambiarTema = (id: TemaApp) => {
    setTema(id)
    const nuevasPrefs = { ...prefs, tema: id }
    setPrefs(nuevasPrefs)
    guardarPreferencias(nuevasPrefs)
    setTemaAplicado(true)
    window.setTimeout(() => {
      setTemaAplicado(false)
    }, 2500)
  }

  const actualizar = (
    campo: keyof PreferenciasPerfil,
    valor: string | number | boolean
  ) => {
    setPrefs((prev) => ({
      ...prev,
      [campo]: valor
    }))
    setGuardado(false)
  }

  const handleGuardar = (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    guardarPreferencias(prefs)
    setGuardado(true)

    window.setTimeout(() => {
      setGuardado(false)
    }, 3000)
  }

  if (!usuario) {
    return (
      <div className="perfil-page">
        <p>Inicia sesión para ver tu perfil.</p>
      </div>
    )
  }

  const inicial =
    usuario.nombre.charAt(0).toUpperCase()

  return (

    <div className="perfil-page">

      <header className="perfil-hero">

        <div className="perfil-avatar-grande">
          {inicial}
        </div>

        <div>
          <h1>Mi perfil</h1>
          <p>
            Personaliza Serenia según tu rutina
            laboral y tus metas de bienestar.
          </p>
        </div>

      </header>

      <section className="perfil-cuenta">

        <h2>Datos de cuenta</h2>

        <ul>
          <li>
            <span>Nombre</span>
            <strong>{usuario.nombre}</strong>
          </li>
          <li>
            <span>Correo</span>
            <strong>{usuario.email}</strong>
          </li>
          <li>
            <span>Miembro desde</span>
            <strong>
              {new Date(
                usuario.fecha_registro
              ).toLocaleDateString('es-MX')}
            </strong>
          </li>
        </ul>

      </section>

      <section className="perfil-temas">

        <h2>Apariencia</h2>

        <p className="perfil-temas-desc">
          El tema se aplica a toda la aplicación al
          instante
        </p>

        {temaAplicado && (
          <p className="mensaje-exito tema-aplicado-msg">
            Tema aplicado en toda la app
          </p>
        )}

        <div className="perfil-temas-grid">

          {TEMAS.map((opcion) => (
            <button
              key={opcion.id}
              type="button"
              className={
                tema === opcion.id
                  ? 'tema-opcion activo'
                  : 'tema-opcion'
              }
              onClick={() =>
                cambiarTema(opcion.id)
              }
            >
              <span
                className="tema-preview"
                style={{
                  background: opcion.preview
                }}
              />
              <span>{opcion.nombre}</span>
            </button>
          ))}

        </div>

      </section>

      <form
        className="perfil-form"
        onSubmit={handleGuardar}
      >

        <h2>Personalización</h2>

        <div className="perfil-grid">

          <div className="input-group">

            <label htmlFor="nombre-mostrar">
              Nombre para mostrar
            </label>

            <input
              id="nombre-mostrar"
              type="text"
              placeholder={usuario.nombre.split(' ')[0]}
              value={prefs.nombreMostrar}
              onChange={(e) =>
                actualizar(
                  'nombreMostrar',
                  e.target.value
                )
              }
            />

          </div>

          <div className="input-group">

            <label htmlFor="sector">
              Sector laboral
            </label>

            <input
              id="sector"
              type="text"
              placeholder="Ej: Tecnología, Salud, Educación..."
              value={prefs.sectorLaboral}
              onChange={(e) =>
                actualizar(
                  'sectorLaboral',
                  e.target.value
                )
              }
            />

          </div>

          <div className="input-group">

            <label htmlFor="hora-inicio">
              Inicio de jornada
            </label>

            <input
              id="hora-inicio"
              type="time"
              value={prefs.horaInicioJornada}
              onChange={(e) =>
                actualizar(
                  'horaInicioJornada',
                  e.target.value
                )
              }
            />

          </div>

          <div className="input-group">

            <label htmlFor="hora-fin">
              Fin de jornada
            </label>

            <input
              id="hora-fin"
              type="time"
              value={prefs.horaFinJornada}
              onChange={(e) =>
                actualizar(
                  'horaFinJornada',
                  e.target.value
                )
              }
            />

          </div>

          <div className="input-group">

            <label htmlFor="meta-checkins">
              Meta semanal de check-ins
            </label>

            <input
              id="meta-checkins"
              type="number"
              min={1}
              max={14}
              value={prefs.metaCheckInsSemanal}
              onChange={(e) =>
                actualizar(
                  'metaCheckInsSemanal',
                  Number(e.target.value)
                )
              }
            />

          </div>

          <div className="input-group">

            <label htmlFor="meta-ejercicios">
              Meta semanal de ejercicios
            </label>

            <input
              id="meta-ejercicios"
              type="number"
              min={1}
              max={14}
              value={prefs.metaEjerciciosSemanal}
              onChange={(e) =>
                actualizar(
                  'metaEjerciciosSemanal',
                  Number(e.target.value)
                )
              }
            />

          </div>

        </div>

        <div className="input-group">

          <label htmlFor="mensaje-motivacion">
            Tu frase de motivación
          </label>

          <textarea
            id="mensaje-motivacion"
            rows={3}
            value={prefs.mensajeMotivacion}
            onChange={(e) =>
              actualizar(
                'mensajeMotivacion',
                e.target.value
              )
            }
          />

        </div>

        <label className="perfil-toggle">

          <input
            type="checkbox"
            checked={prefs.recordatorioCheckIn}
            onChange={(e) =>
              actualizar(
                'recordatorioCheckIn',
                e.target.checked
              )
            }
          />

          <span>
            Recordarme hacer check-in emocional
            durante la jornada
          </span>

        </label>

        {guardado && (
          <p className="mensaje-exito">
            Preferencias guardadas correctamente
          </p>
        )}

        <button type="submit">
          Guardar preferencias
        </button>

      </form>

    </div>

  )

}

export default Perfil
