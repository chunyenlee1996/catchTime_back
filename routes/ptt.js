import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import contentType from '../middlewares/contentType.js'
import upload from '../middlewares/upload.js'
import { create, getAll, upDateMessageBoard, del, edit, getUserPTTs } from '../controllers/ptt.js'

const router = Router()

router.post('/', auth.jwt, contentType('multipart/form-data'), upload, create)
router.get('/all', getAll)
router.get('/UserPTTs', getUserPTTs)
router.post('/:id', auth.jwt, contentType('application/json'), upDateMessageBoard)
router.delete('/:id', del)
router.patch('/:id', auth.jwt, contentType('multipart/form-data'), upload, edit)
export default router
