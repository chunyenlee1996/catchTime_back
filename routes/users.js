import express from 'express'
import contentType from '../middlewares/contentType.js'
import { create, login, logout, extend, getProfile, aboutMe } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
const router = express.Router()

router.post('/', contentType('application/json'), create)
router.post('/login', contentType('application/json'), auth.login, login)
router.post('/:id', contentType('multipart/form-data'), upload, aboutMe)
router.delete('/logout', auth.jwt, logout)
// jwt 舊換新
router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getProfile)
export default router
