import PTTs from '../models/PTT.js'
import { getMessageFromValidationError } from '../utils/error.js'
import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {
    const result = await PTTs.create({
      userId: req.user._id,
      userName: req.user.userName,
      userAvatar: req.user.avatar,
      head: req.body.head,
      content: req.body.content,
      theme: req.body.theme,
      imgURL: req.file?.path
    })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: getMessageFromValidationError(error)
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}
