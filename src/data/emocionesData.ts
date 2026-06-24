export interface Emocion {
  id: string
  etiqueta: string
  emoji: string
  color: string
  descripcion: string
}

export const EMOCIONES: Emocion[] = [
  {
    id: 'muy_bien',
    etiqueta: 'Muy bien',
    emoji: '😊',
    color: '#22c55e',
    descripcion: 'Me siento positivo y con energía'
  },
  {
    id: 'bien',
    etiqueta: 'Bien',
    emoji: '🙂',
    color: '#84cc16',
    descripcion: 'Estable y en equilibrio'
  },
  {
    id: 'calmado',
    etiqueta: 'Calmado',
    emoji: '😌',
    color: '#7bc8a4',
    descripcion: 'En paz y relajado'
  },
  {
    id: 'neutral',
    etiqueta: 'Neutral',
    emoji: '😐',
    color: '#9ca3af',
    descripcion: 'Ni bien ni mal, normal'
  },
  {
    id: 'ansioso',
    etiqueta: 'Ansioso',
    emoji: '😰',
    color: '#f59e0b',
    descripcion: 'Preocupado o inquieto'
  },
  {
    id: 'estresado',
    etiqueta: 'Estresado',
    emoji: '😤',
    color: '#f97316',
    descripcion: 'Presionado o abrumado'
  },
  {
    id: 'triste',
    etiqueta: 'Triste',
    emoji: '😔',
    color: '#6366f1',
    descripcion: 'Con bajo ánimo o melancólico'
  },
  {
    id: 'muy_mal',
    etiqueta: 'Muy mal',
    emoji: '😢',
    color: '#ef4444',
    descripcion: 'Muy decaído o angustiado'
  }
]

export function obtenerEmocionPorId(
  id: string
): Emocion | undefined {
  return EMOCIONES.find(
    (emocion) => emocion.id === id
  )
}
