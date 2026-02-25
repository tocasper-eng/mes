# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

- GitHub: https://github.com/tocasper-eng/mes
- Remote: `git remote add origin https://github.com/tocasper-eng/mes.git`

## Project Overview

MES (Manufacturing Execution System) 製造執行系統，使用 VS Code 開發。

**Tech Stack:**
- Frontend: React + Vite + Ant Design
- Backend: Node.js + Express
- Database: MSSQL (SQL Server) — `THINKSPADT14\SQLEXPRESS`，database: `claude`

## Project Structure

```
mes/
├── client/                   # React 前端 (Vite)
│   ├── src/
│   │   ├── pages/            # 頁面元件 (Login.jsx, ...)
│   │   ├── App.jsx           # 路由設定
│   │   └── main.jsx
│   ├── vite.config.js        # API proxy → localhost:3000
│   └── package.json
├── server/                   # Node.js + Express 後端
│   ├── controllers/          # 業務邏輯 (authController.js)
│   ├── routes/               # API 路由 (auth.js)
│   ├── db/
│   │   ├── connection.js     # MSSQL 連線池
│   │   ├── init.sql          # 建立資料表 DDL
│   │   └── seed.js           # 建立初始 admin 帳號
│   ├── index.js              # Express 入口
│   ├── .env                  # 環境變數（含 DB 連線與 JWT_SECRET）
│   └── package.json
└── CLAUDE.md
```

## Commands

### 初次設定
```bash
# 1. 在 MSSQL 執行 server/db/init.sql 建立 mes_users 資料表
# 2. 建立初始管理員帳號
cd server && npm install && node db/seed.js
```

### Frontend (client/)
```bash
cd client
npm install
npm run dev        # 開發伺服器 http://localhost:5173
npm run build      # 打包正式版
```

### Backend (server/)
```bash
cd server
npm install
npm run dev        # nodemon，http://localhost:3000
npm start          # 正式啟動
```

## Environment Variables

`server/.env`（已建立，實際值已填入）：
```
DB_SERVER=THINKSPADT14\SQLEXPRESS
DB_DATABASE=claude
DB_USER=casper
DB_PASSWORD=（見 server/.env）
DB_PORT=1433
PORT=3000
JWT_SECRET=（見 server/.env）
```

## Architecture Notes

- 前後端分離；React 透過 REST API 與 Express 溝通
- Vite dev server 代理 `/api/*` 至後端 port 3000（見 `client/vite.config.js`）
- JWT token（8h 有效）登入後存於 `localStorage`，key 為 `token`
- 所有 DB 操作透過 `server/db/connection.js` 的連線池；SQL 寫在 controller 層

## Database

### mes_users
| 欄位 | 型別 | 說明 |
|------|------|------|
| id | INT IDENTITY | PK |
| username | NVARCHAR(50) | 唯一，登入帳號 |
| password_hash | NVARCHAR(255) | bcrypt hash |
| display_name | NVARCHAR(100) | 顯示名稱 |
| role | NVARCHAR(20) | admin / manager / operator |
| is_active | BIT | 0 = 停用 |
| last_login | DATETIME | 最後登入時間 |

## API

| Method | Path | 說明 |
|--------|------|------|
| POST | /api/auth/login | 登入，回傳 JWT token |
