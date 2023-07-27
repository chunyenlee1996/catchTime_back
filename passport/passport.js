import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import users from '../models/users.js'

// passport 是用驗證方式寫自己的驗證策略，會用這個套件是因為如果有要跟其他 像是 line 等等 的東西串的話用這個比較方便
// 詳細有什麼驗證策略可以看 http://passportjs.org/packages
// 登入驗證
passport.use('login', new passportLocal.Strategy({
  // usernameField(帳號欄位): 'account(你寫的帳號命名)',
  // usernameField(密碼欄位): 'password(你寫的密碼命名)',
  // 帳號密碼命名需要跟資料庫的名字一樣
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, done) => {
  // done(錯誤, 傳到下一步的資料, 傳到下一步 info 的內容)
  try {
    // 找到要登入的那個帳號
    // findOne() 這是 passport 的 function
    const user = await users.findOne({ account })
    // 如果不是使用者拋出一個 error
    if (!user) {
      throw new Error('USER')
    }
    // 如果密碼不是使用者的密碼，拋出 密碼錯誤的 error
    // bcrypt 的語法
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('PASSWORD')
    }
    // 都正常就下一步
    return done(null, user)
  } catch (error) {
    if (error.message === 'USER') {
      return done(null, false, { message: '帳號不存在' })
    } else if (error.message === 'PASSWORD') {
      return done(null, false, { message: '密碼錯誤' })
    } else {
      return done(error, false, { message: '錯誤' })
    }
  }
}))

// 檢查過期
passport.use('jwt', new passportJWT.Strategy({
  // 設定從哪裡拿 jwt
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 設定secretOrKey 綁 .env 裡的 JWT_SECRET
  secretOrKey: process.env.JWT_SECRET,
  // 從 req 裡面把 token 取出來 看有沒有這個 token(jwt)
  passReqToCallback: true,
  // 忽略過期檢查(要做舊換新功能，要拿舊的 jwt 換新的 jwt ，不過一般會擋舊的 jwt 所以要開啟忽略)
  ignoreExpiration: true
}, async (req, payload, done) => {
  try {
    // 檢查過期狀態
    // 解構出來的東西會放在 payload 裡面
    // payload.exp 是解譯出來的 JWT 過期時間，單位是秒
    // Date.now() 單位是毫秒
    // expired 已到期
    const expired = payload.exp * 1000 < Date.now()

    /*
      http://localhost:4000/users/me?aaa=111
      req.originalUrl ---> /users/me?aaa=111
      req.baseUrl ---> /users
      req.path ---> /me
      req.baseUrl + req.path ---> /users/me
      req.query ---> { aaa: 111 }
    */
    const url = req.baseUrl + req.path
    // 如果過期了(expired)或網址不是下方那兩個就顯示登入逾時
    // 轉而言之如果沒過期或是下方那兩個網址就跳過
    // 這是後端的路徑
    if (expired && url !== '/users/extend' && url !== '/users/logout') {
      throw new Error('EXPIRED')
    }

    // 把 token 取出來
    // split() 是以什麼作為分隔符，結果會是陣列，向下面就是以空格做分隔符號
    const token = req.headers.authorization.split(' ')[1]

    const user = await users.findOne({ _id: payload._id, tokens: token })
    if (!user) {
      throw new Error('NO USER')
    }
    return done(null, { user, token })
  } catch (error) {
    if (error.message === 'EXPIRED') {
      return done(null, false, { message: '登入逾時' })
    } else if (error.message === 'NO USER') {
      return done(null, false, { message: '使用者或 JWT 無效' })
    } else {
      return done(error, false, { message: '錯誤' })
    }
  }
}))
