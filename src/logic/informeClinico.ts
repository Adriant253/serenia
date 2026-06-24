import {
  type RegistroEmocion
} from '../services/emocionesService'

export type NivelRiesgo =
  | 'bajo'
  | 'moderado'
  | 'alto'

export type TendenciaEmocional =
  | 'mejorando'
  | 'estable'
  | 'empeorando'
  | 'insuficiente'

export interface InformeClinico {
  nivelRiesgo: NivelRiesgo
  tendencia: TendenciaEmocional
  promedioEstres: number
  totalRegistros: number
  diasConRegistro: number
  interpretacion: string
  hallazgos: string[]
  preguntasSugeridas: string[]
  recomendacionesClinicas: string[]
  momentosCriticos: {
    fecha: string
    emocion: string
    nivelEstres: number
    causa?: string
    nota?: string
  }[]
  distribucionCausas: {
    etiqueta: string
    cantidad: number
    porcentaje: number
  }[]
}

const EMOCIONES_NEGATIVAS = [
  'ansioso',
  'estresado',
  'triste',
  'muy_mal'
]

function calcularTendencia(
  registros: RegistroEmocion[]
): TendenciaEmocional {
  if (registros.length < 4) {
    return 'insuficiente'
  }

  const mitad = Math.ceil(
    registros.length / 2
  )

  const recientes = registros.slice(0, mitad)
  const anteriores = registros.slice(mitad)

  const promedio = (lista: RegistroEmocion[]) =>
    lista.reduce(
      (s, r) => s + (r.nivelEstres ?? 5),
      0
    ) / lista.length

  const diff =
    promedio(recientes) -
    promedio(anteriores)

  if (diff <= -1) {
    return 'mejorando'
  }

  if (diff >= 1) {
    return 'empeorando'
  }

  return 'estable'
}

function clasificarRiesgo(
  promedio: number,
  pctNegativo: number
): NivelRiesgo {
  if (promedio >= 7.5 || pctNegativo >= 70) {
    return 'alto'
  }

  if (promedio >= 5.5 || pctNegativo >= 45) {
    return 'moderado'
  }

  return 'bajo'
}

