const express = require('express')
const router = express.Router()
const { getCsla } = require('../controllers/cslaController')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware, getCsla)

module.exports = router
