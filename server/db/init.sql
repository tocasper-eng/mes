-- mes_users 用戶資料表
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

-- role 說明：
--   admin    系統管理員
--   manager  生產管理
--   operator 現場操作員
