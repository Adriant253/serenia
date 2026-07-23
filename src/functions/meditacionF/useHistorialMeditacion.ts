import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  eliminarSesionMeditacion,
  obtenerHistorialMeditacion
} from '../../services/meditacionService'

import type {
  SesionHistorialMeditacion
} from '../../services/meditacionService'

import {
  describirDuracionMeditacion,
  formatearFechaHoraMeditacion,
  obtenerMarcaTiempoMeditacion
} from './meditacionUtils'

export type FiltroEstadoHistorial =
  | 'todos'
  | 'completadas'
  | 'interrumpidas'

export type OrdenHistorial =
  | 'recientes'
  | 'antiguas'
  | 'mayor-duracion'
  | 'menor-duracion'

interface UseHistorialMeditacionProps {
  idUsuario: number
  activo: boolean
}

export function useHistorialMeditacion({
  idUsuario,
  activo
}: UseHistorialMeditacionProps) {
  const [
    sesiones,
    setSesiones
  ] = useState<
    SesionHistorialMeditacion[]
  >([])

  const [
    cargando,
    setCargando
  ] = useState(false)

  const [
    error,
    setError
  ] = useState('')

  const [
    busqueda,
    setBusqueda
  ] = useState('')

  const [
    filtroEstado,
    setFiltroEstado
  ] = useState<FiltroEstadoHistorial>(
    'todos'
  )

  const [
    orden,
    setOrden
  ] = useState<OrdenHistorial>(
    'recientes'
  )

  const [
    sesionAEliminar,
    setSesionAEliminar
  ] = useState<
    SesionHistorialMeditacion | null
  >(null)

  const [
    eliminando,
    setEliminando
  ] = useState(false)

  const [
    mensajeAccion,
    setMensajeAccion
  ] = useState('')

  const cargarHistorial =
    useCallback(async () => {
      if (
        !idUsuario ||
        idUsuario <= 0
      ) {
        setSesiones([])

        setError(
          'No se encontró un usuario válido'
        )

        return
      }

      setCargando(true)
      setError('')
      setMensajeAccion('')

      try {
        const registros =
          await obtenerHistorialMeditacion(
            idUsuario
          )

        setSesiones(
          registros
        )
      } catch (errorObtenido) {
        setSesiones([])

        setError(
          errorObtenido instanceof Error
            ? errorObtenido.message
            : (
              'No se pudo consultar el historial'
            )
        )
      } finally {
        setCargando(false)
      }
    }, [idUsuario])

  useEffect(() => {
    if (!activo) {
      return
    }

    void cargarHistorial()
  }, [
    activo,
    cargarHistorial
  ])

  const sesionesFiltradas =
    useMemo(() => {
      const textoBusqueda =
        busqueda
          .trim()
          .toLowerCase()

      const filtradas =
        sesiones.filter(
          (sesion) => {
            const coincideEstado =
              filtroEstado === 'todos' ||
              (
                filtroEstado ===
                  'completadas' &&
                sesion.completado === 1
              ) ||
              (
                filtroEstado ===
                  'interrumpidas' &&
                sesion.completado === 0
              )

            if (!coincideEstado) {
              return false
            }

            if (!textoBusqueda) {
              return true
            }

            const estadoTexto =
              sesion.completado === 1
                ? 'completada completa'
                : (
                  'interrumpida finalizada ' +
                  'antes incompleta'
                )

            const contenidoBusqueda = [
              sesion.id_meditacion,
              describirDuracionMeditacion(
                sesion
                  .duracion_programada_segundos
              ),
              describirDuracionMeditacion(
                sesion
                  .duracion_real_segundos
              ),
              formatearFechaHoraMeditacion(
                sesion.fecha_inicio
              ),
              formatearFechaHoraMeditacion(
                sesion.fecha_fin
              ),
              estadoTexto
            ]
              .join(' ')
              .toLowerCase()

            return contenidoBusqueda
              .includes(
                textoBusqueda
              )
          }
        )

      return [...filtradas].sort(
        (sesionA, sesionB) => {
          if (
            orden ===
            'mayor-duracion'
          ) {
            return (
              sesionB
                .duracion_real_segundos -
              sesionA
                .duracion_real_segundos
            )
          }

          if (
            orden ===
            'menor-duracion'
          ) {
            return (
              sesionA
                .duracion_real_segundos -
              sesionB
                .duracion_real_segundos
            )
          }

          const fechaA =
            obtenerMarcaTiempoMeditacion(
              sesionA.fecha_fin
            )

          const fechaB =
            obtenerMarcaTiempoMeditacion(
              sesionB.fecha_fin
            )

          if (fechaA === fechaB) {
            return orden === 'antiguas'
              ? (
                sesionA.id_meditacion -
                sesionB.id_meditacion
              )
              : (
                sesionB.id_meditacion -
                sesionA.id_meditacion
              )
          }

          return orden === 'antiguas'
            ? fechaA - fechaB
            : fechaB - fechaA
        }
      )
    }, [
      busqueda,
      filtroEstado,
      orden,
      sesiones
    ])

  const estadisticas =
    useMemo(() => {
      const totalSesiones =
        sesiones.length

      const sesionesCompletadas =
        sesiones.filter(
          (sesion) =>
            sesion.completado === 1
        ).length

      const sesionesInterrumpidas =
        totalSesiones -
        sesionesCompletadas

      const totalSegundos =
        sesiones.reduce(
          (
            acumulado,
            sesion
          ) => {
            return (
              acumulado +
              sesion
                .duracion_real_segundos
            )
          },
          0
        )

      const promedioSegundos =
        totalSesiones > 0
          ? Math.round(
            totalSegundos /
            totalSesiones
          )
          : 0

      return {
        totalSesiones,
        sesionesCompletadas,
        sesionesInterrumpidas,
        totalSegundos,
        promedioSegundos
      }
    }, [sesiones])

  function cambiarBusqueda(
    valor: string
  ) {
    setBusqueda(valor)
  }

  function cambiarFiltroEstado(
    valor: FiltroEstadoHistorial
  ) {
    setFiltroEstado(valor)
  }

  function cambiarOrden(
    valor: OrdenHistorial
  ) {
    setOrden(valor)
  }

  function limpiarFiltros() {
    setBusqueda('')
    setFiltroEstado('todos')
    setOrden('recientes')
  }

  function solicitarEliminacion(
    sesion:
      SesionHistorialMeditacion
  ) {
    setSesionAEliminar(
      sesion
    )

    setMensajeAccion('')
  }

  function cancelarEliminacion() {
    if (eliminando) {
      return
    }

    setSesionAEliminar(null)
  }

  async function confirmarEliminacion() {
    if (
      !sesionAEliminar ||
      eliminando
    ) {
      return
    }

    setEliminando(true)
    setError('')
    setMensajeAccion('')

    try {
      const respuesta =
        await eliminarSesionMeditacion(
          sesionAEliminar
            .id_meditacion,
          idUsuario
        )

      if (!respuesta.exito) {
        throw new Error(
          respuesta.mensaje
        )
      }

      setSesiones(
        (sesionesActuales) =>
          sesionesActuales.filter(
            (sesion) =>
              sesion.id_meditacion !==
              sesionAEliminar
                .id_meditacion
          )
      )

      setMensajeAccion(
        respuesta.mensaje
      )

      setSesionAEliminar(null)
    } catch (errorObtenido) {
      setError(
        errorObtenido instanceof Error
          ? errorObtenido.message
          : (
            'No se pudo eliminar la sesión'
          )
      )
    } finally {
      setEliminando(false)
    }
  }

  return {
    sesiones,
    sesionesFiltradas,
    estadisticas,

    cargando,
    error,
    mensajeAccion,

    busqueda,
    filtroEstado,
    orden,

    sesionAEliminar,
    eliminando,

    cargarHistorial,
    cambiarBusqueda,
    cambiarFiltroEstado,
    cambiarOrden,
    limpiarFiltros,

    solicitarEliminacion,
    cancelarEliminacion,
    confirmarEliminacion
  }
}