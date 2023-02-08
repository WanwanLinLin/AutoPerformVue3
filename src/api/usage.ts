import { request } from "@/utils/service"
import { getToken } from "@/utils/cache/cookies"
import Qs from "qs"
import { fi } from "element-plus/es/locale"

export interface IGetArticleRequestData {
  apikey: string
  keyword: string
}

export interface IDispatchBacklinksRequestData {
  apikey: string
  keyword_list: Array<object>
  num: number
}

export interface IUploadAndCheckLanRequestData {
  apikey: string
}

export interface IGetBacklinksResultsRequestData {
  page: number
  limit: number
}

export interface IGetModifyArticleResultsRequestData {
  page: number
  limit: number
}

type GetApikeyResponseData = IApiResponseData<{ apikey: string; remaining_num: number }>
type DispatchBacklinksResponseData = IApiResponseData<null>
type GetBacklinksResultsResponseData = IApiResponseData<object>
type GetModifyArticleResultsResponseData = IApiResponseData<object>

// 获取用户唯一apikey
export function GetApikeyApi() {
  return request<GetApikeyResponseData>({
    url: "users/getApiKey/",
    method: "get"
  })
}

// 爬取微信公众号文章
export function GetWxArticleApi(data: IGetArticleRequestData) {
  return request({
    url: "service/getArticle/",
    method: "get",
    params: { keyword: data.keyword },
    headers: {
      token: getToken(),
      apikey: data.apikey
    },
    responseType: "blob"
  })
}

// 自动化发布外链
export function DispatchBacklinksApi(data: IDispatchBacklinksRequestData) {
  return request<DispatchBacklinksResponseData>({
    url: "service/dispatchBacklinks/",
    method: "get",
    params: { keyword_list: data.keyword_list, num: data.num },
    headers: {
      token: getToken(),
      apikey: data.apikey
    }
  })
}

// 查询外链的发布结果
export function GetBacklinksResultsApi(data: IGetBacklinksResultsRequestData) {
  return request<GetBacklinksResultsResponseData>({
    url: "service/getBacklinksRecords/",
    method: "get",
    params: { page: data.page, limit: data.limit }
  })
}

// 查询文章的修改结果
export function GetModifyArticleResultsApi(data: IGetModifyArticleResultsRequestData) {
  return request<GetModifyArticleResultsResponseData>({
    url: "service/getModifiedArticles/",
    method: "get",
    params: { page: data.page, limit: data.limit }
  })
}
