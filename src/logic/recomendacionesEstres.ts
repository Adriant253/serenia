import {
  obtenerCausaPorId
} from '../data/estresLaboralData'

import {
  obtenerEjercicioPorId as obtenerEjercicioLocal
} from '../data/ejerciciosData'

import {
  obtenerHistorialEmocional,
  type RegistroEmocion
} from '../services/emocionesService'

export type NivelEstresGeneral =
  | 'bajo'
  | 'moderado'
  | 'alto'

export interface AccionSugerida {
  titulo: string
  descripcion: string
  enlace?: string
  prioridad: 'alta' | 'media' | 'baja'
}

export interface EjercicioRecomendado {
  id: string
  titulo: string
  icono: string
  razon: string
}

export interface PlanDiarioEstrés {
  necesitaCheckIn: boolean
  nivelEstresSemanal: NivelEstresGeneral
  promedioEstres: number
  registrosEstresSemana: number
  causaFrecuente: {
    id: string
    etiqueta: string
    consejo: string
  } | null
  ejercicioRecomendado: EjercicioRecomendado
  acciones: AccionSugerida[]
  mensajePrincipal: string
  ultimoRegistro: RegistroEmocion | null
}

const EMOCIONES_ESTRES = [
  'ansioso',
  'estresado',
  'triste',
  'muy_mal'
]

const MAPA_EJERCICIOS: Record<
  string,
  string
> = {
  ansioso: 'respiracion-478',
  estresado: 'pausa-consciente',
  triste: 'grounding-54321',
  muy_mal: 'grounding-54321',
  neutral: 'respiracion-diafragmatica',
  calmado: 'escaneo-corporal',
  bien: 'escaneo-corporal',
  muy_bien: 'escaneo-corporal'
}

const MAPA_CAUSA_EJERCICIO: Record<
  string,
  string
> = {
  carga_trabajo: 'relajacion-muscular-progresiva',
  plazos: 'respiracion-478',
  reuniones: 'pausa-consciente',
  jefe: 'grounding-54321',
  ambiente: 'escaneo-corporal',
  equilibrio: 'escaneo-corporal'
}

function registrosUltimosDias(
  historial: RegistroEmocion[],
  dias: number
): RegistroEmocion[] {
  const limite = new Date()
  limite.setDate(limite.getDate() - dias)

  return historial.filter(
    (registro) =>
      new Date(registro.fecha) >= limite
  )
}

export function yaRegistroHoy(
  historial: RegistroEmocion[]
): boolean {
  const hoy = new Date()
    .toISOString()
    .slice(0, 10)

  return historial.some(
    (registro) =>
      registro.fecha.slice(0, 10) === hoy
  )
}

function calcularPromedioEstres(
  registros: RegistroEmocion[]
): number {
  if (registros.length === 0) {
    return 0
  }

  const suma = registros.reduce(
    (total, registro) =>
      total + (registro.nivelEstres ?? 5),
    0
  )

  return Math.round(
    (suma / registros.length) * 10
  ) / 10
}

function clasificarNivelEstres(
  promedio: number
): NivelEstresGeneral {
  if (promedio <= 4) {
    return 'bajo'
  }

  if (promedio <= 7) {
    return 'moderado'
  }

  return 'alto'
}

function obtenerCausaFrecuente(
  registros: RegistroEmocion[]
): PlanDiarioEstrés['causaFrecuente'] {
  const conteo: Record<string, number> = {}

  for (const registro of registros) {
    if (!registro.causaEstresId) {
      continue
    }

    conteo[registro.causaEstresId] =
      (conteo[registro.causaEstresId] ?? 0) + 1
  }

  const entrada = Object.entries(conteo).sort(
    (a, b) => b[1] - a[1]
  )[0]

  if (!entrada) {
    return null
  }

  const causa = obtenerCausaPorId(entrada[0])

  if (!causa) {
    return null
  }

  return {
    id: causa.id,
    etiqueta: causa.etiqueta,
    consejo: causa.consejo
  }
}

export function recomendarEjercicio(
  ultimoRegistro: RegistroEmocion | null,
  registrosSemana: RegistroEmocion[]
): EjercicioRecomendado {
  let ejercicioId = 'respiracion-478'

  if (
    ultimoRegistro?.causaEstresId &&
    MAPA_CAUSA_EJERCICIO[
      ultimoRegistro.causaEstresId
    ]
  ) {
    ejercicioId =
      MAPA_CAUSA_EJERCICIO[
        ultimoRegistro.causaEstresId
      ]
  } else if (
    ultimoRegistro &&
    MAPA_EJERCICIOS[ultimoRegistro.emocionId]
  ) {
    ejercicioId =
      MAPA_EJERCICIOS[
        ultimoRegistro.emocionId
      ]
  } else {
    const estresReciente =
      registrosSemana.filter((r) =>
        EMOCIONES_ESTRES.includes(
          r.emocionId
        )
      ).length

    if (estresReciente >= 3) {
      ejercicioId =
        'relajacion-muscular-progresiva'
    }
  }

  const ejercicio =
    obtenerEjercicioLocal(ejercicioId) ??
    obtenerEjercicioLocal(
      'respiracion-478'
    )!

  const razon = ultimoRegistro
    ? `Basado en tu último registro (${ultimoRegistro.etiqueta.toLowerCase()})`
    : 'Ideal para empezar a manejar el estrés laboral'

  return {
    id: ejercicio.id,
    titulo: ejercicio.titulo,
    icono: ejercicio.icono,
    razon
  }
}

