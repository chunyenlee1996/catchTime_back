import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import contentType from '../middlewares/contentType.js'
import upload from '../middlewares/upload.js'
import { create } from '../controllers/ptt.js'

const router = Router()

router.post('/', auth.jwt, contentType('multipart/form-data'), upload, create)

export default router
