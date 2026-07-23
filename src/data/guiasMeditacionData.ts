import type {
  GuiaMeditacionItem
} from '../functions/meditacionF/meditacionTypes'

export const GUIAS_MEDITACION: GuiaMeditacionItem[] = [
  {
    id: 1,
    icono: '🧘',
    etiqueta: 'Para comenzar',
    titulo: 'Meditación básica consciente',
    descripcion:
      'Aprende a observar tu respiración y a regresar al momento presente sin exigir que la mente quede en blanco.',
    duracion: '5 minutos',
    idealPara: 'Principiantes',
    tono: 'verde',
    disponibleFree: true,
    pasos: [
      {
        titulo: 'Busca una postura estable',
        descripcion:
          'Siéntate en una silla o cojín. Mantén la espalda cómoda, los hombros sueltos y las manos descansando sobre las piernas.',
        consejo:
          'No necesitas una postura perfecta; prioriza una posición cómoda y segura.'
      },
      {
        titulo: 'Reduce las distracciones',
        descripcion:
          'Silencia las notificaciones y dirige suavemente la mirada hacia abajo. También puedes cerrar los ojos si te resulta cómodo.'
      },
      {
        titulo: 'Observa la respiración',
        descripcion:
          'Nota el aire entrando y saliendo. No intentes cambiar el ritmo; reconoce las sensaciones en la nariz, el pecho o el abdomen.'
      },
      {
        titulo: 'Regresa con amabilidad',
        descripcion:
          'Cuando aparezcan pensamientos, reconócelos sin pelear con ellos y vuelve poco a poco a la respiración.',
        consejo:
          'Distraerse es normal. Cada regreso a la respiración también forma parte de la práctica.'
      },
      {
        titulo: 'Cierra lentamente',
        descripcion:
          'Haz una respiración tranquila, mueve las manos y los pies, y abre los ojos con calma antes de continuar con tu día.'
      }
    ]
  },
  {
    id: 2,
    icono: '🌿',
    etiqueta: 'Respiración',
    titulo: 'Pausa para liberar tensión',
    descripcion:
      'Realiza una pausa breve para suavizar el cuerpo y recuperar un ritmo respiratorio cómodo durante momentos de tensión.',
    duracion: '3 minutos',
    idealPara: 'Momentos de tensión',
    tono: 'azul',
    disponibleFree: false,
    pasos: [
      {
        titulo: 'Detén lo que estás haciendo',
        descripcion:
          'Apoya ambos pies en el suelo y permite que las manos descansen. Observa cómo te sientes sin intentar corregirlo todo.'
      },
      {
        titulo: 'Inhala de forma natural',
        descripcion:
          'Toma aire cómodamente por la nariz. Evita forzar una inhalación profunda si no se siente agradable.'
      },
      {
        titulo: 'Alarga suavemente la salida',
        descripcion:
          'Exhala despacio y permite que los hombros, la mandíbula y el abdomen se aflojen un poco.'
      },
      {
        titulo: 'Repite a tu propio ritmo',
        descripcion:
          'Continúa durante varios ciclos, manteniendo una respiración cómoda y sin contener el aire.',
        consejo:
          'Si sientes mareo o incomodidad, detén el ejercicio y vuelve a respirar normalmente.'
      },
      {
        titulo: 'Reconoce el cambio',
        descripcion:
          'Antes de continuar con tu actividad, nota si alguna zona del cuerpo se siente un poco más relajada.'
      }
    ]
  },
  {
    id: 3,
    icono: '🫶',
    etiqueta: 'Cuerpo',
    titulo: 'Escaneo corporal breve',
    descripcion:
      'Recorre el cuerpo con atención para reconocer sensaciones y soltar tensión sin juzgar lo que encuentres.',
    duracion: '7 minutos',
    idealPara: 'Descanso y sueño',
    tono: 'lila',
    disponibleFree: false,
    pasos: [
      {
        titulo: 'Acomódate',
        descripcion:
          'Siéntate o recuéstate en una posición segura. Permite que la respiración conserve su ritmo natural.'
      },
      {
        titulo: 'Comienza por los pies',
        descripcion:
          'Observa la temperatura, la presión, el contacto o la ausencia de sensaciones. No es necesario sentir algo especial.'
      },
      {
        titulo: 'Sube lentamente',
        descripcion:
          'Lleva la atención a las piernas, la cadera, el abdomen, el pecho, las manos, los brazos, los hombros, el cuello y el rostro.'
      },
      {
        titulo: 'Suaviza sin obligar',
        descripcion:
          'Al encontrar tensión, imagina que la zona obtiene un poco más de espacio cada vez que exhalas.',
        consejo:
          'La meta es observar las sensaciones, no eliminar todas las molestias.'
      },
      {
        titulo: 'Percibe el cuerpo completo',
        descripcion:
          'Durante unos instantes siente el cuerpo como un conjunto y termina moviéndote de manera gradual.'
      }
    ]
  },
  {
    id: 4,
    icono: '⏸️',
    etiqueta: 'Pausa rápida',
    titulo: 'Pausa consciente para estudiar o trabajar',
    descripcion:
      'Interrumpe el piloto automático y regresa a tus actividades con mayor claridad y una siguiente acción definida.',
    duracion: '2 minutos',
    idealPara: 'Estudio y trabajo',
    tono: 'amarillo',
    disponibleFree: false,
    pasos: [
      {
        titulo: 'Haz una pausa real',
        descripcion:
          'Aparta las manos del teclado o del teléfono y dirige la mirada hacia un punto fijo.'
      },
      {
        titulo: 'Nombra tu estado',
        descripcion:
          'Reconoce mentalmente una palabra que describa cómo estás: cansado, acelerado, distraído o tranquilo.'
      },
      {
        titulo: 'Realiza tres respiraciones',
        descripcion:
          'Sigue tres ciclos de respiración sin controlar demasiado el ritmo. Percibe el inicio y el final de cada uno.'
      },
      {
        titulo: 'Elige una sola acción',
        descripcion:
          'Decide cuál es el siguiente paso concreto de tu tarea y deja las demás pendientes para después.'
      },
      {
        titulo: 'Retoma con calma',
        descripcion:
          'Regresa a la actividad intentando mantener la atención únicamente en ese siguiente paso.'
      }
    ]
  }
]

export const CONSEJOS_GUIA_MEDITACION = [
  {
    icono: '🪑',
    titulo: 'Comodidad primero',
    descripcion:
      'Puedes meditar sentado en una silla. No es obligatorio hacerlo en el suelo.'
  },
  {
    icono: '💭',
    titulo: 'Pensar es normal',
    descripcion:
      'La práctica consiste en notar la distracción y regresar con calma.'
  },
  {
    icono: '⏳',
    titulo: 'Empieza poco a poco',
    descripcion:
      'Dos o cinco minutos constantes son suficientes para comenzar.'
  }
]