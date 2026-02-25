const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool, poolConnect, sql } = require('../db/connection')

const login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: '請輸入用戶名和密碼' })
  }

  try {
    await poolConnect
    const request = pool.request()
    request.input('username', sql.NVarChar, username)

    const result = await request.query(`
      SELECT id, username, password_hash, display_name, role, is_active
      FROM mes_users
      WHERE username = @username
    `)

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: '用戶名或密碼錯誤' })
    }

    const user = result.recordset[0]

    if (!user.is_active) {
      return res.status(403).json({ message: '帳號已停用，請聯繫管理員' })
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(401).json({ message: '用戶名或密碼錯誤' })
    }

    // 更新最後登入時間
    const updateReq = pool.request()
    updateReq.input('id', sql.Int, user.id)
    await updateReq.query(`UPDATE mes_users SET last_login = GETDATE() WHERE id = @id`)

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: '伺服器錯誤，請稍後再試' })
  }
}

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const userId = req.user.id

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: '請填寫舊密碼與新密碼' })
  }

  try {
    await poolConnect
    const request = pool.request()
    request.input('id', sql.Int, userId)
    const result = await request.query(
      'SELECT password_hash FROM mes_users WHERE id = @id'
    )

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: '找不到使用者' })
    }

    const isMatch = await bcrypt.compare(oldPassword, result.recordset[0].password_hash)
    if (!isMatch) {
      return res.status(401).json({ message: '舊密碼錯誤' })
    }

    const newHash = await bcrypt.hash(newPassword, 10)
    const updateReq = pool.request()
    updateReq.input('id', sql.Int, userId)
    updateReq.input('password_hash', sql.NVarChar, newHash)
    await updateReq.query(
      'UPDATE mes_users SET password_hash = @password_hash WHERE id = @id'
    )

    res.json({ message: '密碼修改成功' })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ message: '伺服器錯誤，請稍後再試' })
  }
}

module.exports = { login, changePassword }
