const { pool, poolConnect } = require('./connection')

async function check() {
  await poolConnect
  const r = await pool.request().query(`
    SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
    ORDER BY TABLE_NAME
  `)
  console.log('資料庫中的資料表：')
  r.recordset.forEach(t => console.log(' -', t.TABLE_NAME))
  process.exit(0)
}
check().catch(e => { console.error(e.message); process.exit(1) })
