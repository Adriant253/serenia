import { Router } from 'express'

import pool from '../db.js'
import {
    enviarCorreo,
    correoConfigurado
} from '../mail.js'

import {
    esErrorConexionDb,
    mensajeErrorBd
} from '../dbErrors.js'

export const recordatoriosDescansoRouter =
    Router()

let intervaloCorreoRecordatorios = null
let revisionCorreoEnCurso = false

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

function convertirDias(
    dias,
    diasSemana
) {
    if (Array.isArray(dias)) {
        return [...new Set(dias)]
            .map((dia) => Number(dia))
            .filter((dia) => {
                return (
                    Number.isInteger(dia) &&
                    dia >= 0 &&
                    dia <= 6
                )
            })
            .sort((a, b) => a - b)
            .join(',')
    }

    return convertirVacioANull(
        diasSemana
    )
}

function responderErrorServidor(
    res,
    error
) {
    console.error(error)

    if (esErrorConexionDb(error)) {
        return res.status(503).json({
            success: 0,
            mensaje: mensajeErrorBd(error)
        })
    }

    return res.status(500).json({
        success: 0,
        mensaje: 'Error interno del servidor'
    })
}

function obtenerFechaHoraActualMexico() {
    const ahoraMexico = new Date(
        new Date().toLocaleString(
            'en-US',
            {
                timeZone:
                    'America/Mexico_City'
            }
        )
    )

    const anio =
        ahoraMexico.getFullYear()

    const mes =
        String(
            ahoraMexico.getMonth() + 1
        ).padStart(2, '0')

    const dia =
        String(
            ahoraMexico.getDate()
        ).padStart(2, '0')

    const hora =
        String(
            ahoraMexico.getHours()
        ).padStart(2, '0')

    const minuto =
        String(
            ahoraMexico.getMinutes()
        ).padStart(2, '0')

    return {
        diaSemana:
            ahoraMexico.getDay(),

        horaActual:
            `${hora}:${minuto}:00`,

        claveEnvioMinuto:
            `${anio}-${mes}-${dia} ${hora}:${minuto}`,

        claveEnvioCompleta:
            `${anio}-${mes}-${dia} ${hora}:${minuto}:00`
    }
}

