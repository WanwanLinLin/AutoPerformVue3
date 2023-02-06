/** 统一处理 Cookie */

import CacheKey from "@/constants/cacheKey"
import Cookies from "js-cookie"

export const getToken = () => {
  return Cookies.get("token")
}
export const setToken = (token: string) => {
  Cookies.set("token", token)
}
export const removeToken = () => {
  Cookies.remove("token")
}
