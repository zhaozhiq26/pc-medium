<script setup lang="ts">
import SiderBar from './components/siderBar.vue'
import HerderBar from './components/herderBar.vue'
</script>

<template>
  <div class="layout-box">
    <div class="header_box">
      <herder-bar />
    </div>
    <div class="layout_body">
      <div class="body_box">
        <div class="aside_box">
          <sider-bar />
        </div>
        <div class="main_box">
          <router-view />
        </div>
      </div>
    </div>
    <div class="footer_box">
      <div class="info_box">
        <el-link
          href="https://beian.miit.gov.cn/"
          :underline="false"
          target="_blank"
        >
          粤ICP备2023075993 号-2
        </el-link>
        <span> Copyright @ 2023 微企传媒.AII Rights Reserved </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-box {
  .header_box {
    width: 100%;
    height: 60px;
    display: flex;
    background: var(--yw-bg-fff);
    margin-bottom: 17px;
    justify-content: center;
    box-shadow: rgba(0, 0, 0, 0.12) 0 0 12px 0;
  }
  .layout_body {
    width: 100%;
    display: flex;
    justify-content: center;
    .body_box {
      width: 1920px;
      display: flex;
      padding-left: 50px;
      align-items: center;
      .aside_box {
        width: 180px;
        height: 971px;
        border-radius: 4px;
        background: var(--yw-bg-fff);
        // box-shadow: rgba(0, 0, 0, 0.12) 0 0 12px 0;
      }
    }
  }
  .footer_box {
    height: 60px;
    display: flex;
    margin-top: 15px;
    line-height: 60px;
    justify-content: center;
    background: var(--yw-bg-fff);
    // box-shadow: rgba(0, 0, 0, 0.12) 0 0 12px 0;
    .info_box {
      width: 1920px;
      display: flex;
      padding: 0 20px;
      align-items: center;
      justify-content: space-between;
      .el-link {
        color: var(--yw-text-555);
      }
      span {
        color: var(--yw-text-555);
        font-size: 14px;
      }
    }
  }
}
</style>
