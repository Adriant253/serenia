import { useEffect, useState } from 'react'

interface TemporizadorProps {
  duracionSegundos: number
  activo: boolean
  onCompletado: () => void
  reiniciar: boolean
}

function Temporizador({
  duracionSegundos,
  activo,
  onCompletado,
  reiniciar
}: TemporizadorProps) {

  const [tiempoRestante, setTiempoRestante] =
    useState(duracionSegundos)

  useEffect(() => {
    setTiempoRestante(duracionSegundos)
  }, [duracionSegundos, reiniciar])

  useEffect(() => {
    if (!activo) {
      return
    }

    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo)
          onCompletado()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalo)
  }, [
    activo,
    duracionSegundos,
    reiniciar,
    onCompletado
  ])

  const progreso =
    duracionSegundos > 0
      ? ((duracionSegundos - tiempoRestante) /
          duracionSegundos) *
        100
      : 0

  const minutos = Math.floor(
    tiempoRestante / 60
  )
  const segundos =
    tiempoRestante % 60

  const tiempoFormateado =
    `${minutos}:${segundos
      .toString()
      .padStart(2, '0')}`

  return (
    <div className="temporizador">

      <div className="temporizador-circulo">

        <svg
          viewBox="0 0 120 120"
          className="temporizador-svg"
        >
          <circle
            cx="60"
            cy="60"
            r="52"
            className="temporizador-fondo"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            className="temporizador-progreso"
            style={{
              strokeDashoffset:
                326.73 -
                (326.73 * progreso) / 100
            }}
          />
        </svg>

        <span className="temporizador-tiempo">
          {tiempoFormateado}
        </span>

      </div>

      <p className="temporizador-estado">
        {activo
          ? 'Sigue la guía...'
          : 'Presiona continuar para iniciar'}
      </p>

    </div>
  )
}

export default Temporizador
