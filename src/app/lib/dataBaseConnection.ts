import * as mysql from 'mysql2/promise';

/**
 * MySQL Connection Pool
 *
 * Creates a connection pool using environment variables for:
 * - DB_HOST: Database host
 * - DB_USER: Database username
 * - DB_PASSWORD: Database password
 * - DB_NAME: Database name
 *
 * The pool allows for efficient reuse of connections across API routes.
 *
 * @example
 * // Usage in an API route:
 * import pool from "@/app/lib/dataBaseConnection";
 * const [rows] = await pool.query("SELECT * FROM users");
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export default pool;
