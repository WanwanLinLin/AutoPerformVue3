import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import router, { resetRouter } from "@/router"
import {
  type IGetArticleRequestData,
  type IDispatchBacklinksRequestData,
  type IGetBacklinksResultsRequestData,
  type IGetModifyArticleResultsRequestData,
  type IDownloadModifyArticlesRequestData,
  type IGetReptilesWxArticlesResultsRequestData,
  GetWxArticleApi,
  DispatchBacklinksApi,
  GetBacklinksResultsApi,
  GetModifyArticleResultsApi,
  DownloadModifyArticleApi,
  GetReptilesWxArticlesResultsApi
} from "@/api/usage"
import { type RouteRecordRaw } from "vue-router"

export const useServiceStore = defineStore("service", () => {
  const data_ = ref<any>([])

  // 爬取微信公众号文章
  const getArticle = (getArticleData: IGetArticleRequestData) => {
    return new Promise((resolve, reject) => {
      GetWxArticleApi({
        apikey: getArticleData.apikey,
        keyword: getArticleData.keyword
      })
        .then((res: any) => {
          const blob = new Blob([res], {
            type: "application/x-zip-compressed"
          })
          // console.log("结果是", blob)
          const fileName = "result" + Date.parse(new Date()) + ".zip"
          const link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          //释放内存
          window.URL.revokeObjectURL(link.href)
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 自动化发布外链
  const dispatchBacklinks = (dispatchBacklinksData: IDispatchBacklinksRequestData) => {
    return new Promise((resolve, reject) => {
      DispatchBacklinksApi({
        apikey: dispatchBacklinksData.apikey,
        keyword_list: dispatchBacklinksData.keyword_list,
        num: dispatchBacklinksData.num
      })
        .then((res: any) => {
          if (res.code == 200) {
            console.log(res)
            resolve(true)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 查询文章修改结果
  const getModifyArticleResults = (getModifyArticleResultsData: IGetModifyArticleResultsRequestData) => {
    return new Promise((resolve, reject) => {
      GetModifyArticleResultsApi({
        page: getModifyArticleResultsData.page,
        limit: getModifyArticleResultsData.limit
      })
        .then((res: any) => {
          if (res.code == 200) {
            data_.value = res.data
            // console.log("data_.value is ", data_.value)
            // console.log("res is ", res.data)
            resolve(true)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 查询外链发布结果
  const getBacklinksResults = (getBacklinksResultsData: IGetBacklinksResultsRequestData) => {
    return new Promise((resolve, reject) => {
      GetBacklinksResultsApi({
        page: getBacklinksResultsData.page,
        limit: getBacklinksResultsData.limit
      })
        .then((res: any) => {
          if (res.code == 200) {
            data_.value = res.data
            // console.log("data_.value is ", data_.value)
            // console.log("res is ", res.data)
            resolve(true)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 下载修改完成的文章
  const downloadModifyArticle = (downloadModifyArticleData: IDownloadModifyArticlesRequestData) => {
    return new Promise((resolve, reject) => {
      DownloadModifyArticleApi({
        article_name: downloadModifyArticleData.article_name
      })
        .then((res: any) => {
          const blob = new Blob([res], {
            type: "application/x-zip-compressed"
          })
          // console.log("结果是", blob)
          const fileName = downloadModifyArticleData.article_name + ".zip"
          const link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          //释放内存
          window.URL.revokeObjectURL(link.href)
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 查询爬取微信公众号文章的记录
  const getReptilesWxArticlesResults = (ReptilesWxArticlesResultsData: IGetReptilesWxArticlesResultsRequestData) => {
    return new Promise((resolve, reject) => {
      GetReptilesWxArticlesResultsApi({
        page: ReptilesWxArticlesResultsData.page,
        limit: ReptilesWxArticlesResultsData.limit
      })
        .then((res: any) => {
          if (res.code == 200) {
            data_.value = res.data
            // console.log("data_.value is ", data_.value)
            // console.log("res is ", res.data)
            resolve(true)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  return {
    data_,
    getArticle,
    dispatchBacklinks,
    getBacklinksResults,
    getModifyArticleResults,
    downloadModifyArticle,
    getReptilesWxArticlesResults
  }
})

/** 在 setup 外使用 */
export function useServiceStoreHook() {
  return useServiceStore(store)
}
