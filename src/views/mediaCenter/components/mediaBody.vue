<script lang="ts" setup>
import { nextTick, reactive, ref, toRaw, toRefs } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { putMediaInfoAPI, putUpdateMAPI } from '@/api/media'
import type { putUpdateMRes } from '@/types/media'

const refInput = ref()
const priceInput = ref()
const priceMin = ref()
const showDialogTo = ref(false)
const sortRule = ref({ prop: null, order: null })
const refDialog = ref<FormInstance>()
let tableRowEditId = ref(null) // 控制可编辑的每一行
let tableColumnEditIndex = ref(null) //控制可编辑的每一列
const ruleForm = ref<putUpdateMRes>({
  type: '0',
  money: '',
  ids: []
})

// 接收父元素数据
const props = defineProps({
  tableData: {
    type: Array
  }
})
const { tableData } = toRefs(props)

// 修改价格
const handleCellClick = async (row: any, column: any, event: any) => {
  tableRowEditId.value = row.id
  tableColumnEditIndex.value = column.id
  if (row.price) {
    await nextTick(() => {
      refInput.value.focus()
    })
    return
  }
}
// 上下架
const getSwitch = async (val: any) => {
  const res = await putMediaInfoAPI({
    id: val.id,
    grounding: val.grounding,
    resourceFlow: val.resourceFlow ? val.resourceFlow : null,
    flowAnalysis: val.flowAnalysis ? val.flowAnalysis : null,
    averageView: val.averageView ? val.averageView : null,
    fan: val.fan ? val.fan : null
  })
  if (res.code === 200) {
    if (val.grounding === '1') {
      ElMessage.success('上架修改成功')
    } else if (val.grounding === '0') {
      ElMessage.warning('下架修改成功')
    }
    refreshData1()
  }
}

const blurValueInput = async (row: any, column: any) => {
  tableRowEditId.value = null
  tableColumnEditIndex.value = null
  if (!priceInput.value) {
    ElMessage.error('修改价格不能为空')
    return
  } else if (!/^[1-9]\d{0,7}$/.test(priceInput.value)) {
    ElMessage.error('修改价格只能为整数且大于0')
    priceInput.value = ''
    return
  } else {
    const blurValue = toRaw({
      id: row.id,
      price: priceInput.value,
      resourceFlow: row.resourceFlow ? row.resourceFlow : null,
      flowAnalysis: row.flowAnalysis ? row.flowAnalysis : null,
      averageView: row.averageView ? row.averageView : null,
      fan: row.fan ? row.fan : null
    })
    //在此处调接口传数据
    if (ruleForm.value.ids.length === 0) {
      const res = await putMediaInfoAPI(blurValue)
      if (res.code === 200) {
        ElMessage.success('价格修改成功')
        priceInput.value = ''
        refreshData1()
      }
    } else {
      priceInput.value = ''
    }
  }
}
const emits = defineEmits(['refreshData', 'ModifyMedia', 'refreshData'])
const refreshData1 = () => {
  emits('refreshData')
}

// 弹窗内容

// 批量修改资源
const handleSelectionChange = (val: any) => {
  ruleForm.value.ids = val.map((v: any) => {
    return v.id
  })
  const priceArr = val.map((v: any) => {
    return Number(v.price)
  })
  priceMin.value = Math.min(...priceArr)
}

// 批量修改价格
const modifyPriceTo = () => {
  if (ruleForm.value.ids.length !== 0) {
    showDialogTo.value = !showDialogTo.value
  }
}

const rulesTo = reactive({
  type: [{ required: true, message: '请选择调整方式', trigger: 'blur' }],
  money: [
    { required: true, message: '请输入调整数量', trigger: 'blur' },
    { required: true, validator: phoneValidator, trigger: 'blur' }
  ]
})

function phoneValidator(rule: any, value: any, callback: any) {
  if (ruleForm.value.type === '0') {
    if (!/^-?\d+(\.\d{0,2})?$/.test(value)) {
      callback(new Error('输入的数值为数字或两位小数'))
    } else if (Number(value) < -99) {
      callback(new Error('输入的数值在0.01至-99区间'))
    } else {
      callback()
    }
  } else {
    if (!/^-?\d+$/.test(value)) {
      callback(new Error('输入的数值只能为整数'))
    } else if (!(Number(value) > -priceMin.value)) {
      callback(new Error(`输入的数值不能小于等于${priceMin.value}`))
    } else {
      callback()
    }
  }
}

// 取消
const unDisplay = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  showDialogTo.value = !showDialogTo.value
}

const clearContents = () => {
  ruleForm.value.money = ''
}

