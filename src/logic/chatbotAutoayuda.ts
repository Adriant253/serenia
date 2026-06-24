export interface AccionChat {
  etiqueta: string
  respuesta: string
}

export interface RespuestaBot {
  texto: string
  acciones?: AccionChat[]
  enlaceEjercicio?: string
}

export interface ContextoChat {
  nombre: string
  ultimaEmocion?: string
  ultimoEstres?: number
  causaFrecuente?: string
}

type Intensidad =
  | 'baja'
  | 'media'
  | 'alta'

interface AnalisisMensaje {
  intentPrincipal: string
  intentsSecundarios: string[]
  intensidad: Intensidad
  emociones: string[]
  temasLaborales: string[]
  esPregunta: boolean
  esSaludo: boolean
  esAgradecimiento: boolean
  mencionaUrgencia: boolean
}

const PATRONES_INTENT: {
  id: string
  palabras: string[]
  peso: number
}[] = [
  {
    id: 'reunion',
    palabras: [
      'reunion', 'reunión', 'junta',
      'presentacion', 'presentación',
      'videollamada', 'llamada'
    ],
    peso: 3
  },
  {
    id: 'jefe',
    palabras: [
      'jefe', 'jefa', 'supervisor',
      'supervisora', 'gerente', 'jefe me',
      'gritó', 'grito', 'regañ', 'presion'
    ],
    peso: 3
  },
  {
    id: 'sobrecarga',
    palabras: [
      'tarea', 'tareas', 'deadline',
      'plazo', 'plazos', 'entrega',
      'sobrecarga', 'mucho trabajo',
      'no doy abasto', 'abrumad',
      'colaps'
    ],
    peso: 3
  },
  {
    id: 'agotamiento',
    palabras: [
      'agotad', 'burnout', 'burn out',
      'cansad', 'fatig', 'exhaust',
      'sin energia', 'sin energía',
      'no puedo mas', 'no puedo más'
    ],
    peso: 3
  },
  {
    id: 'ansiedad',
    palabras: [
      'ansios', 'nervios', 'preocup',
      'inquiet', 'panico', 'pánico',
      'miedo', 'taquicardia'
    ],
    peso: 2
  },
  {
    id: 'estres',
    palabras: [
      'estres', 'estrés', 'estresad',
      'presion', 'presión', 'tension',
      'tensión', 'agobi'
    ],
    peso: 2
  },
  {
    id: 'concentracion',
    palabras: [
      'concentr', 'enfoc', 'distra',
      'procrast', 'mente en blanco',
      'no pienso', 'dispers'
    ],
    peso: 2
  },
  {
    id: 'conflicto',
    palabras: [
      'conflicto', 'discusion', 'discusión',
      'pelea', 'critica', 'crítica',
      'humill', 'maltrat', 'toxico', 'tóxico'
    ],
    peso: 3
  },
  {
    id: 'tristeza',
    palabras: [
      'trist', 'deprim', 'solo', 'sola',
      'llor', 'vacío', 'vacio', 'desanim'
    ],
    peso: 2
  },
  {
    id: 'equilibrio',
    palabras: [
      'balance', 'vida trabajo',
      'horas extra', 'overtime',
      'descanso', 'desconect'
    ],
    peso: 2
  },
  {
    id: 'companeros',
    palabras: [
      'compañero', 'compañera', 'compañeros',
      'equipo', 'colega', 'compañeros',
      'compañeras', 'ambiente toxico',
      'ambiente tóxico', 'bullying',
      'mobbing', 'exclu'
    ],
    peso: 2
  },
  {
    id: 'sueno',
    palabras: [
      'dormir', 'insomnio', 'desvel',
      'noche', 'sueno', 'sueño',
      'cansancio nocturno'
    ],
    peso: 2
  },
  {
    id: 'positivo',
    palabras: [
      'me siento bien', 'estoy bien',
      'mejor hoy', 'mas tranquilo',
      'más tranquilo', 'aliviado',
      'aliviada', 'contento', 'contenta',
      'calmado', 'calmada', 'gratitud'
    ],
    peso: 2
  },
  {
    id: 'ejercicio',
    palabras: [
      'ejercicio', 'respir', 'tecnica',
      'técnica', 'calm', 'relaj',
      'medit', 'grounding'
    ],
    peso: 2
  },
  {
    id: 'apoyo',
    palabras: [
      'terapia', 'psicolog', 'psicólog',
      'ayuda profesional', 'consulta',
      'hablar con alguien'
    ],
    peso: 2
  }
]

