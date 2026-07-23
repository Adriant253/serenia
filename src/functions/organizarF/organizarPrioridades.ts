import {
  useEffect,
  useMemo,
  useState
} from 'react'

import type {
  MouseEvent
} from 'react'

import {
  editarOrganizarPrioridad,
  eliminarOrganizarPrioridad,
  guardarOrganizarPrioridad,
  obtenerOrganizarPrioridadesUsuario
} from '../../services/organizarPrioridadesService'

import type {
  EstadoTarea,
  NotificarVencimiento,
  PrioridadTarea
} from '../../services/organizarPrioridadesService'

export type FiltroPrioridad = 'Todas' | PrioridadTarea
export type FiltroEstado = 'Todos' | EstadoTarea

export interface UsuarioSesion {
  id_usuario: number
  nombre: string
  email: string
  estado_suscripcion?: string
  fecha_nacimiento: string
  fecha_registro: string
}

export interface TareaPrioridad {
  id: number
  titulo: string
  descripcion: string
  fechaInicio: string
  fecha: string
  prioridad: PrioridadTarea
  estado: EstadoTarea
  fechaCreacion: string
  notificarVencimiento: NotificarVencimiento
  aviso3DiasEnviado: NotificarVencimiento
  avisoDiaVencimientoEnviado: NotificarVencimiento
}

interface TareaApi {
  id_tarea: number | null
  titulo: string | null
  descripcion: string | null
  fecha_inicio: string | null
  fecha_limite: string | null
  prioridad: PrioridadTarea | null
  estado: EstadoTarea | null
  fecha_creacion: string | null
  notificar_vencimiento: number | null
  aviso_3_dias_enviado: number | null
  aviso_dia_vencimiento_enviado: number | null
  estado_suscripcion?: string | null
}

export interface FormularioTarea {
  id_tarea: string
  titulo: string
  descripcion: string
  fechaInicio: string
  fecha: string
  prioridad: PrioridadTarea
  estado: EstadoTarea
  notificarVencimiento: boolean
}

const formularioInicial: FormularioTarea = {
  id_tarea: '',
  titulo: '',
  descripcion: '',
  fechaInicio: '',
  fecha: '',
  prioridad: 'Alta',
  estado: 'Pendiente',
  notificarVencimiento: false
}

const TAREAS_POR_PAGINA = 6
const BOTONES_ESCRITORIO = 5
const BOTONES_MOVIL = 3
const ANCHO_MOVIL = 768

const LIMITE_DIARIO_TAREAS_FREE = 3
const LIMITE_SEMANAL_TAREAS_FREE = 15
const MENSAJE_CAMBIO_PREMIUM = 'Cámbiate a premium'
const ZONA_HORARIA_APP = 'America/Mexico_City'

function obtenerUsuarioSesion(): UsuarioSesion | null {
  try {
    const usuario: UsuarioSesion | null = JSON.parse(
      localStorage.getItem('usuario') || 'null'
    )

    return usuario

  } catch {
    return null
  }
}

function obtenerIdUsuarioSesion(): number | null {
  const usuario = obtenerUsuarioSesion()

  if (!usuario || !usuario.id_usuario) {
    return null
  }

  return Number(usuario.id_usuario)
}

function obtenerCantidadBotonesInicial() {
  if (typeof window === 'undefined') {
    return BOTONES_ESCRITORIO
  }

  return window.innerWidth <= ANCHO_MOVIL
    ? BOTONES_MOVIL
    : BOTONES_ESCRITORIO
}

function obtenerPartesFechaMexico(
  fecha = new Date()
) {
  const partes =
    new Intl.DateTimeFormat(
      'es-MX',
      {
        timeZone: ZONA_HORARIA_APP,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23'
      }
    ).formatToParts(fecha)

  function obtenerParte(
    tipo:
      | 'year'
      | 'month'
      | 'day'
      | 'hour'
      | 'minute'
      | 'second'
  ) {
    return partes.find((parte) => {
      return parte.type === tipo
    })?.value || ''
  }

  return {
    anio: obtenerParte('year'),
    mes: obtenerParte('month'),
    dia: obtenerParte('day'),
    hora: Number(obtenerParte('hour') || 0),
    minuto: Number(obtenerParte('minute') || 0),
    segundo: Number(obtenerParte('second') || 0)
  }
}

