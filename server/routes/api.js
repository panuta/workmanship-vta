import { Router } from '@awaitjs/express'
import { employeeAttendancesTable, process, uploadFile } from '../controllers/api'

const router = Router()

router.getAsync('/employeeAttendancesTable', employeeAttendancesTable)
router.postAsync('/process', process)
router.postAsync('/uploadFile', uploadFile)

export default router
