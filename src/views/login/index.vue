<script lang="ts" setup>
import { ref, reactive } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { useUserStore } from '@/stores'
import { message } from 'ant-design-vue'
import { getQrCodeAPI } from '@/api/login'
import type { loginRes } from '@/types/login'
import registration from './components/registration.vue'
import MailboxBinding from './components/MailboxBinding.vue'
import retrievePassword from './components/retrievePassword.vue'

const ruleRef = ref()
const mailbox = ref(true)
const wxLoginInfo = ref()
const goRegisterTo = ref()
const goRegister = ref(true)
const goPassword = ref(true)
const loadingBox = ref(false)
const SwitchLogin = ref(true)
const userStore = useUserStore()
const loginForm = ref<loginRes>({
  username: '',
  password: '',
  type: 1
})
const loginRules = {
  username: [
    { required: true, trigger: 'blur', message: '请输入手机号/邮箱地址' },
    { required: true, validator: phoneValidator, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入您的密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/,
      message: '请输入6-18位数字和字母组合密码',
      trigger: 'blur'
    }
  ]
}

const phoneRegular =
  /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/
const emRegular = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

// 校验手机号/邮箱
function phoneValidator(rule: any, value: any, callback: any) {
  if (!emRegular || !phoneRegular) {
    callback(new Error('请输入正确格式的手机号/邮箱地址'))
  } else {
    callback()
  }
}

const setWxerwma = async () => {
  const res = await getQrCodeAPI({ type: 1 })
  wxLoginInfo.value = res.data
}
const state = reactive({
  timerHandler: NaN
})
const YW = async () => {
  userStore.wxLogin({ code: wxLoginInfo.value.code }).then(async () => {
    if (userStore.loginInfo.access_token) {
      await userStore.setUserInfo()
      clearInterval(state.timerHandler)
      WxLoginYW()
    }
  })
}
const WxLoginYW = () => {
  if (userStore.userInfo.bindEmail) {
    mailbox.value = false
  } else {
    message.success('登录成功')
    location.href = '/'
  }
}
const toHome_YW = () => {
  SwitchLogin.value = true
  mailbox.value = true
}
// 切换登录方式
const SwitchLoginTo = () => {
  SwitchLogin.value = !SwitchLogin.value
  if (SwitchLogin.value === false) {
    setWxerwma()
    state.timerHandler = setInterval(() => {
      YW()
    }, 1000)
  } else {
    clearInterval(state.timerHandler)
  }
}

const SwitchLoginTo2 = () => {
  SwitchLogin.value = false
  setWxerwma()
  state.timerHandler = setInterval(() => {
    YW()
  }, 1000)
  goRegister.value = true
}
// 刷新
const handleRefresh = () => {
  setWxerwma()
}
// 登录
const handleLogin = () => {
  ruleRef.value.validate().then(async () => {
    loadingBox.value = true
    await userStore
      .Userlogin(loginForm.value)
      .then(async () => {
        loadingBox.value = false
        message.success('登录成功')
        await userStore.setUserInfo()
        location.href = '/'
        ruleRef.value.resetFields()
      })
      .catch(() => {
        loadingBox.value = false
      })
  })
}
// 隐私协议
const privacyPolicyFor = () => (location.href = '/user/privacy')
// 用户协议
const userAgreementFor = () => (location.href = '/user/agreement')

// 去注册
const goToRegister = () => {
  goRegister.value = !goRegister.value
  ruleRef.value.resetFields()
}
// 忘记密码
const goToPassword = () => {
  goPassword.value = !goPassword.value
}
</script>

