<script setup lang="ts">
import { getPAPI } from '@/api/media'
import { useUserStore } from '@/stores'
import { reactive, ref, watch } from 'vue'
import { getCountryAPI } from '@/api/public'
import { SyncOutlined, SearchOutlined } from '@ant-design/icons-vue'

const formRef = ref()
const countryInfo = ref()
const resourceTypeInfo = ref()
const classNameTo = ref(false)
const userStore = useUserStore()

const props = defineProps({
  father: {
    type: Number
  }
})

watch(props, newVal => {
  if (newVal) {
    formRef.value.resetFields()
    resourceTypeInfo.value = []
  }
})

const ywFrom = reactive({
  createId: userStore.userInfo.userId,
  countryId: undefined,
  resourceTypeId: undefined,
  sfId: undefined,
  resourceName: '',
  grounding: 1,
  checkStatus: 1,
  pageSize: 14,
  pageNum: 1
})

// 表单校验规则
const rules = reactive({
  resourceName: [
    { required: true, message: '请输入资源名称', trigger: 'blur' }
  ],
  countryId: [{ required: true, message: '请选择国家', trigger: 'change' }],
  resourceTypeId: [
    { required: true, message: '请选择资源类型', trigger: 'change' }
  ],
  sfId: [{ required: true, message: '请选择身份', trigger: 'change' }]
})

// 获取国家
const countryChange = async () => {
  const res = await getCountryAPI()
  countryInfo.value = res.data
}

// 根据国家id获取资源平台列表
const getPInfo = async () => {
  ywFrom.resourceTypeId = undefined
  if (ywFrom.countryId !== 'null') {
    const res = await getPAPI(ywFrom.countryId!)
    resourceTypeInfo.value = res.data
  } else {
    resourceTypeInfo.value = []
  }
}

const emit = defineEmits(['YouWeiXJSon', 'addMediaYWSon', 'modifyPriceYWSon'])

// 刷新
const refresh = () => {
  classNameTo.value = true
  formRef.value.resetFields()
  resourceTypeInfo.value = []
  emit('YouWeiXJSon', ywFrom)
  setTimeout(() => {
    classNameTo.value = false
  }, 1000)
}

// 搜索
const getSearch = () => {
  emit('YouWeiXJSon', ywFrom)
  formRef.value.clearValidate()
}

// 重置
const resetForm = () => {
  formRef.value.resetFields()
  resourceTypeInfo.value = []
  emit('YouWeiXJSon', ywFrom)
}

// 添加资源
const addMediaYW = () => emit('addMediaYWSon')

// 批量修改价格
const modifyPriceYW = () => emit('modifyPriceYWSon')
</script>

<template>
  <div class="herder_page">
    <a-form layout="inline" ref="formRef" :rules="rules" :model="ywFrom">
      <a-form-item>
        <a-button type="primary" ghost @click="refresh">
          <template #icon>
            <SyncOutlined :class="{ rotateIcon: classNameTo }" />
          </template>
          刷新
        </a-button>
      </a-form-item>

      <a-form-item name="countryId" style="width: 238px">
        <a-select
          v-model:value="ywFrom.countryId"
          @focus="countryChange"
          @change="getPInfo"
          placeholder="请选取国家"
        >
          <a-select-option value="null">全部国家</a-select-option>
          <a-select-option v-for="i in countryInfo" :key="i.id" :value="i.id">
            {{ i.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item name="resourceTypeId" style="width: 238px">
        <a-select
          v-model:value="ywFrom.resourceTypeId"
          placeholder="请选取资源类型(根据国家选取)"
        >
          <a-select-option value="null">全部资源</a-select-option>
          <a-select-option
            v-for="i in resourceTypeInfo"
            :key="i.id"
            :value="i.id"
          >
            {{ i.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item name="sfId" style="width: 238px">
        <a-select v-model:value="ywFrom.sfId" placeholder="请选取身份信息">
          <a-select-option value="null">全部身份</a-select-option>
          <a-select-option :value="1">媒体主</a-select-option>
          <a-select-option :value="2">自营</a-select-option>
          <a-select-option :value="3">服务商</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item name="resourceName" style="width: 238px">
        <a-input
          v-model:value="ywFrom.resourceName"
          placeholder="资源名称"
          autocomplete="off"
          allowClear
          @pressEnter="getSearch"
        >
          <template #suffix>
            <SearchOutlined :style="{ color: '#bcbec4' }" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" ghost @click="getSearch">搜索</a-button>
        <a-button type="text" @click="resetForm" class="resetForm">
          重置
        </a-button>
        <a-button type="primary" @click="addMediaYW" style="margin-left: 10px">
          添加资源
        </a-button>
        <a-button
          type="primary"
          @click="modifyPriceYW"
          ghost
          style="margin-left: 10px"
        >
          批量修改价格
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
.herder_page {
  height: 56px;
  width: 1607px;
  padding: 11px;
  border-radius: 4px;
  margin-bottom: 18px;
  background-color: var(--yw-bg-color);
  .rotateIcon {
    animation: rotate 1s linear infinite;
  }
  .resetForm {
    margin-left: 10px;
    color: var(--yw-primary);
    &:hover {
      color: var(--yw-primary-hover);
    }
  }
}
</style>
