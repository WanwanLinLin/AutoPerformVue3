<script lang="ts" setup>
import { reactive, ref } from "vue"
import { getBacklinksResults } from "@/api/usage"
import { useServiceStore } from "@/store/modules/service"
import { type FormInstance, FormRules, ElMessage, ElMessageBox } from "element-plus"
import { usePagination } from "@/hooks/usePagination"

const { paginationData } = usePagination()
/** 查询外链发布结果 */
const getBacklinksResultsRuleForms = reactive<any>({ items: [{}] })
const getBacklinksResultsRequestForms = reactive<any>({
  page: 1,
  limit: 3,
  total: 0,
  pages: 0
})
const tableData = reactive([
  {
    id: "xxx",
    created_time: "xxxx-xx-xx xx:xx:xx",
    backlink_url: "xxxx",
    keyword: "xxx"
  }
])
const startGetBacklinksResults = async (pages=1) => {
  tableData.length = 0
  getBacklinksResultsRequestForms.page = pages
  await useServiceStore()
    .getBacklinksResults({
      page: getBacklinksResultsRequestForms.page,
      limit: getBacklinksResultsRequestForms.limit
    })
    .then(() => {
      ElMessage({ type: "success", message: "刷新成功!" })
      const { records, total, size, current, searchCount, pages } = useServiceStore().data_
      getBacklinksResultsRequestForms.total = total
      getBacklinksResultsRequestForms.pages = pages
      console.log("结果是:", records)
      records.forEach((element) => {
        tableData.push(element)
      })
    })
    .catch((error) => {
      console.log(error)
      ElMessage({
        type: "error",
        message: error
      })
    })
}
const add_table_index = (index: any) => {
  return index + 1
}
const handleSizeChange = (limit: any) => {
  getBacklinksResultsRequestForms.limit = limit
  startGetBacklinksResults()
}

/** 查询文章修改结果并下载文章 */
const getModifyArticleResultsRequestForms = reactive<any>({
  page: 1,
  limit: 3,
  total: 0,
  pages: 0
})
const getModifyArticleTableData = reactive([
  {
    id: "xxx",
    created_time: "xxxx-xx-xx xx:xx:xx",
    article_name: "xxxx"
  }
])
const startGetModifyArticleResults = async (pages=1) => {
  getModifyArticleTableData.length = 0
  getBacklinksResultsRequestForms.page = pages
  await useServiceStore()
    .getModifyArticleResults({
      page: getModifyArticleResultsRequestForms.page,
      limit: getModifyArticleResultsRequestForms.limit
    })
    .then(() => {
      ElMessage({ type: "success", message: "刷新成功!" })
      const { records, total, size, current, searchCount, pages } = useServiceStore().data_
      getModifyArticleResultsRequestForms.total = total
      getModifyArticleResultsRequestForms.pages = pages
      console.log("结果是:", records)
      records.forEach((element) => {
        getModifyArticleTableData.push(element)
      })
    })
    .catch((error) => {
      console.log(error)
      ElMessage({
        type: "error",
        message: error
      })
    })
}
const handleSizeChange2 = (limit: any) => {
  getModifyArticleResultsRequestForms.limit = limit
  startGetModifyArticleResults()
}
</script>
<template>
  <div>
    <div style="border: solid; border-radius: 40px; width: 100%; margin: 80px auto">
      <el-form-item label-width="40px">
        <el-button type="primary" @click="startGetBacklinksResults()">点击刷新</el-button>
        <el-tag class="ml-2" type="info" style="margin: 30px; width: 40%">查询发布外链结果</el-tag>
      </el-form-item>
      <div style="margin: 20px auto; width: 80%; border: solid 1px whitesmoke; margin-bottom: 80px">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column fixed type="index" :index="add_table_index" label="序号" width="60" />
          <el-table-column prop="created_time" label="创建时间" width="170" />
          <el-table-column prop="backlink_url" label="外链地址" width="270" />
          <el-table-column prop="keyword" label="关键词" width="250" />
          <!-- <el-table-column fixed="right" label="Operations" width="200">
          <template #default>
            <el-button link type="primary" size="small" @click="handleClick">Detail</el-button>
            <el-button link type="primary" size="small">Edit</el-button>
          </template>
        </el-table-column> -->
        </el-table>
      </div>
      <div style="width: 80%; margin: 80px auto; margin-bottom: 30px">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="getBacklinksResultsRequestForms.total"
          :page-size="getBacklinksResultsRequestForms.limit"
          :currentPage="getBacklinksResultsRequestForms.page"
          @size-change="handleSizeChange"
          @current-change="startGetBacklinksResults"
        />
      </div>
    </div>
    <div style="border: solid; border-radius: 40px; width: 100%; margin: 80px auto">
      <el-form-item label-width="40px">
        <el-button type="primary" @click="startGetModifyArticleResults()">点击刷新</el-button>
        <el-tag class="ml-2" type="info" style="margin: 30px; width: 40%">查询文章修改结果</el-tag>
      </el-form-item>
      <div style="margin: 20px auto; width: 80%; border: solid 1px whitesmoke; margin-bottom: 80px">
        <el-table :data="getModifyArticleTableData" style="width: 100%">
          <el-table-column fixed type="index" :index="add_table_index" label="序号" width="60" />
          <el-table-column prop="created_time" label="文章名" width="250" />
          <el-table-column prop="article_name" label="完成时间" width="250" />
          <el-table-column label="操作" width="85">
            <template #default="scope">
              <el-button type="info" text bg size="large">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="width: 80%; margin: 80px auto; margin-bottom: 30px">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="getModifyArticleResultsRequestForms.total"
          :page-size="getModifyArticleResultsRequestForms.limit"
          :currentPage="getModifyArticleResultsRequestForms.page"
          @size-change="handleSizeChange2"
          @current-change="startGetModifyArticleResults"
        />
      </div>
    </div>
  </div>
</template>
