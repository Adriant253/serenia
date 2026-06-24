export type CategoriaEjercicio =
  | 'relajacion_muscular'
  | 'manejo_crisis'

export interface PasoEjercicio {
  titulo: string
  instruccion: string
  duracionSegundos: number
}

export interface Ejercicio {
  id: string
  titulo: string
  categoria: CategoriaEjercicio
  descripcion: string
  duracionEstimada: number
  icono: string
  pasos: PasoEjercicio[]
}

export const CATEGORIAS: Record<
  CategoriaEjercicio,
  { etiqueta: string; descripcion: string }
> = {
  relajacion_muscular: {
    etiqueta: 'Relajación muscular',
    descripcion: 'Libera tensión acumulada en el cuerpo'
  },
  manejo_crisis: {
    etiqueta: 'Manejo de crisis',
    descripcion: 'Técnicas rápidas para momentos de alta presión'
  }
}

export const EJERCICIOS: Ejercicio[] = [
  {
    id: 'respiracion-478',
    titulo: 'Respiración 4-7-8',
    categoria: 'manejo_crisis',
    descripcion:
      'Técnica de respiración para calmar el sistema nervioso en minutos.',
    duracionEstimada: 3,
    icono: '🌬️',
    pasos: [
      {
        titulo: 'Preparación',
        instruccion:
          'Siéntate cómodamente, cierra los ojos y coloca una mano sobre el abdomen.',
        duracionSegundos: 15
      },
      {
        titulo: 'Inhala',
        instruccion:
          'Inhala por la nariz contando lentamente hasta 4.',
        duracionSegundos: 4
      },
      {
        titulo: 'Retén',
        instruccion:
          'Mantén el aire en los pulmones contando hasta 7.',
        duracionSegundos: 7
      },
      {
        titulo: 'Exhala',
        instruccion:
          'Exhala por la boca contando hasta 8, soltando toda la tensión.',
        duracionSegundos: 8
      },
      {
        titulo: 'Repetición',
        instruccion:
          'Repite el ciclo completo. Nota cómo tu cuerpo se relaja con cada exhalación.',
        duracionSegundos: 60
      }
    ]
  },
  {
    id: 'grounding-54321',
    titulo: 'Grounding 5-4-3-2-1',
    categoria: 'manejo_crisis',
    descripcion:
      'Ancla tu mente al presente usando tus cinco sentidos.',
    duracionEstimada: 5,
    icono: '🌍',
    pasos: [
      {
        titulo: '5 cosas que ves',
        instruccion:
          'Nombra en voz alta o en silencio 5 cosas que puedes ver a tu alrededor.',
        duracionSegundos: 45
      },
      {
        titulo: '4 cosas que tocas',
        instruccion:
          'Identifica 4 texturas: la ropa, la silla, el suelo, tu piel.',
        duracionSegundos: 45
      },
      {
        titulo: '3 cosas que escuchas',
        instruccion:
          'Escucha con atención y encuentra 3 sonidos distintos en tu entorno.',
        duracionSegundos: 45
      },
      {
        titulo: '2 cosas que hueles',
        instruccion:
          'Detecta 2 aromas. Si no hay olores, recuerda dos que te resulten agradables.',
        duracionSegundos: 30
      },
      {
        titulo: '1 cosa que saboreas',
        instruccion:
          'Nota el sabor en tu boca o imagina uno que te transmita calma.',
        duracionSegundos: 30
      }
    ]
  },
  {
    id: 'relajacion-muscular-progresiva',
    titulo: 'Relajación muscular progresiva',
    categoria: 'relajacion_muscular',
    descripcion:
      'Tensa y relaja grupos musculares de forma secuencial para liberar estrés.',
    duracionEstimada: 8,
    icono: '💪',
    pasos: [
      {
        titulo: 'Manos y antebrazos',
        instruccion:
          'Cierra los puños con fuerza durante 5 segundos y suelta de golpe, sintiendo la relajación.',
        duracionSegundos: 30
      },
      {
        titulo: 'Hombros y cuello',
        instruccion:
          'Eleva los hombros hacia las orejas, mantén la tensión y déjalos caer suavemente.',
        duracionSegundos: 30
      },
      {
        titulo: 'Rostro',
        instruccion:
          'Fruncce frente, ojos y mandíbula. Mantén 5 segundos y relaja completamente.',
        duracionSegundos: 30
      },
      {
        titulo: 'Abdomen',
        instruccion:
          'Contrae el abdomen como si te prepararas para un golpe. Suelta y respira profundo.',
        duracionSegundos: 30
      },
      {
        titulo: 'Piernas y pies',
        instruccion:
          'Estira los dedos de los pies hacia ti y aprieta los muslos. Relaja y siente el peso.',
        duracionSegundos: 30
      },
      {
        titulo: 'Escaneo final',
        instruccion:
          'Recorre mentalmente todo tu cuerpo. Donde notes tensión, exhala y suelta.',
        duracionSegundos: 45
      }
    ]
  },
  {
    id: 'escaneo-corporal',
    titulo: 'Escaneo corporal',
    categoria: 'relajacion_muscular',
    descripcion:
      'Recorre tu cuerpo con atención plena para detectar y soltar tensiones.',
    duracionEstimada: 6,
    icono: '🧘',
    pasos: [
      {
        titulo: 'Cabeza',
        instruccion:
          'Lleva tu atención a la coronilla. Observa sensaciones sin juzgar.',
        duracionSegundos: 40
      },
      {
        titulo: 'Torso',
        instruccion:
          'Baja la atención por pecho, espalda y abdomen. Respira hacia cada zona.',
        duracionSegundos: 50
      },
      {
        titulo: 'Brazos',
        instruccion:
          'Recorre hombros, brazos, codos, muñecas y manos. Deja que se aflojen.',
        duracionSegundos: 45
      },
      {
        titulo: 'Piernas',
        instruccion:
          'Siente caderas, muslos, rodillas, pantorrillas y pies. Relájalos uno a uno.',
        duracionSegundos: 50
      },
      {
        titulo: 'Integración',
        instruccion:
          'Imagina tu cuerpo completo, ligero y en calma. Permanece unos instantes así.',
        duracionSegundos: 35
      }
    ]
  },
  {
    id: 'respiracion-diafragmatica',
    titulo: 'Respiración diafragmática',
    categoria: 'relajacion_muscular',
    descripcion:
      'Activa el diafragma para reducir la respiración superficial causada por el estrés.',
    duracionEstimada: 4,
    icono: '🫁',
    pasos: [
      {
        titulo: 'Posición',
        instruccion:
          'Recuéstate o siéntate erguido. Una mano en el pecho, otra en el abdomen.',
        duracionSegundos: 15
      },
      {
        titulo: 'Inhalación profunda',
        instruccion:
          'Inhala por la nariz. El abdomen debe elevarse; el pecho apenas se mueve.',
        duracionSegundos: 30
      },
      {
        titulo: 'Exhalación lenta',
        instruccion:
          'Exhala por la boca de forma prolongada, dejando caer los hombros.',
        duracionSegundos: 30
      },
      {
        titulo: 'Ritmo constante',
        instruccion:
          'Mantén un ritmo lento y regular. La mano del abdomen sube y baja suavemente.',
        duracionSegundos: 90
      },
      {
        titulo: 'Cierre',
        instruccion:
          'Nota la diferencia con tu respiración habitual. Lleva esta calma contigo.',
        duracionSegundos: 15
      }
    ]
  },
  {
    id: 'pausa-consciente',
    titulo: 'Pausa consciente de crisis',
    categoria: 'manejo_crisis',
    descripcion:
      'Interrumpe la espiral de ansiedad con una pausa breve y estructurada.',
    duracionEstimada: 2,
    icono: '⏸️',
    pasos: [
      {
        titulo: 'Detente',
        instruccion:
          'Di en silencio: "Puedo pausar". Detén lo que estés haciendo.',
        duracionSegundos: 10
      },
      {
        titulo: 'Respira',
        instruccion:
          'Toma 3 respiraciones profundas. Inhala por 4, exhala por 6.',
        duracionSegundos: 30
      },
      {
        titulo: 'Observa',
        instruccion:
          'Nombra lo que sientes: "Estoy sintiendo ansiedad/estrés". Sin pelear contra ello.',
        duracionSegundos: 20
      },
      {
        titulo: 'Elige',
        instruccion:
          'Pregúntate: ¿Cuál es el siguiente paso más pequeño y útil que puedo dar?',
        duracionSegundos: 30
      },
      {
        titulo: 'Actúa',
        instruccion:
          'Da ese pequeño paso. Celebra haber manejado el momento con intención.',
        duracionSegundos: 20
      }
    ]
  }
]

export function obtenerEjercicioPorId(
  id: string
): Ejercicio | undefined {
  return EJERCICIOS.find(
    (ejercicio) => ejercicio.id === id
  )
}

export function calcularDuracionTotal(
  ejercicio: Ejercicio
): number {
  return ejercicio.pasos.reduce(
    (total, paso) =>
      total + paso.duracionSegundos,
    0
  )
}
