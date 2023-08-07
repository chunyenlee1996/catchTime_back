//  mongoDB 的語法轉換套件
import mongoose from 'mongoose'

const messageBoardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者ID']
  },
  userName: {
    type: String,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  avatar: {
    type: String,
    ref: 'users',
    required: [true, '缺少使用者大頭貼']
  },
  message: {
    type: String,
    required: [true, '沒有留言']
  }
}, { versionKey: false })

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者ID']
  },
  userName: {
    type: String,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  userAvatar: {
    type: String,
    ref: 'users',
    required: [true, '缺少使用者大頭貼']
  },
  // 類別
  theme: {
    type: String,
    required: [true, '還未分類'],
    // 設定類別的方式
    enum: {
      values: ['活動', '器材討論', '風景攝影', '人像攝影', '動態攝影', '建築攝影', '靜物攝影', '紀實攝影', '實驗性攝影', '其他'],
      message: '找不到 {VALUE} 分類'
    }
  },
  head: {
    type: String,
    required: [true, '填寫標題']
  },
  connect: {
    type: String,
    required: [true, '還未寫內容']
  },
  messageBoard: {
    type: [messageBoardSchema],
    default: []
  },
  imgURL: {
    type: String
  },
  join: {
    type: [mongoose.ObjectId],
    ref: 'users',
    default: []
  }
}, { versionKey: false })

export default mongoose.model('PTT', schema)
