import { Router } from '@awaitjs/express'
import { deleteEverything, employeesAttendancesPage, listPayrollFiles, uploadDailyFile, uploadMonthlyFile } from '../controllers/api'

const router = Router()

router.postAsync('/uploadDailyFile', uploadDailyFile)
router.postAsync('/uploadMonthlyFile', uploadMonthlyFile)

router.getAsync('/employeesAttendances', employeesAttendancesPage)
router.getAsync('/listPayrollFiles', listPayrollFiles)

router.postAsync('/deleteEverything', deleteEverything)

export default router
