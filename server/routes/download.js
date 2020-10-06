import express from 'express'
import { downloadPayrollFile } from '../controllers/downloadFile'

const router = express.Router()

router.get('/payroll', downloadPayrollFile)

export default router
