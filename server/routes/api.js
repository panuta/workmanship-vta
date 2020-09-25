import { Router } from '@awaitjs/express'
import { uploadDailyFileController } from '../controllers/uploadFile'
import { employeesAttendancesPageController } from '../controllers/employeesAttendances'

const router = Router()

router.getAsync('/employeesAttendances', employeesAttendancesPageController)
router.postAsync('/uploadDailyFile', uploadDailyFileController)

export default router
