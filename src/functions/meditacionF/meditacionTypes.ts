export type VistaMeditacion =
  | 'temporizador'
  | 'guia'
  | 'historial'

export type EstadoSuscripcion =
  | 'free'
  | 'premium'

export type EstadoTemporizador =
  | 'listo'
  | 'activo'
  | 'pausado'
  | 'finalizado'

export type DuracionMeditacion =
  | 30
  | 60
  | 120
  | 180
  | 300

export type TonoGuiaMeditacion =
  | 'verde'
  | 'azul'
  | 'lila'
  | 'amarillo'

export interface OpcionDuracionMeditacion {
  segundos: DuracionMeditacion
  etiqueta: string
  descripcion: string
  disponibleFree: boolean
}

export interface ResultadoTemporizador {
  duracionProgramadaSegundos: number
  duracionRealSegundos: number
  completada: boolean
  guardada: boolean
  mensaje: string
  idMeditacion: number | null
}

export interface PasoGuiaMeditacion {
  titulo: string
  descripcion: string
  consejo?: string
}

export interface GuiaMeditacionItem {
  id: number
  icono: string
  etiqueta: string
  titulo: string
  descripcion: string
  duracion: string
  idealPara: string
  tono: TonoGuiaMeditacion
  disponibleFree: boolean
  pasos: PasoGuiaMeditacion[]
}

export const OPCIONES_DURACION_MEDITACION:
OpcionDuracionMeditacion[] = [
  {
    segundos: 30,
    etiqueta: '30 segundos',
    descripcion: 'Pausa rápida',
    disponibleFree: true
  },
  {
    segundos: 60,
    etiqueta: '1 minuto',
    descripcion: 'Sesión breve',
    disponibleFree: true
  },
  {
    segundos: 120,
    etiqueta: '2 minutos',
    descripcion: 'Concentración',
    disponibleFree: false
  },
  {
    segundos: 180,
    etiqueta: '3 minutos',
    descripcion: 'Respiración profunda',
    disponibleFree: false
  },
  {
    segundos: 300,
    etiqueta: '5 minutos',
    descripcion: 'Práctica completa',
    disponibleFree: false
  }
]

export function normalizarEstadoSuscripcion(
  valor?: string
): EstadoSuscripcion {
  return valor
    ?.trim()
    .toLowerCase() === 'premium'
    ? 'premium'
    : 'free'
}