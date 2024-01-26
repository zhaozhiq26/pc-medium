<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores'
import { getCountryAPI } from '@/api/public'
import type { EmRegisterRes } from '@/types/login'
import { ElMessage, type FormInstance } from 'element-plus'
import { emailRegisterAPI, emCode, logoutAPI } from '@/api/login'

const codeInfo = ref()
const countryInfo = ref()
const ErrorBox = ref(false)
const loadingBox = ref(false)
const userStore = useUserStore()
const ruleRef = ref<FormInstance>()
const passwordType = ref('password')
const passwordType1 = ref('password')
const emit = defineEmits(['toHomeYW'])
const sms = reactive({
  disabled: false,
  total: 60,
  count: 0
})
const loginForm = reactive<EmRegisterRes>({
  userId: userStore.userInfo.userId,
  countryId: '',
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
  type: 1
})
const countryChange = async () => {
  const res = await getCountryAPI()
  countryInfo.value = res.data
}

const loginRules = {
  countryId: [
    { required: true, trigger: 'change', message: '请选择您国家/地区' }
  ],
  email: [
    { required: true, trigger: 'blur', message: '请输入邮箱地址' },
    { required: true, validator: emailValidator, trigger: 'blur' }
  ],
  code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
  password: [
    { required: true, trigger: 'blur', message: '请输入您的密码' },
    { required: true, validator: passwordValidator, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ]
}

const emRegular = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

// 校验邮箱
function emailValidator(rule: any, value: any, callback: any) {
  if (loginForm.email === null) {
    callback()
  } else if (loginForm.email === '') {
    callback(new Error('请输入邮箱地址'))
  } else if (!emRegular.test(<string>loginForm.email)) {
    callback(new Error('请输入正确格式的邮箱地址'))
  } else {
    callback()
  }
}

// 校验密码
function passwordValidator(rule: any, value: any, callback: any) {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/
  if (!passwordRegex.test(value)) {
    callback(new Error('请输入6-18位数字和字母组合'))
  } else {
    callback()
  }
}

// 获取验证码
const send = async () => {
  if (loginForm.email === '') {
    ElMessage.error('邮箱地址不能为空!')
    return
  } else if (emRegular.test(<string>loginForm.email)) {
    await emCode(loginForm.email)
      .then(res => {
        timerHandler()
        codeInfo.value = res.msg
      })
      .catch(err => {
        ErrorBox.value = true
      })
  }
}

const YouWei = () => {
  ErrorBox.value = false
}
// 确认密码
function equalToPassword(rule: any, value: any, callback: any) {
  if (loginForm.password !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 保存
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await emailRegisterAPI(<EmRegisterRes>{
        userId: userStore.userInfo.userId,
        countryId: loginForm.countryId,
        email: loginForm.email,
        password: loginForm.password,
        code: loginForm.code,
        type: 1
      }).then(() => {
        userStore.setUserInfo().then(() => {
          ElMessage.success('邮箱绑定成功')
          location.href = '/'
        })
      })
    }
  })
}

// 返回登陆页
const ToHome = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  await logoutAPI().then(() => {
    window.localStorage.clear()
    emit('toHomeYW')
  })
}

// 密码显示隐藏
const showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
}

const showPwd1 = () => {
  if (passwordType1.value === 'password') {
    passwordType1.value = ''
  } else {
    passwordType1.value = 'password'
  }
}

