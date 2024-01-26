<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { fileUploadAPI } from '@/api/public'
import { beforeAvatarUpload } from '@/utils/rule'
import { ElMessage, type FormInstance } from 'element-plus'
import { efundReasonAPI, refuseRefundnAPI, toPostedAPI } from '@/api/orderList'

const num = ref()
const upload = ref()
const formInfo = ref()
const drawer = ref(false)
const isLoading = ref(false)
const efundReasonInfo = ref()
const formRef = ref<FormInstance>()
const submitForm = ref({
  id: '',
  completeLink: '',
  screenshot: '',
  status: '',
  orderSn: '',
  rejectionId: null
})
const rules = reactive({
  rejectionId: [
    { required: true, message: '请选择退款理由', trigger: 'change' }
  ],
  completeLink: [
    { required: false, message: '请输入上贴链接', trigger: 'change' },
    {
      pattern:
        /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
      message: '请输入正确的上贴链接',
      trigger: 'blur'
    }
  ]
})
// 上传照片
const httpAvatarUpload = async (options: any) => {
  let formData = new FormData()
  formData.append('file', options.file)
  const res = await fileUploadAPI(formData)
  submitForm.value.screenshot = res.data.url
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
    const types = ['image/jpg', 'image/png', 'image/jpeg']
    const isJPG = types.includes(file.type)
    const isLt800K = file.size / 1024 < 800
    if (isJPG) {
      if (!isLt800K) {
        ElMessage.error('上传的图片大小不能超过 800KB!')
        return false
      }
      let formData = new FormData()
      formData.append('file', file)
      const res = await fileUploadAPI(formData)
      submitForm.value.screenshot = res.data.url
    } else {
      ElMessage.error('上传格式只能为JPG/PNG!')
      return false
    }
  }
}

const addDrawer = async (val: any, num1: number) => {
  drawer.value = !drawer.value
  formInfo.value = val
  submitForm.value.id = val.id
  submitForm.value.status = val.status
  submitForm.value.orderSn = val.orderSn
  num.value = num1
}
// 查看拒接理由
const undReason = async () => {
  const res = await efundReasonAPI({ type: 1 })
  efundReasonInfo.value = res.data
}
const emit = defineEmits(['refreshPage'])
const refreshPage1 = () => {
  emit('refreshPage')
}
// 关闭
const handleClose = () => {
  submitForm.value = {
    completeLink: '',
    id: '',
    orderSn: '',
    rejectionId: null,
    screenshot: '',
    status: ''
  }
  drawer.value = !drawer.value
}
// 提交
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if (submitForm.value.completeLink || submitForm.value.screenshot) {
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        isLoading.value = true
        if (num.value !== 1) {
          await toPostedAPI(submitForm.value)
            .then(() => {
              ElMessage.success('提交反馈成功')
              submitForm.value = {
                completeLink: '',
                id: '',
                orderSn: '',
                rejectionId: null,
                screenshot: '',
                status: ''
              }
              refreshPage1()
              drawer.value = !drawer.value
              isLoading.value = false
            })
            .catch(() => {
              isLoading.value = false
            })
        } else {
          if (submitForm.value.rejectionId) {
            await refuseRefundnAPI({
              id: submitForm.value.id,
              secondScreenshot: submitForm.value.screenshot,
              secondCompleteLink: submitForm.value.completeLink,
              status: submitForm.value.status,
              orderSn: submitForm.value.orderSn,
              rejectionId: submitForm.value.rejectionId
            })
              .then(() => {
                ElMessage.success('拒绝退款成功')
                refreshPage1()
                submitForm.value = {
                  completeLink: '',
                  id: '',
                  orderSn: '',
                  rejectionId: null,
                  screenshot: '',
                  status: ''
                }
                drawer.value = !drawer.value
                isLoading.value = false
              })
              .catch(() => {
                isLoading.value = false
              })
          } else {
            isLoading.value = false
          }
        }
      }
      isLoading.value = false
    })
  } else {
    ElMessage.error('上贴链接/截图必须填写一个')
    isLoading.value = false
  }
}

defineExpose({
  addDrawer
})

document.addEventListener('mousedown', (event: any) => {
  if (event.target.closest('.el-form') !== null && event.button !== 2) {
    document.body.focus()
  }
})
</script>