const EMOCIONES_PATRON: {
  nombre: string
  palabras: string[]
}[] = [
  { nombre: 'estrés', palabras: ['estres', 'estrés', 'presion', 'presión'] },
  { nombre: 'ansiedad', palabras: ['ansios', 'nervios', 'preocup'] },
  { nombre: 'agotamiento', palabras: ['agotad', 'cansad', 'fatig'] },
  { nombre: 'tristeza', palabras: ['trist', 'deprim', 'desanim'] },
  { nombre: 'frustración', palabras: ['frustr', 'enoj', 'molest', 'irrit'] },
  { nombre: 'miedo', palabras: ['miedo', 'panico', 'pánico', 'temor'] }
]

const INTENSIFICADORES =
  /\b(muy|demasiado|super|súper|extremadamente|totalmente|completamente|no aguanto|no soporto|fatal|horrible|terrible|pésim|pesim)\b/i

const URGENCIA =
  /\b(urgente|ahora|ya|ayuda|help|por favor|no se que hacer|no sé qué hacer)\b/i

function normalizar(
  texto: string
): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function analizarMensaje(
  mensaje: string
): AnalisisMensaje {
  const texto = normalizar(mensaje)

  const puntuaciones: Record<
    string,
    number
  > = {}

  for (const patron of PATRONES_INTENT) {
    let score = 0

    for (const palabra of patron.palabras) {
      const p = normalizar(palabra)

      if (texto.includes(p)) {
        score += patron.peso
      }
    }

    if (score > 0) {
      puntuaciones[patron.id] = score
    }
  }

  const ordenados = Object.entries(
    puntuaciones
  ).sort((a, b) => b[1] - a[1])

  const intentPrincipal =
    ordenados[0]?.[0] ?? 'general'

  const intentsSecundarios = ordenados
    .slice(1, 3)
    .map(([id]) => id)

  const emociones: string[] = []

  for (const em of EMOCIONES_PATRON) {
    if (
      em.palabras.some((p) =>
        texto.includes(normalizar(p))
      )
    ) {
      emociones.push(em.nombre)
    }
  }

  let intensidad: Intensidad = 'media'

  if (INTENSIFICADORES.test(mensaje)) {
    intensidad = 'alta'
  } else if (
    emociones.length === 0 &&
    ordenados.length === 0
  ) {
    intensidad = 'baja'
  }

  const esSaludo =
    /^(hola|buenos|buenas|hey|que tal|qué tal|saludos)/i.test(
      mensaje.trim()
    )

  const esAgradecimiento =
    /^(gracias|muchas gracias|te agradezco|ok gracias|perfecto gracias)/i.test(
      mensaje.trim()
    )

  const esPregunta =
    mensaje.includes('?') ||
    /^(como|cómo|que|qué|por que|por qué|puedo|debo|sera|será)/i.test(
      mensaje.trim()
    )

  return {
    intentPrincipal,
    intentsSecundarios,
    intensidad,
    emociones,
    temasLaborales: ordenados.map(
      ([id]) => id
    ),
    esPregunta,
    esSaludo,
    esAgradecimiento,
    mencionaUrgencia: URGENCIA.test(mensaje)
  }
}