// 计时器处理器
const timerHandler = () => {
  sms.count = sms.total
  sms.disabled = true
  let timer = setInterval(() => {
    if (sms.count > 1 && sms.count <= sms.total) {
      sms.count--
    } else {
      sms.disabled = false
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<template>
  <div class="login_box">
    <div class="login_content">
      <div class="login_content_title">
        <div class="login_header">
          <i-ep-arrow-left @click="ToHome(ruleRef)" />
          <span @click="ToHome(ruleRef)">邮箱绑定</span>
        </div>
      </div>
      <div class="login_content_header">
        为了您能够及时的接收订单提醒，需要您绑定邮箱后在使用微企传媒媒体端
      </div>
      <div class="login_content_body">
        <div class="account_login">
          <el-form ref="ruleRef" :model="loginForm" :rules="loginRules">
            <el-form-item class="pid_box" prop="countryId">
              <el-select
                v-model="loginForm.countryId"
                class="m-2"
                placeholder="国家/地区"
                size="large"
                @focus="countryChange"
              >
                <el-option
                  v-for="i in countryInfo"
                  :key="i.id"
                  :label="i.name"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="email">
              <el-input
                v-model="loginForm.email"
                placeholder="请输入邮箱号"
                @focus="YouWei"
              />
            </el-form-item>
            <div v-if="ErrorBox" class="Error_box">
              该账户已注册，请输入别的账户
            </div>
            <el-form-item class="auth_code_btn" prop="code">
              <el-input v-model="loginForm.code" placeholder="请输入验证码">
                <template #append>
                  <el-button v-if="!sms.disabled" class="btn" @click="send"
                    >获取验证码</el-button
                  >
                  <el-button v-else class="btn" disabled
                    >{{ sms.count }} 秒后重新发送</el-button
                  >
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请设置密码（6-18位数字+字母）"
              >
                <template #suffix>
                  <div class="suffix" @click="showPwd">
                    <i
                      :class="
                        passwordType === 'password'
                          ? 'iconfont icon-yincangmima'
                          : 'iconfont icon-mimakejian'
                      "
                      style="font-size: 18px"
                    />
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="loginForm.confirmPassword"
                :type="passwordType1"
                placeholder="请确认密码"
                @keyup.enter.native="handleLogin(ruleRef)"
              >
                <template #suffix>
                  <div class="suffix" @click="showPwd1">
                    <i
                      :class="
                        passwordType1 === 'password'
                          ? 'iconfont icon-yincangmima'
                          : 'iconfont icon-mimakejian'
                      "
                      style="font-size: 18px"
                    />
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="account_login_btn">
              <el-button :loading="loadingBox" @click="handleLogin(ruleRef)">
                确认
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login_box {
  width: 520px;
  //绑定邮箱
  .login_content {
    width: 100%;
    .login_content_title {
      color: var(--yw-text-111);
      height: 70px;
      font-size: 22px;
      line-height: 70px;
      border-bottom: 1px solid var(--yw-bg-dcdee0);
      .login_header {
        width: 130px;
        display: flex;
        cursor: pointer;
        align-items: center;

        span {
          margin-left: 10px;
        }
      }
    }
    .login_content_header {
      font-size: 14px;
      margin: 22px 0 24px 24px;
      font-weight: 400;
      color: var(--yw-text-111);
    }
    .login_content_body {
      margin-left: 24px;

      .account_login {
        .Error_box {
          margin: -18px 0 2px 5px;
          color: var(--yw-text-f3294d);
          font-size: 12px;
        }

        .suffix {
          cursor: pointer;
        }

        :deep(.el-input__wrapper) {
          background-color: var(--yw-bg-f8f8f8);
          box-shadow: none;
        }

        .el-input,
        .el-select {
          width: 416px;
          height: 48px;
        }

        :deep(.select-trigger) {
          height: 100%;

          .el-input {
            height: 100%;
          }
        }

        .auth_code_btn {
          :deep(.el-input-group__append) {
            box-shadow: none;
          }

          .btn {
            background-color: var(--yw-bg-f8f8f8);
            color: var(--yw-primary);
          }
        }

        .account_login_btn {
          margin-top: 40px;

          .el-button {
            background-color: var(--yw-bg-8a9ce8);
            border: none;
            color: var(--yw-text-fff);
            width: 416px;
            height: 48px;
          }
        }

        .prompt_message {
          color: var(--yw-text-f3294d);
        }

        .promptMessageBox {
          display: none;
        }

        .account_login_bottom {
          color: var(--yw-text-555);
          padding: 0 5px;

          span {
            cursor: pointer;
          }

          :deep(.el-form-item__content) {
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
