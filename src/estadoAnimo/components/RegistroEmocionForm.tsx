import { useState } from 'react'
import { Link } from 'react-router-dom'

import { EMOCIONES } from '../../data/emocionesData'
import {
  CAUSAS_ESTRES_LABORAL,
  MOMENTOS_LABORALES
} from '../../data/estresLaboralData'

import {
  recomendarTrasRegistro
} from '../../logic/recomendacionesEstres'

import {
  registrarEmocion,
  type RegistroEmocion
} from '../../services/emocionesService'

interface RegistroEmocionProps {
  idUsuario: number
  onRegistroGuardado: (
    registro: RegistroEmocion
  ) => void
}

function RegistroEmocionForm({
  idUsuario,
  onRegistroGuardado
}: RegistroEmocionProps) {

  const [emocionSeleccionada, setEmocionSeleccionada] =
    useState('')

  const [nivelEstres, setNivelEstres] =
    useState(5)

  const [causaEstresId, setCausaEstresId] =
    useState('')

  const [momentoLaboralId, setMomentoLaboralId] =
    useState('')

  const [nota, setNota] = useState('')

  const [mensaje, setMensaje] = useState('')

  const [ultimaRecomendacion, setUltimaRecomendacion] =
    useState<ReturnType<typeof recomendarTrasRegistro> | null>(null)

  const [guardando, setGuardando] =
    useState(false)

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    if (!emocionSeleccionada) {
      setMensaje(
        'Selecciona cómo te sientes'
      )
      return
    }

    setGuardando(true)
    setMensaje('')
    setUltimaRecomendacion(null)

    const registro = registrarEmocion(
      idUsuario,
      emocionSeleccionada,
      nota,
      nivelEstres,
      causaEstresId || undefined,
      momentoLaboralId || undefined
    )

    if (registro) {
      const recomendacion =
        recomendarTrasRegistro(registro)

      onRegistroGuardado(registro)
      setUltimaRecomendacion(recomendacion)
      setEmocionSeleccionada('')
      setNivelEstres(5)
      setCausaEstresId('')
      setMomentoLaboralId('')
      setNota('')
      setMensaje(
        'Estado de ánimo registrado correctamente'
      )

      setTimeout(() => {
        setMensaje('')
      }, 3000)
    }

    setGuardando(false)
  }

  return (

    <form
      className="registro-emocion"
      onSubmit={handleSubmit}
    >

      <h2>
        Check-in laboral
      </h2>

      <p className="registro-descripcion">
        Registra cómo te sientes en el trabajo
        para recibir ayuda personalizada contra el estrés.
      </p>

      <div className="input-group">

        <label htmlFor="momento-laboral">
          Momento de la jornada
        </label>

        <select
          id="momento-laboral"
          value={momentoLaboralId}
          onChange={(e) =>
            setMomentoLaboralId(
              e.target.value
            )
          }
        >
          <option value="">
            Selecciona (opcional)
          </option>
          {MOMENTOS_LABORALES.map((momento) => (
            <option
              key={momento.id}
              value={momento.id}
            >
              {momento.etiqueta}
            </option>
          ))}
        </select>

      </div>

      <div className="emociones-grid">

        {EMOCIONES.map((emocion) => (

          <button
            key={emocion.id}
            type="button"
            className={
              emocionSeleccionada === emocion.id
                ? 'emocion-btn seleccionada'
                : 'emocion-btn'
            }
            style={{
              borderColor:
                emocionSeleccionada === emocion.id
                  ? emocion.color
                  : undefined
            }}
            onClick={() =>
              setEmocionSeleccionada(
                emocion.id
              )
            }
          >

            <span className="emocion-emoji">
              {emocion.emoji}
            </span>

            <span className="emocion-etiqueta">
              {emocion.etiqueta}
            </span>

          </button>

        ))}

      </div>

      <div className="input-group">

        <label htmlFor="nivel-estres">
          Nivel de estrés laboral:{' '}
          <strong>{nivelEstres}/10</strong>
        </label>

        <input
          id="nivel-estres"
          type="range"
          min={1}
          max={10}
          value={nivelEstres}
          onChange={(e) =>
            setNivelEstres(
              Number(e.target.value)
            )
          }
          className="slider-estres"
        />

        <div className="slider-labels">
          <span>Bajo</span>
          <span>Alto</span>
        </div>

      </div>

      <div className="input-group">

        <label>
          ¿Qué está causando el estrés?
        </label>

        <div className="causas-grid">

          {CAUSAS_ESTRES_LABORAL.map((causa) => (

            <button
              key={causa.id}
              type="button"
              className={
                causaEstresId === causa.id
                  ? 'causa-btn seleccionada'
                  : 'causa-btn'
              }
              onClick={() =>
                setCausaEstresId(
                  causaEstresId === causa.id
                    ? ''
                    : causa.id
                )
              }
            >

              <span>{causa.emoji}</span>
              {causa.etiqueta}

            </button>

          ))}

        </div>

      </div>

      <div className="input-group">

        <label htmlFor="nota-emocion">
          Nota opcional
        </label>

        <textarea
          id="nota-emocion"
          placeholder="Describe brevemente qué pasó en el trabajo..."
          value={nota}
          onChange={(e) =>
            setNota(e.target.value)
          }
          rows={3}
        />

      </div>

      {mensaje && (
        <p
          className={
            mensaje.includes('correctamente')
              ? 'mensaje-exito'
              : 'mensaje-error'
          }
        >
          {mensaje}
        </p>
      )}

      {ultimaRecomendacion && (

        <div
          className={
            ultimaRecomendacion.esUrgente
              ? 'recomendacion-post urgente'
              : 'recomendacion-post'
          }
        >

          <p>
            {ultimaRecomendacion.mensaje}
          </p>

          <div className="recomendacion-ejercicio">

            <span>
              {ultimaRecomendacion.ejercicio.icono}
            </span>

            <strong>
              {ultimaRecomendacion.ejercicio.titulo}
            </strong>

            <Link
              to={`/dashboard/ejercicios?ejercicio=${ultimaRecomendacion.ejercicio.id}`}
            >
              Hacer ahora →
            </Link>

          </div>

        </div>

      )}

      <button
        type="submit"
        disabled={guardando}
      >
        Guardar registro
      </button>

    </form>

  )

}

export default RegistroEmocionForm
