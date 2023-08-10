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

export const getAll = async (req, res) => {
  try {
    const result = await PTTs.find({ theme: req.query.theme })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const upDateMessageBoard = async (req, res) => {
  try {
    if (!req.params.id) throw new Error('NotFound')
    const result = await PTTs.findById(req.params.id)
    result.messageBoard.push({
      userId: req.user._id,
      userName: req.user.userName,
      avatar: req.user.avatar,
      message: req.body.message
    })
    await result.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'NotFound') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: true,
        message: '找不到討論版'
      })
    }
  }
}
