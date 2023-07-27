import { StatusCodes } from 'http-status-codes'
import users from '../models/users.js'
import { getMessageFromValidationError } from '../utils/error.js'
import jwt from 'jsonwebtoken'
// 創建
export const create = async (req, res) => {
  try {
    await users.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: getMessageFromValidationError(error)
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號已註冊'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}
// 登入
export const login = async (req, res) => {
  try {
    // jwt.sign(保存的資料, SECRET, 設定)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 將 jwt 放進資料庫 tokens 這個 key
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      // 這邊看登入之後想要回傳什麼資訊
      result: {
        token,
        userName: req.user.userName,
        account: req.user.account,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        role: req.user.role,
        avatar: req.user.avatar
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}
// 登出
export const logout = async (req, res) => {
  try {
    // filter() 過濾 符合裡面條件的保留
    // 下方這行就是把符合條件的保留，所以現在使用中的 token 會被刪除
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}
// jwt 舊換新
export const extend = async (req, res) => {
  try {
    // findIndex(ex=>ex>3) 尋找陣列符合測試函式(ex=>ex>3)的元素，並返回索引，會從[0]查
    // 下方這行表示在 tokens[] 中找到符合 token 的索引，放進 idx 中
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}
// 取使用者資料
export const getProfile = async (req, res) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        userName: req.user.userName,
        account: req.user.account,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        role: req.user.role,
        avatar: req.user.avatar
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}
