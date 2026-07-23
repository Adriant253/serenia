import { Router } from 'express'

import pool from '../db.js'
import { enviarCorreo, correoConfigurado } from '../mail.js'
import {
    esErrorConexionDb,
    mensajeErrorBd
} from '../dbErrors.js'

export const organizarPrioridadesRouter = Router()

let intervaloCorreoOrganizar = null

/*
|--------------------------------------------------------------------------
| FUNCIONES AUXILIARES
|--------------------------------------------------------------------------
*/

function convertirVacioANull(valor) {
    if (valor === undefined || valor === null || valor === '') {
        return null
    }

    return valor
}

function responderErrorServidor(res, error) {
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
        new Date().toLocaleString('en-US', {
            timeZone: 'America/Mexico_City'
        })
    )

    const anio = ahoraMexico.getFullYear()
    const mes = String(ahoraMexico.getMonth() + 1).padStart(2, '0')
    const dia = String(ahoraMexico.getDate()).padStart(2, '0')

    return {
        fechaActual: `${anio}-${mes}-${dia}`
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

function obtenerTextoFecha(fecha) {
    if (!fecha) {
        return 'Sin fecha'
    }

    return String(fecha).slice(0, 10)
}

/*
|--------------------------------------------------------------------------
| ORGANIZAR PRIORIDADES - GUARDAR TAREA
|--------------------------------------------------------------------------
*/

organizarPrioridadesRouter.post('/guardar', async (req, res) => {

    try {

        const {
            titulo,
            descripcion,
            fechaInicio,
            fecha,
            prioridad,
            estado,
            Usuarios_id_usuario,
            notificar_vencimiento
        } = req.body

        const [resultado] = await pool.query(
            'CALL spGuardarOrganizarPrioridades(?, ?, ?, ?, ?, ?, ?, ?)',
            [
                convertirVacioANull(titulo),
                convertirVacioANull(descripcion),
                convertirVacioANull(fechaInicio),
                convertirVacioANull(fecha),
                convertirVacioANull(prioridad),
                convertirVacioANull(estado),
                convertirVacioANull(Usuarios_id_usuario),
                convertirVacioANull(notificar_vencimiento)
            ]
        )

        res.json(resultado[0][0])

    } catch (error) {

        responderErrorServidor(res, error)

    }

})

/*
|--------------------------------------------------------------------------
| ORGANIZAR PRIORIDADES - LISTAR POR USUARIO
|--------------------------------------------------------------------------
*/

organizarPrioridadesRouter.get('/usuario/:id_usuario', async (req, res) => {

    try {

        const { id_usuario } = req.params

        const [resultado] = await pool.query(
            'CALL spMostrarOrganizarPrioridadesUsuario(?)',
            [id_usuario]
        )

        const datos = resultado[0]

        if (datos.length === 1 && Number(datos[0].success) === 0) {
            return res.json(datos[0])
        }

        res.json({
            success: 1,
            mensaje: 'Datos obtenidos correctamente',
            datos
        })

    } catch (error) {

        responderErrorServidor(res, error)

    }

})

/*
|--------------------------------------------------------------------------
| ORGANIZAR PRIORIDADES - EDITAR TAREA
|--------------------------------------------------------------------------
*/

organizarPrioridadesRouter.put('/editar', async (req, res) => {

    try {

        const {
            id_tarea,
            titulo,
            descripcion,
            fechaInicio,
            fecha,
            prioridad,
            estado,
            Usuarios_id_usuario,
            notificar_vencimiento
        } = req.body

        const [resultado] = await pool.query(
            'CALL spEditarOrganizarPrioridades(?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                convertirVacioANull(id_tarea),
                convertirVacioANull(titulo),
                convertirVacioANull(descripcion),
                convertirVacioANull(fechaInicio),
                convertirVacioANull(fecha),
                convertirVacioANull(prioridad),
                convertirVacioANull(estado),
                convertirVacioANull(Usuarios_id_usuario),
                convertirVacioANull(notificar_vencimiento)
            ]
        )

        res.json(resultado[0][0])

    } catch (error) {

        responderErrorServidor(res, error)

    }

})

/*
|--------------------------------------------------------------------------
| ORGANIZAR PRIORIDADES - ELIMINAR TAREA
|--------------------------------------------------------------------------
*/

organizarPrioridadesRouter.delete('/eliminar', async (req, res) => {

    try {

        const {
            id_tarea,
            Usuarios_id_usuario
        } = req.body

        const [resultado] = await pool.query(
            'CALL spEliminarOrganizarPrioridades(?, ?)',
            [
                convertirVacioANull(id_tarea),
                convertirVacioANull(Usuarios_id_usuario)
            ]
        )

        res.json(resultado[0][0])

    } catch (error) {

        responderErrorServidor(res, error)

    }

})

/*
|--------------------------------------------------------------------------
| ORGANIZAR PRIORIDADES - CORREO AUTOMÁTICO
|--------------------------------------------------------------------------
*/

