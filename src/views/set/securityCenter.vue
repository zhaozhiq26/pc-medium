<!-- 安全中心 -->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores'
import { message } from 'ant-design-vue'
import { putPassWordAPI } from '@/api/user'
import type { PasswordRes } from '@/types/user'
import type { Rule } from 'ant-design-vue/es/form'

const ruleRef = ref()
const loadingYW = ref(false)
const userStore = useUserStore()
const FormData = reactive<PasswordRes>({
  userId: userStore.userInfo.userId,
  password: '',
  newPassWord: '',
  confirmPassWord: ''
})

// 表单校验规则
const rules: Record<string, Rule[]> = {
  password: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/,
      message: '请输入6-18位数字和字母组合',
      trigger: 'blur'
    }
  ],
  newPassWord: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/,
      message: '请输入6-18位数字和字母组合',
      trigger: 'blur'
    }
  ],
  confirmPassWord: [
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/,
      message: '请输入6-18位数字和字母组合',
      trigger: 'blur'
    },
    {
      required: true,
      validator: (rule: any, value: any) => {
        if (FormData.newPassWord === value) {
          return Promise.resolve()
        } else {
          return Promise.reject('两次密码不一致')
        }
      },
      trigger: ['blur', 'change']
    }
  ]
}

// 取消
const resetForm = () => {
  ruleRef.value.resetFields()
}

// 保存
const submitForm = () => {
  ruleRef.value.validate().then(async () => {
    loadingYW.value = true
    await putPassWordAPI(FormData)
      .then(() => {
        message.success('修改密码成功')
        ruleRef.value.resetFields()
        loadingYW.value = false
        window.localStorage.clear()
        message.warning('密码已过期,请重新登录')
        location.href = '/login'
      })
      .catch(() => {
        loadingYW.value = false
      })
  })
}
</script>

<template>
  <div class="security_center yw_box">
    <span class="set_title">修改登录密码</span>
    <div class="SecurityCenter_body">
      <a-form
        :label-col="{ span: 2 }"
        ref="ruleRef"
        :model="FormData"
        :rules="rules"
      >
        <a-form-item label="原密码" name="password">
          <a-input-password
            v-model:value="FormData.password"
            placeholder="请输入旧密码"
          />
        </a-form-item>
        <a-form-item label="新密码" name="newPassWord">
          <a-input-password
            v-model:value="FormData.newPassWord"
            placeholder="请输入新密码"
          />
        </a-form-item>
        <a-form-item label="确认密码" name="confirmPassWord">
          <a-input-password
            v-model:value="FormData.confirmPassWord"
            placeholder="请再次输入新密码"
          />
        </a-form-item>
        <a-form-item>
          <a-button class="res_btn" @click="resetForm"> 取消 </a-button>
          <a-button :loading="loadingYW" type="primary" @click="submitForm">
            保存
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.security_center {
  padding: 27px 53px;
  .set_title {
    color: var(--yw-text-000);
    font-size: 14px;
    margin-bottom: 20px;
    display: inline-block;
  }
  .SecurityCenter_body {
    margin-left: -35px;
    .ant-input-password {
      width: 368px;
      border-radius: 0;
      border-style: none;
      border-bottom: 1px solid var(--yw-bg-dcdee0);
    }

    .ant-input-affix-wrapper-focused {
      box-shadow: none;
    }

    .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
      border-color: var(--yw-primary);
    }

    .ant-btn {
      width: 119px;
      height: 32px;
      margin-right: 37px;
      margin-top: 28px;
    }
    .res_btn {
      margin-left: 150px;
      color: var(--yw-primary);
      border: 1px solid var(--yw-primary);
    }
  }
}

:deep(label) {
  font-weight: 400;
}
</style>
