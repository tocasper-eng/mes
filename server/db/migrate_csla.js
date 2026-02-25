// 重建 mes_CSLA 為 3 欄位版本並匯入資料
const { pool, poolConnect, sql } = require('./connection')

async function run() {
  await poolConnect

  // 刪除舊表並重建
  await pool.request().query(`
    IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'mes_CSLA')
      DROP TABLE mes_CSLA

    CREATE TABLE mes_CSLA (
      LSTAR  NVARCHAR(6)   NOT NULL,  -- 作業編號
      LTEXT  NVARCHAR(50)  NULL,      -- 作業名稱
      remark NVARCHAR(100) NULL,      -- 備註說明
      CONSTRAINT PK_mes_CSLA PRIMARY KEY (LSTAR)
    )
  `)
  console.log('mes_CSLA 重建完成（3 欄位版本）')

  const rows = [
    ['Q200', 'Q-Labor Rate',        ''],
    ['Q201', 'Q-Labor rate (FOC)',  ''],
    ['Q202', 'Q-New_Labor rate',    ''],
    ['Q300', 'Q-Fix OH rate',       ''],
    ['Q301', 'Q-Fix OH (FOC)',      ''],
    ['Q302', 'Q-New Fix OH rate',   ''],
    ['Q400', 'Q-Variable OH',       ''],
    ['Q401', 'Q-Variable OH (FOC)', ''],
    ['Q402', 'Q-New_Variable OH',   ''],
    ['W100', 'W-Direct labor rate', ''],
    ['W200', 'W-Indirect labor rat',''],
    ['W300', 'W-Fix OH rate',       ''],
    ['W400', 'W-Variable OH rate',  ''],
  ]

  for (const [LSTAR, LTEXT, remark] of rows) {
    const req = pool.request()
    req.input('LSTAR',  sql.NVarChar, LSTAR)
    req.input('LTEXT',  sql.NVarChar, LTEXT)
    req.input('remark', sql.NVarChar, remark)
    await req.query(`
      INSERT INTO mes_CSLA (LSTAR, LTEXT, remark)
      VALUES (@LSTAR, @LTEXT, @remark)
    `)
    console.log(`  新增：${LSTAR} ${LTEXT}`)
  }

  console.log(`\n完成：共匯入 ${rows.length} 筆`)
  process.exit(0)
}

run().catch(e => { console.error(e.message); process.exit(1) })
