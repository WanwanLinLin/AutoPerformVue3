import { request } from "@/utils/service"

export interface IRegisterRequestData {
  username: string
  mobile: string
  password: string
  email: string
  code: string
}

export interface IGetCodeRequestData {
  mobile: string
}

type RegisterResponseData = IApiResponseData<string>
type RegetCodeResponseData = IApiResponseData<string>

// 用户注册
export function RegisterApi(data: IRegisterRequestData) {
  return request<RegisterResponseData>({
    url: "users/register/",
    method: "post",
    data
  })
}

// 获取验证码
export function GetCodeApi(path: IGetCodeRequestData) {
  console.log(path)
  return request<RegetCodeResponseData>({
    url: `users/sendCode/${path.mobile}`,
    method: "get"
  })
}
