import {
  useEffect,
  useMemo,
  useState
} from 'react'

import type {
  MouseEvent
} from 'react'

import {
  editarRecordatorioDescanso,
  eliminarRecordatorioDescanso,
  guardarRecordatorioDescanso,
  obtenerRecordatoriosDescansoUsuario
} from '../../services/RecordatoriosService'

import type {
  EstadoRecordatorio
} from '../../services/RecordatoriosService'

export interface UsuarioSesion {
  id_usuario: number
  nombre: string
  email: string
  estado_suscripcion?: string
  fecha_nacimiento: string
  fecha_registro: string
}

export interface RecordatorioDescanso {
  id: number
  hora: string
  nombre: string
  mensaje: string
  dias: number[]
  estado: EstadoRecordatorio
  ultimoEnvio: string | null
}

interface RecordatorioApi {
  id_recordatorio: number | null
  hora: string | null
  nombre: string | null
  mensaje: string | null
  dias_semana: string | null
  estado: EstadoRecordatorio | null
  ultimo_envio: string | null
}

export interface FormularioRecordatorio {
  id_recordatorio: string
  hora: string
  nombre: string
  mensaje: string
  dias: number[]
  estado: EstadoRecordatorio
}

export interface ToastRecordatorio {
  id: number
  titulo: string
  mensaje: string
}

export const nombresDias: Record<number, string> = {
  0: 'Dom',
  1: 'Lun',
  2: 'Mar',
  3: 'Mié',
  4: 'Jue',
  5: 'Vie',
  6: 'Sáb'
}

export const diasFormulario = [
  {
    valor: 1,
    texto: 'Lun'
  },
  {
    valor: 2,
    texto: 'Mar'
  },
  {
    valor: 3,
    texto: 'Mié'
  },
  {
    valor: 4,
    texto: 'Jue'
  },
  {
    valor: 5,
    texto: 'Vie'
  },
  {
    valor: 6,
    texto: 'Sáb'
  },
  {
    valor: 0,
    texto: 'Dom'
  }
]

const formularioInicial: FormularioRecordatorio = {
  id_recordatorio: '',
  hora: '08:00',
  nombre: '',
  mensaje: '',
  dias: [1, 2, 3, 4, 5],
  estado: 'activo'
}

const RECORDATORIOS_POR_PAGINA = 5
const BOTONES_ESCRITORIO = 5
const BOTONES_MOVIL = 3
const ANCHO_MOVIL = 768

const LIMITE_TOTAL_RECORDATORIOS_FREE = 3

function obtenerCantidadBotonesInicial() {
  if (typeof window === 'undefined') {
    return BOTONES_ESCRITORIO
  }

  return window.innerWidth <= ANCHO_MOVIL
    ? BOTONES_MOVIL
    : BOTONES_ESCRITORIO
}

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

function normalizarHora(
  hora: string | null
): string {
  if (!hora) {
    return '08:00'
  }

  return String(hora).slice(0, 5)
}

function convertirDiasTextoALista(
  diasSemana: string | null
): number[] {
  if (!diasSemana) {
    return []
  }

  return diasSemana
    .split(',')
    .map((dia) => Number(dia))
    .filter((dia) => {
      return (
        !Number.isNaN(dia) &&
        dia >= 0 &&
        dia <= 6
      )
    })
}

function ordenarDias(
  dias: number[]
): number[] {
  const orden = [
    1,
    2,
    3,
    4,
    5,
    6,
    0
  ]

  return [...new Set(dias)].sort((a, b) => {
    return (
      orden.indexOf(a) -
      orden.indexOf(b)
    )
  })
}

function normalizarRecordatorioApi(
  recordatorio: RecordatorioApi
): RecordatorioDescanso | null {
  if (
    recordatorio.id_recordatorio === null ||
    recordatorio.estado === null
  ) {
    return null
  }

  return {
    id: Number(recordatorio.id_recordatorio),
    hora: normalizarHora(recordatorio.hora),
    nombre: recordatorio.nombre ?? '',
    mensaje: recordatorio.mensaje ?? '',
    dias: convertirDiasTextoALista(
      recordatorio.dias_semana
    ),
    estado: recordatorio.estado,
    ultimoEnvio: recordatorio.ultimo_envio
  }
}

