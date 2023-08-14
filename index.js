// 環境設定（不會上傳到雲端）
import 'dotenv/config'
// 網頁 server 套件
import express from 'express'
// mongoDB 的語法轉換套件
import mongoose from 'mongoose'
// 狀態碼轉換套件
import { StatusCodes } from 'http-status-codes'
// 防止資料庫受攻擊套件
import MongoSanitize from 'express-mongo-sanitize'
// 設定跨域請求通過條件
import cors from 'cors'
// 限制流量的套件
import { rateLimit } from 'express-rate-limit'
// 引入登入驗證程式碼
import './passport/passport.js'
// 拉 routes 的 users 資料進來
import routeUsers from './routes/users.js'
// 拉 routes 的 images 資料進來
import images from './routes/images.js'
// 拉 routes 的 PTTs 資料進來
import PTTs from './routes/ptt.js'
// 拉 routes 的 activity
import activity from './routes/activity.js'

// 處理 middleware 錯誤的方式，就是將錯誤處理接在每個 middleware 後面

const app = express()

// ---限制流量套件
app.use(rateLimit({
  // 設定一個 IP 在 15 分鐘內最多 100 次請求
  windowMs: 15 * 60 * 1000,
  max: 100,
  // 設定 headers
  standardHeaders: true,
  legacyHeaders: false,
  // 超出流量時的狀態碼
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  // 超出流量時回應的訊息
  message: '先休息一下吧晚點再回來',
  // 統一格式（因為不自己寫格式的話他只會回上面 message 的部分，統一格式比較好
  // 用第四個參數(option)可以取上面的值
  handler (req, res, next, options) {
    res.status(options.statusCode).json({
      success: false,
      message: options.message
    })
  }
}))

// ---跨域請求是否接受
app.use(cors({
  // origin 代表請求來源
  // callback 代表會不會通過
  // callback(錯誤,是否允許請求)
  origin (origin, callback) {
    // undefined 來自 postman 、 github 來自我們上傳的雲端儲存位置 、 localhost 就我們測試的本機
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('CORS'), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(StatusCodes.FORBIDDEN).json({
    success: false,
    message: '請求被拒'
  })
})

// ---資料解析
app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

// 防止資料庫受攻擊用，將 mongoDB 的金錢符號去掉（要在 express.json() 後）
app.use(MongoSanitize())

app.use('/users', routeUsers)

app.use('/images', images)

app.use('/PTTs', PTTs)

app.use('/activity', activity)

// 如果上面所有問題跑完之後把沒擋到的，統一回覆 NOT_FOUND ＊是全部
app.all('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: '找不到'
  })
})
// process.env.PORT 這行是因為 render 會自動幫你配不一樣的 PORT ,沒有的話會用後面的4000
app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  await mongoose.connect(process.env.DB_URL)
  // 下面這行是防止資料庫受到攻擊用的
  mongoose.set('sanitizeFilter', true)
  console.log('資料庫連線成功')
})
