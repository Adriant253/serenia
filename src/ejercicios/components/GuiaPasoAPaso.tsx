import { useCallback, useState } from 'react'

import {
  calcularDuracionTotal,
  type Ejercicio
} from '../../data/ejerciciosData'

import {
  formatearDuracion,
  registrarEjercicioCompletado,
  type ProgresoEjercicios
} from '../../services/progresoService'

import Temporizador from './Temporizador'

interface GuiaPasoAPasoProps {
  ejercicio: Ejercicio
  onVolver: () => void
  onProgresoActualizado: (
    progreso: ProgresoEjercicios
  ) => void
}

function GuiaPasoAPaso({
  ejercicio,
  onVolver,
  onProgresoActualizado
}: GuiaPasoAPasoProps) {

  const [pasoActual, setPasoActual] =
    useState(0)

  const [temporizadorActivo, setTemporizadorActivo] =
    useState(false)

  const [finalizado, setFinalizado] =
    useState(false)

  const [reiniciarTimer, setReiniciarTimer] =
    useState(false)

  const paso =
    ejercicio.pasos[pasoActual]

  const esUltimoPaso =
    pasoActual ===
    ejercicio.pasos.length - 1

  const handleTimerCompletado =
    useCallback(() => {
      setTemporizadorActivo(false)

      if (esUltimoPaso) {
        const duracion =
          calcularDuracionTotal(ejercicio)

        const progreso =
          registrarEjercicioCompletado(
            ejercicio.id,
            ejercicio.titulo,
            duracion
          )

        onProgresoActualizado(progreso)
        setFinalizado(true)
      } else {
        setPasoActual((prev) => prev + 1)
        setReiniciarTimer((prev) => !prev)
      }
    }, [
      esUltimoPaso,
      ejercicio,
      onProgresoActualizado
    ])

  const iniciarPaso = () => {
    setTemporizadorActivo(true)
  }

  const pasoAnterior = () => {
    if (pasoActual > 0) {
      setTemporizadorActivo(false)
      setPasoActual((prev) => prev - 1)
      setReiniciarTimer((prev) => !prev)
    }
  }

  const reiniciarEjercicio = () => {
    setPasoActual(0)
    setTemporizadorActivo(false)
    setFinalizado(false)
    setReiniciarTimer((prev) => !prev)
  }

  if (finalizado) {

    return (

      <div className="guia-finalizado">

        <div className="guia-finalizado-icono">
          🎉
        </div>

        <h2>
          ¡Ejercicio completado!
        </h2>

        <p>
          Completaste
          {' '}
          <strong>
            {ejercicio.titulo}
          </strong>
          . Tu progreso ha sido guardado.
        </p>

        <div className="guia-acciones">

          <button
            type="button"
            className="btn-secundario"
            onClick={onVolver}
          >
            Volver al catálogo
          </button>

          <button
            type="button"
            onClick={reiniciarEjercicio}
          >
            Repetir ejercicio
          </button>

        </div>

      </div>

    )

  }

  return (

    <div className="guia">

      <button
        type="button"
        className="btn-volver"
        onClick={onVolver}
      >
        ← Volver al catálogo
      </button>

      <div className="guia-header">

        <span className="guia-icono">
          {ejercicio.icono}
        </span>

        <div>
          <h2>{ejercicio.titulo}</h2>
          <p className="guia-progreso-texto">
            Paso {pasoActual + 1} de{' '}
            {ejercicio.pasos.length}
          </p>
        </div>

      </div>

      <div className="guia-barra-progreso">

        <div
          className="guia-barra-relleno"
          style={{
            width: `${
              ((pasoActual + 1) /
                ejercicio.pasos.length) *
              100
            }%`
          }}
        />

      </div>

      <div className="guia-contenido">

        <div className="guia-paso">

          <h3>{paso.titulo}</h3>

          <p>{paso.instruccion}</p>

        </div>

        <Temporizador
          duracionSegundos={
            paso.duracionSegundos
          }
          activo={temporizadorActivo}
          onCompletado={
            handleTimerCompletado
          }
          reiniciar={reiniciarTimer}
        />

      </div>

      <div className="guia-acciones">

        <button
          type="button"
          className="btn-secundario"
          onClick={pasoAnterior}
          disabled={
            pasoActual === 0 ||
            temporizadorActivo
          }
        >
          Anterior
        </button>

        {!temporizadorActivo ? (

          <button
            type="button"
            onClick={iniciarPaso}
          >
            {pasoActual === 0
              ? 'Comenzar'
              : 'Continuar'}
          </button>

        ) : (

          <button
            type="button"
            className="btn-secundario"
            onClick={() =>
              setTemporizadorActivo(false)
            }
          >
            Pausar
          </button>

        )}

        {!temporizadorActivo && (
          <button
            type="button"
            className="btn-secundario"
            onClick={handleTimerCompletado}
          >
            Saltar paso
          </button>
        )}

      </div>

      <p className="guia-duracion-paso">
        Duración del paso:{' '}
        {formatearDuracion(
          paso.duracionSegundos
        )}
      </p>

    </div>

  )

}

export default GuiaPasoAPaso
