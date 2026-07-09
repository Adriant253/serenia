import { EJERCICIOS_CATALOGO } from './data/ejerciciosCatalogo.js'

export async function asegurarEjercicios(pool) {

    const dbName = process.env.DB_NAME || 'serenia'

    async function columnaExiste(nombre) {
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS total
             FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = ?
               AND TABLE_NAME = 'ejercicios'
               AND COLUMN_NAME = ?`,
            [dbName, nombre]
        )

        return rows[0].total > 0
    }

    if (!(await columnaExiste('codigo'))) {
        await pool.query(
            `ALTER TABLE ejercicios
             ADD COLUMN codigo VARCHAR(80) NULL UNIQUE
             AFTER id_ejercicio`
        )
    }

    if (!(await columnaExiste('icono'))) {
        await pool.query(
            `ALTER TABLE ejercicios
             ADD COLUMN icono VARCHAR(20) NOT NULL DEFAULT '🌿'
             AFTER descripcion`
        )
    }

    if (!(await columnaExiste('pasos_json'))) {
        await pool.query(
            `ALTER TABLE ejercicios
             ADD COLUMN pasos_json JSON NULL
             AFTER icono`
        )
    }

    const [conteo] = await pool.query(
        'SELECT COUNT(*) AS total FROM ejercicios'
    )

    if (conteo[0].total > 0) {
        return
    }

    for (const ejercicio of EJERCICIOS_CATALOGO) {
        await pool.query(
            `INSERT INTO ejercicios (
                titulo,
                tipo,
                duracion_min,
                url_recurso,
                descripcion,
                codigo,
                icono,
                pasos_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                ejercicio.titulo,
                ejercicio.tipo,
                ejercicio.duracion_min,
                `/dashboard/ejercicios?ejercicio=${ejercicio.codigo}`,
                ejercicio.descripcion,
                ejercicio.codigo,
                ejercicio.icono,
                JSON.stringify(ejercicio.pasos)
            ]
        )
    }

    console.log(
        `Catálogo de ejercicios sembrado: ${EJERCICIOS_CATALOGO.length} registros`
    )

}

export function filaAEjercicio(fila) {
    let pasos = []

    if (fila.pasos_json) {
        pasos = typeof fila.pasos_json === 'string'
            ? JSON.parse(fila.pasos_json)
            : fila.pasos_json
    }

    return {
        id: fila.codigo || String(fila.id_ejercicio),
        idEjercicio: fila.id_ejercicio,
        titulo: fila.titulo,
        categoria: fila.tipo,
        descripcion: fila.descripcion,
        duracionEstimada: fila.duracion_min,
        icono: fila.icono || '🌿',
        urlRecurso: fila.url_recurso,
        pasos
    }
}