function obtenerFechaMexicoISO(
  fecha = new Date()
): string {
  const {
    anio,
    mes,
    dia
  } = obtenerPartesFechaMexico(fecha)

  return `${anio}-${mes}-${dia}`
}

function normalizarFechaCampo(
  fecha: string | null
): string {
  if (!fecha) {
    return ''
  }

  const fechaTexto =
    String(fecha).trim()

  /*
   * fecha_inicio y fecha_limite son campos DATE.
   * Conservamos la parte YYYY-MM-DD sin convertir
   * la zona horaria para evitar moverlos un día.
   */
  const coincidencia =
    fechaTexto.match(/^\d{4}-\d{2}-\d{2}/)

  return coincidencia
    ? coincidencia[0]
    : ''
}

function normalizarFechaCreacionMexico(
  fecha: string | null
): string {
  if (!fecha) {
    return ''
  }

  const fechaTexto =
    String(fecha).trim()

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)
  ) {
    return fechaTexto
  }

  /*
   * Google Cloud devuelve valores como:
   * 2026-07-13T02:36:03.000Z
   *
   * Esa hora todavía corresponde al 12 de julio
   * en Ciudad de México. Por eso sí convertimos
   * fecha_creacion a America/Mexico_City.
   */
  const fechaObjeto =
    new Date(fechaTexto)

  if (
    !Number.isNaN(fechaObjeto.getTime())
  ) {
    return obtenerFechaMexicoISO(fechaObjeto)
  }

  const coincidencia =
    fechaTexto.match(/^\d{4}-\d{2}-\d{2}/)

  return coincidencia
    ? coincidencia[0]
    : ''
}

