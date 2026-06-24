import nodemailer from 'nodemailer'

export function correoConfigurado() {
  return Boolean(
    process.env.MAIL_USER?.trim() &&
    process.env.MAIL_PASS?.trim()
  )
}

function crearTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000
  })
}

export async function enviarCorreo(opciones) {
  if (!correoConfigurado()) {
    throw new Error(
      'Correo no configurado en el servidor. Agrega MAIL_USER y MAIL_PASS en Render.'
    )
  }

  const transporter = crearTransporter()

  const envio = transporter.sendMail(opciones)

  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          'Tiempo de espera agotado al enviar el correo. Revisa MAIL_USER y MAIL_PASS en Render.'
        )
      )
    }, 20_000)
  })

  return Promise.race([envio, timeout])
}

export default crearTransporter()
