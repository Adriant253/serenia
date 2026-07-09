import type { RegistroEmocion } from './emocionesService'
import { EMOCIONES } from '../data/emocionesData'
import {
  CAUSAS_ESTRES_LABORAL,
  MOMENTOS_LABORALES
} from '../data/estresLaboralData'

const CLAVE_SEED = 'sereniaDemoSeed'
const DEMO_VERSION = '2'

interface EntradaEmocion {
  diasAtras: number
  hora: number
  emocionId: string
  nota: string
  nivelEstres: number
  causaId: string
  momentoId: string
}

const EMOCIONES_DEMO: EntradaEmocion[] = [
  {
    diasAtras: 0,
    hora: 9,
    emocionId: 'calmado',
    nota: 'Buen inicio de semana, café y plan claro.',
    nivelEstres: 3,
    causaId: 'carga_trabajo',
    momentoId: 'inicio_jornada'
  },
  {
    diasAtras: 1,
    hora: 14,
    emocionId: 'estresado',
    nota: 'Reunión larga con el cliente, mucha presión.',
    nivelEstres: 7,
    causaId: 'reuniones',
    momentoId: 'post_reunion'
  },
  {
    diasAtras: 1,
    hora: 18,
    emocionId: 'bien',
    nota: 'Terminé lo urgente, me siento más aliviado.',
    nivelEstres: 4,
    causaId: 'plazos',
    momentoId: 'fin_jornada'
  },
  {
    diasAtras: 2,
    hora: 11,
    emocionId: 'ansioso',
    nota: 'Entrega del informe a las 3 pm.',
    nivelEstres: 6,
    causaId: 'plazos',
    momentoId: 'media_jornada'
  },
  {
    diasAtras: 3,
    hora: 16,
    emocionId: 'neutral',
    nota: 'Día normal, sin sobresaltos.',
    nivelEstres: 5,
    causaId: 'ambiente',
    momentoId: 'media_jornada'
  },
  {
    diasAtras: 4,
    hora: 10,
    emocionId: 'muy_bien',
    nota: 'Me felicitaron por el proyecto. Motivado.',
    nivelEstres: 2,
    causaId: 'carga_trabajo',
    momentoId: 'inicio_jornada'
  },
  {
    diasAtras: 5,
    hora: 13,
    emocionId: 'estresado',
    nota: 'Demasiados correos sin leer.',
    nivelEstres: 8,
    causaId: 'carga_trabajo',
    momentoId: 'media_jornada'
  },
  {
    diasAtras: 6,
    hora: 17,
    emocionId: 'calmado',
    nota: 'Hice respiración 4-7-8 y me ayudó.',
    nivelEstres: 3,
    causaId: 'equilibrio',
    momentoId: 'fin_jornada'
  },
  {
    diasAtras: 8,
    hora: 9,
    emocionId: 'triste',
    nota: 'Día difícil, poco apoyo del equipo.',
    nivelEstres: 6,
    causaId: 'jefe',
    momentoId: 'inicio_jornada'
  },
  {
    diasAtras: 10,
    hora: 15,
    emocionId: 'bien',
    nota: 'Avancé con el módulo nuevo sin bloqueos.',
    nivelEstres: 4,
    causaId: 'plazos',
    momentoId: 'media_jornada'
  }
]

function fechaRelativa(
  diasAtras: number,
  hora: number
): string {
  const d = new Date()
  d.setDate(d.getDate() - diasAtras)
  d.setHours(hora, 30, 0, 0)
  return d.toISOString()
}

function claveHistorial(idUsuario: number): string {
  return `historialEmociones_${idUsuario}`
}

function construirEmociones(
  idUsuario: number
): RegistroEmocion[] {
  return EMOCIONES_DEMO.map((entrada, i) => {
    const emocion = EMOCIONES.find(
      e => e.id === entrada.emocionId
    )!
    const causa = CAUSAS_ESTRES_LABORAL.find(
      c => c.id === entrada.causaId
    )!
    const momento = MOMENTOS_LABORALES.find(
      m => m.id === entrada.momentoId
    )!

    return {
      id: `demo-em-${i}-${idUsuario}`,
      id_usuario: idUsuario,
      emocionId: emocion.id,
      etiqueta: emocion.etiqueta,
      emoji: emocion.emoji,
      color: emocion.color,
      nota: entrada.nota,
      fecha: fechaRelativa(
        entrada.diasAtras,
        entrada.hora
      ),
      nivelEstres: entrada.nivelEstres,
      causaEstresId: causa.id,
      causaEstresEtiqueta: causa.etiqueta,
      momentoLaboralId: momento.id,
      momentoLaboralEtiqueta: momento.etiqueta
    }
  }).sort(
    (a, b) =>
      new Date(b.fecha).getTime() -
      new Date(a.fecha).getTime()
  )
}

export function sembrarDatosDemo(
  idUsuario: number,
  forzar = false
): boolean {

  const clave = `${CLAVE_SEED}_${idUsuario}`

  if (
    !forzar &&
    localStorage.getItem(clave) === DEMO_VERSION
  ) {
    return false
  }

  localStorage.setItem(
    claveHistorial(idUsuario),
    JSON.stringify(construirEmociones(idUsuario))
  )

  localStorage.setItem(clave, DEMO_VERSION)
  return true
}
