import { request } from "@/utils/service"

export interface ILoginRequestData {
  /** admin 或 editor */
  username: string
  /** 密码 */
  password: string
  // /** 验证码 */
  // code: string
}

type LoginCodeResponseData = IApiResponseData<string>
type LoginResponseData = IApiResponseData<{ username: string; token: string }>
type UserInfoResponseData = IApiResponseData<{ username: string }>

/** 获取注册验证码 */
export function getLoginCodeApi() {
  return request<LoginCodeResponseData>({
    url: "login/code",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: ILoginRequestData) {
  return request<LoginResponseData>({
    url: "users/login/",
    method: "post",
    data
  })
}
/** 获取用户详情 */
export function getUserInfoApi() {
  return request<UserInfoResponseData>({
    url: "users/getUserInfo/",
    method: "get"
  })
}
