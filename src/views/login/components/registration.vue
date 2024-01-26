<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { emailRegisterAPI, emCode, phoneCode, registerAPI } from '@/api/login'
import type { EmRegisterRes, registerRes } from '@/types/login'
import { getCountryAPI } from '@/api/public'

const passwordType = ref('password')
const passwordType1 = ref('password')
const ErrorBox = ref(false)
const codeInfo = ref()
const loadingYW = ref(false)
const phoneRef = ref<FormInstance>()
const succeed = ref(true)
const activeTime = ref(0)
const countdown = ref(15)
const sms = reactive({
  disabled: false,
  total: 60,
  count: 0
})

const countryInfo = ref()
const phoneForm = reactive<registerRes>({
  countryId: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
  type: 1
})
const emit = defineEmits(['goLogin', 'switchLogin1'])

const phoneRules = {
  countryId: [
    { required: true, trigger: 'change', message: '请选择您国家/地区' }
  ],
  username: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
    { required: true, validator: phoneValidator, trigger: 'blur' }
  ],
  email: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
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

const phoneRegular =
  /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/
const emRegular = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

// 校验手机号
function phoneValidator(rule: any, value: any, callback: any) {
  if (phoneForm.username === null) {
    callback()
  } else if (phoneForm.username === '') {
    callback(new Error('请输入手机号码'))
  } else if (!phoneRegular.test(<string>phoneForm.username)) {
    callback(new Error('请输入正确格式的手机号码'))
  } else {
    callback()
  }
}

// 校验邮箱
function emailValidator(rule: any, value: any, callback: any) {
  if (phoneForm.email === null) {
    callback()
  } else if (phoneForm.email === '') {
    callback(new Error('请输入邮箱地址'))
  } else if (!emRegular.test(<string>phoneForm.email)) {
    callback(new Error('请输入正确格式的邮箱地址'))
  } else {
    callback()
  }
}

// 校验密码
function passwordValidator(rule: any, value: any, callback: any) {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/
  if (!passwordRegex.test(value)) {
    callback(new Error('请设置密码（6-18位  数字+字母）'))
  } else {
    callback()
  }
}

// 确认密码
function equalToPassword(rule: any, value: any, callback: any) {
  if (phoneForm.password !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
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

const countryChange = async () => {
  const res = await getCountryAPI()
  countryInfo.value = res.data
}

// 获取验证码
const send = async () => {
  if (activeTime.value === 0) {
    if (phoneForm.username === '') {
      ElMessage.error('手机号不能为空!')
      return
    } else if (phoneRegular.test(<string>phoneForm.username)) {
      const res = await phoneCode(phoneForm.username)
      if (res.code === 200) {
        timerHandler()
        codeInfo.value = res.msg
      } else {
        ErrorBox.value = !ErrorBox.value
      }
    }
  } else if (activeTime.value === 1) {
    if (phoneForm.email === '') {
      ElMessage.error('邮箱地址不能为空!')
      return
    } else if (emRegular.test(<string>phoneForm.email)) {
      const res = await emCode(phoneForm.email)
      if (res.code === 200) {
        timerHandler()
        codeInfo.value = res.msg
      } else {
        ErrorBox.value = !ErrorBox.value
      }
    }
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

// 点击选择注册方式
const changeTime = (val: number) => {
  phoneRef.value!.resetFields()
  activeTime.value = val
}

// 隐私协议
const privacyPolicyFor = () => (location.href = '/user/privacy')
// 用户协议
const userAgreementFor = () => (location.href = '/user/agreement')

const goLoginTo = () => {
  emit('goLogin')
}

const SwitchLoginTo1 = () => {
  emit('switchLogin1')
}

// 十五秒转跳登录页
const SkipEntry = () => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
      emit('goLogin')
    }
  }, 1000)
}

// 注册
const SubmitRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  loadingYW.value = true
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (activeTime.value === 0) {
        await registerAPI(phoneForm)
          .then(() => {
            succeed.value = !succeed.value
            loadingYW.value = false
          })
          .catch(() => {
            loadingYW.value = false
          })
      } else if (activeTime.value === 1) {
        await emailRegisterAPI(<EmRegisterRes>phoneForm)
          .then(() => {
            succeed.value = !succeed.value
            loadingYW.value = false
          })
          .catch(() => {
            loadingYW.value = false
          })
      }
      SkipEntry()
    } else {
      loadingYW.value = false
    }
  })
}
</script>

