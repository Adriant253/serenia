import 'dotenv/config'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: Number(process.env.DB_PORT) || 3306,

    charset: 'utf8mb4_unicode_ci',

    connectTimeout: 15000,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,

    ssl: {
        rejectUnauthorized: false
    },

    authPlugins: {
        mysql_clear_password: () => () =>
            Buffer.from(process.env.DB_PASSWORD + '\0')
    }
})

pool.on('connection', (connection) => {
    connection.query(
        "SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'"
    )
})

export default pool
