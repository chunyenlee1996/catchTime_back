//  mongoDB 的語法轉換套件
import mongoose from 'mongoose'

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
    required: [true, '未填活動名稱']
  },
  content: {
    type: String,
    required: [true, '未填活動內容']
  },
  address: {
    type: String,
    required: [true, '未填地點']
  },
  mainURL: {
    type: String
  },
  date: {
    type: Date,
    required: [true, '未填寫日期']
  },
  imgURL: {
    type: String,
    default: 'https://res.cloudinary.com/djjixkg5i/image/upload/v1692752651/vgvxfdfhhobhtxjlvf1u.jpg'
  },
  join: {
    type: [mongoose.ObjectId],
    ref: 'users',
    default: []
  }
}, { versionKey: false })

export default mongoose.model('activity', schema)
