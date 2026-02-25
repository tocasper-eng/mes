const sql = require('mssql')
require('dotenv').config()

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

const pool = new sql.ConnectionPool(config)
const poolConnect = pool.connect()

pool.on('error', (err) => {
  console.error('Database connection error:', err)
})

module.exports = { pool, poolConnect, sql }
