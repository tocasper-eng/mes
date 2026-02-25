// 建立 mes_CSLA 資料表並匯入資料
const { pool, poolConnect, sql } = require('./connection')

async function run() {
  await poolConnect

  // 建立資料表
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'mes_CSLA'
    )
    CREATE TABLE mes_CSLA (
      MANDT   NVARCHAR(3)   NOT NULL DEFAULT '100',   -- Client
      KOKRS   NVARCHAR(4)   NOT NULL,                  -- Controlling Area
      LSTAR   NVARCHAR(6)   NOT NULL,                  -- Activity Type
      LTEXT   NVARCHAR(100) NULL,                      -- Activity Type Name
      DATBI   NVARCHAR(8)   NULL,                      -- Valid To Date (YYYYMMDD)
      DATAB   NVARCHAR(8)   NULL,                      -- Valid-From Date (YYYYMMDD)
      LEINH   NVARCHAR(3)   NULL,                      -- Activity Unit
      LATYP   NVARCHAR(1)   NULL,                      -- Activity Type Category
      LATYPI  NVARCHAR(1)   NULL,                      -- Variant ATyp Category (Actual)
      ERSDA   NVARCHAR(8)   NULL,                      -- Entered On
      USNAM   NVARCHAR(12)  NULL,                      -- Entered By
      KSTTY   NVARCHAR(8)   NULL,                      -- Valid Cost Center Categories
      AUSEH   NVARCHAR(3)   NULL,                      -- Output Unit
      AUSFK   DECIMAL(5,2)  NULL,                      -- Output Factor
      VKSTA   NVARCHAR(10)  NULL,                      -- Allocation Cost Element
      CONSTRAINT PK_mes_CSLA PRIMARY KEY (MANDT, KOKRS, LSTAR)
    )
  `)
  console.log('資料表 mes_CSLA 已建立')

  // 資料列表：[LSTAR, LTEXT, KSTTY, LEINH, VKSTA, LATYP, KOKRS]
  const rows = [
    ['Q200', 'Q-Labor Rate',        'Q', 'H',   '94322000', '1', 'CYPG'],
    ['Q201', 'Q-Labor rate (FOC)',  'Q', 'H',   '94322010', '1', 'CYPG'],
    ['Q202', 'Q-New_Labor rate',    'Q', 'H',   '94322020', '1', 'CYPG'],
    ['Q300', 'Q-Fix OH rate',       'Q', 'H',   '94323000', '1', 'CYPG'],
    ['Q301', 'Q-Fix OH (FOC)',      'Q', 'H',   '94323010', '1', 'CYPG'],
    ['Q302', 'Q-New Fix OH rate',   'Q', 'H',   '94323020', '1', 'CYPG'],
    ['Q400', 'Q-Variable OH',       'Q', 'H',   '94324000', '1', 'CYPG'],
    ['Q401', 'Q-Variable OH (FOC)', 'Q', 'H',   '94324010', '1', 'CYPG'],
    ['Q402', 'Q-New_Variable OH',   'Q', 'H',   '94324020', '1', 'CYPG'],
    ['W100', 'W-Direct labor rate', 'W', 'MIN', '94311000', '1', 'CYPG'],
    ['W200', 'W-Indirect labor rat','W', 'MIN', '94312000', '1', 'CYPG'],
    ['W300', 'W-Fix OH rate',       'W', 'MIN', '94313000', '1', 'CYPG'],
    ['W400', 'W-Variable OH rate',  'W', 'MIN', '94314000', '1', 'CYPG'],
  ]

  let inserted = 0
  let skipped = 0

  for (const [LSTAR, LTEXT, KSTTY, LEINH, VKSTA, LATYP, KOKRS] of rows) {
    const req = pool.request()
    req.input('LSTAR', sql.NVarChar, LSTAR)
    req.input('LTEXT', sql.NVarChar, LTEXT)
    req.input('KSTTY', sql.NVarChar, KSTTY)
    req.input('LEINH', sql.NVarChar, LEINH)
    req.input('VKSTA', sql.NVarChar, VKSTA)
    req.input('LATYP', sql.NVarChar, LATYP)
    req.input('KOKRS', sql.NVarChar, KOKRS)

    const result = await req.query(`
      IF NOT EXISTS (
        SELECT 1 FROM mes_CSLA WHERE MANDT='100' AND KOKRS=@KOKRS AND LSTAR=@LSTAR
      )
      BEGIN
        INSERT INTO mes_CSLA (MANDT, KOKRS, LSTAR, LTEXT, KSTTY, LEINH, VKSTA, LATYP)
        VALUES ('100', @KOKRS, @LSTAR, @LTEXT, @KSTTY, @LEINH, @VKSTA, @LATYP)
        SELECT 1 AS inserted
      END
      ELSE
        SELECT 0 AS inserted
    `)

    if (result.recordset[0].inserted) {
      console.log(`  新增：${LSTAR} ${LTEXT}`)
      inserted++
    } else {
      console.log(`  跳過（已存在）：${LSTAR}`)
      skipped++
    }
  }

  console.log(`\n完成：新增 ${inserted} 筆，跳過 ${skipped} 筆`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