function generarAcciones(
  plan: {
    necesitaCheckIn: boolean
    nivelEstresSemanal: NivelEstresGeneral
    causaFrecuente: PlanDiarioEstrés['causaFrecuente']
    ejercicioRecomendado: EjercicioRecomendado
    ultimoRegistro: RegistroEmocion | null
  },
  progresoEjercicios: number
): AccionSugerida[] {
  const acciones: AccionSugerida[] = []

  if (plan.necesitaCheckIn) {
    acciones.push({
      titulo: 'Registrar cómo te sientes',
      descripcion:
        'Aún no has hecho tu check-in de hoy. Toma 1 minuto para identificar tu estado emocional.',
      enlace: '/dashboard/estado-animo',
      prioridad: 'alta'
    })
  }

  if (
    plan.nivelEstresSemanal === 'alto' ||
    plan.nivelEstresSemanal === 'moderado'
  ) {
    acciones.push({
      titulo: `Practicar: ${plan.ejercicioRecomendado.titulo}`,
      descripcion:
        plan.ejercicioRecomendado.razon,
      enlace: `/dashboard/ejercicios?ejercicio=${plan.ejercicioRecomendado.id}`,
      prioridad: 'alta'
    })
  }

  if (plan.causaFrecuente) {
    acciones.push({
      titulo: `Patrón detectado: ${plan.causaFrecuente.etiqueta}`,
      descripcion:
        plan.causaFrecuente.consejo,
      prioridad: 'media'
    })
  }

  if (progresoEjercicios === 0) {
    acciones.push({
      titulo: 'Completa tu primer ejercicio',
      descripcion:
        'Los ejercicios guiados te ayudan a reducir la tensión acumulada durante la jornada.',
      enlace: '/dashboard/ejercicios',
      prioridad: 'media'
    })
  }

  if (
    plan.ultimoRegistro &&
    EMOCIONES_ESTRES.includes(
      plan.ultimoRegistro.emocionId
    ) &&
    plan.nivelEstresSemanal !== 'bajo'
  ) {
    acciones.push({
      titulo: 'Micro-pausa de 2 minutos',
      descripcion:
        'Levanta la vista, estira hombros y respira profundo 5 veces antes de continuar trabajando.',
      prioridad: 'baja'
    })
  }

  return acciones.slice(0, 4)
}

function generarMensajePrincipal(
  nivel: NivelEstresGeneral,
  necesitaCheckIn: boolean,
  nombre: string
): string {
  const primerNombre =
    nombre.split(' ')[0]

  if (necesitaCheckIn) {
    return `${primerNombre}, ¿cómo va tu jornada? Registra tu estado para recibir recomendaciones personalizadas.`
  }

  if (nivel === 'alto') {
    return `${primerNombre}, detectamos estrés elevado esta semana. Te sugerimos pausas activas y un ejercicio guiado hoy.`
  }

  if (nivel === 'moderado') {
    return `${primerNombre}, llevas un ritmo exigente. Pequeñas pausas pueden evitar que el estrés se acumule.`
  }

  return `${primerNombre}, vas bien esta semana. Mantén tus hábitos de autocuidado para sostener el equilibrio.`
}

export function generarPlanDiario(
  idUsuario: number,
  nombreUsuario: string,
  progresoEjercicios = 0
): PlanDiarioEstrés {
  const historial =
    obtenerHistorialEmocional(idUsuario)

  const semana = registrosUltimosDias(
    historial,
    7
  )

  const promedioEstres =
    calcularPromedioEstres(semana)

  const nivelEstresSemanal =
    clasificarNivelEstres(promedioEstres)

  const registrosEstresSemana =
    semana.filter((r) =>
      EMOCIONES_ESTRES.includes(r.emocionId)
    ).length

  const ultimoRegistro =
    historial[0] ?? null

  const causaFrecuente =
    obtenerCausaFrecuente(semana)

  const ejercicioRecomendado =
    recomendarEjercicio(
      ultimoRegistro,
      semana
    )

  const necesitaCheckIn =
    !yaRegistroHoy(historial)

  const progreso = progresoEjercicios

  const acciones = generarAcciones(
    {
      necesitaCheckIn,
      nivelEstresSemanal,
      causaFrecuente,
      ejercicioRecomendado,
      ultimoRegistro
    },
    progreso
  )

  const mensajePrincipal =
    generarMensajePrincipal(
      nivelEstresSemanal,
      necesitaCheckIn,
      nombreUsuario
    )

  return {
    necesitaCheckIn,
    nivelEstresSemanal,
    promedioEstres,
    registrosEstresSemana,
    causaFrecuente,
    ejercicioRecomendado,
    acciones,
    mensajePrincipal,
    ultimoRegistro
  }
}

export function recomendarTrasRegistro(
  registro: RegistroEmocion
): {
  ejercicio: EjercicioRecomendado
  mensaje: string
  esUrgente: boolean
} {
  const esEstres = EMOCIONES_ESTRES.includes(
    registro.emocionId
  )

  const ejercicio = recomendarEjercicio(
    registro,
    [registro]
  )

  if (esEstres || (registro.nivelEstres ?? 0) >= 7) {
    return {
      ejercicio,
      mensaje:
        'Detectamos tensión laboral. Te recomendamos este ejercicio ahora para recuperar calma antes de continuar.',
      esUrgente: true
    }
  }

  return {
    ejercicio,
    mensaje:
      'Buen registro. Este ejercicio te ayudará a mantener el equilibrio durante tu jornada.',
    esUrgente: false
  }
}
