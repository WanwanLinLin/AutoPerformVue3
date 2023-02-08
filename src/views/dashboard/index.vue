<script lang="ts" setup>
import { h, ref } from "vue"
import { useUserStore } from "@/store/modules/user"
import AdminDashboard from "./admin/index.vue"
import EditorDashboard from "./editor/index.vue"
import { ElNotification } from "element-plus"

type CurrentRoleType = "admin" | "editor"

const userStore = useUserStore()
const currentRole = ref<CurrentRoleType>("admin")

currentRole.value = "editor"

ElNotification({
  title: "Hello",
  message: h(
    "a",
    { style: "color: teal", target: "_blank", href: "https://github.com/WanwanLinLin/AutoPerformVue3" },
    "欢迎欢迎, 热烈欢迎~"
  ),
  duration: 0,
  position: "bottom-right"
})
</script>

<template>
  <component :is="currentRole === 'admin' ? AdminDashboard : EditorDashboard" />
</template>
