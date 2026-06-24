import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import { enviarCorreo, correoConfigurado } from './mail.js'
import pool from './db.js'
import { asegurarRecuperacionContrasena } from './setupRecuperacion.js'
import {
    verificarTokenGoogle,
    loginORegistrarGoogle
} from './googleAuth.js'
import { validarEmailServidor } from './validations.js'
import { normalizarRespuestaAuth } from './messages.js'
import {
    esErrorConexionDb,
    mensajeErrorBd
} from './dbErrors.js'
import {
    imprimirEstadoEntorno,
    revisarVariablesEntorno,
    correoListo
} from './envConfig.js'

import recuperarContrasenaTemplate
from './templates/recuperarContrasenaTemplate.js'

const app = express()

const puerto = Number(process.env.PORT) || 3000

const origenesPermitidos = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
].filter(Boolean)

function origenPermitido(origin) {
    if (!origin) {
        return true
    }

    if (origenesPermitidos.includes(origin)) {
        return true
    }

    try {
        const { hostname } = new URL(origin)
        return hostname.endsWith('.vercel.app')
    } catch {
        return false
    }
}

app.use(cors({
    origin(origin, callback) {
        if (origenPermitido(origin)) {
            callback(null, true)
            return
        }

        callback(null, false)
    }
}))
app.use(express.json())

imprimirEstadoEntorno()

try {
    await asegurarRecuperacionContrasena(pool)
} catch (error) {
    console.warn(
        'Advertencia: no se pudo verificar la base de datos al iniciar:',
        error.code || error.message
    )
    console.warn(
        'La API arrancará, pero los endpoints que usen la BD fallarán hasta que haya conexión.'
    )
}

/*
|--------------------------------------------------------------------------
| PRUEBA
|--------------------------------------------------------------------------
*/

app.get('/test', (req, res) => {

    res.json({
        mensaje: 'API funcionando'
    })

})

app.get('/api/health', async (req, res) => {

    const env = revisarVariablesEntorno()

    try {
        await pool.query('SELECT 1')
        res.json({
            ok: true,
            db: true,
            env: {
                listo: env.listo,
                faltantes: env.faltantes,
                correo: correoListo()
            }
        })
    } catch (error) {
        res.status(503).json({
            ok: false,
            db: false,
            mensaje: mensajeErrorBd(error),
            env: {
                listo: env.listo,
                faltantes: env.faltantes,
                correo: correoListo()
            }
        })
    }

})

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

