import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import contentType from '../middlewares/contentType.js'
import upload from '../middlewares/upload.js'
import { create, joinActivity, getAll, getUserActivity, del, removeJoinActivity, getUserJoinActivity } from '../controllers/activity.js'

const router = Router()

router.post('/', auth.jwt, contentType('multipart/form-data'), upload, create)
router.post('/:id', auth.jwt, joinActivity)
router.get('/all', getAll)
router.get('/userActivity', auth.jwt, getUserActivity)
router.get('/userJoinActivity', auth.jwt, getUserJoinActivity)
router.delete('/:id', del)
//  資料可以設很多個，冒號後面可以隨便取名字，再 controller 要取資料的時候用 req.params.(名字就行)
// 範例 req.params.abc,req.params.id
// router.delete('/:id/:abc', del)
router.patch('/:id', auth.jwt, removeJoinActivity)

export default router