<template>
  <div class="login_box">
    <div class="login_left"></div>
    <div class="login_right" v-if="mailbox">
      <div v-if="goRegister" class="login_main">
        <div v-if="goPassword" class="login_content">
          <div v-if="SwitchLogin">
            <div class="login_content_title">
              <div class="account_login">账号登录</div>
              <div class="WeChat_login">
                <span>点击切换扫码登录</span>
                <div class="WeChat_login_imgBox" @click="SwitchLoginTo">
                  <img alt="" src="@/assets/img/WeChatIcon.png" />
                </div>
              </div>
            </div>
            <div class="login_content_body">
              <div class="account_login1">
                <a-form ref="ruleRef" :model="loginForm" :rules="loginRules">
                  <a-form-item name="username">
                    <a-input
                      v-model:value="loginForm.username"
                      autocomplete="off"
                      placeholder="请输入手机号/邮箱登录"
                    />
                  </a-form-item>
                  <a-form-item name="password">
                    <a-input-password
                      v-model:value="loginForm.password"
                      placeholder="请输入密码"
                      @pressEnter="handleLogin"
                    />
                  </a-form-item>
                  <a-form-item>
                    <a-button :loading="loadingBox" @click="handleLogin"
                      >登录</a-button
                    >
                  </a-form-item>
                  <div class="account_login_bottom">
                    <span @click="goToRegister">注册</span>
                    <span @click="goToPassword">忘记密码？</span>
                  </div>
                </a-form>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="login_content_title">
              <div class="account_login">微信登录</div>
              <div class="WeChat_login">
                <span>点击切换账号登录</span>
                <div class="WeChat_login_imgBox" @click="SwitchLoginTo">
                  <img alt="" src="@/assets/img/userLogin.png" />
                </div>
              </div>
            </div>
            <div class="login_content_body">
              <div class="account_login">
                <div class="WeChat_login">
                  <div id="qrcode" class="WeChat_login_img">
                    <qrcode-vue
                      :value="wxLoginInfo?.url"
                      :size="180"
                      level="H"
                    />
                  </div>
                  <div class="WeChat_login_title">
                    使用微信扫一扫完成登录<em @click="handleRefresh">刷新</em>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div class="login_content_footer">
            注册登录即代表已阅读并同意《<span @click="userAgreementFor"
              >用户协议</span
            >》和《<span @click="privacyPolicyFor">隐私政策</span>》
          </div>
        </div>
        <!-- 忘记密码 -->
        <retrievePassword v-if="!goPassword" @goLogin1="goToPassword" />
      </div>
      <div v-else class="login_main1">
        <!-- 注册 -->
        <registration
          v-if="!goRegister"
          ref="goRegisterTo"
          @goLogin="goToRegister"
          @switchLogin1="SwitchLoginTo2"
        />
      </div>
    </div>
    <div class="login_right" v-else>
      <mailbox-binding @toHomeYW="toHome_YW" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login_box {
  display: flex;
  background: var(--yw-bg-fff);

  .login_left {
    width: 30%;
    height: 100vh;
    background: url('@/assets/loginIcon.png') no-repeat 100%/100%;
  }

  .login_right {
    width: 70%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .login_main {
      margin-top: -100px;
      width: 431px;
    }

    .login_main1 {
      margin-top: -100px;
      width: 640px;
    }
  }
}

//登录
.login_content {
  text-align: center;

  .login_content_title {
    height: 80px;
    font-size: 24px;
    color: var(--yw-text-111);
    border-bottom: 1px solid var(--yw-bg-dcdee0);
    display: flex;
    justify-content: space-between;
    align-items: center;

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
    }
  }

  .login_content_body {
    padding-top: 62px;
    display: flex;
    justify-content: center;

    .WeChat_login {
      width: 283px;
      display: flex;
      align-items: center;
      flex-direction: column;

      .WeChat_login_img {
        width: 200px;
        height: 200px;
      }

      .WeChat_login_title {
        margin-top: 50px;
        font-size: 14px;
        color: var(--yw-text-4a4a4a);
        font-weight: 400;
        text-align: center;

        em {
          margin-left: 5px;
          color: var(--yw-primary);
          cursor: pointer;
        }
      }
    }

    .account_login1 {
      .ant-input,
      .ant-input-password {
        width: 416px;
        height: 48px;
        background-color: var(--yw-bg-f8f8fa);
        :deep(.ant-input) {
          background-color: var(--yw-bg-f8f8fa);
        }
      }
      .ant-btn {
        border: none;
        color: var(--yw-text-fff);
        width: 416px;
        height: 48px;
        background-color: var(--yw-bg-8a9ce8);
      }
      :deep(.ant-form-item-explain-error) {
        float: left;
      }
      .account_login_bottom {
        color: var(--yw-text-555);
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          cursor: pointer;
        }
      }
    }
  }

  .login_content_footer {
    margin-top: 60px;
    font-size: 12px;
    color: var(--yw-text-555);

    span {
      color: var(--yw-primary);
      cursor: pointer;
    }
  }
}
</style>
