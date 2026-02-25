const express = require('express')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const cslaRoutes = require('./routes/csla')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

// 提供靜態文件
app.use(express.static(path.join(__dirname, 'public')))

// 健康檢查端點 - 不需要資料庫連接
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/csla', cslaRoutes)

// 處理 SPA 路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`)
  console.log(`[${new Date().toISOString()}] Environment: NODE_ENV=${process.env.NODE_ENV || 'development'}`)
  console.log(`[${new Date().toISOString()}] Database: ${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`)
})

// 優雅關閉
process.on('SIGTERM', () => {
  console.log('[SIGTERM] Shutting down gracefully...')
  server.close(() => {
    console.log('[SIGTERM] Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('[SIGINT] Shutting down gracefully...')
  server.close(() => {
    console.log('[SIGINT] Server closed')
    process.exit(0)
  })
})

// 捕捉未處理的異常
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('[unhandledRejection]', reason)
})
