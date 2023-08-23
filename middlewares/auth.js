// auth 授權
// 這邊在寫 express 的 middlewares

import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

// express 的 function 如果你寫:
// 2個參數就代表你寫的是 controllers (req,res)
// 3個參數就代表你寫的是 middlewares (req,res,next)
// 4個參數就代表你寫的是 middlewares的錯誤處理 (_,req,res,next)底線是 error 用不到可以用底線代替
export const login = (req, res, next) => {
  // authenticate 是 passport 的驗證
  // 這邊在寫 login 的驗證方式
  // session 是把一些驗證的資料放在 server 端，因為我們前後端是在不同的網域，設定 session 會有問題
  // (error, user, info) 對應到 done 傳來的參數 (在 passport.js)
  passport.authenticate('login', { session: false }, (error, user, info) => {
    if (error || !user) {
      // 這個錯誤是在講，進來的資料少了 usernameField 和 passwordField 定義的欄位時
      if (info.message === 'Missing credentials') {
        info.message = '欄位錯誤'
      }
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: info.message
      })
    }
    // 將查詢到的使用者放入 req 給之後的 controller 或 middleware 使用
    req.user = user
    // 下一步
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      // 下方這句在講 info 是不是 jwt錯誤
      // instanceof 是拿來判斷你的錯誤是哪一種錯誤
      // JsonWebTokenError 這個錯誤可能原因:過期(這裡不會有，在passport.js有寫忽略)、被竄改、或 secrete 無效
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'JWT 錯誤'
        })
      } else {
        if (info.message === 'No auth token') {
          info.message = '缺少 JWT'
        } else {
          console.log(info.message)
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message || '錯誤'
        })
      }
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
