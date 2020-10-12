import path from 'path'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res, next) => {
  res.sendFile(path.join(__dirname, '../static/client/index.html'))
})

export default router
