<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
dayjs.locale('zh-cn')
</script>

<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
      token: {
        colorPrimary: '#098d72'
      }
    }"
  >
    <RouterView />
  </a-config-provider>
</template>

<style scoped></style>
