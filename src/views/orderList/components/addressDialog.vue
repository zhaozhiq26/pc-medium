<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import type { FormInstance } from 'element-plus'
import { mediaOrdersAPI } from '@/api/orderList'
import { getAddressInfoAPI, NewAddressAPI } from '@/api/set'
import type { getShippingAddressRes, NewAddressRes } from '@/types/set'

const ruleRef = ref<FormInstance>()
const disabledTo = ref(false)
const disabledJK = ref(false)
const userStore = useUserStore()
const AddressBox = ref(false)
const AddressBox1 = ref(false)
const getSite = ref()
const getShipping = reactive({
  userId: userStore.userInfo.userId,
  typeId: 1
})

const FormData2 = ref<any>({
  id: '',
  orderType: '',
  addressId: 0,
  status: '',
  orderSn: ''
})
const Address = async (val: any) => {
  FormData2.value.id = val.id
  FormData2.value.orderType = val.orderType
  FormData2.value.status = val.status
  FormData2.value.orderSn = val.orderSn
  const res = await getAddressInfoAPI(<getShippingAddressRes>getShipping)
  if (res.data.length === 0) {
    AddressBox.value = true
  } else {
    getSite.value = res.data
    FormData2.value.addressId = res.data.find(v => v.defaultStatus === 1)?.id
    AddressBox1.value = true
  }
}

const FormData = reactive<NewAddressRes>({
  userId: userStore.userInfo!.userId,
  name: '',
  mobile: '',
  areaId: undefined,
  detailAddress: '',
  defaultStatus: 0,
  userType: 1
})

const rules = reactive({
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  detailAddress: [
    { required: true, message: '请输入详细的地址信息', trigger: 'blur' }
  ]
})

const getSiteTo = async () => {
  const res = await getAddressInfoAPI(<getShippingAddressRes>getShipping)
  getSite.value = res.data
  FormData2.value.addressId = res.data.find(v => v.defaultStatus === 1)?.id
}

// 添加地址
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      disabledJK.value = true
      await NewAddressAPI(FormData)
        .then(async () => {
          ElMessage.success('地址添加成功')
          AddressBox.value = false
          await getSiteTo()
          AddressBox1.value = true
          formEl.resetFields()
          disabledJK.value = false
        })
        .catch(() => {
          disabledJK.value = false
        })
    }
  })
}

// 取消添加
const closeDrawer = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  AddressBox.value = false
}

// 取消订单
const closeDrawer1 = () => (AddressBox1.value = false)

const emit = defineEmits(['refreshData'])

const refreshData1 = () => {
  emit('refreshData')
}

// 确认订单
const submitForm1 = async () => {
  disabledTo.value = true
  await mediaOrdersAPI(FormData2.value)
    .then(() => {
      ElMessage.success('接单成功')
      refreshData1()
      AddressBox1.value = false
      setTimeout(() => {
        disabledTo.value = false
      }, 1000)
    })
    .catch(() => {
      disabledTo.value = false
      refreshData1()
    })
}

const handleClose = () => {
  AddressBox.value = false
  ruleRef.value!.resetFields()
}

defineExpose({
  AddressBox,
  Address
})
</script>