function elegirEjercicio(
  analisis: AnalisisMensaje
): string {
  const { intentPrincipal, intensidad } =
    analisis

  if (
    intentPrincipal === 'ansiedad' ||
    intentPrincipal === 'estres'
  ) {
    return intensidad === 'alta'
      ? 'respiracion-478'
      : 'pausa-consciente'
  }

  if (
    intentPrincipal === 'reunion' ||
    intentPrincipal === 'jefe' ||
    intentPrincipal === 'conflicto'
  ) {
    return 'grounding-54321'
  }

  if (
    intentPrincipal === 'sobrecarga'
  ) {
    return 'pausa-consciente'
  }

  if (
    intentPrincipal === 'agotamiento'
  ) {
    return 'escaneo-corporal'
  }

  if (
    intentPrincipal === 'concentracion'
  ) {
    return 'respiracion-478'
  }

  if (
    intentPrincipal === 'tristeza'
  ) {
    return 'grounding-54321'
  }

  if (
    intentPrincipal === 'companeros' ||
    intentPrincipal === 'conflicto'
  ) {
    return 'grounding-54321'
  }

  if (
    intentPrincipal === 'sueno' ||
    intentPrincipal === 'agotamiento'
  ) {
    return 'escaneo-corporal'
  }

  if (
    intentPrincipal === 'positivo'
  ) {
    return 'pausa-consciente'
  }

  return 'respiracion-478'
}

function nombreEjercicio(
  id: string
): string {
  const mapa: Record<string, string> = {
    'respiracion-478': 'Respiración 4-7-8',
    'pausa-consciente': 'Pausa consciente de crisis',
    'grounding-54321': 'Grounding 5-4-3-2-1',
    'escaneo-corporal': 'Escaneo corporal',
    'relajacion-muscular-progresiva':
      'Relajación muscular progresiva'
  }

  return mapa[id] ?? 'un ejercicio guiado'
}

function respuestaEmpatica(
  analisis: AnalisisMensaje,
  nombre: string
): string {
  const primerNombre =
    nombre.split(' ')[0]

  if (analisis.esSaludo) {
    return `Hola ${primerNombre}, me alegra que estés aquí. Cuéntame qué está pasando en tu trabajo hoy.`
  }

  if (analisis.esAgradecimiento) {
    return `De nada, ${primerNombre}. Recuerda que cuidar tu bienestar laboral es tan importante como cumplir tus tareas. Estoy aquí si necesitas algo más.`
  }

  const emocionTexto =
    analisis.emociones.length > 0
      ? analisis.emociones.join(' y ')
      : 'mucho malestar'

  const intensidadTexto =
    analisis.intensidad === 'alta'
      ? 'Lo que describes suena realmente difícil'
      : analisis.intensidad === 'media'
        ? 'Entiendo lo que sientes'
        : 'Gracias por compartirlo'

  return `${intensidadTexto}, ${primerNombre}. Percibo ${emocionTexto} en tu mensaje, y eso es completamente válido en el entorno laboral.`
}

function truncarTexto(
  texto: string,
  max = 72
): string {
  const limpio = texto.trim()

  if (limpio.length <= max) {
    return limpio
  }

  return `${limpio.slice(0, max - 1)}…`
}

function construirReferencia(
  mensaje: string,
  analisis: AnalisisMensaje
): string {
  if (
    analisis.esSaludo ||
    analisis.esAgradecimiento ||
    mensaje.trim().length < 10
  ) {
    return ''
  }

  const mapaIntent: Record<string, string> = {
    reunion: 'la presión de una reunión o junta',
    jefe: 'la relación o presión con tu jefe/a',
    sobrecarga: 'la carga de tareas y plazos',
    agotamiento: 'el agotamiento que describes',
    ansiedad: 'la ansiedad que mencionas',
    estres: 'el estrés laboral que comentas',
    concentracion: 'la dificultad para concentrarte',
    conflicto: 'el conflicto en tu entorno de trabajo',
    tristeza: 'el ánimo bajo que compartes',
    equilibrio: 'el desbalance entre trabajo y descanso',
    companeros: 'la dinámica con tu equipo o compañeros',
    sueno: 'el descanso y el sueño afectados',
    positivo: 'que hoy te sientas algo mejor',
    apoyo: 'tu búsqueda de apoyo',
    ejercicio: 'tu interés en técnicas de calma'
  }

  const tema =
    mapaIntent[analisis.intentPrincipal]

  if (tema) {
    return `Leí lo que escribiste sobre ${tema}.`
  }

  return `Sobre «${truncarTexto(mensaje)}»:`
}

