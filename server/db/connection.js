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

const initializePool = async () => {
  try {
    pool = new sql.ConnectionPool(config)
    await pool.connect()
    console.log('[DB] Database connected successfully')
    return pool
  } catch (err) {
    console.error('[DB] Connection error:', err.message)
    pool = null
    // 不拋出錯誤，讓應用繼續運行
    return null
  }
}

// 異步初始化連接池
const poolPromise = initializePool()

module.exports = {
  pool: poolPromise,
  sql,
  initializePool,
}
