import pool from './db.js'

try {
  const [corregido] = await pool.query(
    `UPDATE usuarios
     SET email = 'gatohola27@gmail.com'
     WHERE LOWER(TRIM(email)) = 'gatohola@27gmail.com'`
  )

  if (corregido.affectedRows > 0) {
    console.log(
      'Correo corregido: gatohola@27gmail.com -> gatohola27@gmail.com'
    )
  } else {
    console.log('No había correo gatohola@27gmail.com que corregir')
  }

  await pool.query(
    `UPDATE usuarios
     SET email = LOWER(TRIM(email))
     WHERE email <> LOWER(TRIM(email))`
  )

  const [users] = await pool.query(
    `SELECT id_usuario, email, nombre
     FROM usuarios
     WHERE LOWER(email) LIKE '%gatohola%'`
  )
  console.log('Usuarios gatohola:', users)
} catch (error) {
  console.error('Error:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
