<script lang="ts" setup>
import { useServiceStore } from "@/store/modules/service"
import { type FormInstance, FormRules, ElMessage, ElMessageBox } from "element-plus"
import type { UploadProps, UploadUserFile } from 'element-plus'
import { reactive, ref } from "vue"
import { uploadAndCheckLanApi } from "@/api/usage"
import axios from "axios"
import { getToken } from "@/utils/cache/cookies"
import { request } from "@/utils/service"

// 爬取微信公众号文章
const getArticleRuleFormRef = ref<FormInstance>()
const getArticleLoading = ref(false)
const disPatchBacklinksLoading = ref(false)
const getArticleRuleForm = reactive({
  apikey: "",
  keyword: ""
})

const startGetArticle = async () => {
  await useServiceStore()
    .getArticle({ apikey: getArticleRuleForm.apikey, keyword: getArticleRuleForm.keyword })
    .then(() => {
      disPatchBacklinksLoading.value = true
      ElMessage("文章爬取成功!")
    })
    .catch((error: any) => {
      console.log(error)
      ElMessage({
        type: "info",
        message: error
      })
    })
    .finally(() => {
      disPatchBacklinksLoading.value = false
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

/* 自动化发布外链 */
const dispatchBacklinksRuleFormsRef = ref<FormInstance>()
const dispatchBacklinksRuleForms = reactive<any>({ items: [{}] })
const collectDispatchBacklinksDataForm = reactive<any>({
  keyword_list: [],
  apikey: "",
  num: ""
})
const addItem = () => {
  dispatchBacklinksRuleForms.items.push({
    keyword: "",
    url: ""
  })
  // console.log("this is add: ", dispatchBacklinksRuleForms.items)
}
const delItem = (index: any) => {
  dispatchBacklinksRuleForms.items.splice(index, 1)
  // console.log("this is del: ", dispatchBacklinksRuleForms.items)
}
const startDispatchBacklinks = async () => {
  getKeywordList().forEach((e) => {
    collectDispatchBacklinksDataForm.keyword_list.push(e)
  })
  // collectDispatchBacklinksDataForm.keyword_list =
  // console.log("KL值为: ", collectDispatchBacklinksDataForm.keyword_list)
  // console.log("请求数据为: ", collectDispatchBacklinksDataForm)
  disPatchBacklinksLoading.value = true
  await useServiceStore()
    .dispatchBacklinks({
      apikey: collectDispatchBacklinksDataForm.apikey,
      keyword_list: collectDispatchBacklinksDataForm.keyword_list,
      num: collectDispatchBacklinksDataForm.num
    })
    .then(() => {
      ElMessage("发布成功!!准备刷新页面...")
      sleep(2000)
      location.reload()
    })
    .catch((error: any) => {
      console.log(error)
      ElMessage({
        type: "info",
        message: error
      })
      sleep(2000)
      location.reload()
    })
    .finally(() => {
      disPatchBacklinksLoading.value = false
    })
}
const getKeywordList = () => {
  addItem()
  delItem(dispatchBacklinksRuleForms.items.length - 1)
  const tempArray: Array<object> = []
  dispatchBacklinksRuleForms.items.forEach((element: any) => {
    tempArray.push(JSON.stringify({ [element.keyword]: element.url }))
  })
  return tempArray
}
const sleep = (ms: any) => {
  //sleep延迟方法2
  const unixtime_ms = new Date().getTime()
  while (new Date().getTime() < unixtime_ms + ms) {}
}

/*自动翻译并校验语法*/
const uploadAndCheckLoading = ref(false)
const uploadAndCheckRuleFormsRef = ref(null)
const uploadAndCheckRuleForms = reactive<any>({ apikey: "" })
const fileList = ref<UploadUserFile[]>([])
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
  ElMessage("成功移除")
}
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile)
}
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`你确定要移除 ${uploadFile.name} 吗 ?`).then(
    () => true,
    () => false
  )
}
const uploadFile = (param: any) => {
  uploadAndCheckLoading.value = true
  const file = param.file
  console.log(param.file)
  const file_form = new FormData()
  file_form.append("file", file)
  console.log(file_form)
  // (暂时使用axios直接发请求)
  // axios({
  //   url: "v1/service/tranAndModify/",
  //   method: "POST",
  //   headers: {
  //     token: getToken(),
  //     apikey: uploadAndCheckRuleForms.apikey
  //   },
  //   data: file_form
  // })
  request({
    url: "service/tranAndModify/",
    method: "post",
    data: file_form,
    headers: {
      token: getToken(),
      apikey: uploadAndCheckRuleForms.apikey
    }
  })
    .then((res) => {
      // console.log(res)
      if (res.data.code != 200) {
        uploadAndCheckLoading.value = false
        sleep(2000)
        // ElMessage({ type: "error", message: "apikey不正确或上传的文件格式错误" })
        location.reload()
      } else {
        // ElMessage({ message: "修改并校验成功, 你可以前往资源界面下载了" })
        uploadAndCheckLoading.value = false
        sleep(2000)
        location.reload()
      }
    })
    .catch((err) => {
      uploadAndCheckLoading.value = false
      ElMessage({ type: "error", message: err })
      sleep(2000)
      location.reload()
    })
}
const submitUpload = () => {
  uploadAndCheckRuleFormsRef.value.submit()
}
</script>
<template>
  <div>
    <div style="border: solid; border-radius: 30px; width: 80%; margin: 80px auto">
      <div style="margin: 70px auto; width: 70%; border: solid 1px whitesmoke">
        <el-form
          style="margin: 40px auto"
          ref="getArticleRuleFormRef"
          :model="getArticleRuleForm"
          status-icon
          label-width="80px"
          class="demo-getArticleRuleForm"
        >
          <el-form-item label="功能1" prop="pass">
            <el-tag class="ml-2" type="info">自动化爬取文章</el-tag>
          </el-form-item>
          <el-form-item label="apikey" prop="apikey">
            <el-input v-model="getArticleRuleForm.apikey" placeholder="请输入你的apikey" />
          </el-form-item>
          <el-form-item label="keyword" prop="keyword">
            <el-input v-model="getArticleRuleForm.keyword" placeholder="请输入要爬取的关键词" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="getArticleLoading" @click="startGetArticle">开始爬取</el-button>
            <el-button @click="resetForm(getArticleRuleFormRef)">重置输入</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="border: solid; border-radius: 30px; width: 80%; margin: 80px auto">
      <div style="margin: 70px auto; width: 70%; border: solid 1px whitesmoke">
        <el-form-item label="功能2" prop="pass" style="margin: 20px auto" label-width="80px">
          <el-tag class="ml-2" type="info">自动化发布外链</el-tag>
        </el-form-item>
        <el-row v-for="(item, index) in dispatchBacklinksRuleForms.items" :key="index" style="margin-left: 0.5vw">
          <el-col :span="22">
            <el-form :inline="true" class="demo-ruleForm" ref="dispatchBacklinksRuleFormsRef">
              <el-form-item label="外链信息" prop="keyword">
                <el-input v-model="item.keyword" placeholder="请输入关键词" style="width: 15vw" />
              </el-form-item>
              <el-form-item prop="url">
                <el-input v-model="item.url" placeholder="请输入URL" style="width: 150px" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="2">
            <el-button
              class="el-icon-circle-plus-outline"
              type="info"
              v-if="index == 0"
              style="font-size: 5px; color: blanchedalmond"
              @click="addItem"
              >+</el-button
            >
            <el-button
              class="el-icon-remove-outline"
              type="danger"
              v-if="index != 0"
              style="font-size: 5px; color: blanchedalmond"
              @click="delItem(index)"
              >-</el-button
            >
          </el-col>
        </el-row>
        <el-form-item label="apikey" label-width="80px">
          <el-input v-model="collectDispatchBacklinksDataForm.apikey" placeholder="请输入apikey" style="width: 150px"
        /></el-form-item>
        <el-form-item label="发布数量" label-width="80px">
          <el-input v-model="collectDispatchBacklinksDataForm.num" placeholder="请输入发布的数量" style="width: 150px"
        /></el-form-item>
        <el-form-item label-width="150px">
          <el-button type="primary" :loading="disPatchBacklinksLoading" @click="startDispatchBacklinks"
            >开始发布</el-button
          >
        </el-form-item>
      </div>
    </div>
    <div style="border: solid; border-radius: 30px; width: 80%; margin: 80px auto">
      <div style="margin: 70px auto; width: 70%; border: solid 1px whitesmoke">
        <el-form-item label="功能3" prop="pass" style="margin: 20px auto" label-width="80px">
          <el-tag class="ml-2" type="info">自动化翻译和校验语法</el-tag>
        </el-form-item>
        <el-form-item label="apikey" label-width="80px">
          <el-input v-model="uploadAndCheckRuleForms.apikey" placeholder="请输入apikey" style="width: 150px"
        /></el-form-item>
        <el-form-item style="margin: 40px auto" label-width="80px">
          <el-upload
            :limit="1"
            class="upload-demo"
            ref="uploadAndCheckRuleFormsRef"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            :http-request="uploadFile"
            :before-remove="beforeRemove"
          >
            <el-button slot="trigger" size="large" type="success">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item style="margin: 40px auto" label-width="80px">
          <el-button :loading="uploadAndCheckLoading" size="large" type="primary" @click="submitUpload">点击上传文件</el-button>
          <div slot="tip" class="el-upload__tip">目前只支持markdown格式的文件</div>
        </el-form-item>
      </div>
    </div>
  </div>
</template>
