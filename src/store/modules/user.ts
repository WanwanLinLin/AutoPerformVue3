import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import { type ILoginRequestData, loginApi, getUserInfoApi } from "@/api/login"
import { type IRegisterRequestData, type IGetCodeRequestData, GetCodeApi, RegisterApi } from "@/api/register"
import { GetApikeyApi } from "@/api/usage"
import { type RouteRecordRaw } from "vue-router"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const username = ref<string>("")
  const roles = ref<string[]>([])
  const data_ = ref<any>([])

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = (loginData: ILoginRequestData) => {
    return new Promise((resolve, reject) => {
      loginApi({
        username: loginData.username,
        password: loginData.password
      })
        .then((res) => {
          if (res.code == 200) {
            console.log(res)
            setToken(res.data.token)
            token.value = res.data.token
            resolve(true)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 注册 */
  const register = (getRegisterData: IRegisterRequestData) => {
    return new Promise((resolve, reject) => {
      RegisterApi({
        username: getRegisterData.username,
        mobile: getRegisterData.mobile,
        password: getRegisterData.password,
        email: getRegisterData.email,
        code: getRegisterData.code
      })
        .then((res) => {
          if (res.code == 200) {
            // console.log("getCode的结果是: ", res)
            // data_.value = res.data
            // console.log("data_中的数据是: ", res)
            resolve(true)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /** 获取验证码 */
  const getCode = (getCodeData: IGetCodeRequestData) => {
    return new Promise((resolve, reject) => {
      GetCodeApi({
        mobile: getCodeData.mobile
      })
        .then((res) => {
          if (res.code == 201) {
            console.log("getCode的结果是: ", res)
            data_.value = res.data
            resolve(true)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 获取用户详情 */
  const getInfo = () => {
    return new Promise((resolve, reject) => {
      getUserInfoApi()
        .then((res) => {
          roles.value = res.roles
          username.value = res.data.username
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 获取用户apikey */
  const getApikey = () => {
    return new Promise((resolve, reject) => {
      GetApikeyApi()
        .then((res) => {
          data_.value = res.data
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 切换角色 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    await getInfo()
    const permissionStore = usePermissionStore()
    permissionStore.setRoutes(roles.value)
    resetRouter()
    permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    resetRouter()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }

  return {
    token,
    roles,
    username,
    data_,
    login,
    getInfo,
    changeRoles,
    logout,
    resetToken,
    getCode,
    setRoles,
    register,
    getApikey
  }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
