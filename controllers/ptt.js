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
    const result = await PTTs.find({
      // $or:[] 這個是其中一個的語法，要是陣列，裡面物件表示
      $or: [
        // new RegExp() 是正則表達式的語法，console.log()留在下面可以看
        { theme: new RegExp(req.query.theme, 'i') },
        { userName: new RegExp(req.query.search, 'i') },
        { name: new RegExp(req.query.search, 'i') }
      ]
    })
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

export const getUserPTTs = async (req, res) => {
  try {
    // .find( mongoDB 資料庫的 key : key 的 value )
    const result = await PTTs.find({ userId: req.query.search })
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
    // const result = await images.findById(req.params.id)
    // if (req.params.id === req.user._id) {
    // }
    // findOneAndDelete()這個語法可以直接下條件查詢有沒有這個東西並刪除(查 mongoose model api)
    // req.params.id 中間的 params 代表是查document(查 mongoose document api)，路由就要接('/:id')
    // 下方這行是代表連使用者都要是req.user._id
    // const result = await images.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    const result = await PTTs.findOneAndDelete({ _id: req.params.id })
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
    const result = await PTTs.findByIdAndUpdate({ _id: req.params.id, userId: req.user._id }, {
      head: req.body.head,
      content: req.body.content,
      // 可能更新不會傳圖片過來，所以要加?
      imgURL: req.file?.path,
      theme: req.body.theme
      // 設定 new: true 他才會傳新的東西過來，runValidators: true 驗證才會執行
    }, { new: true, runValidators: true })
    if (result) {
      res.status(StatusCodes.OK).json({
        success: true,
        message: '',
        result
      })
    }
    console.table(req.body)
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