<template>
  <el-dialog
    v-model="AddressBox"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :show-close="false"
    align-center
    class="fill_in"
    width="603px"
  >
    <template #header>
      <div class="dialog_title">
        <span>你未填写收货地址，请填写收货地址后开启寄样订单接单</span>
        <el-icon @click="closeDrawer(ruleRef)">
          <Close />
        </el-icon>
      </div>
    </template>
    <el-form ref="ruleRef" :model="FormData" :rules="rules" label-width="100px">
      <el-form-item label="收货人姓名" prop="name">
        <el-input v-model="FormData.name" placeholder="请输入收货人姓名" />
      </el-form-item>
      <el-form-item label="联系方式" prop="mobile">
        <el-input v-model="FormData.mobile" placeholder="请输入联系方式" />
      </el-form-item>
      <el-form-item label="地址信息" prop="detailAddress">
        <el-input
          v-model="FormData.detailAddress"
          placeholder="请输入详细的地址信息"
        />
      </el-form-item>
      <el-form-item prop="defaultStatus">
        <el-checkbox
          v-model="FormData.defaultStatus"
          :false-label="0"
          :true-label="1"
          label="设为默认收货地址"
          size="large"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="res_btn" @click="closeDrawer(ruleRef)">
          取消
        </el-button>
        <el-button
          :loading="disabledJK"
          type="primary"
          @click="submitForm(ruleRef)"
        >
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div class="dialog_box2">
    <el-dialog
      v-model="AddressBox1"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :show-close="false"
      align-center
      class="fill_in_box"
      width="603px"
    >
      <template #header>
        <div class="dialog_title dialog_title_1">
          <span></span>
          <el-icon @click="closeDrawer1">
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="fill_in_box_content">
        <el-table :data="getSite" style="width: 100%">
          <el-table-column width="50">
            <div class="fill_in_img">
              <i class="iconfont icon-position" />
            </div>
          </el-table-column>
          <el-table-column width="340">
            <template #default="{ row }">
              <div class="fill_in_box_header_title">
                <div class="fill_in_box_header_title_top">
                  {{ row.detailAddress }}
                </div>
                <div>
                  <span class="fill_in_box_header_title_name">
                    {{ row.name }} <em>{{ row.mobile }}</em>
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="160">
            <template #default="{ row }">
              <div class="fill_in_checkbox">
                <el-radio-group v-model="FormData2.addressId">
                  <el-radio v-if="row.defaultStatus === 1" :label="row.id">
                    使用默认地址
                  </el-radio>
                  <el-radio v-else :label="row.id">使用该地址</el-radio>
                </el-radio-group>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="fill_in_btn">
        <el-button class="res_btn_1" @click="closeDrawer1">取消</el-button>
        <el-button :loading="disabledTo" type="primary" @click="submitForm1">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.fill_in_checkbox {
  margin-left: 30px;

  :deep(.el-radio) {
    .el-radio__inner {
      border-radius: 0;
    }

    .el-radio__input.is-checked .el-radio__inner::after {
      content: '';
      width: 8px;
      height: 6px;
      border: 2px solid var(--yw-bg-fff);
      border-top: transparent;
      border-right: transparent;
      text-align: center;
      display: block;
      position: absolute;
      top: 2px;
      left: 2px;
      transform: rotate(-45deg);
      border-radius: 0;
      background: none;
    }
  }
}

.fill_in {
  :deep(.el-dialog__header) {
    border: 1px solid var(--yw-bg-dcdee0);
  }

  :deep(.el-dialog__title) {
    font-size: 14px !important;
  }

  .el-form {
    padding-left: 53px;
  }
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
}

.el-input {
  width: 341px;
  border-bottom: 1px solid var(--yw-bg-dcdee0);
}

.el-button {
  width: 119px;
  height: 32px;
  margin-right: 37px;
}

.res_btn {
  border: 1px solid var(--yw-primary);
}

.dialog_title {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--yw-bg-dcdee0);
  margin-right: -5px;

  span {
    font-size: 14px;
    color: var(--yw-text-111);
    font-weight: 400;
    padding-left: 24px;
    margin-bottom: 10px;
  }

  .el-icon {
    padding-right: 5px;
  }
}

.dialog_title_1 {
  border-bottom: none;
}

.dialog_box2 {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    .fill_in_img {
      width: 16px;
      height: 19px;

      i {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }

    .fill_in_box_content {
      .fill_in_box_header_title {
        font-size: 14px;
        color: var(--yw-text-111);

        .fill_in_box_header_title_top {
          margin-bottom: 9px;
          width: 316px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .fill_in_box_header_title_name {
          em {
            margin-left: 26px;
          }
        }
      }
    }

    .fill_in_btn {
      margin-top: 20px;
      padding-left: 369px;
    }

    .el-button {
      width: 64px;
      height: 32px;
    }

    .res_btn_1 {
      margin-right: 12px;
    }
  }
}
</style>
