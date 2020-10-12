import express from 'express'
import { downloadPayrollFile } from '../controllers/downloadFiles'

const router = express.Router()

router.get('/payroll', downloadPayrollFile)

export default router
