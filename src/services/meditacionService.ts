import {
  mensajeErrorRed
} from '../config/api'

import {
  parseJsonResponse
} from '../config/parseJsonResponse'

const API_BASE=
  'https://serenia-api.onrender.com'

export type EstadoSuscripcionMeditacion =
  | 'free'
  | 'premium'

export interface EstadoMeditacionServidor {
  estadoSuscripcion:
    EstadoSuscripcionMeditacion

  esPremium: boolean

  sesionesUtilizadas:
    number | null

  sesionesDisponibles:
    number | null

  limiteSesiones:
    number | null

  estaBloqueado: boolean

  fechaBloqueo:
    string | null

  fechaDesbloqueo:
    string | null

  segundosParaDesbloqueo: number
}

export interface GuardarSesionMeditacion {
  duracion_programada_segundos: number
  duracion_real_segundos: number
  completado: 0 | 1
  fecha_inicio: string
  fecha_fin: string
  Usuarios_id_usuario: number
}

export interface RespuestaGuardarSesionMeditacion {
  exito: boolean
  campo: string | null
  mensaje: string
  idMeditacion: number | null
  estado: EstadoMeditacionServidor | null
}

export interface SesionHistorialMeditacion {
  id_meditacion: number
  duracion_programada_segundos: number
  duracion_real_segundos: number
  completado: 0 | 1
  fecha_inicio: string
  fecha_fin: string
  Usuarios_id_usuario: number
}

export interface RespuestaEliminarMeditacion {
  exito: boolean
  campo: string | null
  mensaje: string
  idMeditacion: number | null
}

const API_URL =
  API_BASE.replace(/\/+$/, '')

function construirUrl(
  ruta: string
): string {
  return `${API_URL}${ruta}`
}

function obtenerTexto(
  valor: unknown,
  valorPredeterminado = ''
): string {
  if (
    valor === undefined ||
    valor === null
  ) {
    return valorPredeterminado
  }

  return String(valor)
}

function obtenerTextoNullable(
  valor: unknown
): string | null {
  if (
    valor === undefined ||
    valor === null ||
    valor === ''
  ) {
    return null
  }

  return String(valor)
}

function obtenerNumero(
  valor: unknown,
  valorPredeterminado = 0
): number {
  const numero =
    Number(valor)

  return Number.isFinite(numero)
    ? numero
    : valorPredeterminado
}

function obtenerNumeroNullable(
  valor: unknown
): number | null {
  if (
    valor === undefined ||
    valor === null ||
    valor === ''
  ) {
    return null
  }

  const numero =
    Number(valor)

  return Number.isFinite(numero)
    ? numero
    : null
}

function obtenerEstadoSuscripcion(
  valor: unknown
): EstadoSuscripcionMeditacion {
  return obtenerTexto(valor)
    .trim()
    .toLowerCase() === 'premium'
    ? 'premium'
    : 'free'
}

function convertirEstadoMeditacion(
  datos: Record<string, unknown>
): EstadoMeditacionServidor | null {
  if (
    datos.estado_suscripcion ===
      undefined &&
    datos.es_premium ===
      undefined
  ) {
    return null
  }

  const estadoSuscripcion =
    obtenerEstadoSuscripcion(
      datos.estado_suscripcion
    )

  return {
    estadoSuscripcion,

    esPremium:
      obtenerNumero(
        datos.es_premium
      ) === 1 ||
      estadoSuscripcion ===
        'premium',

    sesionesUtilizadas:
      obtenerNumeroNullable(
        datos.sesiones_utilizadas
      ),

    sesionesDisponibles:
      obtenerNumeroNullable(
        datos.sesiones_disponibles
      ),

    limiteSesiones:
      obtenerNumeroNullable(
        datos.limite_sesiones
      ),

    estaBloqueado:
      obtenerNumero(
        datos.esta_bloqueado
      ) === 1,

    fechaBloqueo:
      obtenerTextoNullable(
        datos.fecha_bloqueo
      ),

    fechaDesbloqueo:
      obtenerTextoNullable(
        datos.fecha_desbloqueo
      ),

    segundosParaDesbloqueo:
      Math.max(
        0,
        obtenerNumero(
          datos
            .segundos_para_desbloqueo
        )
      )
  }
}

