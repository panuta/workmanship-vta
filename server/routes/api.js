import { Router } from '@awaitjs/express'
import { employeeAttendancesTable, process } from '../controllers/api'

const router = Router()

router.getAsync('/employeeAttendancesTable', employeeAttendancesTable)
router.postAsync('/process', process)

export default router
