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
      address: req.body.address,
      mainURL: req.body?.mainURL,
      imgURL: req.file?.path
    })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
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
    result.join.push(req.user._id)
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

export const removeJoinActivity = async (req, res) => {
  try {
    if (!req.params.id) throw new Error('NotFound')
    const result = await activity.findById(req.params.id)
    // 因為findIndex 是跑索引，所以可以這樣找
    // 因為存的是objectID，所以裡面要將他轉為文字才可以做比較
    const index = result.join.findIndex(join => join.toString() === req.user._id.toString())
    if (index > -1) {
      result.join.splice(index, 1)
    } else if (index < 0) { throw new Error('NotFoundId') }
    await result.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'NotFound') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: true,
        message: '找不到討論版'
      })
    } else if (error.name === 'NotFoundId') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: true,
        message: '找不到報名ID'
      })
    }
  }
}

export const getAll = async (req, res) => {
  try {
    const result = await activity.find({
      // $or:[] 這個是其中一個的語法，要是陣列，裡面物件表示
      $or: [
        // new RegExp() 是正則表達式的語法，console.log()留在下面可以看
        { theme: new RegExp(req.query.search, 'i') },
        { userName: new RegExp(req.query.search, 'i') },
        { head: new RegExp(req.query.search, 'i') }
      ]
    })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}
export const getUserActivity = async (req, res) => {
  try {
    // .find( mongoDB 資料庫的 key : key 的 value )
    // 找自己參加的
    // const result = await activity.find({ join: req.user._id })
    // 找自己辦的含參與者
    const result = await activity.find({ userId: req.user._id }).populate('join', 'account email')
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
export const getUserJoinActivity = async (req, res) => {
  try {
    // .find( mongoDB 資料庫的 key : key 的 value )
    // 找自己參加的
    const result = await activity.find({ join: req.user._id })
    // 找自己辦的含參與者
    // const result = await activity.find({ userId: req.user._id }).populate('join', 'account email')
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
