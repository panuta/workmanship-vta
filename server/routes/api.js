import { Router } from '@awaitjs/express'
import { uploadDailyFile, uploadMonthlyFile } from '../controllers/uploadFile'
import { employeesAttendancesPage } from '../controllers/employeesAttendances'

const router = Router()

router.getAsync('/employeesAttendances', employeesAttendancesPage)
router.postAsync('/uploadDailyFile', uploadDailyFile)
router.postAsync('/uploadMonthlyFile', uploadMonthlyFile)

export default router
