import { StatusCodes } from 'http-status-codes'

/**
 * 檢查請求的 Content-Type
 * @param {string} type Content-Type
 * @return express middleware function
 */
// 驗證資料型態的 middlewares
// (req, res, next) 是 express middlewares 的 f(x) 格式
export default (type) => {
  return (req, res, next) => {
    if (
      // content-type 是會標明這個請求的資料類型是什麼
      // 判斷 headers 有沒有 content-type 或 content-type 有沒有包含 type
      !req.headers['content-type'] ||
      !req.headers['content-type'].includes(type)
    ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
      return
    }
    next()
  }
}
