export interface CausaEstresLaboral {
  id: string
  etiqueta: string
  emoji: string
  consejo: string
}

export interface MomentoLaboral {
  id: string
  etiqueta: string
}

export const CAUSAS_ESTRES_LABORAL: CausaEstresLaboral[] = [
  {
    id: 'carga_trabajo',
    etiqueta: 'Exceso de tareas',
    emoji: '📋',
    consejo:
      'Prioriza 3 tareas clave hoy. Delega o pospone lo que no sea urgente.'
  },
  {
    id: 'plazos',
    etiqueta: 'Plazos y deadlines',
    emoji: '⏰',
    consejo:
      'Divide el trabajo en bloques de 25 minutos. Un paso a la vez reduce la ansiedad.'
  },
  {
    id: 'reuniones',
    etiqueta: 'Reuniones exigentes',
    emoji: '👥',
    consejo:
      'Toma 2 minutos de respiración antes y después de cada reunión importante.'
  },
  {
    id: 'jefe',
    etiqueta: 'Presión del jefe o equipo',
    emoji: '🏢',
    consejo:
      'Separa hechos de interpretaciones. Pide claridad por escrito cuando sea posible.'
  },
  {
    id: 'ambiente',
    etiqueta: 'Ambiente laboral difícil',
    emoji: '⚡',
    consejo:
      'Establece límites claros. Tu bienestar no depende de controlar a los demás.'
  },
  {
    id: 'equilibrio',
    etiqueta: 'Falta de balance vida-trabajo',
    emoji: '⚖️',
    consejo:
      'Define una hora fija para desconectar. Protege ese tiempo como una reunión.'
  },
  {
    id: 'otro',
    etiqueta: 'Otra causa',
    emoji: '💭',
    consejo:
      'Identificar la causa ya es un avance. Regístrala para detectar patrones.'
  }
]

export const MOMENTOS_LABORALES: MomentoLaboral[] = [
  { id: 'inicio_jornada', etiqueta: 'Inicio de jornada' },
  { id: 'media_jornada', etiqueta: 'Media jornada' },
  { id: 'post_reunion', etiqueta: 'Después de una reunión' },
  { id: 'fin_jornada', etiqueta: 'Fin de jornada' }
]

export function obtenerCausaPorId(
  id: string
): CausaEstresLaboral | undefined {
  return CAUSAS_ESTRES_LABORAL.find(
    (causa) => causa.id === id
  )
}

export function obtenerMomentoPorId(
  id: string
): MomentoLaboral | undefined {
  return MOMENTOS_LABORALES.find(
    (momento) => momento.id === id
  )
}
