import { StatusCodes } from 'http-status-codes'
import users from '../models/users.js'
import { getMessageFromValidationError } from '../utils/error.js'
import jwt from 'jsonwebtoken'
// 創建
export const create = async (req, res) => {
  try {
    // 如果前端跟你設定儲存資料的欄位名字一樣的話可以直接丟進去，不一樣的話在一個一個寫
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
// 這邊 login 跟 getProfile 取的東西很像的原因在
// getProfile 是如果有重新整理的話，利用 pinia 存放在 persist 裡的 token 發請求取得放在 getProfile 的資料
// 所以 login 跟 getProfile 才會只有差 token 資訊
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
        avatar: req.user.avatar,
        userId: req.user._id
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
    // 下方這行表示在 tokens[] 中找到符合 token 的索引，放進 idx 中(找現在使用的token是陣列中的第幾個)
    const idx = req.user.tokens.findIndex(token => token === req.token)
    // 這行跟上面的 token 一樣，要牽一個新的 jwt 出來
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 換陣列的索引內容，把新的token放到現在使用的那個陣列位置中
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
        avatar: req.user.avatar,
        userId: req.user._id,
        aboutMe: req.user.aboutMe,
        mainImg: req.user.mainImg
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

// 放使用者自我介紹
export const aboutMe = async (req, res) => {
  try {
    const result = await users.findByIdAndUpdate({ _id: req.params.id }, {
      aboutMe: req.body.aboutMe,
      mainImg: req.file?.path
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