<template>
  <div class="submit_and_pste">
    <el-drawer
      v-model="drawer"
      :before-close="handleClose"
      size="905"
      @paste.enter="handlePaste"
    >
      <div class="submit_and_pste_header">
        <div class="submit_and_pste_top">
          <i class="submit_and_pste_top_left" />
          <span class="submit_and_pste_top_right">上贴信息</span>
        </div>
        <div class="submit_and_pste_header_title">
          *上贴链接/截图必须填写一个
        </div>
        <div class="submit_and_pste_header_body">
          <el-form
            ref="formRef"
            :model="submitForm"
            :rules="rules"
            label-width="99px"
          >
            <el-form-item
              v-if="num === 1"
              label="拒绝的理由"
              prop="rejectionId"
            >
              <el-select
                v-model="submitForm.rejectionId"
                placeholder="请选择拒绝理由"
                @focus="undReason"
              >
                <el-option
                  v-for="i in efundReasonInfo"
                  :key="i.id"
                  :label="i.content"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="上贴链接" prop="completeLink">
              <el-input
                v-model="submitForm.completeLink"
                placeholder="请输入上贴链接"
              />
            </el-form-item>
            <!-- <el-form-item label="备注" prop="feedbackNotes">
              <el-input
                v-model="submitForm.feedbackNotes"
                placeholder="备注"
                type="textarea"
              />
            </el-form-item> -->
            <el-form-item label="上贴截图">
              <el-upload
                drag
                action=""
                ref="upload"
                :http-request="httpAvatarUpload"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
                accept=".jpeg,.png,.jpg"
                class="avatar-uploader"
              >
                <img
                  v-if="submitForm.screenshot"
                  :src="submitForm.screenshot"
                  alt=""
                  class="avatar"
                />
                <i-ep-upload-filled
                  v-if="!submitForm.screenshot"
                  class="el-icon--upload"
                />
                <div v-if="!submitForm.screenshot" class="uploader_code">
                  点击上传
                </div>
                <div v-if="!submitForm.screenshot" class="uploader_code1">
                  CTRL+V或
                </div>
                <div v-if="!submitForm.screenshot" class="uploader_code2">
                  拖动图片到这里
                </div>
                <template #tip>
                  <div v-if="!submitForm.screenshot" class="el-upload__tip">
                    支持jpg/png格式
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item class="submit_btn_box">
              <el-button
                :loading="isLoading"
                type="primary"
                @click="submit(formRef)"
                >提交上贴信息
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-divider />
      <div class="submit_and_pste_body">
        <div class="submit_and_pste_top">
          <i class="submit_and_pste_top_left" />
          <span class="submit_and_pste_top_right">订单信息</span>
        </div>
        <div class="submit_and_pste_body_bottom">
          <div class="submit_and_pste_body_top">
            <div>
              <span class="submit_and_pste_body_title">国家/地区</span>
              <span class="submit_and_pste_body_right_top_img countryPic">
                <img :src="formInfo.countryPic" alt="" />
                {{ formInfo.countryName }}
              </span>
            </div>
            <div>
              <span class="submit_and_pste_body_title">购物平台</span>
              <span class="submit_and_pste_body_right_top_img">
                <img :src="formInfo.platformsPic" alt="" />
                {{ formInfo.platformsName }}
              </span>
            </div>
          </div>
          <div class="submit_and_pste_body_box">
            <span class="submit_and_pste_body_title">标题</span>
            <span class="submit_and_pste_body_content">{{
              formInfo.resourceTitle
            }}</span>
          </div>
          <div class="submit_and_pste_body_box">
            <span class="submit_and_pste_body_title">链接</span>
            <span class="submit_and_pste_body_content">{{
              formInfo.resourceUrl
            }}</span>
          </div>
          <div class="submit_and_pste_body_box">
            <span class="submit_and_pste_body_title">产品售价</span>
            <span
              v-if="formInfo.discountPriceMin"
              class="submit_and_pste_body_content"
            >
              <span v-if="formInfo.discountPriceMin">
                {{ formInfo.unit }}{{ formInfo.discountPriceMin }}
              </span>
              <span
                v-if="formInfo.discountPriceMin && formInfo.discountPriceMax"
              >
                -
              </span>
              <span v-if="formInfo.discountPriceMax">
                {{ formInfo.unit }}{{ formInfo.discountPriceMax }}
              </span>
              <em class="em_box">
                <span v-if="formInfo.originalPriceMin">
                  {{ formInfo.unit }}{{ formInfo.originalPriceMin }}
                </span>
                <span
                  v-if="formInfo.originalPriceMin && formInfo.originalPriceMax"
                >
                  -
                </span>
                <span v-if="formInfo.originalPriceMax">
                  {{ formInfo.unit }}{{ formInfo.originalPriceMax }}
                </span>
              </em>
            </span>
          </div>
          <div class="submit_and_pste_body_box">
            <span class="submit_and_pste_body_title">折扣码</span>
            <span class="submit_and_pste_body_content">
              {{ formInfo.discountCode }}
              <span>
                <span v-if="formInfo.preferentialRatio">
                  {{ formInfo.preferentialRatio }}%OFF
                </span>
                <span v-if="formInfo.preferentialRatio && formInfo.coupon"
                  >+</span
                >
                <span v-if="formInfo.coupon">
                  {{ formInfo.coupon }}Coupon
                </span>
              </span>
            </span>
          </div>
          <div class="submit_and_pste_body_box">
            <span class="submit_and_pste_body_title">coupon</span>
            <span class="submit_and_pste_body_content">{{
              formInfo.coupon
            }}</span>
          </div>
          <div class="submit_and_pste_body_box">
            <span class="submit_and_pste_body_title">可用变量</span>
            <span class="submit_and_pste_body_content">{{
              formInfo.variableBody
            }}</span>
          </div>
          <div class="submit_and_pste_body_box">
            <span class="submit_and_pste_body_title">折扣有效时间</span>
            <span
              v-if="formInfo.startTime"
              class="submit_and_pste_body_content"
            >
              {{ formInfo.startTime }}
              <span v-if="formInfo.startTime && formInfo.endTime"> - </span>
              {{ formInfo.endTime }}
            </span>
          </div>
          <div class="submit_and_pste_body_box">
            <span class="submit_and_pste_body_title">订单费用</span>
            <span class="submit_and_pste_body_content"
              >￥&nbsp;{{ formInfo.totalAmount }}</span
            >
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.el-select {
  width: 368px;
}

