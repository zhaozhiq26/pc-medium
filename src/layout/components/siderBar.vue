<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="aside_bar_box">
    <el-menu :default-active="route.path" router>
      <el-menu-item index="/">
        <i class="iconfont icon-Vector" />
        <span>主页</span>
      </el-menu-item>

      <el-menu-item index="/order/list">
        <i class="iconfont icon-dingdan" />
        <span>订单列表</span>
      </el-menu-item>

      <el-menu-item index="/account/center">
        <i class="iconfont icon-yonghu" />
        <span>账户中心</span>
      </el-menu-item>

      <el-menu-item index="/media/center">
        <i class="iconfont icon-media" />
        <span>媒体中心</span>
      </el-menu-item>

      <el-menu-item index="/feedback/center">
        <i class="iconfont icon-bumenfankui" />
        <span>反馈中心</span>
      </el-menu-item>

      <el-menu-item index="/bill">
        <i class="iconfont icon-fapiaowenti" />
        <span>开票</span>
      </el-menu-item>

      <el-sub-menu index="/set">
        <template #title>
          <i class="iconfont icon-set" />
          <span>设置</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/set/settlement/info">结算信息</el-menu-item>
          <el-menu-item index="/set/shipping/address">收货地址</el-menu-item>
          <el-menu-item index="/set/user/info">个人信息</el-menu-item>
          <el-menu-item index="/set/security/center">安全中心</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.aside_bar_box {
  :deep(.el-menu) {
    border-right: none !important;
    .el-menu-item,
    .el-sub-menu__title {
      height: 37px;
    }
  }
  .el-menu-item.is-active {
    color: var(--yw-text-fff);
    background-color: var(--yw-primary);
  }
  .iconfont {
    margin-right: 10px;
  }
  :deep(.el-menu-item-group__title) {
    display: none;
  }
}
</style>