export function generarInformeClinico(
  registros: RegistroEmocion[],
  nombrePaciente: string
): InformeClinico {
  if (registros.length === 0) {
    return {
      nivelRiesgo: 'bajo',
      tendencia: 'insuficiente',
      promedioEstres: 0,
      totalRegistros: 0,
      diasConRegistro: 0,
      interpretacion:
        `No hay registros emocionales de ${nombrePaciente} en el periodo seleccionado. Se recomienda solicitar check-ins diarios para construir un historial clínico.`,
      hallazgos: [
        'Sin datos suficientes para análisis clínico.'
      ],
      preguntasSugeridas: [
        '¿Con qué frecuencia experimenta estrés en el trabajo?',
        '¿Existen situaciones laborales recurrentes que desencadenen malestar?',
        '¿Cómo afecta el estrés su sueño, alimentación o relaciones?'
      ],
      recomendacionesClinicas: [
        'Invitar al paciente a registrar su estado emocional diariamente en Serenia.'
      ],
      momentosCriticos: [],
      distribucionCausas: []
    }
  }

  const promedioEstres =
    Math.round(
      (registros.reduce(
        (s, r) => s + (r.nivelEstres ?? 5),
        0
      ) / registros.length) * 10
    ) / 10

  const negativos = registros.filter((r) =>
    EMOCIONES_NEGATIVAS.includes(r.emocionId)
  ).length

  const pctNegativo = Math.round(
    (negativos / registros.length) * 100
  )

  const nivelRiesgo = clasificarRiesgo(
    promedioEstres,
    pctNegativo
  )

  const tendencia = calcularTendencia(registros)

  const diasUnicos = new Set(
    registros.map((r) =>
      r.fecha.slice(0, 10)
    )
  ).size

  const causasMap: Record<string, number> = {}

  for (const r of registros) {
    if (r.causaEstresEtiqueta) {
      causasMap[r.causaEstresEtiqueta] =
        (causasMap[r.causaEstresEtiqueta] ?? 0) + 1
    }
  }

  const distribucionCausas = Object.entries(
    causasMap
  )
    .map(([etiqueta, cantidad]) => ({
      etiqueta,
      cantidad,
      porcentaje: Math.round(
        (cantidad / registros.length) * 100
      )
    }))
    .sort((a, b) => b.cantidad - a.cantidad)

  const causaPrincipal =
    distribucionCausas[0]?.etiqueta ??
    'no identificada'

  const emocionMap: Record<string, number> = {}

  for (const r of registros) {
    emocionMap[r.etiqueta] =
      (emocionMap[r.etiqueta] ?? 0) + 1
  }

  const emocionPredominante =
    Object.entries(emocionMap).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? '—'

  const momentosCriticos = registros
    .filter(
      (r) =>
        (r.nivelEstres ?? 0) >= 7 ||
        EMOCIONES_NEGATIVAS.includes(
          r.emocionId
        )
    )
    .slice(0, 5)
    .map((r) => ({
      fecha: r.fecha,
      emocion: r.etiqueta,
      nivelEstres: r.nivelEstres ?? 5,
      causa: r.causaEstresEtiqueta,
      nota: r.nota || undefined
    }))

  const tendenciaTexto =
    tendencia === 'mejorando'
      ? 'muestra una tendencia a la mejora'
      : tendencia === 'empeorando'
        ? 'muestra un incremento en niveles de estrés'
        : tendencia === 'estable'
          ? 'mantiene un patrón emocional estable'
          : 'requiere más registros para evaluar tendencia'

  const riesgoTexto =
    nivelRiesgo === 'alto'
      ? 'Se sugiere evaluación prioritaria del estrés laboral.'
      : nivelRiesgo === 'moderado'
        ? 'Se recomienda seguimiento activo y estrategias de afrontamiento.'
        : 'El nivel de estrés reportado se encuentra dentro de rangos manejables.'

  const interpretacion =
    `${nombrePaciente} registró ${registros.length} check-in(s) en ${diasUnicos} día(s). ` +
    `El estrés laboral promedio es ${promedioEstres}/10, con emoción predominante "${emocionPredominante}". ` +
    `El ${pctNegativo}% de los registros reflejan estados emocionales negativos. ` +
    `La causa laboral más reportada es "${causaPrincipal}". ` +
    `El paciente ${tendenciaTexto}. ${riesgoTexto}`

  const hallazgos: string[] = [
    `Estrés promedio: ${promedioEstres}/10 (nivel de riesgo: ${nivelRiesgo})`,
    `Emoción predominante: ${emocionPredominante}`,
    `${pctNegativo}% de registros con emociones negativas`,
    `Causa laboral principal: ${causaPrincipal}`,
    `Tendencia emocional: ${tendencia}`
  ]

  if (distribucionCausas.length > 1) {
    hallazgos.push(
      `Causas secundarias: ${distribucionCausas.slice(1, 3).map((c) => c.etiqueta).join(', ')}`
    )
  }

  const preguntasSugeridas = [
    `¿Cómo experimenta el estrés relacionado con "${causaPrincipal}" en su día a día?`,
    '¿Ha notado cambios en su rendimiento, concentración o motivación laboral?',
    '¿Cuenta con redes de apoyo dentro o fuera del trabajo?',
    '¿Qué estrategias ha intentado para manejar el estrés y cuáles le han funcionado?',
    '¿Existen factores fuera del trabajo que amplifiquen su estrés laboral?'
  ]

  const recomendacionesClinicas: string[] = []

  if (nivelRiesgo === 'alto') {
    recomendacionesClinicas.push(
      'Evaluar signos de agotamiento (burnout) y síntomas somáticos asociados.',
      'Considerar intervención en manejo de crisis y técnicas de regulación emocional inmediata.',
      'Explorar ajustes en carga laboral o límites saludables con el paciente.'
    )
  } else if (nivelRiesgo === 'moderado') {
    recomendacionesClinicas.push(
      'Reforzar rutinas de autocuidado y pausas activas durante la jornada.',
      'Practicar ejercicios de respiración y grounding como técnicas de prevención.',
      'Trabajar reestructuración cognitiva ante situaciones laborales estresantes.'
    )
  } else {
    recomendacionesClinicas.push(
      'Mantener hábitos de check-in emocional para prevención.',
      'Continuar con ejercicios de relajación como refuerzo positivo.'
    )
  }

  if (tendencia === 'empeorando') {
    recomendacionesClinicas.push(
      'Investigar eventos laborales recientes que hayan incrementado el estrés.'
    )
  }

  return {
    nivelRiesgo,
    tendencia,
    promedioEstres,
    totalRegistros: registros.length,
    diasConRegistro: diasUnicos,
    interpretacion,
    hallazgos,
    preguntasSugeridas,
    recomendacionesClinicas,
    momentosCriticos,
    distribucionCausas
  }
}