export function ordenarRecordatorios(
  lista: RecordatorioDescanso[]
) {
  return [...lista].sort((a, b) => {
    return a.hora.localeCompare(b.hora)
  })
}

function unirPartes(
  partes: string[]
) {
  if (partes.length === 0) {
    return 'menos de 1 minuto'
  }

  if (partes.length === 1) {
    return partes[0]
  }

  const copiaPartes = [...partes]

  const ultimaParte =
    copiaPartes.pop()

  return (
    copiaPartes.join(', ') +
    ' y ' +
    ultimaParte
  )
}

export function obtenerSiguienteFechaRecordatorio(
  recordatorio: RecordatorioDescanso
) {
  if (recordatorio.estado !== 'activo') {
    return null
  }

  const ahora = new Date()

  const partes =
    recordatorio.hora.split(':')

  const hora =
    Number(partes[0])

  const minuto =
    Number(partes[1])

  for (let i = 0; i <= 7; i++) {
    const fecha = new Date(ahora)

    fecha.setDate(
      ahora.getDate() + i
    )

    fecha.setHours(
      hora,
      minuto,
      0,
      0
    )

    if (
      recordatorio.dias.includes(
        fecha.getDay()
      ) &&
      fecha > ahora
    ) {
      return fecha
    }
  }

  return null
}

export function obtenerTextoTiempoRestante(
  recordatorio: RecordatorioDescanso
) {
  if (recordatorio.estado !== 'activo') {
    return 'Recordatorio pausado'
  }

  const siguienteFecha =
    obtenerSiguienteFechaRecordatorio(
      recordatorio
    )

  if (!siguienteFecha) {
    return 'Sin próximo correo'
  }

  const ahora = new Date()

  const diferencia =
    siguienteFecha.getTime() -
    ahora.getTime()

  let totalMinutos =
    Math.ceil(diferencia / 60000)

  if (totalMinutos <= 0) {
    return 'Se enviará en menos de 1 minuto'
  }

  if (totalMinutos === 1) {
    return 'Se enviará en 1 minuto'
  }

  const dias =
    Math.floor(totalMinutos / 1440)

  totalMinutos =
    totalMinutos % 1440

  const horas =
    Math.floor(totalMinutos / 60)

  const minutos =
    totalMinutos % 60

  const partes: string[] = []

  if (dias > 0) {
    partes.push(
      dias === 1
        ? '1 día'
        : `${dias} días`
    )
  }

  if (horas > 0) {
    partes.push(
      horas === 1
        ? '1 hora'
        : `${horas} horas`
    )
  }

  if (minutos > 0) {
    partes.push(
      minutos === 1
        ? '1 minuto'
        : `${minutos} minutos`
    )
  }

  return (
    'Se enviará en ' +
    unirPartes(partes)
  )
}