function respuestaPorIntent(
  intent: string,
  _analisis: AnalisisMensaje
): string {
  switch (intent) {
    case 'reunion':
      return (
        'Las reuniones difíciles dejan al cuerpo en alerta mucho después de terminar. ' +
        'Antes de seguir trabajando, tómate 2 minutos: respira profundo, nombra 3 cosas que sí salieron bien (aunque sean pequeñas) y recuerda que una mala reunión no define tu valor profesional.'
      )

    case 'jefe':
      return (
        'La presión de un superior puede sentirse muy personal, pero muchas veces refleja sus propias urgencias, no tu capacidad. ' +
        'Separa hechos de interpretaciones: ¿qué pasó exactamente y qué parte es tu responsabilidad? Si necesitas claridad, pedirla por escrito reduce la ansiedad.'
      )

    case 'sobrecarga':
      return (
        'Cuando hay demasiadas tareas, el cerebro entra en modo supervivencia y todo parece urgente. ' +
        'Haz una lista y elige solo 3 prioridades para hoy. Lo demás puede esperar o delegarse. Renegociar plazos no es fallar — es gestionar bien tu energía.'
      )

    case 'agotamiento':
      return (
        'El agotamiento laboral aparece cuando das más de lo que recuperas durante mucho tiempo. ' +
        'Hoy intenta algo pequeño: posponer una tarea no urgente, tomar 10 minutos sin pantalla y reconocer que tu cuerpo pide descanso, no más esfuerzo.'
      )

    case 'ansiedad':
      return (
        'La ansiedad laboral suele anticipar escenarios que aún no ocurren. ' +
        'Pregúntate: "¿Qué está en mi control ahora mismo?" Enfócate solo en eso. Tu cuerpo necesita señales de seguridad — una respiración lenta y prolongada ayuda a enviarlas.'
      )

    case 'estres':
      return (
        'El estrés es la respuesta natural de tu cuerpo ante exigencias altas. No significa que estés fallando. ' +
        'Identifica qué lo disparó hoy y haz una pausa antes de reaccionar. Actuar desde la calma, aunque sea 5 minutos después, cambia el resultado.'
      )

    case 'concentracion':
      return (
        'No poder concentrarte casi siempre indica sobrecarga mental, no falta de disciplina. ' +
        'Prueba trabajar en bloques de 25 minutos en una sola tarea, con 5 min de pausa real. Si la mente sigue acelerada, calma el cuerpo primero con respiración.'
      )

    case 'conflicto':
      return (
        'Los conflictos laborales activan mucho estrés porque mezclan trabajo con emociones personales. ' +
        'No tienes que resolverlo todo hoy. Documenta lo ocurrido, evita responder en caliente y busca un espacio seguro para procesar lo que sientes.'
      )

    case 'tristeza':
      return (
        'Sentirte triste o desanimado/a en el trabajo puede ser señal de que algo importante para ti está siendo ignorado o dañado. ' +
        'Permítete sentirlo sin juzgarte. Hablar con alguien de confianza o un profesional puede ayudarte a entender qué necesitas cambiar.'
      )

    case 'equilibrio':
      return (
        'El desbalance vida-trabajo se acumula silenciosamente. ' +
        'Define una hora fija para desconectar hoy y protégela como si fuera una reunión importante. Recuperar energía no es opcional — es parte de sostener tu rendimiento.'
      )

    case 'companeros':
      return (
        'Las tensiones con compañeros pueden contaminar todo el día laboral. ' +
        'Enfócate en hechos observables, no en suposiciones. Si el ambiente es hostil de forma repetida, documenta situaciones y considera hablar con RR.HH. o tu superior de forma constructiva.'
      )

    case 'sueno':
      return (
        'Cuando el trabajo invade el sueño, el cerebro sigue en modo alerta. ' +
        'Antes de dormir, escribe en un papel lo pendiente para “sacarlo” de la cabeza. Evita revisar correos 1 hora antes de acostarte.'
      )

    case 'positivo':
      return (
        'Me alegra leer que hoy te sientes mejor. Aprovecha este momento para anclar qué te ayudó — una pausa, terminar algo, apoyo de alguien — y repítelo cuando vuelva la presión.'
      )

    case 'ejercicio':
      return (
        'Excelente decisión buscar una técnica activa. Los ejercicios guiados de Serenia están pensados para usarse durante la jornada laboral, incluso en momentos de poca privacidad.'
      )

    case 'apoyo':
      return (
        'Pedir ayuda profesional es un paso valioso. Serenia puede acompañarte con técnicas de autocuidado, pero un psicólogo puede ofrecerte un espacio más profundo para trabajar lo que sientes.'
      )

    default:
      return (
        'El estrés laboral se manifiesta de muchas formas distintas. Lo importante es que estés identificando lo que te pasa. ' +
        'Cuanto más claro sea el detonante, más fácil será encontrar una estrategia que funcione para ti.'
      )
  }
}

