import express from 'express'
import path from 'path'

const router = express.Router()

router.get('/', async (req, res, next) => {
  res.sendFile(path.join(__dirname, '../static/client/index.html'))
})

export default router