function escaparHTMLCorreo(texto) {
    return String(texto ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

/*
|--------------------------------------------------------------------------
| RECORDATORIOS DESCANSO - GUARDAR
|--------------------------------------------------------------------------
*/

recordatoriosDescansoRouter.post(
    '/guardar',
    async (req, res) => {

        try {

            const {
                hora,
                nombre,
                mensaje,
                dias_semana,
                dias,
                estado,
                Usuarios_id_usuario
            } = req.body

            const diasConvertidos =
                convertirDias(
                    dias,
                    dias_semana
                )

            const [resultado] =
                await pool.query(
                    `
                    CALL spGuardarRecordatorioDescanso(
                        ?, ?, ?, ?, ?, ?
                    )
                    `,
                    [
                        convertirVacioANull(
                            hora
                        ),

                        convertirVacioANull(
                            nombre
                        ),

                        convertirVacioANull(
                            mensaje
                        ),

                        convertirVacioANull(
                            diasConvertidos
                        ),

                        convertirVacioANull(
                            estado
                        ),

                        convertirVacioANull(
                            Usuarios_id_usuario
                        )
                    ]
                )

            res.json(
                resultado[0][0]
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
| RECORDATORIOS DESCANSO - LISTAR POR USUARIO
|--------------------------------------------------------------------------
*/

recordatoriosDescansoRouter.get(
    '/usuario/:id_usuario',
    async (req, res) => {

        try {

            const {
                id_usuario
            } = req.params

            const [resultado] =
                await pool.query(
                    `
                    CALL spMostrarRecordatoriosDescansoUsuario(
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
                resultado[0]

            if (
                datos.length === 1 &&
                Number(
                    datos[0].success
                ) === 0
            ) {
                return res.json(
                    datos[0]
                )
            }

            res.json({
                success: 1,
                mensaje:
                    'Recordatorios obtenidos correctamente',
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
| RECORDATORIOS DESCANSO - EDITAR
|--------------------------------------------------------------------------
*/

recordatoriosDescansoRouter.put(
    '/editar',
    async (req, res) => {

        try {

            const {
                id_recordatorio,
                hora,
                nombre,
                mensaje,
                dias_semana,
                dias,
                estado,
                Usuarios_id_usuario
            } = req.body

            const diasConvertidos =
                convertirDias(
                    dias,
                    dias_semana
                )

            const [resultado] =
                await pool.query(
                    `
                    CALL spEditarRecordatorioDescanso(
                        ?, ?, ?, ?, ?, ?, ?
                    )
                    `,
                    [
                        convertirVacioANull(
                            id_recordatorio
                        ),

                        convertirVacioANull(
                            hora
                        ),

                        convertirVacioANull(
                            nombre
                        ),

                        convertirVacioANull(
                            mensaje
                        ),

                        convertirVacioANull(
                            diasConvertidos
                        ),

                        convertirVacioANull(
                            estado
                        ),

                        convertirVacioANull(
                            Usuarios_id_usuario
                        )
                    ]
                )

            res.json(
                resultado[0][0]
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
| RECORDATORIOS DESCANSO - ELIMINAR
|--------------------------------------------------------------------------
*/

recordatoriosDescansoRouter.delete(
    '/eliminar',
    async (req, res) => {

        try {

            const {
                id_recordatorio,
                Usuarios_id_usuario
            } = req.body

            const [resultado] =
                await pool.query(
                    `
                    CALL spEliminarRecordatorioDescanso(
                        ?, ?
                    )
                    `,
                    [
                        convertirVacioANull(
                            id_recordatorio
                        ),

                        convertirVacioANull(
                            Usuarios_id_usuario
                        )
                    ]
                )

            res.json(
                resultado[0][0]
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
| RECORDATORIOS DESCANSO - CORREO AUTOMÁTICO
|--------------------------------------------------------------------------
*/

export async function verificarRecordatoriosDescansoCorreo() {
    const resultadoRevision = {
        revisados: 0,
        enviados: 0,
        errores: 0
    }

    if (revisionCorreoEnCurso) {
        return resultadoRevision
    }

    revisionCorreoEnCurso = true

    try {

        if (!correoConfigurado()) {
            console.warn(
                'Correo no configurado. No se revisarán recordatorios.'
            )

            return resultadoRevision
        }

        const {
            diaSemana,
            horaActual,
            claveEnvioMinuto,
            claveEnvioCompleta
        } =
            obtenerFechaHoraActualMexico()

        const [recordatorios] =
            await pool.query(
                `
                SELECT
                    rd.id_recordatorio,

                    TIME_FORMAT(
                        rd.hora,
                        '%H:%i:%s'
                    ) AS hora,

                    rd.nombre,
                    rd.mensaje,
                    rd.dias_semana,
                    rd.estado,
                    rd.ultimo_envio,
                    rd.Usuarios_id_usuario,

                    u.nombre AS nombre_usuario,
                    u.email

                FROM recordatorios_descanso rd

                INNER JOIN usuarios u
                    ON rd.Usuarios_id_usuario =
                       u.id_usuario

                WHERE rd.estado = 'activo'

                AND FIND_IN_SET(
                    ?,
                    rd.dias_semana
                ) > 0

                AND TIME_FORMAT(
                    rd.hora,
                    '%H:%i:%s'
                ) = ?

                AND u.email IS NOT NULL
                AND TRIM(u.email) <> ''

                AND (
                    rd.ultimo_envio IS NULL

                    OR DATE_FORMAT(
                        rd.ultimo_envio,
                        '%Y-%m-%d %H:%i'
                    ) <> ?
                )

                ORDER BY
                    rd.hora ASC,
                    rd.id_recordatorio ASC
                `,
                [
                    diaSemana,
                    horaActual,
                    claveEnvioMinuto
                ]
            )

        resultadoRevision.revisados =
            recordatorios.length

        if (
            recordatorios.length === 0
        ) {
            return resultadoRevision
        }

        for (
            const recordatorio
            of recordatorios
        ) {
            try {

                const mensajeRecordatorio =
                    recordatorio.mensaje ||
                    'Es momento de tomar un descanso y despejar la mente.'

                await enviarCorreo({
                    from:
                        `Serenia <${process.env.MAIL_USER}>`,

                    to:
                        recordatorio.email,

                    subject:
                        `Recordatorio de descanso: ${recordatorio.nombre}`,

                    html: `
                        <div style="font-family: Arial, sans-serif; color: #172d32; padding: 20px;">
                            <h2 style="color: #2f9b78;">
                                Serenia - Recordatorio para descanso
                            </h2>

                            <p>
                                Hola
                                <strong>
                                    ${escaparHTMLCorreo(recordatorio.nombre_usuario)}
                                </strong>.
                            </p>

                            <p>
                                Ha llegado la hora de tu recordatorio:
                            </p>

                            <div style="background: #eefaf4; border-left: 6px solid #4ead92; padding: 15px; border-radius: 12px;">
                                <h3 style="margin: 0 0 8px; color: #172d32;">
                                    ${escaparHTMLCorreo(recordatorio.nombre)}
                                </h3>

                                <p style="margin: 0; color: #667085;">
                                    ${escaparHTMLCorreo(mensajeRecordatorio)}
                                </p>

                                <p style="margin: 12px 0 0; font-weight: bold; color: #2f9b78;">
                                    Hora programada:
                                    ${escaparHTMLCorreo(recordatorio.hora)}
                                </p>
                            </div>

                            <p style="margin-top: 18px; color: #667085;">
                                Toma un momento para respirar,
                                estirarte o descansar la vista.
                            </p>
                        </div>
                    `,

                    text: `
Serenia - Recordatorio para descanso

Hola ${recordatorio.nombre_usuario}.

Ha llegado la hora de tu recordatorio:

${recordatorio.nombre}

${mensajeRecordatorio}

Hora programada: ${recordatorio.hora}

Toma un momento para respirar, estirarte o descansar la vista.
                    `
                })

                await pool.query(
                    `
                    UPDATE recordatorios_descanso
                    SET ultimo_envio = ?
                    WHERE id_recordatorio = ?
                    `,
                    [
                        claveEnvioCompleta,
                        recordatorio
                            .id_recordatorio
                    ]
                )

                resultadoRevision.enviados += 1

                console.log(
                    'Correo de recordatorio enviado:',
                    recordatorio.email,
                    'ID:',
                    recordatorio.id_recordatorio
                )

            } catch (errorCorreo) {

                resultadoRevision.errores += 1

                console.error(
                    'Error enviando recordatorio:',
                    recordatorio.id_recordatorio,
                    errorCorreo.message
                )

            }
        }

        return resultadoRevision

    } catch (error) {

        resultadoRevision.errores += 1

        console.error(
            'Error verificando recordatorios de descanso:',
            error.message
        )

        return resultadoRevision

    } finally {

        revisionCorreoEnCurso = false

    }
}

/*
|--------------------------------------------------------------------------
| RECORDATORIOS DESCANSO - PROBAR CORREOS
|--------------------------------------------------------------------------
*/

recordatoriosDescansoRouter.post(
    '/revisar-correos',
    async (req, res) => {

        try {

            const resultado =
                await verificarRecordatoriosDescansoCorreo()

            res.json({
                success: 1,
                mensaje:
                    'Revisión de recordatorios ejecutada',
                resultado
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
| RECORDATORIOS DESCANSO - INICIAR INTERVALO
|--------------------------------------------------------------------------
*/

export function iniciarCorreoRecordatoriosDescanso() {
    if (
        intervaloCorreoRecordatorios
    ) {
        return
    }

    if (
        process.env
            .RECORDATORIOS_CORREO_ACTIVO ===
        'false'
    ) {
        console.log(
            'Correo automático de Recordatorios desactivado.'
        )

        return
    }

    intervaloCorreoRecordatorios =
        setInterval(
            verificarRecordatoriosDescansoCorreo,
            60000
        )

    setTimeout(
        verificarRecordatoriosDescansoCorreo,
        5000
    )

    console.log(
        'Correo automático de Recordatorios iniciado.'
    )
}