function generarConsejoPractico(
  analisis: AnalisisMensaje
): string {
  if (analisis.mencionaUrgencia) {
    return (
      'Paso inmediato: inhala 4 segundos, exhala 6. Repítelo 3 veces antes de tomar cualquier decisión.'
    )
  }

  if (analisis.intensidad === 'alta') {
    return (
      'Paso inmediato: aléjate 2 minutos de tu pantalla. Camina, estira hombros y mandíbula, y vuelve cuando tu respiración esté más lenta.'
    )
  }

  return (
    'Paso práctico: escribe en una frase qué te está afectando y una acción pequeña que puedas hacer en los próximos 15 minutos.'
  )
}

function generarRespuestaInteligente(
  mensaje: string,
  contexto?: ContextoChat
): RespuestaBot {
  const analisis =
    analizarMensaje(mensaje)

  const nombre =
    contexto?.nombre ?? 'amigo/a'

  if (
    analisis.intentPrincipal ===
      'general' &&
    !analisis.esSaludo &&
    !analisis.esAgradecimiento &&
    mensaje.trim().length < 8
  ) {
    return {
      texto:
        'Cuéntame un poco más sobre lo que pasa en tu trabajo. Por ejemplo: ¿Es estrés por tareas, una reunión, tu jefe, o algo más?',
      acciones: [
        {
          etiqueta: '😰 Estoy estresado/a',
          respuesta: '__estres__'
        },
        {
          etiqueta: '👥 Reunión difícil',
          respuesta: '__reunion__'
        },
        {
          etiqueta: '📋 Muchas tareas',
          respuesta: '__sobrecarga__'
        }
      ]
    }
  }

  const partes: string[] = []

  const referencia = construirReferencia(
    mensaje,
    analisis
  )

  if (referencia) {
    partes.push(referencia)
  }

  partes.push(
    respuestaEmpatica(analisis, nombre),
    respuestaPorIntent(
      analisis.intentPrincipal,
      analisis
    )
  )

  if (
    analisis.intentsSecundarios.includes(
      'jefe'
    ) &&
    analisis.intentPrincipal !== 'jefe'
  ) {
    partes.push(
      'Además, la dinámica con tu superior parece estar influyendo en cómo te sientes. Recuerda que puedes establecer límites profesionales respetuosos.'
    )
  }

  if (
    analisis.intentsSecundarios.includes(
      'sobrecarga'
    ) &&
    analisis.intentPrincipal !==
      'sobrecarga'
  ) {
    partes.push(
      'También detecto que la carga de trabajo puede estar sumando presión. Priorizar es clave en este momento.'
    )
  }

  partes.push(
    generarConsejoPractico(analisis)
  )

  if (
    contexto?.ultimaEmocion &&
    contexto.ultimoEstres &&
    contexto.ultimoEstres >= 6
  ) {
    partes.push(
      `Veo que en tu último check-in registraste "${contexto.ultimaEmocion}" con estrés ${contexto.ultimoEstres}/10. Parece un patrón que vale la pena atender.`
    )
  }

  const ejercicioId =
    elegirEjercicio(analisis)

  if (
    analisis.intentPrincipal !==
      'apoyo' &&
    analisis.intentPrincipal !==
      'positivo' &&
    !analisis.esSaludo &&
    !analisis.esAgradecimiento
  ) {
    partes.push(
      `Te recomiendo el ejercicio "${nombreEjercicio(ejercicioId)}" para este momento.`
    )
  }

  if (analisis.esPregunta) {
    partes.push(
      'Si tu pregunta es si esto es normal: sí, muchas personas experimentan esto en el trabajo. Lo importante es no normalizarlo hasta el punto de ignorarlo.'
    )
  }

  const acciones: AccionChat[] = []

  if (
    !analisis.esAgradecimiento &&
    analisis.intentPrincipal !== 'ejercicio'
  ) {
    acciones.push({
      etiqueta: `🌿 Hacer ${nombreEjercicio(ejercicioId)}`,
      respuesta: `__ejercicio_${ejercicioId.replace(/-/g, '_')}__`
    })
  }

  if (
    analisis.intensidad === 'alta' &&
    analisis.intentPrincipal !== 'positivo'
  ) {
    acciones.push({
      etiqueta: 'Necesito calmarme ya',
      respuesta: '__ejercicio_respiracion_478__'
    })
  }

  acciones.push({
    etiqueta: 'Cuéntame otra cosa',
    respuesta: '__escuchar__'
  })

  return {
    texto: partes.join('\n\n'),
    enlaceEjercicio:
      analisis.esSaludo ||
      analisis.esAgradecimiento ||
      analisis.intentPrincipal === 'apoyo'
        ? undefined
        : ejercicioId,
    acciones:
      acciones.length > 0
        ? acciones
        : undefined
  }
}

