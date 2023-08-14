import activity from '../models/activity.js'
import { getMessageFromValidationError } from '../utils/error.js'
import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {
    const result = await activity.create({
      userId: req.user._id,
      userName: req.user.userName,
      userAvatar: req.user.avatar,
      theme: req.body.theme,
      head: req.body.head,
      content: req.body.content,
      date: req.body.date,
      time: req.body.time,
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
export const joinActivity = async (req, res) => {
  try {
    if (!req.params.id) throw new Error('NotFound')
    const result = await activity.findById(req.params.id)
    result.join.push({
      userId: req.user._id,
      userName: req.user.userName,
      userEmail: req.user.email
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
export const getAll = async (req, res) => {
  try {
    const result = await activity.find()
    res.success(StatusCodes.OK).json({
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
export const getUserActivity = async (req, res) => {
  try {
    // .find( mongoDB 資料庫的 key : key 的 value )
    const result = await activity.find({ userId: req.query.search })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '使用者圖片取得發生錯誤'
    })
  }
}
export const del = async (req, res) => {
  try {
    const result = await activity.findOneAndDelete({ _id: req.params.id })
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
