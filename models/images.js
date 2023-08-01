//  mongoDB 的語法轉換套件
import mongoose from 'mongoose'

const messageBoardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者id']
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
    default: []
  },
  name: {
    type: String,
    required: [true, '沒有作品名稱']
  },
  imgURL: {
    type: String,
    required: [true, '沒有圖片']
  },
  content: {
    type: String,
    required: [true, '沒有內容']
  },
  messageBoard: {
    type: [messageBoardSchema],
    default: []
  },
  // 類別
  theme: {
    type: String,
    required: [true, '還未分類'],
    // 設定類別的方式
    enum: {
      values: ['風景攝影', '人像攝影', '動態攝影', '建築攝影', '靜物攝影', '紀實攝影', '實驗性攝影'],
      message: '找不到 {VALUE} 分類'
    }
  }
}, { versionKey: false })

export default mongoose.model('images', schema)
