const { pool: poolPromise, sql } = require('../db/connection')

const getCsla = async (req, res) => {
  const { lstar, ltext } = req.query

  try {
    const pool = await poolPromise
    if (!pool) return res.status(500).json({ message: '資料庫連線失敗，請稍後再試' })

    const request = pool.request()
    let where = []

    if (lstar) {
      request.input('lstar', sql.NVarChar, `%${lstar}%`)
      where.push('LSTAR LIKE @lstar')
    }
    if (ltext) {
      request.input('ltext', sql.NVarChar, `%${ltext}%`)
      where.push('LTEXT LIKE @ltext')
    }

    const whereClause = where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''

    const result = await request.query(`
      SELECT LSTAR, LTEXT, remark
      FROM mes_CSLA
      ${whereClause}
      ORDER BY LSTAR
    `)

    res.json(result.recordset)
  } catch (err) {
    console.error('CSLA query error:', err)
    res.status(500).json({ message: '查詢失敗，請稍後再試' })
  }
}

module.exports = { getCsla }
