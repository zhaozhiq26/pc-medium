<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { withdrawAPI } from '@/api/user'
import { getViewPayeeAPI } from '@/api/set'
import type { getViewPayeeRes } from '@/types/set'

const ruleFormRef = ref<FormInstance>()
const userStore = useUserStore()
const viewPayeeInfo = ref()
const loadingYW = ref(false)
const emit = defineEmits(['refresh'])
const viewPayee = ref<getViewPayeeRes>({
  userId: userStore.userInfo.userId,
  typeId: 1
})
const ruleForm = ref({
  userId: userStore.userInfo.userId,
  payeeID: 0,
  cash: ''
})
// 表单校验规则
const rules = reactive({
  payeeID: [{ required: true, message: '请输入收款人ID', trigger: 'blur' }],
  cash: [
    { required: true, message: '请输入提现金额', trigger: 'blur' },
    {
      pattern: /^(0|[1-9]\d{0,9})(\.\d{1,2})?$/,
      message: '请输入正确的金额',
      trigger: 'blur'
    }
  ]
})
const getViewPayee = async () => {
  const res = await getViewPayeeAPI(viewPayee.value)
  viewPayeeInfo.value = res.data
  ruleForm.value.payeeID = res.data.id
}
// 保存
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  loadingYW.value = true
  if (
    ruleForm.value.cash > '0' &&
    ruleForm.value.cash > '0.0' &&
    ruleForm.value.cash > '0.00'
  ) {
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        await withdrawAPI({
          money: ruleForm.value.cash
        })
          .then(() => {
            ElMessage.success('提现申请成功')
            ruleForm.value.cash = ''
            formEl.clearValidate('cash')
            emit('refresh')
            loadingYW.value = false
          })
          .catch(() => {
            loadingYW.value = false
          })
      } else {
        loadingYW.value = false
      }
    })
  } else {
    ElMessage.error('输入金额不能为 0')
    loadingYW.value = false
  }
}

// 取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  ruleForm.value.cash = ''
  formEl.clearValidate('cash')
}
defineExpose({
  getViewPayee
})
</script>

<template>
  <div class="my_withdrawal_box">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="请选择收款账户" prop="payeeID">
        <el-radio-group v-model="ruleForm.payeeID">
          <div
            v-if="viewPayeeInfo?.bank === 'paypal'"
            class="payee_checkbox_list"
          >
            <el-radio :label="viewPayeeInfo?.id">
              <i class="payee_checkbox_img">
                <img alt="" src="@/assets/img/pay/PaypalIcon.png" />
              </i>
              <span>{{ viewPayeeInfo.bank }}</span>
            </el-radio>
          </div>
          <div
            v-else-if="viewPayeeInfo?.bank === 'Payonner'"
            class="payee_checkbox_list"
          >
            <el-radio :label="viewPayeeInfo?.id">
              <i class="payee_checkbox_img">
                <img alt="" src="@/assets/img/pay/PayonnerIcon.png" />
              </i>
              <span>{{ viewPayeeInfo.bank }}</span>
            </el-radio>
          </div>
          <div
            v-else-if="viewPayeeInfo?.bank === 'WMZ'"
            class="payee_checkbox_list"
          >
            <el-radio :label="viewPayeeInfo?.id">
              <i class="payee_checkbox_img">
                <img alt="" src="@/assets/img/pay/WMZIcon.png" />
              </i>
              <span>{{ viewPayeeInfo.bank }}</span>
            </el-radio>
          </div>
          <div
            v-else-if="viewPayeeInfo?.bank === 'USDT TRC'"
            class="payee_checkbox_list"
          >
            <el-radio :label="viewPayeeInfo?.id">
              <i class="payee_checkbox_img">
                <img alt="" src="@/assets/img/pay/USDT TRC20Icon.png" />
              </i>
              <span>{{ viewPayeeInfo.bank }}</span>
            </el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="cash_box" label="请输入提现金额" prop="cash">
        <el-input
          v-model="ruleForm.cash"
          placeholder="输入提现金额（不能大于可提现余额）"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loadingYW"
          class="sub_btn"
          type="primary"
          @click="onSubmit(ruleFormRef)"
        >
          提现
        </el-button>
        <el-button class="res_btn" @click="resetForm(ruleFormRef)">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.my_withdrawal_box {
  box-sizing: border-box;
  width: 534px;

  :deep(.el-radio) {
    .el-radio__inner {
      border-radius: 0;
    }

    .el-radio__input.is-checked .el-radio__inner::after {
      content: '';
      width: 8px;
      height: 5px;
      border: 2px solid var(--yw-bg-fff);
      border-top: transparent;
      border-right: transparent;
      text-align: center;
      display: block;
      position: absolute;
      top: 3px;
      left: 2px;
      transform: rotate(-45deg);
      border-radius: 0;
      background: none;
    }
  }
}

.payee_checkbox_list {
  width: 524px;
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 18px;
  background: var(--yw-bg-color);
  margin-bottom: 9px;

  &:last-child {
    margin-bottom: 0;
  }

  .payee_checkbox_img {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 10px;
    margin-top: -10px;
  }

  :deep(.el-radio__label) {
    display: flex;
    align-items: center;
  }

  span {
    font-weight: 400;
    font-size: 14px;
    color: var(--yw-text-000);
    line-height: 16px;
  }
}

.el-input {
  width: 414px;
}

.cash_box {
  display: flex;
  align-items: center;

  :deep(.el-form-item__label) {
    margin-bottom: 0 !important;
    margin-right: 14px;
  }
}

.el-button {
  width: 119px;
  height: 32px;
  margin-right: 37px;
  margin-top: 38px;
}

.sub_btn {
  margin-left: 32px;
}

.res_btn {
  border: 1px solid var(--yw-primary);
}
</style>
