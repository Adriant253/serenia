export async function asegurarProgresoEjercicios(pool) {

    const dbName = process.env.DB_NAME || 'serenia'

    async function tablaExiste(nombre) {
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS total
             FROM information_schema.TABLES
             WHERE TABLE_SCHEMA = ?
               AND TABLE_NAME = ?`,
            [dbName, nombre]
        )

        return rows[0].total > 0
    }

    if (!(await tablaExiste('historial_ejercicios'))) {
        await pool.query(`
            CREATE TABLE historial_ejercicios (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                id_usuario INT UNSIGNED NOT NULL,
                ejercicio_id VARCHAR(80) NOT NULL,
                titulo VARCHAR(200) NOT NULL,
                duracion_segundos INT UNSIGNED NOT NULL DEFAULT 0,
                fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_usuario_fecha (id_usuario, fecha DESC),
                INDEX idx_usuario_ejercicio (id_usuario, ejercicio_id)
            ) ENGINE=InnoDB
              DEFAULT CHARSET=utf8mb4
              COLLATE=utf8mb4_unicode_ci
        `)
    }

}