function sumarDiasFechaISO(
  fechaISO: string,
  cantidadDias: number
): string {
  const fecha =
    new Date(`${fechaISO}T12:00:00.000Z`)

  fecha.setUTCDate(
    fecha.getUTCDate() + cantidadDias
  )

  const anio = fecha.getUTCFullYear()
  const mes =
    String(fecha.getUTCMonth() + 1)
      .padStart(2, '0')
  const dia =
    String(fecha.getUTCDate())
      .padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function normalizarNotificacion(
  valor: number | string | null | undefined
): NotificarVencimiento {
  if (valor === 1 || valor === '1') {
    return 1
  }

  if (valor === 0 || valor === '0') {
    return 0
  }

  return null
}

function obtenerFechaLocalISO(
  fecha = new Date()
): string {
  return obtenerFechaMexicoISO(fecha)
}

function obtenerInicioSemanaActualISO(
  fecha = new Date()
): string {
  const fechaMexico =
    obtenerFechaMexicoISO(fecha)

  const fechaReferencia =
    new Date(`${fechaMexico}T12:00:00.000Z`)

  const diaSemana =
    fechaReferencia.getUTCDay()

  const diferenciaLunes =
    diaSemana === 0
      ? -6
      : 1 - diaSemana

  return sumarDiasFechaISO(
    fechaMexico,
    diferenciaLunes
  )
}

function formatearTiempoRestante(ms: number): string {
  const minutosTotales = Math.max(
    1,
    Math.ceil(ms / 60000)
  )

  const dias = Math.floor(minutosTotales / 1440)
  const horas = Math.floor((minutosTotales % 1440) / 60)
  const minutos = minutosTotales % 60

  if (dias > 0) {
    return `${dias} día${dias === 1 ? '' : 's'} y ${horas} hora${horas === 1 ? '' : 's'}`
  }

  if (horas > 0) {
    return `${horas} hora${horas === 1 ? '' : 's'} y ${minutos} minuto${minutos === 1 ? '' : 's'}`
  }

  return `${minutos} minuto${minutos === 1 ? '' : 's'}`
}

function obtenerMilisegundosRestantesDiaMexico(
  fecha = new Date()
): number {
  const {
    hora,
    minuto,
    segundo
  } = obtenerPartesFechaMexico(fecha)

  const segundosTranscurridos =
    (hora * 60 * 60) +
    (minuto * 60) +
    segundo

  const segundosDia =
    24 * 60 * 60

  return Math.max(
    1000,
    (segundosDia - segundosTranscurridos) * 1000
  )
}

function obtenerTiempoRestanteDia(
  fecha = new Date()
): string {
  return formatearTiempoRestante(
    obtenerMilisegundosRestantesDiaMexico(fecha)
  )
}

function obtenerTiempoRestanteSemana(
  fecha = new Date()
): string {
  const fechaMexico =
    obtenerFechaMexicoISO(fecha)

  const fechaReferencia =
    new Date(`${fechaMexico}T12:00:00.000Z`)

  const diaSemana =
    fechaReferencia.getUTCDay()

  const diasCompletosRestantes =
    diaSemana === 0
      ? 0
      : 7 - diaSemana

  const milisegundosRestantes =
    obtenerMilisegundosRestantesDiaMexico(fecha) +
    (
      diasCompletosRestantes *
      24 *
      60 *
      60 *
      1000
    )

  return formatearTiempoRestante(
    milisegundosRestantes
  )
}

function normalizarTareaApi(tarea: TareaApi): TareaPrioridad | null {
  if (
    tarea.id_tarea === null ||
    tarea.prioridad === null ||
    tarea.estado === null
  ) {
    return null
  }

  return {
    id: Number(tarea.id_tarea),
    titulo: tarea.titulo ?? '',
    descripcion: tarea.descripcion ?? '',
    fechaInicio: normalizarFechaCampo(tarea.fecha_inicio),
    fecha: normalizarFechaCampo(tarea.fecha_limite),
    prioridad: tarea.prioridad,
    estado: tarea.estado,
    fechaCreacion:
      normalizarFechaCreacionMexico(
        tarea.fecha_creacion
      ),
    notificarVencimiento: normalizarNotificacion(tarea.notificar_vencimiento),
    aviso3DiasEnviado: normalizarNotificacion(tarea.aviso_3_dias_enviado),
    avisoDiaVencimientoEnviado: normalizarNotificacion(tarea.aviso_dia_vencimiento_enviado)
  }
}

function normalizarEstadoSuscripcion(
  estadoSuscripcion?: string
) {
  return estadoSuscripcion
    ? estadoSuscripcion.trim().toLowerCase()
    : 'free'
}

function validarUsuarioPremium(
  estadoSuscripcion: string
) {
  return (
    estadoSuscripcion === 'premium' ||
    estadoSuscripcion === 'premiun'
  )
}

export function obtenerClasePrioridad(
  prioridad: PrioridadTarea
) {
  return prioridad.toLowerCase()
}

export function obtenerClaseEtiqueta(
  prioridad: PrioridadTarea
) {
  if (prioridad === 'Alta') {
    return 'etiqueta-alta'
  }

  if (prioridad === 'Media') {
    return 'etiqueta-media'
  }

  return 'etiqueta-baja'
}

export function ordenarTareas(
  lista: TareaPrioridad[]
) {
  const pesoEstado: Record<EstadoTarea, number> = {
    Pendiente: 1,
    Completada: 2
  }

  const pesoPrioridad: Record<PrioridadTarea, number> = {
    Alta: 1,
    Media: 2,
    Baja: 3
  }

  return [...lista].sort((a, b) => {
    const diferenciaEstado =
      pesoEstado[a.estado] -
      pesoEstado[b.estado]

    if (diferenciaEstado !== 0) {
      return diferenciaEstado
    }

    const diferenciaPrioridad =
      pesoPrioridad[a.prioridad] -
      pesoPrioridad[b.prioridad]

    if (diferenciaPrioridad !== 0) {
      return diferenciaPrioridad
    }

    return a.fecha.localeCompare(b.fecha)
  })
}

export function useOrganizarPrioridades() {
  const [tareas, setTareas] = useState<TareaPrioridad[]>([])

  const [formulario, setFormulario] =
    useState<FormularioTarea>(formularioInicial)

  const [modalActivo, setModalActivo] = useState(false)
  const [modalPremiumActivo, setModalPremiumActivo] = useState(false)

  const [tituloModal, setTituloModal] = useState('➕ Crear tarea')

  const [aviso, setAviso] = useState('')
  const [cargando, setCargando] = useState(false)

  const [buscar, setBuscar] = useState('')

  const [filtroPrioridad, setFiltroPrioridad] =
    useState<FiltroPrioridad>('Todas')

  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstado>('Todos')

  const [tareaConfirmandoEliminar, setTareaConfirmandoEliminar] =
    useState<number | null>(null)

  const [paginaActual, setPaginaActual] =
    useState(1)

  const [cantidadBotonesPaginacion, setCantidadBotonesPaginacion] =
    useState(obtenerCantidadBotonesInicial)

  const [idUsuario] = useState<number | null>(
    obtenerIdUsuarioSesion()
  )

  const [
    estadoSuscripcionActual,
    setEstadoSuscripcionActual
  ] = useState(
    normalizarEstadoSuscripcion(
      obtenerUsuarioSesion()?.estado_suscripcion
    )
  )

  const [fechaHoraActual, setFechaHoraActual] =
    useState(new Date())

  function mostrarAviso(mensaje: string) {
    setAviso(mensaje)

    setTimeout(() => {
      setAviso('')
    }, 2500)
  }

  function abrirModalPremium() {
    setModalPremiumActivo(true)
  }

  function cerrarModalPremium() {
    setModalPremiumActivo(false)
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial)
    setTituloModal('➕ Crear tarea')
  }

  function cerrarModal() {
    setModalActivo(false)
  }

  function cerrarModalDesdeFondo(
    event: MouseEvent<HTMLDivElement>
  ) {
    if ((event.target as HTMLDivElement).id === 'modalTarea') {
      cerrarModal()
    }
  }

  function cerrarModalPremiumDesdeFondo(
    event: MouseEvent<HTMLDivElement>
  ) {
    if ((event.target as HTMLDivElement).id === 'modalPremium') {
      cerrarModalPremium()
    }
  }

  function actualizarFormulario<K extends keyof FormularioTarea>(
    campo: K,
    valor: FormularioTarea[K]
  ) {
    setFormulario((formularioActual) => ({
      ...formularioActual,
      [campo]: valor
    }))
  }

  async function cargarTareas() {
    if (!idUsuario) {
      mostrarAviso('No se encontró el usuario en sesión.')
      return
    }

    try {
      setCargando(true)

      const respuesta =
        await obtenerOrganizarPrioridadesUsuario(idUsuario)

      if (Number(respuesta.success) === 0) {
        mostrarAviso(String(respuesta.mensaje || 'No se pudieron cargar las tareas.'))
        setTareas([])
        return
      }

      const datos: TareaApi[] =
        Array.isArray(respuesta.datos)
          ? respuesta.datos
          : []

      const estadoSuscripcionApi =
        datos.find((item) => {
          return Boolean(
            item.estado_suscripcion
          )
        })?.estado_suscripcion

      if (estadoSuscripcionApi) {
        setEstadoSuscripcionActual(
          normalizarEstadoSuscripcion(
            estadoSuscripcionApi
          )
        )
      }

      const tareasNormalizadas = datos
        .map((item: TareaApi) => normalizarTareaApi(item))
        .filter((item: TareaPrioridad | null): item is TareaPrioridad => {
          return item !== null
        })

      setTareas(tareasNormalizadas)

    } catch (error) {
      console.error(error)
      mostrarAviso('Error al cargar las tareas.')

    } finally {
      setCargando(false)
    }
  }

  const tareasAlta = tareas.filter((tarea) => {
    return tarea.prioridad === 'Alta'
  })

  const tareasMedia = tareas.filter((tarea) => {
    return tarea.prioridad === 'Media'
  })

  const tareasBaja = tareas.filter((tarea) => {
    return tarea.prioridad === 'Baja'
  })

  const totalTareas = tareas.length
  const totalAlta = tareasAlta.length
  const totalMedia = tareasMedia.length
  const totalBaja = tareasBaja.length

  const estadoSuscripcion =
    estadoSuscripcionActual

  const esUsuarioPremium =
    validarUsuarioPremium(estadoSuscripcion)

  const esUsuarioFree =
    !esUsuarioPremium

  const fechaHoy =
    obtenerFechaLocalISO(fechaHoraActual)

  const inicioSemanaActual =
    obtenerInicioSemanaActualISO(fechaHoraActual)

  const tareasCreadasHoy =
    tareas.filter((tarea) => {
      return tarea.fechaCreacion === fechaHoy
    }).length

  const tareasCreadasSemana =
    tareas.filter((tarea) => {
      return (
        tarea.fechaCreacion !== '' &&
        tarea.fechaCreacion >= inicioSemanaActual &&
        tarea.fechaCreacion <= fechaHoy
      )
    }).length

  const limiteDiarioAlcanzadoFree =
    esUsuarioFree &&
    tareasCreadasHoy >= LIMITE_DIARIO_TAREAS_FREE

  const limiteSemanalAlcanzadoFree =
    esUsuarioFree &&
    tareasCreadasSemana >= LIMITE_SEMANAL_TAREAS_FREE

  const creacionBloqueadaFree =
    limiteDiarioAlcanzadoFree ||
    limiteSemanalAlcanzadoFree

  const tipoLimitePremium =
    limiteSemanalAlcanzadoFree
      ? 'semanal'
      : limiteDiarioAlcanzadoFree
        ? 'diario'
        : ''

  const tiempoRestantePremium =
    tipoLimitePremium === 'semanal'
      ? obtenerTiempoRestanteSemana(fechaHoraActual)
      : tipoLimitePremium === 'diario'
        ? obtenerTiempoRestanteDia(fechaHoraActual)
        : ''

  const tituloLimitePremium =
    tipoLimitePremium === 'semanal'
      ? 'Límite semanal alcanzado'
      : tipoLimitePremium === 'diario'
        ? 'Límite diario alcanzado'
        : MENSAJE_CAMBIO_PREMIUM

  const descripcionLimitePremium =
    tipoLimitePremium === 'semanal'
      ? `Ya alcanzaste el límite semanal de ${LIMITE_SEMANAL_TAREAS_FREE} tareas. Podrás crear otra tarea en ${tiempoRestantePremium}.`
      : tipoLimitePremium === 'diario'
        ? `Ya creaste ${LIMITE_DIARIO_TAREAS_FREE} tareas hoy. Podrás crear otra tarea en ${tiempoRestantePremium}.`
        : 'Para seguir creando tareas sin límite, cámbiate a premium.'

  const mensajeBloqueoPremium =
    MENSAJE_CAMBIO_PREMIUM

  function obtenerNotificacionFormulario(): NotificarVencimiento {
    if (!esUsuarioPremium) {
      return null
    }

    return formulario.notificarVencimiento
      ? 1
      : null
  }

  function obtenerNotificacionTarea(
    tarea: TareaPrioridad
  ): NotificarVencimiento {
    if (!esUsuarioPremium) {
      return null
    }

    return tarea.notificarVencimiento === 1
      ? 1
      : null
  }

  function abrirModalCrear() {
    if (creacionBloqueadaFree) {
      abrirModalPremium()
      return
    }

    limpiarFormulario()
    setTituloModal('➕ Crear tarea')
    setModalActivo(true)

    setTimeout(() => {
      document.getElementById('tituloTarea')?.focus()
    }, 100)
  }

  function abrirModalEditar() {
    setTituloModal('✏️ Editar tarea')
    setModalActivo(true)

    setTimeout(() => {
      document.getElementById('tituloTarea')?.focus()
    }, 100)
  }

  async function guardarTarea() {
    const titulo = formulario.titulo.trim()
    const descripcion = formulario.descripcion.trim()
    const fechaInicio = formulario.fechaInicio
    const fecha = formulario.fecha
    const prioridad = formulario.prioridad

    const estado: EstadoTarea =
      formulario.id_tarea === ''
        ? 'Pendiente'
        : formulario.estado

    if (!idUsuario) {
      mostrarAviso('No se encontró el usuario en sesión.')
      return
    }

    if (formulario.id_tarea === '' && creacionBloqueadaFree) {
      abrirModalPremium()
      return
    }

    if (titulo === '') {
      alert('Escribe el título de la tarea.')
      return
    }

    if (fechaInicio === '') {
      alert('Selecciona una fecha de inicio.')
      return
    }

    if (fecha === '') {
      alert('Selecciona una fecha límite.')
      return
    }

    if (fechaInicio > fecha) {
      alert('La fecha de inicio no puede ser mayor que la fecha límite.')
      return
    }

    try {
      setCargando(true)

      let respuesta

      if (formulario.id_tarea === '') {
        respuesta = await guardarOrganizarPrioridad({
          titulo,
          descripcion,
          fechaInicio,
          fecha,
          prioridad,
          estado: 'Pendiente',
          Usuarios_id_usuario: idUsuario,
          notificar_vencimiento: obtenerNotificacionFormulario()
        })
      } else {
        respuesta = await editarOrganizarPrioridad({
          id_tarea: Number(formulario.id_tarea),
          titulo,
          descripcion,
          fechaInicio,
          fecha,
          prioridad,
          estado,
          Usuarios_id_usuario: idUsuario,
          notificar_vencimiento: obtenerNotificacionFormulario()
        })
      }

      if (Number(respuesta.success) === 0) {
        if (
          String(respuesta.mensaje || '')
            .toLowerCase()
            .includes('premium')
        ) {
          abrirModalPremium()
          return
        }

        mostrarAviso(String(respuesta.mensaje || 'No se pudo guardar la tarea.'))
        return
      }

      mostrarAviso(String(respuesta.mensaje || 'Tarea guardada.'))
      limpiarFormulario()
      cerrarModal()
      await cargarTareas()

    } catch (error) {
      console.error(error)
      mostrarAviso('Error al guardar la tarea.')

    } finally {
      setCargando(false)
    }
  }

  function editarTarea(id: number) {
    const tarea = tareas.find((tareaActual) => {
      return tareaActual.id === id
    })

    if (!tarea) {
      return
    }

    setFormulario({
      id_tarea: String(tarea.id),
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaInicio: tarea.fechaInicio,
      fecha: tarea.fecha,
      prioridad: tarea.prioridad,
      estado: tarea.estado,
      notificarVencimiento:
        esUsuarioPremium &&
        tarea.notificarVencimiento === 1
    })

    abrirModalEditar()
  }

  function eliminarTarea(id: number) {
    setTareaConfirmandoEliminar(id)
  }

  async function confirmarEliminarTarea(id: number) {
    if (!idUsuario) {
      mostrarAviso('No se encontró el usuario en sesión.')
      return
    }

    try {
      setCargando(true)

      const respuesta = await eliminarOrganizarPrioridad({
        id_tarea: id,
        Usuarios_id_usuario: idUsuario
      })

      if (Number(respuesta.success) === 0) {
        mostrarAviso(String(respuesta.mensaje || 'No se pudo eliminar la tarea.'))
        return
      }

      setTareaConfirmandoEliminar(null)
      mostrarAviso(String(respuesta.mensaje || 'Tarea eliminada.'))
      await cargarTareas()

    } catch (error) {
      console.error(error)
      mostrarAviso('Error al eliminar la tarea.')

    } finally {
      setCargando(false)
    }
  }

  function cancelarEliminarTarea() {
    setTareaConfirmandoEliminar(null)
  }

  async function cambiarEstado(id: number) {
    if (!idUsuario) {
      mostrarAviso('No se encontró el usuario en sesión.')
      return
    }

    const tarea = tareas.find((tareaActual) => {
      return tareaActual.id === id
    })

    if (!tarea) {
      return
    }

    const nuevoEstado: EstadoTarea =
      tarea.estado === 'Pendiente'
        ? 'Completada'
        : 'Pendiente'

    try {
      setCargando(true)

      const respuesta = await editarOrganizarPrioridad({
        id_tarea: tarea.id,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        fechaInicio: tarea.fechaInicio,
        fecha: tarea.fecha,
        prioridad: tarea.prioridad,
        estado: nuevoEstado,
        Usuarios_id_usuario: idUsuario,
        notificar_vencimiento: obtenerNotificacionTarea(tarea)
      })

      if (Number(respuesta.success) === 0) {
        mostrarAviso(String(respuesta.mensaje || 'No se pudo actualizar el estado.'))
        return
      }

      mostrarAviso('Estado actualizado.')
      await cargarTareas()

    } catch (error) {
      console.error(error)
      mostrarAviso('Error al actualizar el estado.')

    } finally {
      setCargando(false)
    }
  }

  function aplicarFiltroRapido(
    prioridad: FiltroPrioridad
  ) {
    setFiltroPrioridad(prioridad)

    setTimeout(() => {
      document.querySelector('.organizar-tablero-lista')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  const tareasFiltradas = useMemo(() => {
    const textoBuscar = buscar.toLowerCase()

    const filtradas = tareas.filter((tarea) => {
      const coincideBusqueda =
        tarea.titulo.toLowerCase().includes(textoBuscar) ||
        tarea.descripcion.toLowerCase().includes(textoBuscar)

      const coincidePrioridad =
        filtroPrioridad === 'Todas' ||
        tarea.prioridad === filtroPrioridad

      const coincideEstado =
        filtroEstado === 'Todos' ||
        tarea.estado === filtroEstado

      return coincideBusqueda && coincidePrioridad && coincideEstado
    })

    return ordenarTareas(filtradas)

  }, [
    tareas,
    buscar,
    filtroPrioridad,
    filtroEstado
  ])

  const totalPaginas =
    Math.max(
      1,
      Math.ceil(tareasFiltradas.length / TAREAS_POR_PAGINA)
    )

  const indiceInicio =
    (paginaActual - 1) * TAREAS_POR_PAGINA

  const indiceFin =
    indiceInicio + TAREAS_POR_PAGINA

  const tareasPaginadas =
    tareasFiltradas.slice(indiceInicio, indiceFin)

  const mitadBotones =
    Math.floor(cantidadBotonesPaginacion / 2)

  let inicioPaginasVisibles =
    paginaActual - mitadBotones

  if (inicioPaginasVisibles < 1) {
    inicioPaginasVisibles = 1
  }

  let finPaginasVisibles =
    inicioPaginasVisibles + cantidadBotonesPaginacion - 1

  if (finPaginasVisibles > totalPaginas) {
    finPaginasVisibles = totalPaginas

    inicioPaginasVisibles =
      Math.max(
        1,
        finPaginasVisibles - cantidadBotonesPaginacion + 1
      )
  }

  const paginasVisibles =
    Array.from(
      {
        length:
          finPaginasVisibles - inicioPaginasVisibles + 1
      },
      (_, index) => inicioPaginasVisibles + index
    )

  function cambiarPagina(numeroPagina: number) {
    if (numeroPagina < 1 || numeroPagina > totalPaginas) {
      return
    }

    setPaginaActual(numeroPagina)

    setTimeout(() => {
      document.querySelector('.organizar-tablero-lista')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 80)
  }

  function irPrimeraPagina() {
    cambiarPagina(1)
  }

  function irUltimaPagina() {
    cambiarPagina(totalPaginas)
  }

  useEffect(() => {
    function actualizarCantidadBotones() {
      setCantidadBotonesPaginacion(
        window.innerWidth <= ANCHO_MOVIL
          ? BOTONES_MOVIL
          : BOTONES_ESCRITORIO
      )
    }

    window.addEventListener('resize', actualizarCantidadBotones)

    return () => {
      window.removeEventListener('resize', actualizarCantidadBotones)
    }
  }, [])

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setFechaHoraActual(new Date())
    }, 60000)

    return () => {
      window.clearInterval(intervalo)
    }
  }, [])

  useEffect(() => {
    setPaginaActual(1)
  }, [
    buscar,
    filtroPrioridad,
    filtroEstado
  ])

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas)
    }
  }, [
    paginaActual,
    totalPaginas
  ])

  useEffect(() => {
    cargarTareas()
  }, [])

  useEffect(() => {
    function manejarEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        cerrarModal()
        cerrarModalPremium()
        setTareaConfirmandoEliminar(null)
      }
    }

    document.addEventListener('keydown', manejarEscape)

    return () => {
      document.removeEventListener('keydown', manejarEscape)
    }
  }, [])

  return {
    tareas,
    tareasFiltradas,
    tareasPaginadas,

    totalTareas,
    totalAlta,
    totalMedia,
    totalBaja,

    estadoSuscripcion,
    esUsuarioFree,
    esUsuarioPremium,

    fechaHoy,
    inicioSemanaActual,
    tareasCreadasHoy,
    tareasCreadasSemana,

    limiteDiarioAlcanzadoFree,
    limiteSemanalAlcanzadoFree,
    creacionBloqueadaFree,

    limiteDiarioTareasFree: LIMITE_DIARIO_TAREAS_FREE,
    limiteSemanalTareasFree: LIMITE_SEMANAL_TAREAS_FREE,

    mensajeBloqueoPremium,
    tipoLimitePremium,
    tiempoRestantePremium,
    tituloLimitePremium,
    descripcionLimitePremium,

    totalPaginas,
    paginaActual,
    paginasVisibles,
    cambiarPagina,
    irPrimeraPagina,
    irUltimaPagina,

    formulario,
    actualizarFormulario,

    modalActivo,
    modalPremiumActivo,
    tituloModal,
    aviso,
    cargando,

    buscar,
    setBuscar,

    filtroPrioridad,
    setFiltroPrioridad,

    filtroEstado,
    setFiltroEstado,

    tareaConfirmandoEliminar,

    abrirModalCrear,
    cerrarModal,
    cerrarModalPremium,
    cerrarModalDesdeFondo,
    cerrarModalPremiumDesdeFondo,
    guardarTarea,
    limpiarFormulario,

    editarTarea,
    eliminarTarea,
    confirmarEliminarTarea,
    cancelarEliminarTarea,
    cambiarEstado,

    aplicarFiltroRapido,
    cargarTareas
  }
}