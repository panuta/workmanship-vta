import { Router } from '@awaitjs/express'
import { deleteEverything } from '../controllers/settingsApi'

const router = Router()

router.postAsync('/settings/deleteEverything', deleteEverything)

export default router
