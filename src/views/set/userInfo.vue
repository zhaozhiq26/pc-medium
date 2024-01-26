<!-- 个人信息 -->
<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { message } from 'ant-design-vue'
import { updateInfoAPI } from '@/api/user'
import { fileUploadAPI } from '@/api/public'
import { onMounted, reactive, ref } from 'vue'
import type { UserInfoRes } from '@/types/user'
import { PictureOutlined } from '@ant-design/icons-vue'

const ruleRef = ref()
const isLoading = ref(false)
const userStore = useUserStore()
const UserData = ref<UserInfoRes>({
  userId: userStore.userInfo?.userId,
  avatar: userStore.userInfo?.avatar,
  userName: userStore.userInfo?.userName,
  nickName: userStore.userInfo?.nickName,
  email: userStore.userInfo?.email,
  sex: userStore.userInfo?.sex,
  phonenumber: userStore.userInfo?.phonenumber,
  chatToolId: userStore.userInfo?.chatToolId,
  chatTool: userStore.userInfo?.chatTool
})
// 上传照片
const beforeAvatarUpload = (file: any) => {
  const types = ['image/jpg', 'image/png', 'image/jpeg']
  const isJPG = types.includes(file.type)
  const isLt500K = file.size / 1024 < 500
  if (!isJPG) {
    message.error('上传图片格式仅支持JPG/PNG!')
    return false
  }
  if (!isLt500K) {
    message.error('上传图片大小不能超过 500KB!')
    return false
  }
}
const httpAvatarUpload = async (options: any) => {
  let formData = new FormData()
  formData.append('file', options.file)
  const res = await fileUploadAPI(formData)
  UserData.value.avatar = res.data.url
}

// 表单校验规则
const rules = reactive({
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { pattern: /^.{1,17}$/, message: '昵称超出限制字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: '请输入正确的邮箱',
      trigger: 'blur'
    }
  ],
  phonenumber: [
    { required: false, message: '请输入手机号', trigger: 'blur' },
    {
      pattern:
        /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/,
      message: '请输入正确格式的手机号',
      trigger: 'blur'
    }
  ]
})

// 取消
const resetForm = () => {
  ruleRef.value.resetFields()
}
onMounted(() => {
  ruleRef.value?.resetFields()
  userStore.setUserInfo()
})

// 保存
const submitForm = () => {
  ruleRef.value
    .validate()
    .then(async () => {
      await updateInfoAPI(UserData.value)
        .then(async () => {
          isLoading.value = false
          ruleRef.value.resetFields()
          message.success('用户信息更新成功')
          UserData.value.avatar = ''
          await userStore.setUserInfo()
          window.location.reload()
        })
        .catch(() => {
          isLoading.value = false
        })
    })
    .catch((error: any) => {
      isLoading.value = false
    })
}
</script>

<template>
  <div class="user_info yw_box">
    <span class="set_title">个人信息</span>
    <div class="suer_info_content">
      <a-form
        ref="ruleRef"
        :rules="rules"
        :model="UserData"
        :label-col="{ span: 1 }"
        v-loading.fullscreen.lock="isLoading"
      >
        <a-form-item label="头像" name="avatar">
          <a-upload
            name="avatar"
            list-type="picture-card"
            :show-upload-list="false"
            accept=".jpeg,.png,.jpg"
            action=""
            :customRequest="httpAvatarUpload"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="UserData.avatar"
              :src="UserData.avatar"
              style="border-radius: 4px"
              alt="avatar"
            />
            <div v-else class="avatar_box">
              <PictureOutlined class="ant-upload-icon" />
              <div class="ant-upload-text">上传照片</div>
            </div>
          </a-upload>
          <div class="el-upload__tip">支持jpg、png格式</div>
        </a-form-item>
        <a-form-item label="ID :" name="userName">
          <div>{{ UserData.userId }}</div>
        </a-form-item>
        <a-form-item label="昵称" name="nickName">
          <a-form-item-rest>
            <a-input
              v-model:value="UserData.nickName"
              style="width: 368px"
              :maxlength="16"
              autocomplete="off"
              placeholder="请输入昵称"
            />
          </a-form-item-rest>
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-form-item-rest>
            <a-input
              v-model:value="UserData.email"
              style="width: 368px"
              autocomplete="off"
              placeholder="请输入邮箱"
            />
          </a-form-item-rest>
        </a-form-item>
        <a-form-item label="性别" name="sex">
          <a-form-item-rest>
            <el-select
              v-model="UserData.sex"
              style="width: 368px"
              placeholder="请选择性别"
            >
              <el-option label="男" value="0" />
              <el-option label="女" value="1" />
              <el-option label="保密" value="2" />
            </el-select>
          </a-form-item-rest>
        </a-form-item>
        <a-form-item label="手机号" name="phonenumber">
          <a-form-item-rest>
            <a-input
              v-model:value="UserData.phonenumber"
              style="width: 368px"
              autocomplete="off"
              placeholder="请输入手机号"
            />
          </a-form-item-rest>
        </a-form-item>
        <a-form-item label="在线联系" name="chatTool">
          <a-form-item-rest>
            <a-input-group compact>
              <a-select
                v-model:value="UserData.chatToolId"
                style="width: 130px"
                placeholder="请选择在线联系方式"
              >
                <a-select-option :value="0">WhatsApp</a-select-option>
                <a-select-option :value="1">Telegram</a-select-option>
                <a-select-option :value="2">Wechat</a-select-option>
                <a-select-option :value="3">QQ</a-select-option>
                <a-select-option :value="4">Facebook</a-select-option>
                <a-select-option :value="5">Intagram</a-select-option>
                <a-select-option :value="6">KakotalkKik</a-select-option>
                <a-select-option :value="7">Messager</a-select-option>
                <a-select-option :value="8">DMLine</a-select-option>
              </a-select>
              <a-input
                v-model:value="UserData.chatTool"
                style="width: 238px"
                autocomplete="off"
                placeholder="请输入在线联系方式"
              />
            </a-input-group>
          </a-form-item-rest>
        </a-form-item>
        <a-form-item>
          <a-button class="res_btn" @click="resetForm"> 取消 </a-button>
          <a-button
            :loading="isLoading"
            class="res_btn1"
            type="primary"
            @click="submitForm"
          >
            保存
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user_info {
  padding: 27px 53px;

  .set_title {
    font-size: 14px;
    color: var(--yw-text-000);
  }

  .suer_info_content {
    margin-top: 32px;

    .avatar_box {
      display: flex;
      flex-direction: column;
      .ant-upload-icon {
        font-size: 24px;
        color: var(--yw-text-969799);
      }
      .ant-upload-text {
        color: var(--yw-text-555);
        font-size: 12px;
        margin-left: -12px;
      }
    }

    .res_btn {
      width: 119px;
      height: 32px;
      color: var(--yw-primary);
      margin-left: 66px;
      margin-right: 12px;
      border: 1px solid var(--yw-primary);
    }
    .res_btn1 {
      height: 32px;
      width: 119px;
    }
  }

  :deep(.ant-upload) {
    width: 110px !important;
    height: 110px !important;
  }
}
:deep(.ant-select-selection-placeholder) {
  color: var(--yw-text-a8abb2);
  font-size: 12px;
}

:deep(label) {
  font-weight: 400;
}
</style>
