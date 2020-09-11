import express from 'express'
import { getMonthlyAttendance } from '../controllers/api'

const router = express.Router()

router.get('/monthlyAttendance', getMonthlyAttendance)

export default router