const RESPUESTAS_RAPIDAS: Record<
  string,
  RespuestaBot
> = {
  __estres__: {
    texto:
      'El estrés laboral es una respuesta normal ante la presión. Identifica qué lo causó ahora, respira profundo 3 veces y decide un solo paso pequeño para los próximos 15 minutos.',
    enlaceEjercicio: 'respiracion-478',
    acciones: [
      {
        etiqueta: '🌬️ Respiración 4-7-8',
        respuesta: '__ejercicio_respiracion_478__'
      },
      {
        etiqueta: '⏸️ Pausa consciente',
        respuesta: '__ejercicio_pausa_consciente__'
      }
    ]
  },
  __reunion__: {
    texto:
      'Después de una reunión difícil: aparta el celular 2 min, nombra 3 cosas que salieron bien y bebe agua lentamente. Tu cuerpo necesita señales de que la amenaza ya pasó.',
    enlaceEjercicio: 'pausa-consciente'
  },
  __sobrecarga__: {
    texto:
      'Lista tus tareas y marca solo 3 como imprescindibles hoy. El resto puede esperar. Pedir ayuda o renegociar plazos es inteligencia laboral, no debilidad.',
    enlaceEjercicio: 'pausa-consciente'
  },
  __concentracion__: {
    texto:
      'Trabaja 25 min en UNA tarea, luego 5 min de pausa sin pantalla. Si la mente sigue acelerada, calma el cuerpo primero con respiración.',
    enlaceEjercicio: 'respiracion-478'
  },
  __agotamiento__: {
    texto:
      'El agotamiento pide recuperación, no más esfuerzo. Posponer algo no urgente y tomar 10 min de descanso consciente es productivo, no pereza.',
    enlaceEjercicio: 'escaneo-corporal'
  },
  __ejercicio__: {
    texto: 'Elige el ejercicio que mejor se adapte a tu momento:',
    acciones: [
      {
        etiqueta: '🌬️ Respiración 4-7-8',
        respuesta: '__ejercicio_respiracion_478__'
      },
      {
        etiqueta: '⏸️ Pausa consciente',
        respuesta: '__ejercicio_pausa_consciente__'
      },
      {
        etiqueta: '🌍 Grounding',
        respuesta: '__ejercicio_grounding_54321__'
      },
      {
        etiqueta: '💪 Relajación muscular',
        respuesta: '__ejercicio_relajacion_muscular_progresiva__'
      }
    ]
  },
  __ejercicio_respiracion_478__: {
    texto:
      'Respiración 4-7-8: inhala 4 seg, retén 7, exhala 8. Repite 3-4 ciclos en tu escritorio. Activa el sistema de calma en minutos.',
    enlaceEjercicio: 'respiracion-478'
  },
  __ejercicio_pausa_consciente__: {
    texto:
      'Pausa consciente: Detente → Respira → Observa → Elige un paso pequeño. Interrumpe la espiral de estrés en 2 minutos.',
    enlaceEjercicio: 'pausa-consciente'
  },
  __ejercicio_grounding_54321__: {
    texto:
      'Grounding 5-4-3-2-1: 5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas. Te ancla al presente.',
    enlaceEjercicio: 'grounding-54321'
  },
  __ejercicio_relajacion_muscular_progresiva__: {
    texto:
      'Relajación muscular: tensa y suelta hombros, mandíbula y manos. Ideal al final de la jornada para soltar tensión acumulada.',
    enlaceEjercicio: 'relajacion-muscular-progresiva'
  },
  __ejercicio_escaneo_corporal__: {
    texto:
      'Escaneo corporal: recorre tu cuerpo con atención de pies a cabeza. Reconecta cuando estás agotado/a mentalmente.',
    enlaceEjercicio: 'escaneo-corporal'
  },
  __escuchar__: {
    texto:
      'Estoy escuchando. Cuéntame con tus palabras qué está pasando — cuanto más específico seas, mejor podré orientarte.'
  },
  __rumiacion__: {
    texto:
      'Di mentalmente "Estoy rumiando" y redirige tu atención a una tarea concreta del presente. Si persiste, prueba Grounding.',
    enlaceEjercicio: 'grounding-54321'
  },
  __apoyo__: {
    texto:
      'Buscar apoyo profesional es fortaleza, no debilidad. Un psicólogo puede ayudarte a profundizar. Serenia complementa ese proceso con herramientas diarias.'
  }
}

