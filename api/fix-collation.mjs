import pool from './db.js'

try {
  const [t] = await pool.query(
    "SHOW TABLE STATUS LIKE 'usuarios'"
  )
  console.log('Tabla collation:', t[0]?.Collation)

  await pool.query(`
    ALTER TABLE usuarios
    CONVERT TO CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci
  `)
  console.log('Tabla usuarios convertida a utf8mb4_0900_ai_ci')

  const [test] = await pool.query(
    'CALL spRegistrarUsuario(?, ?, ?, ?)',
    ['Test Collation', 'coltest@test.com', 'password123', '2000-01-01']
  )
  console.log('Registro test:', test[0][0])

} catch (error) {
  console.error('Error:', error.code, error.message)
} finally {
  await pool.end()
}
