<script lang="ts" setup>
import { ref } from 'vue'
import { BillingStatus } from '@/enums'
import { ElMessage } from 'element-plus'
import { fileUploadAPI } from '@/api/public'
import type { updateByMediaIdRes } from '@/types/bill'
import { updateByMediaAPI } from '@/api/bill'

const showYW = ref(false)
const YWLoading = ref(false)
const showYWNum = ref(0)
const screenshot = ref('')
const title = ref('开票')
const emit = defineEmits(['YWRefresh'])
const { tableData, tabNum } = defineProps({
  tableData: Array,
  tabNum: Number
})
const YWData = ref<updateByMediaIdRes>({
  id: 0,
  file: '',
  status: 1,
  remark: ''
})

// 开票 / 驳回
const notarize = (val: any, num: number) => {
  showYWNum.value = num
  if (num === 0) {
    title.value = '开票'
  } else if (num === 1) {
    title.value = '驳回'
  } else if (num === 4) {
    title.value = '修改'
    screenshot.value = val.file
  }
  YWData.value.id = Number(val.id)
  showYW.value = true
}

const beforeAvatarUpload = async (options: any) => {
  if (
    options.file.type === 'image/jpeg' ||
    options.file.type === 'image/png' ||
    options.file.type === 'application/pdf'
  ) {
    if (options.file.size / 1024 > 800) {
      ElMessage.error('上传的文件大小不能超过 800KB!')
      return false
    }
    let formData = new FormData()
    formData.append('file', options.file)
    const res = await fileUploadAPI(formData)
    console.log(res)
    YWData.value.file = res.data.name
    screenshot.value = res.data.url
  } else {
    ElMessage.error('上传的文件只支持png、jpg、pdf文件!')
    return false
  }
}

const handlePaste = async (e: any) => {
  let clipboardData = e.clipboardData // IE
  if (!clipboardData) {
    clipboardData = e.originalEvent.clipboardData
  }
  const items = (e.clipboardData || e.originalEvent.clipboardData).items
  let file = null
  if (!items || items.length === 0) {
    ElMessage.error('当前浏览器不支持粘贴本地图片，请打开图片复制后再粘贴！')
    return
  }
  // 搜索剪切板items
  for (let i = 0; i < items.length; i++) {
    // 限制上传文件类型
    if (items[i].type.indexOf('image') !== -1) {
      file = items[i].getAsFile()
      break
    }
  }
  if (file) {
    if (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'application/pdf'
    ) {
      if (file.size / 1024 > 800) {
        ElMessage.error('上传的图片大小不能超过 800KB!')
        return false
      }
      let formData = new FormData()
      formData.append('file', file)
      const res = await fileUploadAPI(formData)
      YWData.value.file = res.data.name
      screenshot.value = res.data.url
    } else {
      ElMessage.error('上传格式只能为JPG/PNG!')
      return false
    }
  }
}

// 取消
const unselect = () => {
  if (showYWNum.value === 0) {
    YWData.value.file = ''
    screenshot.value = ''
  } else if (showYWNum.value === 1) {
    YWData.value.remark = ''
  } else if (showYWNum.value === 4) {
    YWData.value.file = ''
    screenshot.value = ''
  }
  showYW.value = false
}

// 保存
const save = async () => {
  YWLoading.value = true
  if (showYWNum.value === 0 || showYWNum.value === 4) {
    if (YWData.value.file !== '') {
      await updateByMediaAPI({
        ...YWData.value,
        remark: null,
        status: 0
      }).then(() => {
        // 开票成功
        if (showYWNum.value === 0) {
          ElMessage.success('开票成功')
        } else {
          ElMessage.success('修改开票成功')
        }
        YWData.value.file = ''
        screenshot.value = ''
        showYW.value = false
        YWLoading.value = false
        emit('YWRefresh')
      })
    } else {
      ElMessage.error('请上传开票文件！')
      YWLoading.value = false
      return false
    }
  } else {
    if (YWData.value.remark !== '') {
      await updateByMediaAPI({
        ...YWData.value,
        file: null,
        status: 2
      }).then(() => {
        // 开票成功
        ElMessage.info('已驳回开票')
        YWData.value.remark = ''
        showYW.value = false
        YWLoading.value = false
        emit('YWRefresh')
      })
    } else {
      ElMessage.error('驳回理由不能为空！')
      YWLoading.value = false
      return false
    }
  }
  showYW.value = false
  YWLoading.value = false
}
</script>

