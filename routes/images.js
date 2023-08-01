import express from 'express'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import contentType from '../middlewares/contentType.js'
import { create, getAll, del, edit } from '../controllers/images.js'

const router = express.Router()

// 中間 contentType 驗證請求格式對不對
router.post('/', auth.jwt, contentType('multipart/from-data'), upload, create)
router.get('/all', auth.jwt, getAll)
router.delete('/:id', del)
router.patch('/:id', auth.jwt, contentType('multipart/form-data'), upload, edit)
export default router