// 提交
const confirmModification = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await putUpdateMAPI({
        ...ruleForm.value,
        money:
          ruleForm.value.type === '0'
            ? ruleForm.value.money + '%'
            : ruleForm.value.money
      })
      if (res.code === 200) {
        ElMessage.success('批量修改价格成功')
        showDialogTo.value = !showDialogTo.value
        formEl.resetFields()
        emits('refreshData', { pageSize: 14, pageNum: 1 })
      }
    }
  })
}

const ModifyMedia1 = (id: number) => {
  emits('ModifyMedia', id)
}
defineExpose({
  ruleForm,
  modifyPriceTo
})
</script>

<template>
  <div class="MediaCar-page">
    <div class="MediaCar_body">
      <el-table
        :data="tableData"
        :default-sort="sortRule"
        :header-cell-style="{
          background: 'rgba(9, 141, 114, 0.05)',
          height: '56px',
          color: '#111'
        }"
        height="745"
        style="width: 100%"
        @cell-click="handleCellClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column label="资源名称" width="290">
          <template #default="{ row }">
            <div class="min-content-header-cell">
              <el-tooltip effect="dark" placement="top-start">
                <span class="blacken">{{ row.resourceName }}</span>
                <template #content>
                  <div>资源名称</div>
                  <div class="tooltip-box">{{ row.resourceName }}</div>
                </template>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="资源类别" width="140">
          <template #default="{ row }">
            <div class="min-content-header-cell1">
              <span class="blacken">{{ row.resourceTypeName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="购物平台" width="180">
          <template #default="{ row }">
            <el-tooltip effect="dark" placement="top-start">
              <template #content>
                <div>购物平台</div>
                <div class="tooltip-box">
                  <span v-for="v in row.platformsList" :key="v.id">
                    {{ v.name }}&nbsp;
                  </span>
                </div>
              </template>
              <div class="min-content-header-img">
                <img
                  v-for="i in row.platformsList"
                  :key="i.id"
                  :src="i.pic"
                  alt=""
                />
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="流量/粉丝量" width="130">
          <template #default="{ row }">
            <div v-show="row.resourceFlow !== null">
              <i class="iconfont icon-a-flow" />
              <span class="svg_left">{{ row.resourceFlow }}</span>
              <span>{{ row.flowUnit }}</span>
            </div>
            <div v-show="row.fan !== null">
              <i class="iconfont icon-a-fans" />
              <span class="svg_left">{{ row.fan }}</span>
              <span>{{ row.fanUnit }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="price" width="130">
          <template #default="{ row, column }">
            <div style="display: flex; align-items: center">
              <el-input
                v-if="
                  tableRowEditId === row.id &&
                  tableColumnEditIndex === column.id
                "
                ref="refInput"
                v-model="priceInput"
                :placeholder="row.price"
                class="price_title_input"
                onkeyup="value=value.replace(/\D/g,'').replace(/^0+/g,'')"
                @blur="blurValueInput(row, column)"
                @keyup.enter="blurValueInput(row, column)"
              />
              <span v-else class="price_title_icon">{{ row.price }}</span>
              <i class="iconfont icon-redact" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="身份" width="80">
          <template #default="{ row }">
            <span v-show="row.sfId === 1" class="public_sf media_owner"
              >媒体主</span
            >
            <span v-show="row.sfId === 2" class="public_sf self_support"
              >自营</span
            >
            <span v-show="row.sfId === 3" class="public_sf service_provider"
              >服务商</span
            >
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="122">
          <template #default="{ row }">
            <div v-show="row.checkStatus === 0" class="no_pass">
              <div class="public_state no_pass_span">审核不通过</div>
              <el-tooltip effect="dark" placement="top-start">
                <template #content>
                  <div>审核未通过</div>
                  <div class="tooltip_box">{{ row.checkReason }}</div>
                </template>
                <div class="no_pass_icon">?</div>
              </el-tooltip>
            </div>
            <span v-show="row.checkStatus === 1" class="public_state approve">
              审核通过
            </span>
            <span
              v-show="row.checkStatus === 2"
              class="public_state under_review"
            >
              待审核
            </span>
          </template>
        </el-table-column>
        <el-table-column label="销量" prop="sale" width="99" />
        <el-table-column label="上传时间" prop="createTime" width="180">
          <template #default="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="上下架"
          prop="grounding"
          width="109"
        >
          <template #default="{ row }">
            <el-tooltip
              v-if="row.grounding === 0"
              effect="dark"
              placement="top-start"
            >
              <template #content>
                <div>上下架</div>
                <div class="tooltip_box">下架</div>
              </template>
              <el-switch
                v-model="row.grounding"
                active-text="上"
                :active-value="1"
                inactive-text="下"
                :inactive-value="0"
                inline-prompt
                @change="getSwitch(row)"
              />
            </el-tooltip>
            <el-switch
              v-if="row.grounding === 1"
              v-model="row.grounding"
              active-text="上"
              :active-value="1"
              inactive-text="下"
              :inactive-value="0"
              inline-prompt
              @change="getSwitch(row)"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="86">
          <template #default="{ row }">
            <i class="iconfont icon-redact" @click="ModifyMedia1(row.id)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!--弹窗-->
  <div class="dialog-box">
    <el-dialog
      v-model="showDialogTo"
      :close-on-click-modal="false"
      :show-close="false"
      align-center
      width="389"
    >
      <template #header>
        <div class="dialog_title">
          <span>批量修改价格</span>
          <el-icon @click="unDisplay(refDialog)">
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="dialog-body">
        <el-form
          ref="refDialog"
          :model="ruleForm"
          :rules="rulesTo"
          label-width="90px"
        >
          <el-form-item label="调整方式" prop="type">
            <el-select v-model="ruleForm.type" @change="clearContents">
              <el-option label="按比例调整" value="0" />
              <el-option label="按固定金额修改" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="ruleForm.type === '0'"
            label="比例调整"
            prop="money"
          >
            <el-input v-model="ruleForm.money">
              <template #append>%</template>
            </el-input>
          </el-form-item>

          <el-form-item v-else label="固定金额" prop="money">
            <el-input v-model="ruleForm.money" />
          </el-form-item>

          <el-form-item>
            <span class="form_item_title">正数为加，负数为减</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button class="btn" @click="unDisplay(refDialog)">取消</el-button>
        <el-button
          class="btn1"
          type="primary"
          @click="confirmModification(refDialog)"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dialog-box {
  :deep(.el-dialog__header) {
    padding: 0;
    margin-right: 0;
    border-radius: 4px;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  .dialog_title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--yw-bg-dcdee0);
    height: 40px;
    align-items: center;

    span {
      font-size: 16px;
      color: var(--yw-text-111);
      font-weight: 400;
      padding-left: 24px;
    }

    .el-icon {
      padding-right: 14px;
    }
  }

  .dialog-body {
    padding: 24px;

    .el-select {
      width: 100%;
    }

    .form_item_title {
      color: var(--yw-text-ef6706);
      margin-top: -10px;
    }

    :deep(.el-input-group__append) {
      width: 1px;
    }
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: right;
    border-top: 1px solid var(--yw-bg-dcdee0);
    height: 48px;

    .el-button {
      width: 64px;
    }

    .btn {
      color: var(--yw-primary);
      border-color: var(--yw-primary);
    }

    .btn1 {
      margin-right: 24px;
    }
  }
}

.MediaCar_body {
  height: 750px;

  :deep(.el-table) {
    .svg_left {
      margin-left: 5px;
    }

    .min-content-header-cell {
      .el-tooltip__trigger {
        color: var(--yw-text-111);
        overflow: hidden;
        max-width: 270px;
        font-weight: bold;
        white-space: nowrap;
        display: inline-block;
        text-overflow: ellipsis;
      }
    }

    .min-content-header-cell1 {
      .blacken {
        max-width: 120px;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
        text-overflow: ellipsis;
      }
    }

    .price_title_input {
      height: 22px;
      width: 65px !important;
      .el-input__wrapper {
        padding: 1px 5px !important;
      }
    }

    .price_title_icon {
      color: var(--yw-primary);
    }

    .min-content-header-img {
      display: inline-block;
      max-width: 133px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      img {
        width: 16px;
        height: 16px;
        margin-top: 7px;
        margin-right: 12px;
      }
    }
    .icon-redact {
      color: var(--yw-primary);
    }
  }
}
.tooltip-box {
  font-size: 14px;
  margin-top: 8px;
  overflow: hidden;
  max-width: 240px;
  font-weight: 400;
  color: var(--yw-text-fff);
  line-height: 16px;
  margin-bottom: 8px;
  text-overflow: ellipsis;
}
:deep(.el-table__inner-wrapper) {
  &::before {
    display: none;
  }
}

:deep(.el-table__header-wrapper) {
  thead {
    tr {
      color: var(--yw-text-111);
    }
  }
}

.price-icon {
  width: 12px;
  height: 12px;
  display: inline-block;
  margin-left: 3px;

  img {
    margin-bottom: 20px;
  }
}

.tooltip-box {
  margin-top: 8px;
  margin-bottom: 8px;
  max-width: 200px;
  font-size: 14px;
  font-weight: 400;
  color: var(--yw-text-fff);
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
