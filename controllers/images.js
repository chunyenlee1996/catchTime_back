import images from '../models/images.js'
import { getMessageFromValidationError } from '../utils/error.js'
import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {
    const result = await images.create({
      userId: req.user._id,
      name: req.body.name,
      imgURL: req.file.path,
      them: req.body.them,
      content: req.body.content
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
    const result = await images.find()
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

export const del = async (req, res) => {
  try {
    // const result = await images.findById(req.params.id)
    // if (req.params.id === req.user._id) {
    // }
    // findOneAndDelete()這個語法可以直接下條件查詢有沒有這個東西並刪除(查 mongoose model api)
    // req.params.id 中間的 params 代表是查document(查 mongoose document api)，路由就要接('/:id')
    const result = await images.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
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

export const edit = async (req, res) => {
  try {
    const result = await images.findByIdAndUpdate({ _id: req.params.id, userId: req.user._id }, {
      name: req.body.name,
      // 可能更新不會傳圖片過來，所以要加?
      imgURL: req.file?.path,
      them: req.body.them,
      content: req.body.content
      // 設定 new: true 他才會傳新的東西過來，runValidators: true 驗證才會執行
    }, { new: true, runValidators: true })
    if (result) {
      res.status(StatusCodes.OK).json({
        success: true,
        message: '',
        result
      })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: getMessageFromValidationError(error)
      })
    } else if (error.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}
