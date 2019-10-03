export function validateMoney (rule, value, callback) {
  const priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
  if (value) {
    const price = value
    if (!priceReg.test(price)) {
      callback(new Error('请输入整数或者保留两位小数'))
    } else {
      callback()
    }
  } else {
    callback(new Error('此项必填'))
  }
}
export function validateLaborMoney (rule, value, callback) {
  const priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
  if (value) {
    const price = value
    if (!priceReg.test(price)) {
      callback(new Error('请输入整数或者保留两位小数'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
export function validateDuration (rule, value, callback) {
  const reg = /^[0-9]*$/
  if (value) {
    if (!reg.test(value)) {
      callback(new Error('请输入有效天数'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
