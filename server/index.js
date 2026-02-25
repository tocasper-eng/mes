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

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/csla', cslaRoutes)

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 處理 SPA 路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
