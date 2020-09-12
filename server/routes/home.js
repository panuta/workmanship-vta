import express from 'express'

const router = express.Router()

router.get('/', async (req, res, next) => {
  // res.sendFile(path.join(__dirname, '../static/client/index.html'))

  res.send("OK")
})

export default router
