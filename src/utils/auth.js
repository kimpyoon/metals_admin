import Cookies from 'js-cookie'
import md5 from 'js-md5'
const TokenKey = 'metals_admin_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, { expires: 30 })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function calcuMd5 (pwd) {
  pwd = md5(pwd)
  return pwd.toLowerCase()
}
