<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { forgetPasswordAPI, sendCodeAPI } from '@/api/login'

const ruleRef = ref()
const loadingBox = ref(false)
const sms = reactive({
  disabled: false,
  total: 60,
  count: 0
})
const forgetForm = reactive({
  number: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const forgetRules = {
  number: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
    { required: true, validator: phoneValidator, trigger: 'blur' }
  ],
  code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
  password: [
    { required: true, trigger: 'blur', message: '请输入您的密码' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/,
      message: '请输入6-18位数字和字母组合密码',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
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

// 确认密码
function equalToPassword(rule: any, value: any, callback: any) {
  if (forgetForm.password !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
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
// 获取验证码
const send = async () => {
  if (forgetForm.number === '') {
    message.error('手机号/邮箱地址不能为空!')
    return
  } else {
    timerHandler()
    await sendCodeAPI(
      emRegular.test(forgetForm.number) ? 1 : 0,
      forgetForm.number
    )
  }
}

const emit = defineEmits(['goLogin1'])

// 提交修改
const forgetBtn = () => {
  ruleRef.value.validate().then(async () => {
    loadingBox.value = true
    await forgetPasswordAPI({
      number: forgetForm.number,
      code: forgetForm.code,
      password: forgetForm.password,
      type: emRegular.test(forgetForm.number) ? 1 : 0
    })
      .then(() => {
        loadingBox.value = false
        message.success('密码找回成功')
        emit('goLogin1')
        ruleRef.value.resetFields()
      })
      .catch(() => {
        loadingBox.value = false
      })
  })
}

// 返回登录页
const goLoginTo = () => {
  emit('goLogin1')
}
</script>

<template>
  <div class="login_content">
    <div class="login_content_title">
      <div class="account_login">
        <el-icon @click="goLoginTo">
          <ArrowLeft />
        </el-icon>
        忘记密码
      </div>
    </div>
    <div class="login_content_body">
      <div class="account_login">
        <a-form ref="ruleRef" :model="forgetForm" :rules="forgetRules">
          <a-form-item name="number">
            <a-input
              v-model:value="forgetForm.number"
              autocomplete="off"
              placeholder="请输入手机号/邮箱登录"
            />
          </a-form-item>
          <a-form-item name="code">
            <a-input
              v-model:value="forgetForm.code"
              autocomplete="off"
              placeholder="请输入验证码"
            >
              <template #addonAfter>
                <a-button
                  type="text"
                  class="btn"
                  v-if="!sms.disabled"
                  @click="send"
                  >获取验证码</a-button
                >
                <a-button type="text" class="btn" v-else disabled>
                  {{ sms.count }} 秒后重新发送
                </a-button>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password
              v-model:value="forgetForm.password"
              autocomplete="off"
              placeholder="请设置密码(6-18位数字+字母)"
            />
          </a-form-item>
          <a-form-item name="confirmPassword">
            <a-input-password
              v-model:value="forgetForm.confirmPassword"
              autocomplete="off"
              placeholder="请确认密码"
              @pressEnter="forgetBtn"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              :loading="loadingBox"
              class="confirm_btn"
              @click="forgetBtn"
            >
              确定
            </a-button>
          </a-form-item>
        </a-form>
      </div>
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

    .account_login {
      display: flex;
      align-items: center;

      .el-icon {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }

  .login_content_body {
    padding-top: 40px;
    display: flex;
    justify-content: center;

    .account_login {
      .ant-input,
      .ant-input-password {
        width: 416px;
        height: 48px;
        background-color: var(--yw-bg-f8f8fa);
        :deep(.ant-input) {
          background-color: var(--yw-bg-f8f8fa);
        }
      }

      :deep(.ant-input-wrapper) {
        height: 48px;
        .ant-input {
          height: 48px;
          background-color: var(--yw-bg-f8f8fa);
        }
      }
      :deep(.ant-input-group-addon) {
        padding: 0;
        width: 136px;
      }

      .btn {
        width: 100%;
        height: 100%;
        color: var(--yw-primary);
        &:hover {
          background-color: var(--yw-bg-f8f8fa);
        }
      }

      .confirm_btn {
        border: none;
        color: var(--yw-text-fff);
        width: 416px;
        height: 48px;
        background-color: var(--yw-bg-8a9ce8);
      }
      :deep(.ant-form-item-explain-error) {
        float: left;
      }
    }
  }
}
</style>
