import { Router } from '@awaitjs/express'
import { uploadFileController } from '../controllers/uploadFile'
import { employeesAttendancesPageController } from '../controllers/employeesAttendances'

const router = Router()

router.getAsync('/employeesAttendances', employeesAttendancesPageController)
router.postAsync('/uploadFile', uploadFileController)

export default router
