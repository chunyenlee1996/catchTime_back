import UserRole from '../enums/UserRole.js'
import { StatusCodes } from 'http-status-codes'

export default (req, res, next) => {
  // 可參照 users models
  if (req.user.role === UserRole.USER) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: '沒有權限'
    })
  } else {
    next()
  }
}
