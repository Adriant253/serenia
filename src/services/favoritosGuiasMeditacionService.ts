import {
  API_BASE,
  mensajeErrorRed
} from '../config/api'

import {
  parseJsonResponse
} from '../config/parseJsonResponse'

const API_URL =
  API_BASE.replace(/\/+$/, '')

export interface RespuestaFavoritoGuia {
  exito: boolean
  mensaje: string
  idGuia: number | null
}

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

export async function obtenerFavoritosGuiasMeditacion(
  idUsuario: number
): Promise<number[]> {
  try {
    const response = await fetch(
      construirUrl(
        `/api/meditaciones/guias/favoritos/usuario/${idUsuario}`
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
      !response.ok ||
      obtenerNumero(
        respuesta.success
      ) !== 1
    ) {
      throw new Error(
        obtenerTexto(
          respuesta.mensaje,
          'No se pudieron obtener las guías favoritas.'
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
      .map((registro) => {
        if (
          typeof registro !== 'object' ||
          registro === null
        ) {
          return null
        }

        return obtenerNumeroNullable(
          (
            registro as Record<
              string,
              unknown
            >
          ).id_guia
        )
      })
      .filter(
        (
          idGuia
        ): idGuia is number =>
          idGuia !== null &&
          idGuia > 0
      )

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function agregarFavoritoGuiaMeditacion(
  idUsuario: number,
  idGuia: number
): Promise<RespuestaFavoritoGuia> {
  try {
    const response = await fetch(
      construirUrl(
        '/api/meditaciones/guias/favoritos/agregar'
      ),
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          Usuarios_id_usuario:
            idUsuario,

          id_guia:
            idGuia
        })
      }
    )

    const respuesta =
      await parseJsonResponse(
        response,
        true
      )

    const exito =
      response.ok &&
      obtenerNumero(
        respuesta.success
      ) === 1

    return {
      exito,

      mensaje:
        obtenerTexto(
          respuesta.mensaje,
          exito
            ? 'La guía se agregó a favoritos.'
            : 'No se pudo agregar la guía a favoritos.'
        ),

      idGuia:
        obtenerNumeroNullable(
          respuesta.id_guia
        )
    }

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}

export async function eliminarFavoritoGuiaMeditacion(
  idUsuario: number,
  idGuia: number
): Promise<RespuestaFavoritoGuia> {
  try {
    const response = await fetch(
      construirUrl(
        '/api/meditaciones/guias/favoritos/eliminar'
      ),
      {
        method: 'DELETE',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          Usuarios_id_usuario:
            idUsuario,

          id_guia:
            idGuia
        })
      }
    )

    const respuesta =
      await parseJsonResponse(
        response,
        true
      )

    const exito =
      response.ok &&
      obtenerNumero(
        respuesta.success
      ) === 1

    return {
      exito,

      mensaje:
        obtenerTexto(
          respuesta.mensaje,
          exito
            ? 'La guía se quitó de favoritos.'
            : 'No se pudo quitar la guía de favoritos.'
        ),

      idGuia:
        obtenerNumeroNullable(
          respuesta.id_guia
        )
    }

  } catch (error) {
    throw new Error(
      mensajeErrorRed(error)
    )
  }
}