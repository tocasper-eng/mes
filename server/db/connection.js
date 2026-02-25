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
    connectionTimeout: 5000,
    requestTimeout: 5000,
  },
}

let pool = null
let poolConnect = null

const getPool = async () => {
  if (!pool) {
    pool = new sql.ConnectionPool(config)
    try {
      poolConnect = await pool.connect()
      console.log('Database connected successfully')
    } catch (err) {
      console.error('Database connection error:', err.message)
      pool = null
      poolConnect = null
      throw err
    }
  }
  return pool
}

pool = new sql.ConnectionPool(config)
poolConnect = pool.connect().catch(err => {
  console.error('Initial database connection failed:', err.message)
})

module.exports = { pool, poolConnect, sql, getPool }