export async function obtenerEstadoMeditacion(
  idUsuario: number
): Promise<EstadoMeditacionServidor> {
  try {
    const response =
      await fetch(
        construirUrl(
          `/api/meditaciones/estado/${idUsuario}`
        ),
        {
          method: 'GET',

          headers: {
            'Content-Type':
              'application/json'
          }
        }
      )

    const datos =
      await parseJsonResponse(
        response,
        true
      )

    if (
      obtenerNumero(
        datos.success
      ) !== 1
    ) {
      throw new Error(
        obtenerTexto(
          datos.mensaje,
          'No se pudo obtener el estado de meditación'
        )
      )
    }

    const estado =
      convertirEstadoMeditacion(
        datos
      )

    if (!estado) {
      throw new Error(
        'La API no devolvió un estado de meditación válido'
      )
    }

    return estado

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function guardarSesionMeditacion(
  datosSesion:
    GuardarSesionMeditacion
): Promise<RespuestaGuardarSesionMeditacion> {
  try {
    const response =
      await fetch(
        construirUrl(
          '/api/meditaciones/guardar'
        ),
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              datosSesion
            )
        }
      )

    const datos =
      await parseJsonResponse(
        response,
        true
      )

    return {
      exito:
        obtenerNumero(
          datos.success
        ) === 1,

      campo:
        obtenerTextoNullable(
          datos.campo
        ),

      mensaje:
        obtenerTexto(
          datos.mensaje,
          'No se pudo guardar la sesión'
        ),

      idMeditacion:
        obtenerNumeroNullable(
          datos.id_meditacion
        ),

      estado:
        convertirEstadoMeditacion(
          datos
        )
    }

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function obtenerHistorialMeditacion(
  idUsuario: number
): Promise<SesionHistorialMeditacion[]> {
  try {
    const response =
      await fetch(
        construirUrl(
          `/api/meditaciones/historial/usuario/${idUsuario}`
        ),
        {
          method: 'GET',

          headers: {
            'Content-Type':
              'application/json'
          }
        }
      )

    const respuesta =
      await parseJsonResponse(
        response,
        true
      )

    if (
      obtenerNumero(
        respuesta.success
      ) !== 1
    ) {
      throw new Error(
        obtenerTexto(
          respuesta.mensaje,
          'No se pudo obtener el historial'
        )
      )
    }

    const datos =
      Array.isArray(
        respuesta.datos
      )
        ? respuesta.datos
        : []

    return datos
      .filter(
        (
          registro
        ): registro is Record<
          string,
          unknown
        > => {
          return (
            typeof registro ===
              'object' &&
            registro !== null
          )
        }
      )
      .map((registro) => ({
        id_meditacion:
          obtenerNumero(
            registro.id_meditacion
          ),

        duracion_programada_segundos:
          obtenerNumero(
            registro
              .duracion_programada_segundos
          ),

        duracion_real_segundos:
          obtenerNumero(
            registro
              .duracion_real_segundos
          ),

        completado:
          obtenerNumero(
            registro.completado
          ) === 1
            ? 1
            : 0,

        fecha_inicio:
          obtenerTexto(
            registro.fecha_inicio
          ),

        fecha_fin:
          obtenerTexto(
            registro.fecha_fin
          ),

        Usuarios_id_usuario:
          obtenerNumero(
            registro
              .Usuarios_id_usuario
          )
      }))

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function eliminarSesionMeditacion(
  idMeditacion: number,
  idUsuario: number
): Promise<RespuestaEliminarMeditacion> {
  try {
    const response =
      await fetch(
        construirUrl(
          '/api/meditaciones/historial/eliminar'
        ),
        {
          method: 'DELETE',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            id_meditacion:
              idMeditacion,

            Usuarios_id_usuario:
              idUsuario
          })
        }
      )

    const datos =
      await parseJsonResponse(
        response,
        true
      )

    return {
      exito:
        obtenerNumero(
          datos.success
        ) === 1,

      campo:
        obtenerTextoNullable(
          datos.campo
        ),

      mensaje:
        obtenerTexto(
          datos.mensaje,
          'No se pudo eliminar el registro'
        ),

      idMeditacion:
        obtenerNumeroNullable(
          datos.id_meditacion
        )
    }

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}