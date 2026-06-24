import pool from './db.js'
import { asegurarRecuperacionContrasena } from './setupRecuperacion.js'

try {
  await asegurarRecuperacionContrasena(pool)
  console.log('Recuperación de contraseña lista')
} catch (error) {
  console.error('Error en setup de recuperación:', error.message)
  process.exit(1)
} finally {
  await pool.end()
}
