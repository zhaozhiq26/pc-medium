<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores'
import type { addUserInfoRes } from '@/types/set'
import { putNewPayeeAPI, ToNewPayeeAPI } from '@/api/set'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const dialogTitle = ref()
const userStore = useUserStore()
const dialogVisible = ref(false)
const ruleFormRefs = ref<FormInstance>()
const ruleForm = ref<addUserInfoRes>({
  id: undefined,
  userId: userStore.userInfo.userId,
  bank: '',
  cardId: '',
  countryId: userStore.userInfo.countryId,
  defaultStatus: 0,
  userTypeId: 1
})
const emit = defineEmits(['getViewPayeeYW'])
const rules = reactive<FormRules<addUserInfoRes>>({
  bank: [{ required: true, message: '请选择开户行', trigger: 'change' }],
  cardId: [
    { required: true, message: '请填写收款账户', trigger: 'blur' },
    { required: true, validator: cardIdValidator, trigger: 'blur' }
  ]
})
const showDialog = (val: any) => {
  dialogVisible.value = true
  if (val === 0) {
    dialogTitle.value = '添加提现账户'
  } else {
    dialogTitle.value = '修改提现账户'
    ruleForm.value = Object.assign({}, val)
  }
}

// 校验银行卡号/邮箱
function cardIdValidator(rule: any, value: any, callback: any) {
  if (ruleForm.value.bank === 'paypal' || ruleForm.value.bank === 'Payonner') {
    if (
      !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(
        <string>ruleForm.value.cardId
      )
    ) {
      callback(new Error('请输入正确格式的账户'))
    } else {
      callback()
    }
  } else if (ruleForm.value.bank === 'WMZ') {
    if (!/^Z\d{12}$/.test(<string>ruleForm.value.cardId)) {
      callback(new Error('请输入正确格式的WMZ账户'))
    } else {
      callback()
    }
  } else if (ruleForm.value.bank === 'USDT TRC') {
    if (
      !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/.test(
        <string>ruleForm.value.cardId
      )
    ) {
      callback(new Error('请输入正确格式的USDT TRC账户'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const addBank = () => (ruleForm.value.cardId = '')
// 刷新数据
const refreshThePage = () => {
  emit('getViewPayeeYW')
}

// 取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  dialogVisible.value = false
  formEl.resetFields()
}

// 确定
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (!ruleForm.value.id) {
        const res = await ToNewPayeeAPI(ruleForm.value)
        if (res.code === 200) {
          ElMessage.success('收款信息添加成功')
          dialogVisible.value = false
          refreshThePage()
          formEl.resetFields()
        }
      } else {
        const res = await putNewPayeeAPI(ruleForm.value)
        if (res.code === 200) {
          ElMessage.success('收款信息修改成功')
          dialogVisible.value = false
          refreshThePage()
          formEl.resetFields()
        }
      }
    }
  })
}
defineExpose({
  showDialog
})
</script>

<template>
  <div class="account_popup">
    <el-dialog
      :close-on-click-modal="false"
      v-model="dialogVisible"
      :show-close="false"
      align-center
      width="389"
    >
      <div class="info_dialog_head">
        <span>{{ dialogTitle }}</span>
        <i-ep-close @click="resetForm(ruleFormRefs)" />
      </div>
      <el-form
        ref="ruleFormRefs"
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
        label-width="88px"
      >
        <el-form-item label="开户行" prop="bank">
          <el-select
            v-model="ruleForm.bank"
            :clearable="false"
            placeholder="请选择开户行"
            @change="addBank"
          >
            <el-option label="paypal" value="paypal" />
            <el-option label="Payonner" value="Payonner" />
            <el-option label="WMZ" value="WMZ" />
            <el-option label="USDT TRC" value="USDT TRC" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-show="ruleForm.bank === ''"
          label="收款账户"
          prop="cardId"
        >
          <el-input v-model="ruleForm.cardId" placeholder="请输入paypal账户" />
        </el-form-item>

        <el-form-item
          v-if="ruleForm.bank === 'paypal'"
          label="收款账户"
          prop="cardId"
        >
          <el-input v-model="ruleForm.cardId" placeholder="请输入paypal账户" />
        </el-form-item>

        <el-form-item
          v-else-if="ruleForm.bank === 'Payonner'"
          label="收款账户"
          prop="cardId"
        >
          <el-input
            v-model="ruleForm.cardId"
            placeholder="请输入Payonner账户"
          />
        </el-form-item>

        <el-form-item
          v-else-if="ruleForm.bank === 'WMZ'"
          label="收款账户"
          prop="cardId"
        >
          <el-input v-model="ruleForm.cardId" placeholder="请输入WMZ账户" />
        </el-form-item>

        <el-form-item
          v-else-if="ruleForm.bank === 'USDT TRC'"
          label="收款账户"
          prop="cardId"
        >
          <el-input
            v-model="ruleForm.cardId"
            placeholder="请输入USDT TRC账户"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="ruleForm.defaultStatus"
            :false-label="0"
            :true-label="1"
          >
            设为默认收款方式
          </el-checkbox>
        </el-form-item>
      </el-form>
      <div class="info_dialog_btn">
        <el-button class="btn" @click="resetForm(ruleFormRefs)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRefs)">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
//弹窗
.account_popup {
  :deep(.el-dialog__header) {
    display: none !important;
  }

  :deep(.el-dialog__body) {
    padding: 0 !important;
  }

  .info_dialog_head {
    height: 40px;
    border-bottom: 1px solid var(--yw-bg-ebedf0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48px;

    span {
      font-size: 16px;
      color: var(--yw-text-000);
      font-weight: 400;
      margin-left: 24px;
    }

    svg {
      width: 16px;
      height: 16px;
      margin-right: 14px;
      cursor: pointer;
    }
  }

  .el-form {
    margin-left: 15px;

    .el-select,
    .el-input {
      width: 245px;
    }
  }

  .info_dialog_btn {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: right;
    padding-right: 24px;
    border-top: 1px solid var(--yw-bg-ebedf0);

    .btn {
      border-color: var(--yw-primary);
      color: var(--yw-primary);
    }

    .el-button {
      width: 64px;
      height: 32px;
      margin-left: 18px;
    }
  }
}
</style>
