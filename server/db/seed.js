// 建立初始管理員帳號
// 執行方式：node server/db/seed.js
const bcrypt = require('bcryptjs')
const { pool, poolConnect, sql } = require('./connection')

async function createUser(username, password, displayName, role) {
  const hash = await bcrypt.hash(password, 10)
  const request = pool.request()
  request.input('username', sql.NVarChar, username)
  request.input('password_hash', sql.NVarChar, hash)
  request.input('display_name', sql.NVarChar, displayName)
  request.input('role', sql.NVarChar, role)
  await request.query(`
    IF NOT EXISTS (SELECT 1 FROM mes_users WHERE username = @username)
    INSERT INTO mes_users (username, password_hash, display_name, role)
    VALUES (@username, @password_hash, @display_name, @role)
  `)
  console.log(`Seed 完成：${username} / ${password}`)
}

async function seed() {
  await poolConnect

  await createUser('admin', 'admin123', '系統管理員', 'admin')
  await createUser('jimmy', 'psi', 'Jimmy', 'operator')

  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
