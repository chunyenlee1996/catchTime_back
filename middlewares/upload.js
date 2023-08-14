// 解析一種叫 form-data 資料格式的套件
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
// 跟 multer 搭配使用，用來將資料放到 cloudinary
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

// cloudinary 配置
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({
  // 設定儲存位置
  storage: new CloudinaryStorage({ cloudinary }),
  // 過濾前端送過來的檔案
  fileFilter (req, file, callback) {
    // callback(錯誤, 是否允許)
    // mimetype 是一種檔案類型，要更改可以到 multer 上看有哪些可以改
    if (['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
      callback(null, true)
    } else {
      // 使用跟套件一樣的錯誤格式，方便之後處理
      callback(new multer.MulterError('LIMIT_FILE_FORMAT'), false)
    }
  },
  limits: {
    // 限制檔案大小，超過會出現 LIMIT_FILE_SIZE 錯誤
    fileSize: 5464 * 8192
  }
})

export default (req, res, next) => {
  // 這邊的 imgURL 要跟前端傳進來的欄位名稱一樣
  upload.single('imgURL')(req, res, error => {
    if (error instanceof multer.MulterError) {
      // 處理上傳錯誤
      console.log(error)
      let message = '上傳錯誤'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FILE_FORMAT') {
        message = '檔案格式錯誤'
      }
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error) {
      // 處理其他錯誤
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器錯誤'
      })
    } else {
      // 沒有錯誤，繼續
      next()
    }
  })
}
