export function formatearTiempoMeditacion(
  totalSegundos: number
): string {
  const segundosSeguros = Math.max(
    0,
    Math.floor(totalSegundos)
  )

  const minutos = Math.floor(
    segundosSeguros / 60
  )

  const segundos =
    segundosSeguros % 60

  return (
    `${String(minutos).padStart(2, '0')}:` +
    String(segundos).padStart(2, '0')
  )
}

export function describirDuracionMeditacion(
  totalSegundos: number
): string {
  const segundosSeguros = Math.max(
    0,
    Math.floor(totalSegundos)
  )

  if (segundosSeguros < 60) {
    return segundosSeguros === 1
      ? '1 segundo'
      : `${segundosSeguros} segundos`
  }

  const minutos = Math.floor(
    segundosSeguros / 60
  )

  const segundos =
    segundosSeguros % 60

  if (segundos === 0) {
    return minutos === 1
      ? '1 minuto'
      : `${minutos} minutos`
  }

  return `${minutos} min ${segundos} s`
}

export function formatearFechaMySQL(
  fecha: Date
): string {
  const anio =
    fecha.getFullYear()

  const mes =
    String(
      fecha.getMonth() + 1
    ).padStart(2, '0')

  const dia =
    String(
      fecha.getDate()
    ).padStart(2, '0')

  const hora =
    String(
      fecha.getHours()
    ).padStart(2, '0')

  const minuto =
    String(
      fecha.getMinutes()
    ).padStart(2, '0')

  const segundo =
    String(
      fecha.getSeconds()
    ).padStart(2, '0')

  return (
    `${anio}-${mes}-${dia} ` +
    `${hora}:${minuto}:${segundo}`
  )
}

/*
|--------------------------------------------------------------------------
| FECHAS DEL HISTORIAL
|--------------------------------------------------------------------------
|
| MySQL puede devolver una fecha como:
|
| 2026-07-12 16:30:00
|
| o Node puede serializarla como:
|
| 2026-07-12T16:30:00.000Z
|
| Se leen manualmente los componentes para evitar que el navegador
| cambie la hora por la zona horaria.
|
*/

function convertirFechaMeditacion(
  valor: string
): Date | null {
  const texto =
    String(valor || '').trim()

  if (!texto) {
    return null
  }

  const coincidencia =
    texto.match(
      /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/
    )

  if (coincidencia) {
    const anio =
      Number(coincidencia[1])

    const mes =
      Number(coincidencia[2]) - 1

    const dia =
      Number(coincidencia[3])

    const hora =
      Number(coincidencia[4])

    const minuto =
      Number(coincidencia[5])

    const segundo =
      Number(
        coincidencia[6] || 0
      )

    const fecha =
      new Date(
        anio,
        mes,
        dia,
        hora,
        minuto,
        segundo
      )

    return Number.isNaN(
      fecha.getTime()
    )
      ? null
      : fecha
  }

  const fechaAlternativa =
    new Date(texto)

  return Number.isNaN(
    fechaAlternativa.getTime()
  )
    ? null
    : fechaAlternativa
}

export function formatearFechaMeditacion(
  valor: string
): string {
  const fecha =
    convertirFechaMeditacion(
      valor
    )

  if (!fecha) {
    return 'Fecha no disponible'
  }

  return new Intl.DateTimeFormat(
    'es-MX',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  ).format(fecha)
}

export function formatearHoraMeditacion(
  valor: string
): string {
  const fecha =
    convertirFechaMeditacion(
      valor
    )

  if (!fecha) {
    return '--:--'
  }

  return new Intl.DateTimeFormat(
    'es-MX',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  ).format(fecha)
}

export function formatearFechaHoraMeditacion(
  valor: string
): string {
  return (
    `${formatearFechaMeditacion(valor)} ` +
    `${formatearHoraMeditacion(valor)}`
  )
}

export function obtenerMarcaTiempoMeditacion(
  valor: string
): number {
  const fecha =
    convertirFechaMeditacion(
      valor
    )

  return fecha?.getTime() ?? 0
}