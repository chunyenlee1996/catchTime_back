import express from 'express'
import contentType from '../middlewares/contentType.js'
import { create } from '../controllers/users.js'

const router = express.Router()

router.post('/', contentType('application/json'), create)

export default router