const SALUDO_INICIAL = (
  nombre: string
): RespuestaBot => ({
  texto:
    `Hola ${nombre.split(' ')[0]}, soy Serenia. Analizo lo que me cuentes sobre tu trabajo y te doy orientación personalizada para manejar el estrés. ¿Qué está pasando hoy?`,
  acciones: [
    {
      etiqueta: '😰 Me siento estresado/a',
      respuesta: '__estres__'
    },
    {
      etiqueta: '👥 Tuve una reunión difícil',
      respuesta: '__reunion__'
    },
    {
      etiqueta: '📋 Demasiadas tareas',
      respuesta: '__sobrecarga__'
    },
    {
      etiqueta: '😔 Me siento agotado/a',
      respuesta: '__agotamiento__'
    }
  ]
})

export function obtenerSaludoChat(
  contexto: ContextoChat
): RespuestaBot {
  if (
    contexto.ultimaEmocion &&
    contexto.ultimoEstres &&
    contexto.ultimoEstres >= 6
  ) {
    return {
      texto:
        `Hola ${contexto.nombre.split(' ')[0]}, noto que tu último check-in fue "${contexto.ultimaEmocion}" con estrés ${contexto.ultimoEstres}/10. ` +
        `Cuéntame qué está pasando ahora y te ayudo con una respuesta personalizada.`,
      acciones: SALUDO_INICIAL(
        contexto.nombre
      ).acciones
    }
  }

  return SALUDO_INICIAL(contexto.nombre)
}

export function procesarMensaje(
  mensaje: string,
  claveAccion?: string,
  contexto?: ContextoChat
): RespuestaBot {
  if (claveAccion) {
    return procesarAccionRapida(claveAccion)
  }

  return generarRespuestaInteligente(
    mensaje,
    contexto
  )
}

export function procesarAccionRapida(
  clave: string
): RespuestaBot {
  if (RESPUESTAS_RAPIDAS[clave]) {
    return RESPUESTAS_RAPIDAS[clave]
  }

  if (clave.startsWith('__ejercicio_')) {
    const id = clave
      .replace('__ejercicio_', '')
      .replace(/__/g, '')
      .replace(/_/g, '-')

    return {
      texto: `Te guío al ejercicio "${nombreEjercicio(id)}". Síguelo paso a paso para sentir alivio.`,
      enlaceEjercicio: id
    }
  }

  return generarRespuestaInteligente(
    clave,
    undefined
  )
}
