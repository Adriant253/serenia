import 'dotenv/config'

import pool from './db.js'
import { asegurarEjercicios } from './setupEjercicios.js'

try {
    await asegurarEjercicios(pool)

    const [filas] = await pool.query(
        `SELECT id_ejercicio, codigo, titulo, tipo, duracion_min
         FROM ejercicios
         ORDER BY id_ejercicio`
    )

    console.log(`Ejercicios en base de datos: ${filas.length}`)
    console.table(filas)
} catch (error) {
    console.error('Error al sembrar ejercicios:', error)
    process.exit(1)
} finally {
    await pool.end()
}
