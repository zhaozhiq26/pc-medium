<!-- 收货地址 -->
<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { onMounted, reactive, ref } from 'vue'
import ShippingDialog from './components/shippingDialog.vue'
import type {
  getShippingAddressRes,
  NewAddressRes,
  postUpdateDefaultRes
} from '@/types/set'
import {
  deleteAddressAPI,
  getAddressInfoAPI,
  NewAddressAPI,
  postUpdateDefaultAPI
} from '@/api/set'
import { message } from 'ant-design-vue'

const ruleRef = ref()
const tableData = ref()
const VisibleRef = ref()
const loadingYW = ref(false)
const userStore = useUserStore()
const addressData = ref<NewAddressRes>({
  userId: userStore.userInfo!.userId,
  name: '',
  mobile: '',
  areaId: undefined,
  detailAddress: '',
  defaultStatus: false,
  userType: 1
})
const getShipping = reactive<getShippingAddressRes>({
  userId: userStore.userInfo.userId,
  typeId: 1
})

// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: '请输入收件人名称', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  detailAddress: [
    { required: true, message: '请输入收货地址', trigger: 'blur' }
  ]
})
// 保存地址
const CommitSave = () => {
  ruleRef.value.validate().then(async () => {
    loadingYW.value = true
    await NewAddressAPI({
      ...addressData.value,
      defaultStatus: addressData.value.defaultStatus === true ? 1 : 0
    })
      .then(async () => {
        message.success('地址添加成功')
        await getAddressInfo()
        ruleRef.value.resetFields()
        loadingYW.value = false
      })
      .catch(() => {
        loadingYW.value = false
      })
  })
}

onMounted(() => {
  getAddressInfo()
})
// 表格数据
const getAddressInfo = async () => {
  const res = await getAddressInfoAPI(getShipping)
  tableData.value = res.data
}

const columns = [
  {
    title: '收件人',
    dataIndex: 'name',
    width: 310
  },
  {
    title: '联系方式',
    dataIndex: 'mobile',
    width: 260
  },
  {
    title: '收货地址',
    dataIndex: 'detailAddress',
    ellipsis: true,
    width: 490
  },
  {
    title: '操作',
    width: 213
  },
  {
    title: ''
  }
]

// 修改
const handleEdit = (row: any) => VisibleRef.value.dialogRef(row)

// 删除
const ywDelete = async (id: number) => {
  await deleteAddressAPI(id).then(async () => {
    message.success('删除成功')
    await getAddressInfo()
  })
}

const toCall = async () => await getAddressInfo()

// 修改默认
const UpdateDefault = async (id: number) => {
  const arr = tableData.value.find((v: any) => v.defaultStatus === 1)
  if (tableData.value.length === 1 || arr === undefined) {
    const res = await postUpdateDefaultAPI({
      oldId: id,
      newId: id
    })
    if (res.code === 200) {
      await getAddressInfo()
      message.success('设置默认地址成功')
    }
  } else {
    const Info = ref<postUpdateDefaultRes>({
      oldId: arr.id,
      newId: id
    })
    const res = await postUpdateDefaultAPI(Info.value)
    if (res.code === 200) {
      await getAddressInfo()
      message.success('设置默认地址成功')
    }
  }
}
</script>

<template>
  <div class="shipping_address yw_box">
    <div class="set_title">收货地址设置</div>
    <div class="shipping_address_content">
      <a-form
        ref="ruleRef"
        :model="addressData"
        :rules="rules"
        :label-col="{ span: 2 }"
      >
        <a-form-item label="收件人" name="name">
          <a-input
            autocomplete="off"
            v-model:value="addressData.name"
            placeholder="请输入收件人名称"
          />
        </a-form-item>
        <a-form-item label="联系方式" name="mobile">
          <a-input
            autocomplete="off"
            v-model:value="addressData.mobile"
            placeholder="请输入联系方式"
          />
        </a-form-item>
        <a-form-item label="收货地址" name="detailAddress">
          <a-input
            autocomplete="off"
            v-model:value="addressData.detailAddress"
            placeholder="请输入详细的收货地址，以此保证及时收到样品"
          />
        </a-form-item>
        <a-form-item label="" name="defaultStatus">
          <div class="yw_checkbox">
            <a-checkbox v-model:checked="addressData.defaultStatus" name="type">
              设为默认地址
            </a-checkbox>
          </div>
        </a-form-item>
        <a-form-item label="" name="defaultStatus">
          <a-button
            :loading="loadingYW"
            class="top_el_btn"
            type="primary"
            @click="CommitSave"
          >
            保存
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="payment_term_footer">
      <a-table :columns="columns" :data-source="tableData">
        <template #bodyCell="{ column, record }">
          <template v-if="column.title === '操作'">
            <a-button type="text" @click="handleEdit(record)"> 修改 </a-button>
            <a-divider type="vertical" />
            <a-popconfirm placement="left" @confirm="ywDelete(record.id)">
              <template #title>
                <p>删除提示</p>
                <p>您确认要删除这条数据吗？</p>
              </template>
              <a-button type="text">删除</a-button>
            </a-popconfirm>
          </template>

          <template v-if="column.title === ''">
            <span v-if="record.defaultStatus === 1" class="default_btn">
              默认地址
            </span>
            <span
              v-else
              class="default_btn_1"
              @click="UpdateDefault(record.id)"
            >
              设为默认
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <!-- 弹出框 -->
  <ShippingDialog ref="VisibleRef" @sayCall="toCall" />
</template>

<style lang="scss" scoped>
.shipping_address {
  padding: 27px 53px;
  .shipping_address_content {
    margin-top: 26px;
    margin-left: -22px;

    .ant-input {
      width: 368px;
    }
    .yw_checkbox,
    .top_el_btn {
      width: 119px;
      margin-left: 130px;
    }
  }

  .payment_term_footer {
    :deep(.ant-table) {
      height: 550px;
      .ant-table-content {
        overflow: auto;
      }
    }
    :deep(.ant-table-thead) {
      height: 56px;
      .ant-table-cell {
        background: var(--yw-bg-color);
      }
    }
    :deep(.ant-table-tbody) {
      .ant-table-cell {
        padding: 8px 16px;
      }
      .default_btn {
        cursor: pointer;
        padding: 0 6px;
        border-radius: 4px;
        color: var(--yw-text-fff);
        background-color: var(--yw-primary);
        &:hover {
          background-color: var(--yw-primary-hover);
        }
      }
      .default_btn_1 {
        cursor: pointer;
        padding: 1px 6px;
      }
    }
  }
}
:deep(label) {
  font-weight: 400;
}
</style>
