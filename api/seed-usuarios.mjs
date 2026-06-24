import pool from './db.js'

const CONTRASENA_DEMO = 'Serenia2024!'

const USUARIOS_DEMO = [
  {
    nombre: 'María González',
    email: 'maria.gonzalez@gmail.com',
    fecha_nacimiento: '1992-03-15'
  },
  {
    nombre: 'Carlos Ruiz',
    email: 'carlos.ruiz@outlook.com',
    fecha_nacimiento: '1988-07-22'
  },
  {
    nombre: 'Ana Martínez',
    email: 'ana.martinez@hotmail.com',
    fecha_nacimiento: '1995-11-08'
  },
  {
    nombre: 'Luis Hernández',
    email: 'luis.hernandez@gmail.com',
    fecha_nacimiento: '1990-01-30'
  },
  {
    nombre: 'Laura Sánchez',
    email: 'laura.sanchez@gmail.com',
    fecha_nacimiento: '1993-05-12'
  },
  {
    nombre: 'Diego Torres',
    email: 'diego.torres@outlook.com',
    fecha_nacimiento: '1987-09-04'
  },
  {
    nombre: 'Sofía Ramírez',
    email: 'sofia.ramirez@gmail.com',
    fecha_nacimiento: '1998-02-18'
  },
  {
    nombre: 'Miguel Ángel Flores',
    email: 'miguel.flores@hotmail.com',
    fecha_nacimiento: '1985-12-25'
  },
  {
    nombre: 'Valentina Cruz',
    email: 'valentina.cruz@gmail.com',
    fecha_nacimiento: '1999-06-07'
  },
  {
    nombre: 'Roberto Jiménez',
    email: 'roberto.jimenez@outlook.com',
    fecha_nacimiento: '1991-08-14'
  },
  {
    nombre: 'Camila Mendoza',
    email: 'camila.mendoza@gmail.com',
    fecha_nacimiento: '1996-04-03'
  },
  {
    nombre: 'Fernando Ortiz',
    email: 'fernando.ortiz@hotmail.com',
    fecha_nacimiento: '1989-10-21'
  },
  {
    nombre: 'Patricia Vega',
    email: 'patricia.vega@gmail.com',
    fecha_nacimiento: '1994-07-09'
  },
  {
    nombre: 'Jorge Castro',
    email: 'jorge.castro@outlook.com',
    fecha_nacimiento: '1986-03-28'
  },
  {
    nombre: 'Isabel Morales',
    email: 'isabel.morales@gmail.com',
    fecha_nacimiento: '1997-01-16'
  }
]

let insertados = 0
let omitidos = 0
let errores = 0

console.log('Insertando 15 cuentas demo en MySQL...\n')

for (const usuario of USUARIOS_DEMO) {
  try {
    const [resultado] = await pool.query(
      'CALL spRegistrarUsuario(?, ?, ?, ?)',
      [
        usuario.nombre,
        usuario.email,
        CONTRASENA_DEMO,
        usuario.fecha_nacimiento
      ]
    )

    const respuesta = resultado[0][0]

    if (respuesta.success === 1) {
      insertados += 1
      console.log(
        `✓ ${usuario.nombre} (${usuario.email}) — id ${respuesta.id_usuario ?? '?'}`
      )
    } else {
      omitidos += 1
      console.log(
        `○ ${usuario.email} — ${respuesta.mensaje ?? 'ya existe'}`
      )
    }
  } catch (error) {
    errores += 1
    console.error(
      `✗ ${usuario.email} — ${error.message}`
    )
  }
}

console.log('\n--- Resumen ---')
console.log(`Insertados: ${insertados}`)
console.log(`Omitidos:   ${omitidos}`)
console.log(`Errores:    ${errores}`)
console.log(`\nContraseña de todas las cuentas: ${CONTRASENA_DEMO}`)

await pool.end()