app.post('/api/login', async (req, res) => {

    try {

        const {
            email,
            contrasena
        } = req.body

        const emailError =
            validarEmailServidor(email)

        if (emailError) {
            return res.status(400).json({
                success: 0,
                campo: 'email',
                mensaje: emailError
            })
        }

        if (!contrasena?.trim()) {
            return res.status(400).json({
                success: 0,
                campo: 'contrasena',
                mensaje: 'Ingresa tu contraseña'
            })
        }

        const emailNorm = email.trim().toLowerCase()

        const [usuarios] = await pool.query(
            `SELECT
                id_usuario,
                nombre,
                email,
                contrasena,
                estado_suscripcion,
                fecha_nacimiento,
                fecha_registro
             FROM usuarios
             WHERE LOWER(TRIM(email)) = ?
             LIMIT 1`,
            [emailNorm]
        )

        if (usuarios.length === 0) {
            return res.json({
                success: 0,
                campo: 'email',
                mensaje:
                    'No encontramos una cuenta con ese correo. Revisa que esté bien escrito.'
            })
        }

        const usuario = usuarios[0]

        if (usuario.contrasena !== contrasena) {
            return res.json({
                success: 0,
                campo: 'contrasena',
                mensaje:
                    'La contraseña no es correcta. Vuelve a intentarlo.'
            })
        }

        res.json({
            success: 1,
            mensaje: 'Inicio de sesión correcto',
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            email: usuario.email,
            estado_suscripcion:
                usuario.estado_suscripcion,
            fecha_nacimiento:
                usuario.fecha_nacimiento,
            fecha_registro: usuario.fecha_registro
        })

    } catch (error) {

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

})

/*
|--------------------------------------------------------------------------
| GOOGLE AUTH
|--------------------------------------------------------------------------
*/

app.post('/api/auth/google', async (req, res) => {

    try {

        const { credential } = req.body

        if (!credential) {
            return res.status(400).json({
                success: 0,
                mensaje: 'Credencial de Google requerida'
            })
        }

        const datosGoogle =
            await verificarTokenGoogle(credential)

        const respuesta =
            await loginORegistrarGoogle(
                pool,
                datosGoogle
            )

        res.json(respuesta)

    } catch (error) {

        console.error('Error Google Auth:', error)

        if (esErrorConexionDb(error)) {
            return res.status(503).json({
                success: 0,
                mensaje: mensajeErrorBd(error)
            })
        }

        res.status(401).json({
            success: 0,
            mensaje:
                error.message ||
                'No se pudo verificar la cuenta de Google'
        })

    }

})

/*
|--------------------------------------------------------------------------
| REGISTRO
|--------------------------------------------------------------------------
*/

app.post('/api/registro', async (req, res) => {

    try {

        const {
            nombre,
            email,
            contrasena,
            fecha_nacimiento
        } = req.body

        const emailError =
            validarEmailServidor(email)

        if (emailError) {
            return res.status(400).json({
                success: 0,
                campo: 'email',
                mensaje: emailError
            })
        }

        if (!nombre?.trim()) {
            return res.status(400).json({
                success: 0,
                campo: 'nombre',
                mensaje: 'El nombre es obligatorio'
            })
        }

        if (!contrasena?.trim() || contrasena.length < 8) {
            return res.status(400).json({
                success: 0,
                campo: 'contrasena',
                mensaje: 'La contraseña debe tener mínimo 8 caracteres'
            })
        }

        if (!fecha_nacimiento) {
            return res.status(400).json({
                success: 0,
                campo: 'fecha_nacimiento',
                mensaje: 'La fecha de nacimiento es obligatoria'
            })
        }

        const [resultado] = await pool.query(
            'CALL spRegistrarUsuario(?, ?, ?, ?)',
            [
                nombre,
                email,
                contrasena,
                fecha_nacimiento
            ]
        )

        res.json(
            normalizarRespuestaAuth(resultado[0][0])
        )

    } catch (error) {

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

})


app.get('/api/test-correo', async (req, res) => {

    try {

        await enviarCorreo({

            from: process.env.MAIL_USER || 'Serenia',

            to: 'davidangelvazquez306@gmail.com',

            subject: 'Prueba Serenia',

            html: `
                <h1>Correo de prueba</h1>

                <p>
                    Si estás viendo este correo,
                    Nodemailer funciona correctamente.
                </p>

                <p>
                    Enviado desde Serenia 🚀
                </p>
            `

        })

        res.json({

            success: 1,

            mensaje: 'Correo enviado correctamente'

        })

    } catch (error) {

        console.error(error)

        res.status(500).json({

            success: 0,

            mensaje: error.message

        })

    }

})


/*
|--------------------------------------------------------------------------
| RECUPERAR CONTRASEÑA
|--------------------------------------------------------------------------
*/

app.post(
    '/api/solicitar-recuperacion',
    async (req, res) => {

        try {

            const {
                email,
                token
            } = req.body

            const emailError =
                validarEmailServidor(email)

            if (emailError) {
                return res.status(400).json({
                    success: 0,
                    mensaje: emailError
                })
            }

            if (!token?.trim()) {
                return res.status(400).json({
                    success: 0,
                    mensaje: 'Token de recuperación requerido'
                })
            }

            const [resultado] =
                await pool.query(
                    'CALL spSolicitarRecuperacionContrasena(?, ?)',
                    [
                        email,
                        token
                    ]
                )

            const respuesta =
                resultado[0][0]

            if (
                respuesta.success === 1
            ) {

                if (!correoConfigurado()) {
                    return res.status(503).json({
                        success: 0,
                        mensaje:
                            'El envío de correos no está configurado. Agrega MAIL_USER y MAIL_PASS en Render.'
                    })
                }

                try {

                    await enviarCorreo({

                        from:
                            `Serenia <${process.env.MAIL_USER}>`,

                        to: email,

                        subject:
                            'Recuperación de contraseña - Serenia',

                        html:
                            recuperarContrasenaTemplate(
                                token
                            )

                    })

                } catch (mailError) {

                    console.error(
                        'Error al enviar correo:',
                        mailError
                    )

                    return res.status(500).json({

                        success: 0,

                        mensaje:
                            mailError.message ||
                            'No se pudo enviar el correo. Intenta más tarde'

                    })

                }

            }

            res.json(
                respuesta
            )

        } catch (error) {

            console.error(error)

            res.status(500).json({

                success: 0,

                mensaje:
                    'Error interno del servidor'

            })

        }

    }
)









/*
|--------------------------------------------------------------------------
| CAMBIAR CONTRASEÑA
|--------------------------------------------------------------------------
*/

app.post(
    '/api/cambiar-contrasena',
    async (req, res) => {

        try {

            const {
                email,
                token,
                nuevaContrasena
            } = req.body

            const [resultado] =
                await pool.query(
                    'CALL spCambiarContrasena(?, ?, ?)',
                    [
                        email,
                        token,
                        nuevaContrasena
                    ]
                )

            res.json(
                resultado[0][0]
            )

        } catch (error) {

            console.error(error)

            res.status(500).json({
                success: 0,
                mensaje: 'Error interno del servidor'
            })

        }

    }
)



app.listen(puerto, () => {

    console.log(
        `API iniciada en el puerto ${puerto}`
    )

})