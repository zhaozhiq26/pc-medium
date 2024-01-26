<!-- 弹窗 -->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { NewAddressToAPI } from '@/api/set'
import type { NewAddressRes } from '@/types/set'

const ruleRef = ref()
const loadingYW = ref(false)
const dialogVisible = ref(false)
const emit = defineEmits(['sayCall'])
const formInfo = ref<NewAddressRes>({
  id: 0,
  userId: '',
  name: '',
  mobile: '',
  areaId: '',
  detailAddress: '',
  defaultStatus: 0,
  userType: 1
})
// 调用弹窗方法
const dialogRef = (row: any) => {
  dialogVisible.value = true
  formInfo.value = Object.assign({}, row)
}
// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: '请输入收件人姓名', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  detailAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
})

const sayCall = async () => emit('sayCall')

// 确定
const SaveUpload = () => {
  ruleRef.value.validate().then(async () => {
    loadingYW.value = true
    await NewAddressToAPI({
      id: formInfo.value.id,
      userId: formInfo.value.userId,
      name: formInfo.value.name,
      mobile: formInfo.value.mobile,
      detailAddress: formInfo.value.detailAddress,
      defaultStatus: formInfo.value.defaultStatus,
      userType: 1
    })
      .then(async () => {
        message.success('地址修改成功')
        dialogVisible.value = false
        ruleRef.value.resetFields()
        await sayCall()
        loadingYW.value = false
      })
      .catch(() => {
        loadingYW.value = false
      })
  })
}

// 取消
const closeDrawer = () => {
  ruleRef.value.resetFields()
  dialogVisible.value = false
  sayCall()
}

defineExpose({
  dialogRef
})
</script>

<template>
  <!-- 弹出框 -->
  <a-modal
    v-model:open="dialogVisible"
    width="603px"
    title="修改地址"
    :maskClosable="false"
    @cancel="closeDrawer"
    @ok="SaveUpload"
  >
    <a-form
      ref="ruleRef"
      :model="formInfo"
      :rules="rules"
      :label-col="{ span: 5 }"
    >
      <a-form-item label="收货人姓名" name="name">
        <a-input
          autocomplete="off"
          v-model:value="formInfo.name"
          placeholder="请输入收件人名称"
        />
      </a-form-item>
      <a-form-item label="联系方式" name="mobile">
        <a-input
          autocomplete="off"
          v-model:value="formInfo.mobile"
          placeholder="请输入联系方式"
        />
      </a-form-item>
      <a-form-item label="地址信息" name="detailAddress">
        <a-input
          autocomplete="off"
          v-model:value="formInfo.detailAddress"
          placeholder="请输入详细的收货地址，以此保证及时收到样品"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped>
.ant-form {
  padding: 20px 25px;
  border-top: 1px solid var(--yw-bg-dcdee0);
}
.ant-input {
  width: 368px;
  border-radius: 0;
  border-style: none;
  border-bottom: 1px solid var(--yw-bg-dcdee0);
}

:deep(.ant-input:focus) {
  box-shadow: none !important;
}
</style>
