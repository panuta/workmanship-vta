import { Router } from '@awaitjs/express'
import { employeeAttendances, uploadFile } from '../controllers/api'

const router = Router()

router.getAsync('/employeeAttendances', employeeAttendances)
router.postAsync('/uploadFile', uploadFile)

export default router
