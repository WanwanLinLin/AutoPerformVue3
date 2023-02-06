<script lang="ts" setup>
import { type FormInstance, FormRules, ElMessage, ElMessageBox } from "element-plus"
import Clipboard from "clipboard"
import { reactive } from "vue"

// do not use same name with ref
const form = reactive({
  name: "apikey123dsafsdafgewrdgfr32rdfcsf",
  region: "100"
})

const copyData = () => {
  const Url = form.name // 点击文字复制的地址
  const clipboard = new Clipboard(".copyData", {
    text: function () {
      return Url
    }
  })
  // 复制成功
  clipboard.on("success", () => {
    ElMessage({
      type: "info",
      message: "apikey复制成功!"
    })
    // 释放内存
    clipboard.destroy()
  })
  // 复制失败
  clipboard.on("error", () => {
    // 不支持复制
    ElMessage({
      type: "success",
      message: "复制失败!请稍后重试"
    })
    // 释放内存
    clipboard.destroy()
  })
}

const onSubmit = () => {
  console.log("submit!")
}
</script>
<template>
  <div style="margin: 80px auto; width: 70%">
    <el-form :model="form" style="height: 20%" label-width="100px" size="large">
      <el-form-item label="apikey">
        <!-- <el-input v-model="form.name" /> -->
        <el-tag class="ml-2" type="info">{{ form.name }}</el-tag>
      </el-form-item>
      <el-form-item label="剩余使用次数">
        <el-tag class="ml-2" type="info">{{ form.region }}</el-tag>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit">点击获取/刷新apikey</el-button>
        <el-button class="copyData" type="success" @click="copyData">复制apikey</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
