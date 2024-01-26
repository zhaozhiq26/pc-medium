<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores'
import { NewPayeeAPI } from '@/api/set'
import { message } from 'ant-design-vue'

const ruleFormRef = ref()
const loadingYW = ref(false)
const userStore = useUserStore()
const form = reactive({
  cardName: '',
  cardId: '',
  certId: '',
  telNo: ''
})

const rules = reactive({
  cardName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    {
      pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
      message: '请输入真实姓名',
      trigger: 'blur'
    }
  ],
  certId: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    {
      pattern:
        /^(\d{6})(19|20)(\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])(\d{3})([0-9X])$/,
      message: '请输入正确身份证号码',
      trigger: 'blur'
    }
  ],
  cardId: [
    { required: true, message: '请输入银行卡号', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{15,18}$/,
      message: '请输入正确银行卡号',
      trigger: 'blur'
    }
  ],
  telNo: [
    { required: true, message: '请输入预留手机号', trigger: 'blur' },
    {
      pattern:
        /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/,
      message: '请输入正确手机号',
      trigger: 'blur'
    }
  ]
})
const emits = defineEmits(['addDataTo'])
// 取消
const resetForm = () => {
  ruleFormRef.value.resetFields()
  emits('addDataTo')
}
// 提交结算信息
const submitForm = () => {
  ruleFormRef.value.validate().then(async () => {
    loadingYW.value = true
    await NewPayeeAPI({
      settleAccountMember: {
        createId: userStore.userInfo.userId,
        accountInfoParam: form
      }
    })
      .then(() => {
        message.success('用户信息添加成功')
        emits('addDataTo')
        ruleFormRef.value.resetFields()
        loadingYW.value = false
      })
      .catch(() => {
        loadingYW.value = false
      })
  })
}
</script>

<template>
  <div class="yw_box yw_settlement">
    <div class="yw_settlement_title">结算资料</div>
    <div class="yw_settlement_body">
      <a-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        :label-col="{ span: 2 }"
      >
        <a-form-item label="姓名" name="cardName">
          <a-input
            v-model:value="form.cardName"
            placeholder="请输入真实姓名"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item label="身份证号" name="certId">
          <a-input
            v-model:value="form.certId"
            placeholder="请输入身份证号"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item label="银行账号" name="cardId">
          <a-input
            v-model:value="form.cardId"
            placeholder="请输入银行账号"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item label="预留手机号" name="telNo">
          <a-input
            v-model:value="form.telNo"
            placeholder="请输入银行预留手机号"
            autocomplete="off"
          />
        </a-form-item>
        <div class="yw_settlement_text">
          <span>温馨提醒: </span
          >此资料仅作为支付机构做资金结算用途，且信息都已自动加密处理提交后，平台以及支付机构不会向您本人索取任何验证码等信息，如有
          出现类似情况，均为诈骗，请注意防范！
        </div>
        <a-form-item>
          <a-button class="btn" @click="resetForm"> 取消 </a-button>
          <a-button
            :loading="loadingYW"
            class="res_btn1"
            type="primary"
            @click="submitForm"
          >
            提交结算信息
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.yw_settlement {
  padding: 28px;
  height: 971px;
  font-size: 14px;
  background: var(--yw-bg-fff);
  border-left: 1px solid var(--yw-bg-f0f0f0);

  .yw_settlement_title {
    color: var(--yw-text-000);
    font-weight: bold;
    line-height: 16px;
    margin-bottom: 38px;
  }

  .yw_settlement_body {
    margin-left: -18px;
    .ant-input {
      width: 368px;
      height: 32px;
    }

    .yw_settlement_text {
      width: 454px;
      font-size: 14px;
      color: var(--yw-text-f00);
      font-weight: 400;
      margin-left: 50px;
      line-height: 20px;
      margin-bottom: 28px;

      span {
        color: var(--yw-text-000);
      }
    }

    .btn {
      width: 119px;
      height: 32px;
      margin-left: 112px;
      margin-right: 33px;
      color: var(--yw-primary);
      border-color: var(--yw-primary);
      &:hover {
        color: var(--yw-text-fff);
        border-color: var(--yw-primary-hover);
        background-color: var(--yw-primary-hover);
      }
    }
  }
}

:deep(label) {
  font-weight: 400;
}
</style>