<template>
  <div v-if="succeed" class="login_content">
    <div class="login_content_title">
      <div class="account_login">
        <span
          :class="{ active: activeTime === 0 }"
          class="phone_registration"
          @click="changeTime(0)"
          >手机号注册</span
        >
        <span
          :class="{ active: activeTime === 1 }"
          class="email_registration"
          @click="changeTime(1)"
          >邮箱号注册</span
        >
      </div>
      <div class="WeChat_login">
        <span>点击切换扫码登录</span>
        <div class="WeChat_login_imgBox" @click="SwitchLoginTo1">
          <img alt="" src="@/assets/img/WeChatIcon.png" />
        </div>
      </div>
    </div>
    <div class="login_content_body">
      <div class="account_login">
        <el-form ref="phoneRef" :model="phoneForm" :rules="phoneRules">
          <el-form-item class="pid_box" prop="countryId">
            <el-select
              v-model="phoneForm.countryId"
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

          <el-form-item v-if="activeTime === 0" prop="username">
            <el-input
              v-model="phoneForm.username"
              autofocus
              placeholder="请输入手机号"
            />
          </el-form-item>

          <el-form-item v-if="activeTime === 1" prop="email">
            <el-input
              v-model="phoneForm.email"
              autofocus
              placeholder="请输入邮箱号"
            />
          </el-form-item>
          <div v-if="ErrorBox" class="Error_box">
            该账户已注册，请输入别的账户或去登录
          </div>
          <el-form-item class="auth_code_btn" prop="code">
            <el-input
              v-model="phoneForm.code"
              autofocus
              placeholder="请输入验证码"
            >
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
              v-model="phoneForm.password"
              :type="passwordType"
              autofocus
              placeholder="请设置密码（6-18位数字+字母）"
            >
              <template #suffix>
                <div class="suffix" @click="showPwd">
                  <i
                    :class="
                      passwordType === 'password'
                        ? 'iconfont  icon-yincangmima'
                        : 'iconfont  icon-mimakejian'
                    "
                    style="font-size: 18px"
                  />
                </div>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="phoneForm.confirmPassword"
              :type="passwordType1"
              autofocus
              placeholder="请确认密码"
            >
              <template #suffix>
                <div class="suffix" @click="showPwd1">
                  <i
                    :class="
                      passwordType1 === 'password'
                        ? 'iconfont  icon-yincangmima'
                        : 'iconfont  icon-mimakejian'
                    "
                    style="font-size: 18px"
                  />
                </div>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item class="account_login_btn">
            <el-button :loading="loadingYW" @click="SubmitRegister(phoneRef)"
              >注册</el-button
            >
          </el-form-item>
          <el-form-item class="account_login_bottom">
            <span @click="goLoginTo">已有账号？去登录</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="login_content_footer">
      注册登录即代表已阅读并同意《<span @click="userAgreementFor">用户协议</span
      >》和《<span @click="privacyPolicyFor">隐私政策</span>》
    </div>
  </div>
  <div v-if="!succeed" class="registered_successfully">
    <div class="registered_successfully_title">恭喜您！注册成功</div>
    <div class="registered_successfully_content">
      {{ countdown }}s后自动返回登录界面
    </div>
    <div class="registered_successfully_btn">
      <el-button @click="goLoginTo">现在去登录</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login_content {
  text-align: center;

  .login_content_title {
    height: 80px;
    font-size: 24px;
    color: var(--yw-text-111);
    border-bottom: 1px solid var(--yw-bg-dcdee0);
    display: flex;
    justify-content: space-between;

    .WeChat_login {
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        width: 110px;
        height: 26px;
        background: var(--yw-primary);
        font-size: 12px;
        color: var(--yw-text-fff);
        line-height: 26px;
        margin-right: 12px;
      }

      .WeChat_login_imgBox {
        width: 50px;
        height: 50px;
        cursor: pointer;
      }
    }

    .account_login {
      display: flex;
      align-items: center;

      .phone_registration {
        margin-right: 50px;
        cursor: pointer;
      }

      .email_registration {
        cursor: pointer;
      }
    }

    .active {
      font-size: 24px;
      font-weight: bold;
      color: var(--yw-text-8a9ce8);
    }
  }

  .login_content_body {
    padding-top: 40px;
    display: flex;
    justify-content: center;

    .account_login {
      .Error_box {
        margin: -18px 0 2px -90px;
        color: var(--yw-text-f3294d);
        font-size: 12px;
      }

      .suffix {
        cursor: pointer;
      }

      :deep(.el-input__wrapper) {
        background-color: var(--yw-bg-f8f8fa);
      }

      .el-input,
      .el-select {
        width: 416px;
        height: 48px;
      }

      .auth_code_btn {
        .btn {
          height: 100%;
          color: var(--yw-primary);
        }
      }

      .account_login_btn {
        margin-bottom: 0;

        .el-button {
          background-color: var(--yw-bg-8a9ce8);
          border: none;
          color: var(--yw-text-fff);
          width: 416px;
          height: 48px;
        }
      }

      .account_login_bottom {
        width: 326px;
        color: var(--yw-text-555);

        span {
          cursor: pointer;
        }

        :deep(.el-form-item__content) {
          justify-content: space-between;
        }
      }
    }
  }

  .login_content_footer {
    margin-top: 20px;
    color: var(--yw-text-555);
    font-size: 12px;

    span {
      color: var(--yw-primary);
      cursor: pointer;
    }
  }
}

//注册成功页
.registered_successfully {
  font-weight: 400;
  text-align: center;

  .registered_successfully_title {
    font-size: 32px;
    color: var(--yw-text-000);
  }

  .registered_successfully_content {
    font-size: 14px;
    color: var(--yw-primary);
    margin: 18px 0 46px;
  }

  .registered_successfully_btn {
    .el-button {
      width: 323px;
      height: 40px;
      background: var(--yw-bg-8a9ce8);
      color: var(--yw-text-fff);
    }
  }
}
</style>