<template>
  <div class="bill_card">
    <el-table
      :data="tableData"
      :header-cell-style="{
        background: 'rgba(9, 141, 114, 0.05)',
        height: '56px',
        color: '#111'
      }"
      height="750"
      style="width: 100%"
    >
      <el-table-column label="申请时间" prop="createTime" width="180" />
      <el-table-column label="申请用户" width="210">
        <template #default="{ row }">
          <div class="Application_user">
            <div class="title">{{ row.userName }}</div>
            <div>{{ row.userId }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发票金额" prop="money" />
      <el-table-column label="类型" width="180">
        <template #default="{ row }">
          <div class="status_box">
            <span v-if="row.titleIdNumber">{{ row.titleIdNumber }}</span>
            <span v-else>{{ row.titleSucc }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发票抬头" prop="invoiceTitle" width="230">
        <template #default="{ row }">
          <div class="invoice_title">
            <span v-if="row.titleType === 0">{{ row.titleUserName }}</span>
            <span v-else>{{ row.titleCompanyName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="接收方式" prop="titleEmail" width="220" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <div class="status_box">
            <span>{{ BillingStatus[row.status] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="180" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div v-if="tabNum === 1" class="operation">
            <el-button text @click="notarize(row, 0)">开票</el-button>
            <el-divider direction="vertical" />
            <el-button text @click="notarize(row, 1)">驳回</el-button>
          </div>
          <div v-else-if="tabNum === 0" class="operation">
            <el-link
              :href="row.file"
              :underline="false"
              class="color_yw"
              target="_blank"
              >查看</el-link
            >
            <el-divider direction="vertical" />
            <el-button text @click="notarize(row, 4)">修改</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 弹窗 -->
  <div class="dialog_box">
    <el-dialog
      v-model="showYW"
      :title="title"
      align-center
      :close-on-click-modal="false"
      width="320"
    >
      <div class="dialog_content">
        <div v-if="showYWNum === 0 || showYWNum === 4" class="upload_box">
          <el-upload
            ref="upload"
            :http-request="beforeAvatarUpload"
            :show-file-list="false"
            accept=".jpeg,.png,.jpg,.pdf"
            action=""
            class="avatar-uploader"
            drag
            @paste.enter="handlePaste"
          >
            <img v-if="screenshot" :src="screenshot" alt="" class="avatar" />
            <el-icon v-if="!screenshot" class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div v-if="!screenshot" class="uploader_code">点击上传</div>
            <div v-if="!screenshot" class="uploader_code1">CTRL+V或</div>
            <div v-if="!screenshot" class="uploader_code2">拖动图片到这里</div>
            <template #tip>
              <div class="el-upload__tip">
                支持png、jpg、pdf文件不能超过800kb
              </div>
            </template>
          </el-upload>
        </div>
        <div v-else class="input_box">
          <div class="input_title"><em>*</em>请输入驳回的理由</div>
          <el-input v-model="YWData.remark" type="textarea" />
        </div>
      </div>
      <div class="dialog_btn">
        <el-button class="btn" @click="unselect">取消</el-button>
        <el-button :loading="YWLoading" type="primary" @click="save"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.bill_card {
  font-size: 14px;

  :deep(.el-table__row) {
    height: 80px;
  }

  :deep(.el-table__inner-wrapper::before) {
    display: none;
  }

  .Application_user {
    .title {
      max-width: 186px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .invoice_title {
    span {
      display: inline-block;
      width: 190px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .status_box {
    span {
      color: var(--yw-text-5b7aff);
    }
  }

  .operation {
    .el-button {
      padding: 0;
      color: var(--yw-text-5b7aff);
      height: 16px;
    }

    .color_yw {
      color: var(--yw-text-5b7aff);
    }
  }
}

.dialog_box {
  :deep(.el-dialog__body) {
    padding: 0;
  }

  .dialog_content {
    border-top: 1px solid var(--yw-bg-ebedf0);
    border-bottom: 1px solid var(--yw-bg-ebedf0);
    height: 200px;

    .upload_box {
      margin-top: 25px;

      .avatar-uploader {
        text-align: center;

        :deep(.el-upload) {
          width: 140px;
          height: 138px;
          margin: 0 auto;

          .el-upload-dragger {
            padding: 0;
          }

          .el-icon {
            margin-top: 28px;
            margin-bottom: 8px;
            font-size: 22px;
            color: var(--yw-primary);
          }

          .uploader_code {
            font-size: 12px;
            color: var(--yw-primary);
          }

          .uploader_code1 {
            font-size: 12px;
          }

          .uploader_code2 {
            font-size: 12px;
            margin-bottom: 30px;
          }
        }

        .el-upload__tip {
          color: var(--yw-text-000);
        }

        :deep(.el-upload-dragger) {
          width: 140px;
          height: 138px;
        }
      }
    }

    .input_box {
      padding: 17px 24px 0;

      .input_title {
        margin-bottom: 12px;

        em {
          color: var(--yw-text-f00);
          margin-right: 5px;
        }
      }

      .el-textarea {
        height: 130px;

        :deep(.el-textarea__inner) {
          height: 100%;
        }
      }
    }
  }

  .dialog_btn {
    height: 47px;
    padding-top: 8px;
    text-align: center;
    box-sizing: border-box;

    .el-button {
      width: 64px;
    }

    .btn {
      border-color: var(--yw-primary);
      color: var(--yw-primary);
    }
  }
}
</style>
