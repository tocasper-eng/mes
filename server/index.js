const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const cslaRoutes = require('./routes/csla')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/csla', cslaRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