.submit_and_pste {
  :deep(.el-drawer) {
    border-radius: 4px 0 0 4px;

    .el-drawer__header {
      margin-bottom: 0;
      padding: 8px 18px 0;
    }

    .el-drawer__body {
      padding-top: 0;
    }
  }

  .submit_and_pste_top {
    .submit_and_pste_top_left {
      display: inline-block;
      width: 2px;
      height: 13px;
      background: var(--yw-primary);
    }

    .submit_and_pste_top_right {
      font-size: 16px;
      font-weight: 500;
      margin-left: 8px;
    }
  }

  .submit_and_pste_header {
    .submit_and_pste_header_title {
      color: var(--yw-text-f3294d);
      font-weight: 400;
      font-size: 16px;
      margin-top: 19px;
      margin-bottom: 22px;
    }

    .submit_and_pste_header_body {
      :deep(.el-form) {
        .avatar-uploader {
          width: 139px;
          height: 127px;
          border: 2px solid var(--yw-bg-dcdee0);
          background: var(--yw-bg-f8f8f8);
          border-radius: 4px;

          .el-upload {
            width: 100%;
            height: 100%;
            border: none;
            background: none;
            position: relative;

            .el-upload-dragger {
              padding: 0;
              width: 100%;
              height: 100%;
              border: none;
              border-radius: 4px;
            }

            .el-upload-dragger .el-icon--upload {
              position: absolute;
              top: 20%;
              left: 40%;
              width: 24px;
              height: 24px;
              color: var(--yw-primary);
              margin-bottom: 8px;
            }

            .uploader_code {
              position: absolute;
              top: 32%;
              left: 32%;
              font-size: 12px;
              color: var(--yw-primary);
            }

            .uploader_code1 {
              position: absolute;
              top: 44%;
              left: 29%;
              font-size: 12px;
              color: var(--yw-text-555);
            }

            .uploader_code2 {
              position: absolute;
              top: 55%;
              left: 20%;
              font-size: 12px;
              color: var(--yw-text-555);
            }
          }
        }
      }

      .el-input {
        width: 368px;
        height: 32px;

        :deep(.el-input__inner) {
          width: 100%;
          height: 100%;
        }
      }

      .submit_btn_box {
        :deep(.el-form-item__content) {
          justify-content: right;
        }
      }
    }
  }

  .submit_and_pste_body {
    .submit_and_pste_body_bottom {
      .submit_and_pste_body_top {
        display: flex;
      }

      .submit_and_pste_body_box {
        display: flex;
        align-items: baseline;
        margin-top: 5px;
      }

      .submit_and_pste_body_right_top_img {
        font-size: 14px;

        img {
          width: 18px;
          height: 18px;
          margin-bottom: -4px;
        }
      }

      .countryPic {
        img {
          width: 20px;
        }
      }

      .submit_and_pste_body_title {
        display: inline-block;
        margin-top: 12px;
        margin-right: 18px;
        width: 84px;
        height: 21px;
        font-size: 14px;
        font-weight: 400;
        color: var(--yw-text-555);
        line-height: 16px;
        text-align: right;
      }

      .submit_and_pste_body_content {
        display: inline-block;
        width: 630px;
        font-size: 14px;
        font-weight: 400;

        em {
          margin-left: 30px;
        }

        .em_box {
          text-decoration: line-through;
        }
      }
    }
  }
}
</style>
