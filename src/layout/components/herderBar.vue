<script setup lang="ts">
import { ref } from 'vue'
import { logoutAPI } from '@/api/login'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores'

const language = ref('zh-CN')

const userStore = useUserStore()

// 退出登录
const logout = () => {
  ElMessageBox.confirm('确认退出登陆吗?', '退出提醒').then(async () => {
    const res = await logoutAPI()
    if (res.code === 200) {
      ElMessage.success('退出登录成功')
      window.localStorage.clear()
      location.href = '/login'
    }
  })
  return
}
</script>

<template>
  <div class="herder_bar">
    <div class="header_left">
      <a href="/">
        <img alt="" src="@/assets/logo.png" />
      </a>
    </div>
    <div class="header_right">
      <div class="header_user_info">
        <el-dropdown>
          <el-avatar :size="40" :src="userStore.userInfo.avatar" />
          <template #dropdown>
            <el-dropdown-item @click="logout">退出登陆</el-dropdown-item>
          </template>
        </el-dropdown>
      </div>
      <div>
        <el-select :style="{ width: '100px' }" v-model="language">
          <el-option value="zh-CN" label="简体中文" />
          <el-option value="en-US" label="English" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.herder_bar {
  height: 60px;
  display: flex;
  width: 1920px;
  padding: 0 50px;
  align-items: center;
  justify-content: space-between;
  .header_left {
    width: 54px;
    height: 43px;
  }
  .header_right {
    display: flex;
    align-items: center;
    .header_user_info {
      margin-right: 16px;
    }
  }
}
</style>
<style>
.arco-modal-footer {
  border-top: none;
}
.arco-dropdown {
  padding: 0 !important;
}
</style>
