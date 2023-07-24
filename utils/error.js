// utils 中會放常用的 function

// jsDOC (自己寫提示)
/**
 * 從 Mongoose 的 ValidationError 取第一個驗證錯誤訊息
 * @param error Mongoose ValidationError
 * @returns 錯誤訊息
 */

export const getMessageFromValidationError = (error) => {
  const key = Object.keys(error.errors)[0]
  return error.errors[key].message
}
