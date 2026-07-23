import {
    Router
} from 'express'

import pool from '../db.js'

import {
    esErrorConexionDb,
    mensajeErrorBd
} from '../dbErrors.js'

export const meditacionRouter =
    Router()

/*
|--------------------------------------------------------------------------
| FUNCIONES AUXILIARES
|--------------------------------------------------------------------------
*/

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

function responderErrorServidor(
    res,
    error
) {
    console.error(
        'Error en rutas de meditación:',
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

/*
|--------------------------------------------------------------------------
| MEDITACIÓN - COMPROBAR RUTA
|--------------------------------------------------------------------------
*/

meditacionRouter.get(
    '/test',
    (_req, res) => {

        res.json({
            success: 1,
            mensaje:
                'Rutas de meditación funcionando'
        })

    }
)

/*
|--------------------------------------------------------------------------
| MEDITACIÓN - OBTENER ESTADO FREE / PREMIUM
|--------------------------------------------------------------------------
|
| GET:
| /api/meditaciones/estado/:id_usuario
|
| Devuelve:
|
| - Plan del usuario.
| - Sesiones utilizadas.
| - Sesiones disponibles.
| - Estado de bloqueo.
| - Segundos para desbloqueo.
|
*/

meditacionRouter.get(
    '/estado/:id_usuario',
    async (req, res) => {

        try {

            const {
                id_usuario
            } = req.params

            const [resultado] =
                await pool.query(
                    `
                    CALL spObtenerEstadoMeditacion(
                        ?
                    )
                    `,
                    [
                        convertirVacioANull(
                            id_usuario
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
                        'La base de datos no devolvió el estado de meditación'
                })
            }

            res.json(
                respuesta
            )

        } catch (error) {

            responderErrorServidor(
                res,
                error
            )

        }

    }
)

/*
|--------------------------------------------------------------------------
| MEDITACIÓN - GUARDAR SESIÓN DEL TEMPORIZADOR
|--------------------------------------------------------------------------
|
| POST:
| /api/meditaciones/guardar
|
| Body:
|
| {
|   "duracion_programada_segundos": 30,
|   "duracion_real_segundos": 30,
|   "completado": 1,
|   "fecha_inicio": "2026-07-12 15:00:00",
|   "fecha_fin": "2026-07-12 15:00:30",
|   "Usuarios_id_usuario": 26
| }
|
*/

meditacionRouter.post(
    '/guardar',
    async (req, res) => {

        try {

            const {
                duracion_programada_segundos,
                duracion_real_segundos,
                completado,
                fecha_inicio,
                fecha_fin,
                Usuarios_id_usuario
            } = req.body

            const [resultado] =
                await pool.query(
                    `
                    CALL spGuardarMeditacionTemporizador(
                        ?, ?, ?, ?, ?, ?
                    )
                    `,
                    [
                        convertirVacioANull(
                            duracion_programada_segundos
                        ),

                        convertirVacioANull(
                            duracion_real_segundos
                        ),

                        convertirVacioANull(
                            completado
                        ),

                        convertirVacioANull(
                            fecha_inicio
                        ),

                        convertirVacioANull(
                            fecha_fin
                        ),

                        convertirVacioANull(
                            Usuarios_id_usuario
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
                        'La base de datos no devolvió el resultado del guardado'
                })
            }

            res.json(
                respuesta
            )

        } catch (error) {

            responderErrorServidor(
                res,
                error
            )

        }

    }
)

/*
|--------------------------------------------------------------------------
| MEDITACIÓN - CONSULTAR HISTORIAL
|--------------------------------------------------------------------------
|
| GET:
| /api/meditaciones/historial/usuario/:id_usuario
|
| Solamente Premium puede consultar el historial.
|
*/

meditacionRouter.get(
    '/historial/usuario/:id_usuario',
    async (req, res) => {

        try {

            const {
                id_usuario
            } = req.params

            const [resultado] =
                await pool.query(
                    `
                    CALL spObtenerHistorialMeditaciones(
                        ?
                    )
                    `,
                    [
                        convertirVacioANull(
                            id_usuario
                        )
                    ]
                )

            const datos =
                Array.isArray(
                    resultado?.[0]
                )
                    ? resultado[0]
                    : []

            /*
            |--------------------------------------------------------------
            | El procedimiento devuelve una fila de error para usuarios
            | Free, usuarios inexistentes o IDs inválidos.
            |--------------------------------------------------------------
            */

            if (
                datos.length === 1 &&
                Number(
                    datos[0]?.success
                ) === 0
            ) {
                return res.json(
                    datos[0]
                )
            }

            res.json({
                success: 1,

                mensaje:
                    'Historial de meditación obtenido correctamente',

                datos
            })

        } catch (error) {

            responderErrorServidor(
                res,
                error
            )

        }

    }
)

/*
|--------------------------------------------------------------------------
| MEDITACIÓN - ELIMINAR REGISTRO DEL HISTORIAL
|--------------------------------------------------------------------------
|
| DELETE:
| /api/meditaciones/historial/eliminar
|
| Body:
|
| {
|   "id_meditacion": 1,
|   "Usuarios_id_usuario": 26
| }
|
| Solamente Premium puede eliminar registros.
|
*/

meditacionRouter.delete(
    '/historial/eliminar',
    async (req, res) => {

        try {

            const {
                id_meditacion,
                Usuarios_id_usuario
            } = req.body

            const [resultado] =
                await pool.query(
                    `
                    CALL spEliminarMeditacionHistorial(
                        ?, ?
                    )
                    `,
                    [
                        convertirVacioANull(
                            id_meditacion
                        ),

                        convertirVacioANull(
                            Usuarios_id_usuario
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
                        'La base de datos no devolvió el resultado de la eliminación'
                })
            }

            res.json(
                respuesta
            )

        } catch (error) {

            responderErrorServidor(
                res,
                error
            )

        }

    }
)