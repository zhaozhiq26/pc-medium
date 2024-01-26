<script setup lang="ts">
import dayjs from 'dayjs'
import { reactive, ref, watch } from 'vue'
import { SyncOutlined, SearchOutlined } from '@ant-design/icons-vue'

const formRef = ref()
const dateValue = ref([])
const classNameTo = ref(false)

const props = defineProps({
  father: {
    type: Number
  }
})

watch(props, newVal => {
  if (newVal) {
    formRef.value.resetFields()
    dateValue.value = []
  }
})

const ywFrom = reactive({
  userId: '',
  endTime: undefined,
  startTime: undefined,
  status: 1,
  pageNum: 1,
  pageSize: 10
})

// 表单校验规则
const rules = reactive({
  userId: [
    { required: true, message: '请输入用户ID', trigger: 'blur' },
    { pattern: /^[0-9]*$/, message: '输入的ID只能为数字', trigger: 'blur' }
  ]
})

const emit = defineEmits(['YouWeiXJSon', 'addMediaYWSon', 'modifyPriceYWSon'])

// 刷新
const refresh = () => {
  classNameTo.value = true
  dateValue.value = []
  formRef.value.resetFields()
  emit('YouWeiXJSon', {
    ...ywFrom,
    status: props.father
  })
  setTimeout(() => {
    classNameTo.value = false
  }, 1000)
}

// 搜索
const getSearch = () => {
  if (/^[0-9]*$/.test(ywFrom.userId)) {
    emit('YouWeiXJSon', {
      ...ywFrom,
      endTime:
        dateValue.value.length < 0
          ? undefined
          : dayjs(dateValue.value[1]).format('YYYY-MM-DD 23:59:59'),
      startTime:
        dateValue.value.length < 0
          ? undefined
          : dayjs(dateValue.value[0]).format('YYYY-MM-DD 00:00:00'),
      status: props.father
    })
    formRef.value.clearValidate()
  }
}
// 重置
const resetForm = () => {
  dateValue.value = []
  formRef.value.resetFields()
  emit('YouWeiXJSon', {
    ...ywFrom,
    status: props.father
  })
}
</script>

<template>
  <div class="herder_page">
    <a-form layout="inline" ref="formRef" :rules="rules" :model="ywFrom">
      <a-form-item>
        <a-button ghost @click="refresh" class="YWBtn">
          <template #icon>
            <SyncOutlined :class="{ rotateIcon: classNameTo }" />
          </template>
          刷新
        </a-button>
      </a-form-item>

      <a-form-item name="dateValue" style="width: 226px">
        <a-range-picker
          v-model:value="dateValue"
          :allowClear="false"
          valueFormat="YYYY-MM-DD HH:mm:ss"
        />
      </a-form-item>

      <a-form-item name="userId" style="width: 238px">
        <a-input
          v-model:value="ywFrom.userId"
          placeholder="用户ID搜索"
          autocomplete="off"
          :maxlength="19"
          allowClear
          @pressEnter="getSearch"
        >
          <template #suffix>
            <SearchOutlined :style="{ color: '#bcbec4' }" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button ghost @click="getSearch" class="YWBtn"> 搜索 </a-button>
        <a-button type="text" @click="resetForm" class="resetForm">
          重置
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
  .YWBtn {
    color: var(--yw-primary-two);
    background-color: var(--yw-bg-fff);
    border-color: var(--yw-primary-two);
  }
  .resetForm {
    margin-left: 10px;
    color: var(--yw-primary-two);
  }
  :deep(.ant-picker-active-bar) {
    display: none;
  }
}
</style>
