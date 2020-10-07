import { Router } from '@awaitjs/express'
import { uploadDailyFile, uploadMonthlyFile } from '../controllers/uploadApi'
import { deleteEverything, employeesAttendancesPage, listPayrollFiles } from '../controllers/api'

const router = Router()

router.postAsync('/uploadDailyFile', uploadDailyFile)
router.postAsync('/uploadMonthlyFile', uploadMonthlyFile)
router.getAsync('/employeesAttendances', employeesAttendancesPage)
router.getAsync('/listPayrollFiles', listPayrollFiles)
router.postAsync('/deleteEverything', deleteEverything)

export default router
