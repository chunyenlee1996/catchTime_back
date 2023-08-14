import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import contentType from '../middlewares/contentType.js'
import upload from '../middlewares/upload.js'
import { create, joinActivity, getAll, getUserActivity, del } from '../controllers/activity.js'

const router = Router()

router.post('/', auth.jwt, contentType('multipart/form-data'), upload, create)
router.post('/:id', auth.jwt, contentType('application/json'), joinActivity)
router.get('/all', getAll)
router.get('UserActivity', getUserActivity)
router.delete('/:id', del)

export default router
