// 建立資料表 + 初始帳號
const bcrypt = require('bcryptjs')
const { pool, poolConnect, sql } = require('./connection')

async function setup() {
  await poolConnect

  // 建立 mes_users 資料表
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT 1 FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_NAME = 'mes_users'
    )
    CREATE TABLE mes_users (
      id            INT IDENTITY(1,1) PRIMARY KEY,
      username      NVARCHAR(50)  NOT NULL UNIQUE,
      password_hash NVARCHAR(255) NOT NULL,
      display_name  NVARCHAR(100) NULL,
      email         NVARCHAR(100) NULL,
      role          NVARCHAR(20)  NOT NULL DEFAULT 'operator',
      is_active     BIT           NOT NULL DEFAULT 1,
      created_at    DATETIME      NOT NULL DEFAULT GETDATE(),
      last_login    DATETIME      NULL
    )
  `)
  console.log('資料表 mes_users 已建立')

  // 建立帳號
  const users = [
    { username: 'admin', password: 'admin123', displayName: '系統管理員', role: 'admin' },
    { username: 'jimmy', password: 'psi',      displayName: 'Jimmy',      role: 'operator' },
  ]

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10)
    const req = pool.request()
    req.input('username',      sql.NVarChar, u.username)
    req.input('password_hash', sql.NVarChar, hash)
    req.input('display_name',  sql.NVarChar, u.displayName)
    req.input('role',          sql.NVarChar, u.role)
    await req.query(`
      IF NOT EXISTS (SELECT 1 FROM mes_users WHERE username = @username)
      INSERT INTO mes_users (username, password_hash, display_name, role)
      VALUES (@username, @password_hash, @display_name, @role)
    `)
    console.log(`帳號建立：${u.username} / ${u.password}`)
  }

  process.exit(0)
}

setup().catch((err) => {
  console.error(err)
  process.exit(1)
})
