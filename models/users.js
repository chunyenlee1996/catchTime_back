//  mongoDB 的語法轉換套件
import mongoose from 'mongoose'
// 自訂驗證（寫 mongoose 的自定驗證）
import validator from 'validator'
// 密碼加密
import bcrypt from 'bcrypt'
// 引入 enum 中的 userRole
import UserRole from '../enums/UserRole.js'

const schema = new mongoose.Schema({
  account: {
    type: String,
    required: [true, '缺少帳號'],
    minlength: [4, '帳號太短'],
    maxlength: [20, '帳號太長'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  password: {
    type: String,
    required: [true, '缺少密碼']
  },
  email: {
    type: String,
    required: [true, '缺少信箱'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '信箱格式錯誤'
    }
  },
  tokens: {
    type: [String],
    default: []
  },
  phoneNumber: {
    type: String,
    required: [true, '缺少電話號碼'],
    match: [/^[0-9]+$/, '電話格式錯誤']
  },
  userName: {
    type: String,
    required: [true, '請輸入姓名']
  },
  avatar: {
    type: String,
    // 設定預設值
    // default: ''
    default () {
      // this 會指其他欄位的資料
      return `https://source.boringavatars.com/beam/250/${this.account}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`
    }
  },
  // role 角色（這邊指是否為管理員）
  // enum 列舉，先定義好什麼代表什麼，可以增加可讀性，像是鍵盤 'A','S','D','W'，將 'A' 定義為左，就可以在這邊直接寫左，會比寫 'A' 的可讀性高
  role: {
    type: Number,
    default: UserRole.USER
  },
  following: {
    type: [mongoose.ObjectId],
    ref: 'users',
    default: []
  },
  followers: {
    type: [mongoose.ObjectId],
    ref: 'users',
    default: []
  },
  likeImg: {
    type: [mongoose.ObjectId],
    ref: 'images',
    default: []
  },
  likePTT: {
    type: [mongoose.ObjectId],
    ref: 'PTT',
    default: []
  }
}, { versionKey: false }) // , { versionKey: false } 加這個是因為 mongoDB 資料庫中有一個＿＿Ｖ的位置用來存放這筆資料修改過幾次，如果沒有用到的話可以加這行來去掉這個欄位

// ---密碼加密
// 這邊不能使用箭頭函式，因為我們的 this 就是指到我們要保存的那個資料
// this 會因為位置的不同，會有不同的意思
// 新增資料時，驗證完畢保存前執行（ middleware)
schema.pre('save', function (next) {
  // 這邊把 this 放入變數的原因是因為 this 會指到上一個 f(x) 的 this 如果這個 f(x) 中又有一個 f(x) 裏面 f(x) 寫 this 他會指到裡面的 f(x) 而不是外面的 f(x)
  const user = this
  // 如果 user 的 password 欄位有更改的話
  if (user.isModified('password')) {
    // 判斷密碼長度有沒有小於 4
    if (user.password.length < 4) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼太短' }))
      next(error)
      return
    // 判斷密碼長度有沒有大於 20
    } else if (user.password.length > 20) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼太長' }))
      next(error)
      return
    } else {
      // 給密碼加密，加鹽 10 次
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

// middleware 要做更新時會用到 findOneAndUpdate 這個時機
// findOneAndUpdate 或 findByIdAndUpdate 時，驗證完畢保存前執行
// 用 id 更新使用者資料的時候，順便把密碼加密時
schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length < 4) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼太短' }))
      next(error)
      return
    } else if (user.password.length > 20) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼太長' }))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

export default mongoose.model('users', schema)