export async function verificarTareasPorVencerCorreo() {
    const resultadoRevision = {
        revisadas: 0,
        enviadas: 0,
        errores: 0
    }

    try {

        if (!correoConfigurado()) {
            console.warn(
                'Correo no configurado. No se revisarán tareas por vencer.'
            )

            return resultadoRevision
        }

        const { fechaActual } = obtenerFechaHoraActualMexico()

        const [tareas] = await pool.query(
            `
            SELECT
                tareas_por_vencer.tipo_aviso,
                tareas_por_vencer.id_tarea,
                tareas_por_vencer.titulo,
                tareas_por_vencer.descripcion,
                tareas_por_vencer.fecha_inicio,
                tareas_por_vencer.fecha_limite,
                tareas_por_vencer.prioridad,
                tareas_por_vencer.estado,
                tareas_por_vencer.notificar_vencimiento,
                tareas_por_vencer.aviso_3_dias_enviado,
                tareas_por_vencer.aviso_dia_vencimiento_enviado,
                tareas_por_vencer.Usuarios_id_usuario,
                tareas_por_vencer.nombre_usuario,
                tareas_por_vencer.email,
                tareas_por_vencer.estado_suscripcion
            FROM
            (
                SELECT
                    'tres_dias' AS tipo_aviso,

                    op.id_tarea,
                    op.titulo,
                    op.descripcion,
                    DATE_FORMAT(op.fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
                    DATE_FORMAT(op.fecha_limite, '%Y-%m-%d') AS fecha_limite,
                    op.prioridad,
                    op.estado,
                    op.notificar_vencimiento,
                    op.aviso_3_dias_enviado,
                    op.aviso_dia_vencimiento_enviado,
                    op.Usuarios_id_usuario,

                    u.nombre AS nombre_usuario,
                    u.email,
                    LOWER(u.estado_suscripcion) AS estado_suscripcion

                FROM organizar_prioridades op
                INNER JOIN usuarios u
                    ON op.Usuarios_id_usuario = u.id_usuario

                WHERE op.estado = 'Pendiente'
                AND op.notificar_vencimiento = 1
                AND LOWER(u.estado_suscripcion) IN ('premium', 'premiun')
                AND u.email IS NOT NULL
                AND TRIM(u.email) <> ''
                AND DATEDIFF(op.fecha_limite, ?) = 3
                AND DATEDIFF(op.fecha_limite, op.fecha_inicio) > 5
                AND IFNULL(op.aviso_3_dias_enviado, 0) = 0

                UNION ALL

                SELECT
                    'dia_vencimiento' AS tipo_aviso,

                    op.id_tarea,
                    op.titulo,
                    op.descripcion,
                    DATE_FORMAT(op.fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
                    DATE_FORMAT(op.fecha_limite, '%Y-%m-%d') AS fecha_limite,
                    op.prioridad,
                    op.estado,
                    op.notificar_vencimiento,
                    op.aviso_3_dias_enviado,
                    op.aviso_dia_vencimiento_enviado,
                    op.Usuarios_id_usuario,

                    u.nombre AS nombre_usuario,
                    u.email,
                    LOWER(u.estado_suscripcion) AS estado_suscripcion

                FROM organizar_prioridades op
                INNER JOIN usuarios u
                    ON op.Usuarios_id_usuario = u.id_usuario

                WHERE op.estado = 'Pendiente'
                AND op.notificar_vencimiento = 1
                AND LOWER(u.estado_suscripcion) IN ('premium', 'premiun')
                AND u.email IS NOT NULL
                AND TRIM(u.email) <> ''
                AND DATEDIFF(op.fecha_limite, ?) = 0
                AND IFNULL(op.aviso_dia_vencimiento_enviado, 0) = 0
            ) AS tareas_por_vencer

            ORDER BY
                tareas_por_vencer.fecha_limite ASC,
                CASE tareas_por_vencer.prioridad
                    WHEN 'Alta' THEN 1
                    WHEN 'Media' THEN 2
                    WHEN 'Baja' THEN 3
                    ELSE 4
                END
            `,
            [
                fechaActual,
                fechaActual
            ]
        )

        resultadoRevision.revisadas = tareas.length

        if (tareas.length === 0) {
            return resultadoRevision
        }

        for (const tarea of tareas) {
            try {

                const esAvisoTresDias =
                    tarea.tipo_aviso === 'tres_dias'

                const asunto =
                    esAvisoTresDias
                        ? `Tu tarea está por vencer en 3 días: ${tarea.titulo}`
                        : `Tu tarea vence hoy: ${tarea.titulo}`

                const tituloAviso =
                    esAvisoTresDias
                        ? 'Tu tarea está por vencer en 3 días'
                        : 'Tu tarea vence hoy'

                const mensajeAviso =
                    esAvisoTresDias
                        ? 'Esta tarea tiene una duración mayor a 5 días, por eso te avisamos 3 días antes de su fecha límite.'
                        : 'Esta tarea llega hoy a su fecha límite.'

                const descripcionTarea =
                    tarea.descripcion ||
                    'Sin descripción registrada.'

                const fechaInicio =
                    obtenerTextoFecha(tarea.fecha_inicio)

                const fechaLimite =
                    obtenerTextoFecha(tarea.fecha_limite)

                await enviarCorreo({
                    from:
                        `Serenia <${process.env.MAIL_USER}>`,

                    to: tarea.email,

                    subject: asunto,

                    html: `
                        <div style="font-family: Arial, sans-serif; color: #172d32; padding: 20px;">
                            <h2 style="color: #2f9b78;">
                                Serenia - Organizador de Prioridades
                            </h2>

                            <p>
                                Hola <strong>${escaparHTMLCorreo(tarea.nombre_usuario)}</strong>.
                            </p>

                            <p>
                                ${escaparHTMLCorreo(mensajeAviso)}
                            </p>

                            <div style="background: #eefaf4; border-left: 6px solid #4ead92; padding: 15px; border-radius: 12px;">
                                <h3 style="margin: 0 0 8px; color: #172d32;">
                                    ${escaparHTMLCorreo(tituloAviso)}
                                </h3>

                                <p style="margin: 0 0 10px; color: #172d32;">
                                    <strong>Tarea:</strong>
                                    ${escaparHTMLCorreo(tarea.titulo)}
                                </p>

                                <p style="margin: 0 0 10px; color: #667085;">
                                    <strong>Descripción:</strong>
                                    ${escaparHTMLCorreo(descripcionTarea)}
                                </p>

                                <p style="margin: 0 0 10px; color: #667085;">
                                    <strong>Prioridad:</strong>
                                    ${escaparHTMLCorreo(tarea.prioridad)}
                                </p>

                                <p style="margin: 0 0 10px; color: #667085;">
                                    <strong>Fecha de inicio:</strong>
                                    ${escaparHTMLCorreo(fechaInicio)}
                                </p>

                                <p style="margin: 0; color: #2f9b78; font-weight: bold;">
                                    <strong>Fecha límite:</strong>
                                    ${escaparHTMLCorreo(fechaLimite)}
                                </p>
                            </div>

                            <p style="margin-top: 18px; color: #667085;">
                                Este aviso fue enviado porque activaste las notificaciones de vencimiento para esta tarea.
                            </p>
                        </div>
                    `,

                    text: `
Serenia - Organizador de Prioridades

Hola ${tarea.nombre_usuario}.

${mensajeAviso}

Tarea: ${tarea.titulo}
Descripción: ${descripcionTarea}
Prioridad: ${tarea.prioridad}
Fecha de inicio: ${fechaInicio}
Fecha límite: ${fechaLimite}

Este aviso fue enviado porque activaste las notificaciones de vencimiento para esta tarea.
                    `
                })

                if (esAvisoTresDias) {
                    await pool.query(
                        `
                        UPDATE organizar_prioridades
                        SET aviso_3_dias_enviado = 1
                        WHERE id_tarea = ?
                        `,
                        [
                            tarea.id_tarea
                        ]
                    )
                } else {
                    await pool.query(
                        `
                        UPDATE organizar_prioridades
                        SET aviso_dia_vencimiento_enviado = 1
                        WHERE id_tarea = ?
                        `,
                        [
                            tarea.id_tarea
                        ]
                    )
                }

                resultadoRevision.enviadas += 1

                console.log(
                    'Correo de tarea por vencer enviado:',
                    tarea.email,
                    'ID tarea:',
                    tarea.id_tarea,
                    'Tipo:',
                    tarea.tipo_aviso
                )

            } catch (errorCorreo) {

                resultadoRevision.errores += 1

                console.error(
                    'Error enviando correo de tarea por vencer:',
                    tarea.id_tarea,
                    errorCorreo.message
                )

            }
        }

        return resultadoRevision

    } catch (error) {

        resultadoRevision.errores += 1

        console.error(
            'Error verificando tareas por vencer:',
            error.message
        )

        return resultadoRevision

    }
}

/*
|--------------------------------------------------------------------------
| ORGANIZAR PRIORIDADES - PROBAR REVISIÓN DE CORREOS
|--------------------------------------------------------------------------
*/

organizarPrioridadesRouter.post('/revisar-correos', async (req, res) => {

    try {

        const resultado =
            await verificarTareasPorVencerCorreo()

        res.json({
            success: 1,
            mensaje: 'Revisión de correos ejecutada',
            resultado
        })

    } catch (error) {

        responderErrorServidor(res, error)

    }

})

/*
|--------------------------------------------------------------------------
| ORGANIZAR PRIORIDADES - INICIAR INTERVALO
|--------------------------------------------------------------------------
*/

export function iniciarCorreoOrganizarPrioridades() {
    if (intervaloCorreoOrganizar) {
        return
    }

    if (process.env.ORGANIZAR_CORREO_ACTIVO === 'false') {
        console.log(
            'Correo automático de Organizar Prioridades desactivado.'
        )
        return
    }

    intervaloCorreoOrganizar = setInterval(
        verificarTareasPorVencerCorreo,
        60000
    )

    setTimeout(
        verificarTareasPorVencerCorreo,
        5000
    )

    console.log(
        'Correo automático de Organizar Prioridades iniciado.'
    )
}