export function useRecordatoriosDescanso() {
  const [recordatorios, setRecordatorios] =
    useState<RecordatorioDescanso[]>([])

  const [formulario, setFormulario] =
    useState<FormularioRecordatorio>(
      formularioInicial
    )

  const [modalActivo, setModalActivo] =
    useState(false)

  const [
    modalPremiumActivo,
    setModalPremiumActivo
  ] = useState(false)

  const [tituloModal, setTituloModal] =
    useState('Agregar recordatorio')

  const [
    recordatorioConfirmandoEliminar,
    setRecordatorioConfirmandoEliminar
  ] = useState<number | null>(null)

  const [toasts, setToasts] =
    useState<ToastRecordatorio[]>([])

  const [cargando, setCargando] =
    useState(false)

  const [paginaActual, setPaginaActual] =
    useState(1)

  const [
    cantidadBotonesPaginacion,
    setCantidadBotonesPaginacion
  ] = useState(
    obtenerCantidadBotonesInicial
  )

  const [reloj, setReloj] =
    useState(Date.now())

  const [usuarioSesion] =
    useState<UsuarioSesion | null>(
      obtenerUsuarioSesion()
    )

  const [idUsuario] =
    useState<number | null>(
      obtenerIdUsuarioSesion()
    )

  function mostrarAvisoEnPantalla(
    titulo: string,
    mensaje: string
  ) {
    const id =
      Date.now() +
      Math.floor(Math.random() * 1000)

    setToasts((actuales) => [
      ...actuales,
      {
        id,
        titulo,
        mensaje
      }
    ])

    window.setTimeout(() => {
      setToasts((actuales) =>
        actuales.filter((toast) => {
          return toast.id !== id
        })
      )
    }, 2500)
  }

  function cerrarToast(
    id: number
  ) {
    setToasts((actuales) =>
      actuales.filter((toast) => {
        return toast.id !== id
      })
    )
  }

  function limpiarFormulario() {
    setFormulario({
      ...formularioInicial,
      dias: [...formularioInicial.dias]
    })
  }

  function abrirModalPremium() {
    setModalPremiumActivo(true)
  }

  function cerrarModalPremium() {
    setModalPremiumActivo(false)
  }

  function cerrarModalPremiumDesdeFondo(
    event: MouseEvent<HTMLDivElement>
  ) {
    if (
      (event.target as HTMLDivElement).id ===
      'modalPremiumRecordatorios'
    ) {
      cerrarModalPremium()
    }
  }

  function abrirModalCrear() {
    if (creacionBloqueadaFree) {
      abrirModalPremium()
      return
    }

    limpiarFormulario()

    setRecordatorioConfirmandoEliminar(
      null
    )

    setTituloModal(
      'Agregar recordatorio'
    )

    setModalActivo(true)

    window.setTimeout(() => {
      document
        .getElementById(
          'horaRecordatorio'
        )
        ?.focus()
    }, 100)
  }

  function abrirModalEditar(
    id: number
  ) {
    const recordatorio =
      recordatorios.find((item) => {
        return item.id === id
      })

    if (!recordatorio) {
      return
    }

    setRecordatorioConfirmandoEliminar(
      null
    )

    setFormulario({
      id_recordatorio:
        String(recordatorio.id),

      hora:
        recordatorio.hora,

      nombre:
        recordatorio.nombre,

      mensaje:
        recordatorio.mensaje,

      dias:
        ordenarDias(
          recordatorio.dias
        ),

      estado:
        recordatorio.estado
    })

    setTituloModal(
      'Editar recordatorio'
    )

    setModalActivo(true)

    window.setTimeout(() => {
      document
        .getElementById(
          'horaRecordatorio'
        )
        ?.focus()
    }, 100)
  }

  function cerrarModal() {
    setModalActivo(false)
  }

  function cerrarModalDesdeFondo(
    event: MouseEvent<HTMLDivElement>
  ) {
    if (
      (event.target as HTMLDivElement).id ===
      'modalRecordatorio'
    ) {
      cerrarModal()
    }
  }

  function actualizarFormulario<
    K extends keyof FormularioRecordatorio
  >(
    campo: K,
    valor: FormularioRecordatorio[K]
  ) {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor
    }))
  }

  function cambiarDiaFormulario(
    dia: number
  ) {
    setFormulario((actual) => {
      const existe =
        actual.dias.includes(dia)

      const nuevosDias =
        existe
          ? actual.dias.filter((item) => {
              return item !== dia
            })
          : [
              ...actual.dias,
              dia
            ]

      return {
        ...actual,
        dias: ordenarDias(nuevosDias)
      }
    })
  }

  async function cargarRecordatorios() {
    if (!idUsuario) {
      mostrarAvisoEnPantalla(
        'Usuario no encontrado',
        'No se encontró el usuario en sesión.'
      )

      return
    }

    try {
      setCargando(true)

      const respuesta =
        await obtenerRecordatoriosDescansoUsuario(
          idUsuario
        )

      if (
        Number(respuesta.success) === 0
      ) {
        mostrarAvisoEnPantalla(
          'Error',
          respuesta.mensaje
        )

        setRecordatorios([])

        return
      }

      const datos =
        Array.isArray(respuesta.datos)
          ? respuesta.datos
          : []

      const recordatoriosNormalizados =
        datos
          .map(
            (
              item: RecordatorioApi
            ) => {
              return normalizarRecordatorioApi(
                item
              )
            }
          )
          .filter(
            (
              item:
                RecordatorioDescanso |
                null
            ): item is RecordatorioDescanso => {
              return item !== null
            }
          )

      setRecordatorios(
        recordatoriosNormalizados
      )

    } catch (error) {
      console.error(error)

      mostrarAvisoEnPantalla(
        'Error',
        'No se pudieron cargar los recordatorios.'
      )

    } finally {
      setCargando(false)
    }
  }

  const totalRecordatorios =
    recordatorios.length

  const totalActivos =
    recordatorios.filter((item) => {
      return item.estado === 'activo'
    }).length

  const estadoSuscripcion =
    normalizarEstadoSuscripcion(
      usuarioSesion?.estado_suscripcion
    )

  const esUsuarioPremium =
    validarUsuarioPremium(
      estadoSuscripcion
    )

  const esUsuarioFree =
    !esUsuarioPremium

  const creacionBloqueadaFree =
    esUsuarioFree &&
    totalRecordatorios >=
      LIMITE_TOTAL_RECORDATORIOS_FREE

  const espaciosDisponiblesFree =
    esUsuarioFree
      ? Math.max(
          0,
          LIMITE_TOTAL_RECORDATORIOS_FREE -
            totalRecordatorios
        )
      : null

  const tituloLimitePremium =
    'Límite de recordatorios alcanzado'

  const descripcionLimitePremium =
    `Los usuarios free pueden tener un máximo de ${LIMITE_TOTAL_RECORDATORIOS_FREE} recordatorios. Elimina uno de tus recordatorios actuales o cámbiate a premium para crear todos los que necesites.`

  async function guardarRecordatorio() {
    const hora =
      formulario.hora

    const nombre =
      formulario.nombre.trim()

    const mensaje =
      formulario.mensaje.trim()

    const dias =
      ordenarDias(
        formulario.dias
      )

    const estado =
      formulario.estado

    const esNuevoRecordatorio =
      formulario.id_recordatorio === ''

    if (!idUsuario) {
      mostrarAvisoEnPantalla(
        'Usuario no encontrado',
        'No se encontró el usuario en sesión.'
      )

      return
    }

    if (
      esNuevoRecordatorio &&
      creacionBloqueadaFree
    ) {
      cerrarModal()
      abrirModalPremium()
      return
    }

    if (hora === '') {
      mostrarAvisoEnPantalla(
        'Hora obligatoria',
        'Selecciona una hora para el recordatorio.'
      )

      return
    }

    if (nombre === '') {
      mostrarAvisoEnPantalla(
        'Nombre obligatorio',
        'Escribe un nombre para el recordatorio.'
      )

      return
    }

    if (nombre.length > 150) {
      mostrarAvisoEnPantalla(
        'Nombre demasiado largo',
        'El nombre debe tener como máximo 150 caracteres.'
      )

      return
    }

    if (mensaje.length > 4000) {
      mostrarAvisoEnPantalla(
        'Mensaje demasiado largo',
        'El mensaje debe tener como máximo 4000 caracteres.'
      )

      return
    }

    if (dias.length === 0) {
      mostrarAvisoEnPantalla(
        'Días obligatorios',
        'Selecciona al menos un día para repetir el recordatorio.'
      )

      return
    }

    try {
      setCargando(true)

      let respuesta

      if (esNuevoRecordatorio) {
        respuesta =
          await guardarRecordatorioDescanso({
            hora,
            nombre,
            mensaje,
            dias,
            estado,
            Usuarios_id_usuario:
              idUsuario
          })
      } else {
        respuesta =
          await editarRecordatorioDescanso({
            id_recordatorio:
              Number(
                formulario.id_recordatorio
              ),

            hora,
            nombre,
            mensaje,
            dias,
            estado,

            Usuarios_id_usuario:
              idUsuario
          })
      }

      if (
        Number(respuesta.success) === 0
      ) {
        const campo =
          String(
            respuesta.campo || ''
          )

        const mensajeRespuesta =
          String(
            respuesta.mensaje || ''
          )

        if (
          campo ===
            'limite_total_free' ||
          mensajeRespuesta
            .toLowerCase()
            .includes('premium')
        ) {
          cerrarModal()
          abrirModalPremium()
          return
        }

        mostrarAvisoEnPantalla(
          'Error',
          mensajeRespuesta ||
            'No se pudo guardar el recordatorio.'
        )

        return
      }

      mostrarAvisoEnPantalla(
        'Guardado',
        respuesta.mensaje
      )

      limpiarFormulario()
      cerrarModal()

      await cargarRecordatorios()

    } catch (error) {
      console.error(error)

      mostrarAvisoEnPantalla(
        'Error',
        'No se pudo guardar el recordatorio.'
      )

    } finally {
      setCargando(false)
    }
  }

  function eliminarRecordatorio(
    id: number,
    cerrar: boolean
  ) {
    setRecordatorioConfirmandoEliminar(
      id
    )

    if (cerrar) {
      cerrarModal()
    }

    window.setTimeout(() => {
      document
        .getElementById(
          `recordatorio-${id}`
        )
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
    }, 100)
  }

  function eliminarRecordatorioDesdeModal() {
    if (
      formulario.id_recordatorio === ''
    ) {
      return
    }

    eliminarRecordatorio(
      Number(
        formulario.id_recordatorio
      ),
      true
    )
  }

  async function confirmarEliminarRecordatorio(
    id: number
  ) {
    if (!idUsuario) {
      mostrarAvisoEnPantalla(
        'Usuario no encontrado',
        'No se encontró el usuario en sesión.'
      )

      return
    }

    try {
      setCargando(true)

      const respuesta =
        await eliminarRecordatorioDescanso({
          id_recordatorio: id,

          Usuarios_id_usuario:
            idUsuario
        })

      if (
        Number(respuesta.success) === 0
      ) {
        mostrarAvisoEnPantalla(
          'Error',
          respuesta.mensaje
        )

        return
      }

      setRecordatorioConfirmandoEliminar(
        null
      )

      mostrarAvisoEnPantalla(
        'Eliminado',
        respuesta.mensaje
      )

      await cargarRecordatorios()

    } catch (error) {
      console.error(error)

      mostrarAvisoEnPantalla(
        'Error',
        'No se pudo eliminar el recordatorio.'
      )

    } finally {
      setCargando(false)
    }
  }

  function cancelarEliminarRecordatorio() {
    setRecordatorioConfirmandoEliminar(
      null
    )
  }

  async function cambiarEstado(
    id: number
  ) {
    if (!idUsuario) {
      mostrarAvisoEnPantalla(
        'Usuario no encontrado',
        'No se encontró el usuario en sesión.'
      )

      return
    }

    const recordatorio =
      recordatorios.find((item) => {
        return item.id === id
      })

    if (!recordatorio) {
      return
    }

    const nuevoEstado:
      EstadoRecordatorio =
        recordatorio.estado === 'activo'
          ? 'pausado'
          : 'activo'

    try {
      setCargando(true)

      const respuesta =
        await editarRecordatorioDescanso({
          id_recordatorio:
            recordatorio.id,

          hora:
            recordatorio.hora,

          nombre:
            recordatorio.nombre,

          mensaje:
            recordatorio.mensaje,

          dias:
            ordenarDias(
              recordatorio.dias
            ),

          estado:
            nuevoEstado,

          Usuarios_id_usuario:
            idUsuario
        })

      if (
        Number(respuesta.success) === 0
      ) {
        mostrarAvisoEnPantalla(
          'Error',
          respuesta.mensaje
        )

        return
      }

      setRecordatorioConfirmandoEliminar(
        null
      )

      mostrarAvisoEnPantalla(
        'Estado actualizado',
        'El recordatorio cambió de estado.'
      )

      await cargarRecordatorios()

    } catch (error) {
      console.error(error)

      mostrarAvisoEnPantalla(
        'Error',
        'No se pudo cambiar el estado.'
      )

    } finally {
      setCargando(false)
    }
  }

  const recordatoriosOrdenados =
    useMemo(() => {
      return ordenarRecordatorios(
        recordatorios
      )
    }, [
      recordatorios
    ])

  const proximoRecordatorio =
    useMemo(() => {
      const proximasFechas =
        recordatoriosOrdenados
          .map((recordatorio) => {
            const fecha =
              obtenerSiguienteFechaRecordatorio(
                recordatorio
              )

            return {
              recordatorio,
              fecha
            }
          })
          .filter((item) => {
            return item.fecha !== null
          })
          .sort((a, b) => {
            return (
              (a.fecha?.getTime() || 0) -
              (b.fecha?.getTime() || 0)
            )
          })

      if (
        proximasFechas.length === 0
      ) {
        return '--:--'
      }

      return (
        proximasFechas[0]
          .recordatorio.hora
      )

    }, [
      recordatoriosOrdenados,
      reloj
    ])

  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        recordatoriosOrdenados.length /
          RECORDATORIOS_POR_PAGINA
      )
    )

  const indiceInicio =
    (paginaActual - 1) *
    RECORDATORIOS_POR_PAGINA

  const indiceFin =
    indiceInicio +
    RECORDATORIOS_POR_PAGINA

  const recordatoriosPaginados =
    recordatoriosOrdenados.slice(
      indiceInicio,
      indiceFin
    )

  const mitadBotones =
    Math.floor(
      cantidadBotonesPaginacion / 2
    )

  let inicioPaginasVisibles =
    paginaActual - mitadBotones

  if (inicioPaginasVisibles < 1) {
    inicioPaginasVisibles = 1
  }

  let finPaginasVisibles =
    inicioPaginasVisibles +
    cantidadBotonesPaginacion -
    1

  if (
    finPaginasVisibles >
    totalPaginas
  ) {
    finPaginasVisibles =
      totalPaginas

    inicioPaginasVisibles =
      Math.max(
        1,
        finPaginasVisibles -
          cantidadBotonesPaginacion +
          1
      )
  }

  const paginasVisibles =
    Array.from(
      {
        length:
          finPaginasVisibles -
          inicioPaginasVisibles +
          1
      },
      (_, index) => {
        return (
          inicioPaginasVisibles +
          index
        )
      }
    )

  function cambiarPagina(
    numeroPagina: number
  ) {
    if (
      numeroPagina < 1 ||
      numeroPagina > totalPaginas
    ) {
      return
    }

    setPaginaActual(numeroPagina)

    window.setTimeout(() => {
      document
        .querySelector(
          '.lista-alarmas'
        )
        ?.scrollIntoView({
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

    window.addEventListener(
      'resize',
      actualizarCantidadBotones
    )

    return () => {
      window.removeEventListener(
        'resize',
        actualizarCantidadBotones
      )
    }
  }, [])

  useEffect(() => {
    if (
      paginaActual > totalPaginas
    ) {
      setPaginaActual(totalPaginas)
    }
  }, [
    paginaActual,
    totalPaginas
  ])

  useEffect(() => {
    cargarRecordatorios()
  }, [])

  useEffect(() => {
    function manejarEscape(
      event: KeyboardEvent
    ) {
      if (event.key === 'Escape') {
        cerrarModal()
        cerrarModalPremium()

        setRecordatorioConfirmandoEliminar(
          null
        )
      }
    }

    document.addEventListener(
      'keydown',
      manejarEscape
    )

    return () => {
      document.removeEventListener(
        'keydown',
        manejarEscape
      )
    }
  }, [])

  useEffect(() => {
    const intervalo =
      window.setInterval(() => {
        setReloj(Date.now())
      }, 30000)

    return () => {
      window.clearInterval(intervalo)
    }
  }, [])

  return {
    recordatorios,
    recordatoriosOrdenados,
    recordatoriosPaginados,

    totalRecordatorios,
    totalActivos,
    proximoRecordatorio,

    estadoSuscripcion,
    esUsuarioPremium,
    esUsuarioFree,

    limiteTotalRecordatoriosFree:
      LIMITE_TOTAL_RECORDATORIOS_FREE,

    creacionBloqueadaFree,
    espaciosDisponiblesFree,

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
    cambiarDiaFormulario,

    modalActivo,
    modalPremiumActivo,
    tituloModal,

    cerrarModal,
    cerrarModalDesdeFondo,

    abrirModalPremium,
    cerrarModalPremium,
    cerrarModalPremiumDesdeFondo,

    recordatorioConfirmandoEliminar,

    toasts,
    cerrarToast,

    cargando,

    abrirModalCrear,
    abrirModalEditar,
    guardarRecordatorio,

    eliminarRecordatorio,
    eliminarRecordatorioDesdeModal,
    confirmarEliminarRecordatorio,
    cancelarEliminarRecordatorio,

    cambiarEstado,
    cargarRecordatorios
  }
}