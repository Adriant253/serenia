import {
    Router
} from 'express'

import pool from '../db.js'

import {
    esErrorConexionDb,
    mensajeErrorBd
} from '../dbErrors.js'

export const favoritosGuiasMeditacionRouter =
    Router()

function convertirVacioANull(valor) {
    if (
        valor === undefined ||
        valor === null ||
        valor === ''
    ) {
        return null
    }

    return valor
}

function obtenerPrimeraFila(
    resultado
) {
    const filas =
        resultado?.[0]

    if (
        !Array.isArray(filas) ||
        filas.length === 0
    ) {
        return null
    }

    return filas[0]
}

function responderErrorServidor(
    res,
    error
) {
    console.error(
        'Error en favoritos de guías de meditación:',
        error
    )

    if (esErrorConexionDb(error)) {
        return res.status(503).json({
            success: 0,
            mensaje:
                mensajeErrorBd(error)
        })
    }

    return res.status(500).json({
        success: 0,
        mensaje:
            'Error interno del servidor'
    })
}

/*
|--------------------------------------------------------------------------
| MOSTRAR FAVORITOS DEL USUARIO
|--------------------------------------------------------------------------
|
| GET:
| /api/meditaciones/guias/favoritos/usuario/:id_usuario
|
*/

favoritosGuiasMeditacionRouter.get(
    '/usuario/:id_usuario',
    async (req, res) => {

        try {

            const {
                id_usuario
            } = req.params

            const [resultado] =
                await pool.query(
                    `
                    CALL spMostrarFavoritosGuiasMeditacion(
                        ?
                    )
                    `,
                    [
                        convertirVacioANull(
                            id_usuario
                        )
                    ]
                )

            const filas =
                Array.isArray(
                    resultado?.[0]
                )
                    ? resultado[0]
                    : []

            if (
                filas.length === 1 &&
                Number(
                    filas[0]?.success
                ) === 0
            ) {
                return res.status(400).json(
                    filas[0]
                )
            }

            const datos =
                filas
                    .filter((fila) => (
                        Number(
                            fila?.success
                        ) === 1 &&
                        Number.isInteger(
                            Number(
                                fila?.id_guia
                            )
                        )
                    ))
                    .map((fila) => ({
                        id_guia:
                            Number(
                                fila.id_guia
                            ),

                        fecha_creacion:
                            fila.fecha_creacion ??
                            null
                    }))

            return res.json({
                success: 1,

                mensaje:
                    'Favoritos obtenidos correctamente.',

                datos
            })

        } catch (error) {

            return responderErrorServidor(
                res,
                error
            )

        }

    }
)

/*
|--------------------------------------------------------------------------
| AGREGAR FAVORITO
|--------------------------------------------------------------------------
|
| POST:
| /api/meditaciones/guias/favoritos/agregar
|
| Body:
|
| {
|   "Usuarios_id_usuario": 26,
|   "id_guia": 2
| }
|
*/

favoritosGuiasMeditacionRouter.post(
    '/agregar',
    async (req, res) => {

        try {

            const {
                Usuarios_id_usuario,
                id_guia
            } = req.body

            const [resultado] =
                await pool.query(
                    `
                    CALL spAgregarFavoritoGuiaMeditacion(
                        ?, ?
                    )
                    `,
                    [
                        convertirVacioANull(
                            Usuarios_id_usuario
                        ),

                        convertirVacioANull(
                            id_guia
                        )
                    ]
                )

            const respuesta =
                obtenerPrimeraFila(
                    resultado
                )

            if (!respuesta) {
                return res.status(500).json({
                    success: 0,

                    mensaje:
                        'La base de datos no devolvió el resultado del guardado.'
                })
            }

            const estadoHttp =
                Number(
                    respuesta.success
                ) === 1
                    ? 200
                    : 400

            return res
                .status(estadoHttp)
                .json(respuesta)

        } catch (error) {

            return responderErrorServidor(
                res,
                error
            )

        }

    }
)

/*
|--------------------------------------------------------------------------
| ELIMINAR FAVORITO
|--------------------------------------------------------------------------
|
| DELETE:
| /api/meditaciones/guias/favoritos/eliminar
|
| Body:
|
| {
|   "Usuarios_id_usuario": 26,
|   "id_guia": 2
| }
|
*/

favoritosGuiasMeditacionRouter.delete(
    '/eliminar',
    async (req, res) => {

        try {

            const {
                Usuarios_id_usuario,
                id_guia
            } = req.body

            const [resultado] =
                await pool.query(
                    `
                    CALL spEliminarFavoritoGuiaMeditacion(
                        ?, ?
                    )
                    `,
                    [
                        convertirVacioANull(
                            Usuarios_id_usuario
                        ),

                        convertirVacioANull(
                            id_guia
                        )
                    ]
                )

            const respuesta =
                obtenerPrimeraFila(
                    resultado
                )

            if (!respuesta) {
                return res.status(500).json({
                    success: 0,

                    mensaje:
                        'La base de datos no devolvió el resultado de la eliminación.'
                })
            }

            const estadoHttp =
                Number(
                    respuesta.success
                ) === 1
                    ? 200
                    : 400

            return res
                .status(estadoHttp)
                .json(respuesta)

        } catch (error) {

            return responderErrorServidor(
                res,
                error
            )

        }

    }
)