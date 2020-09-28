import { Router } from '@awaitjs/express'
import { deleteEverything } from '../controllers/settingsApi'
import { uploadMonthlyFile } from '../controllers/uploadFile'

const router = Router()

router.postAsync('/settings/uploadMonthlyFile', uploadMonthlyFile)
router.postAsync('/settings/deleteEverything', deleteEverything)

export default router
