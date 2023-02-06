<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { User, Lock, ChatDotRound, Message, Iphone } from "@element-plus/icons-vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import { type FormInstance, FormRules, ElMessage, ElMessageBox } from "element-plus"
import { type ILoginRequestData } from "@/api/login"
import { type IRegisterRequestData, type RegetCodeResponseData } from "@/api/register"

const router = useRouter()
const registerFormRef = ref<FormInstance | null>(null)

/** 注册按钮 Loading */
const loading = ref(false)

/** 登录表单数据 */
const registerForm: IRegisterRequestData = reactive({
  username: "",
  mobile: "",
  password: "",
  confirm_password: "",
  email: "",
  code: ""
})

/** 自定义校验规则 */
// 1.校验确认密码
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"))
  } else if (value !== registerForm.password) {
    callback(new Error("两次密码不匹配!"))
  } else {
    callback()
  }
}

// 2.校验手机号
const checkMobile = (rule: any, value: any, callback: any) => {
  const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
  if (regMobile.test(value)) {
    // 合法的手机号
    return callback()
  }
  callback(new Error("请输入合法的手机号"))
}

// 3.校验邮箱
const checkEmail = (rule: any, value: any, callback: any) => {
  const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (regEmail.test(value)) {
    // True 合法的邮箱
    return callback()
  }
  callback(new Error("请输入合法的邮箱"))
}

/** 登录表单校验规则 */
const registerFormRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  mobile: [{ required: true, validator: checkMobile, trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  confirm_password: [{ validator: validatePass2, trigger: "blur" }],
  email: [{ required: false, validator: checkEmail, trigger: "blur" }],
  code: [
    { required: true, message: "请输入手机验证码", trigger: "blur" },
    { min: 4, max: 4, message: "验证码的长度应该为4个字符", trigger: "blur" }
  ]
}

const gotoLogin = () => {
  router.push({
    path: "/"
  })
}

/** 注册逻辑 */
const handleRegister = async () => {
  await registerFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .register({
          username: registerForm.username,
          mobile: registerForm.mobile,
          password: registerForm.password,
          email: registerForm.email,
          code: registerForm.code
        })
        .then(() => {
          ElMessage({
            type: "success",
            message: "注册成功！正在跳转登录页面..."
          })
          router.push({ path: "/" })
        })
        .catch(() => {
          // createCode()
          registerForm.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      return false
    }
  })
}
/** 获取手机验证码逻辑 */
const getCode = async () => {
  await useUserStore()
    .getCode({
      mobile: registerForm.mobile
    })
    .then(() => {
      ElMessage("验证码发送成功！")
      registerForm.code = useUserStore().data_
    })
    .catch((error) => {
      console.log(error)
      ElMessage({
        type: "info",
        message: error
      })
    })
}
</script>

<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch" />
    <div class="login-card">
      <div class="title">
        <img src="@/assets/layout/logo-text-4.png" />
      </div>
      <div class="content">
        <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" @keyup.enter="handleRegister">
          <el-form-item prop="username">
            <el-input
              v-model.trim="registerForm.username"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="mobile">
            <el-input
              v-model.trim="registerForm.mobile"
              placeholder="手机号"
              type="text"
              tabindex="1"
              :prefix-icon="Iphone"
              size="large"
            />
            <el-button style="width: 100px; height: 38px" @click.prevent="getCode">获取验证码</el-button>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="registerForm.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model.trim="registerForm.email"
              placeholder="邮箱"
              type="text"
              tabindex="1"
              :prefix-icon="Message"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model.trim="registerForm.code"
              placeholder="验证码"
              type="text"
              tabindex="1"
              :prefix-icon="ChatDotRound"
              size="large"
            />
          </el-form-item>

          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleRegister">
            点击注册
          </el-button>
          <el-button :loading="loading" type="success" style="margin-left: 0" size="large" @click.prevent="gotoLogin()">
            已经有账号？点击此处登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    width: 480px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
