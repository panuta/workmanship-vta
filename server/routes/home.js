import express from 'express'
import { processExcelFile } from '../data/sources/excel/processors'

const router = express.Router()

router.get('/excel', async (req, res, next) => {
  await processExcelFile()

  // res.sendFile(path.join(__dirname, '../static/client/index.html'))

  res.send("OK")
})

export default router
