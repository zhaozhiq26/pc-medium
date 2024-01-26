<script setup lang="ts">
import { reactive, ref } from 'vue'
import { listByMediaIdAPI } from '@/api/bill'
import BillCard from './components/billCard.vue'
import BillHeader from './components/billHeader.vue'
import type { listByMediaIdRes } from '@/types/bill'

const infoList = ref()
const total = ref<any>(0)

const ywFrom = reactive<listByMediaIdRes>({
  pageNum: 1,
  pageSize: 10,
  status: 1,
  userId: undefined,
  startTime: undefined,
  endTime: undefined
})

// 获取开票数据
const listByMediaInfo = async () => {
  const res = await listByMediaIdAPI(ywFrom)
  infoList.value = res.data.records
  total.value = res.data.total
}

// 切换tab栏
const ywTab = (val: number) => {
  ywFrom.status = val
  ywFrom.userId = undefined
  ywFrom.startTime = undefined
  ywFrom.endTime = undefined
  listByMediaInfo()
}

// 搜索 / 重置 / 刷新
const YouWeiXJ = (val: any) => {
  infoList.value = []
  ywFrom.pageNum = 1
  ywFrom.pageSize = 10
  ywFrom.status = val.status
  ywFrom.userId = val.userId
  ywFrom.startTime = val.startTime
  ywFrom.endTime = val.endTime
  listByMediaInfo()
}

listByMediaInfo()
</script>

<template>
  <div class="bill_page yw_box">
    <ul class="bill_ul">
      <li :class="{ active: ywFrom.status === 1 }" @click="ywTab(1)">待开票</li>
      <li :class="{ active: ywFrom.status === 0 }" @click="ywTab(0)">已开票</li>
      <li :class="{ active: ywFrom.status === 2 }" @click="ywTab(2)">已驳回</li>
    </ul>
    <bill-header :father="ywFrom.status" @YouWeiXJSon="YouWeiXJ" />
    <!-- 表格 -->
    <bill-card
      :tabNum="ywFrom.status"
      :tableData="infoList"
      @YWRefresh="listByMediaInfo"
    />
    <pagination
      :total="total"
      @pagination="listByMediaInfo"
      v-model:page="ywFrom.pageNum"
      v-model:limit="ywFrom.pageSize"
    />
  </div>
</template>

<style lang="scss" scoped>
.bill_page {
  padding: 16px 21px 8px;
  .bill_ul {
    display: flex;
    list-style: none;
    font-size: 14px;
    padding-left: 33px;
    border-bottom: 1px solid var(--yw-bg-ebedf0);
    li {
      cursor: pointer;
      margin-right: 40px;
      &:hover {
        color: var(--yw-primary-hover);
      }
    }
    .active {
      color: var(--yw-primary);
      padding-bottom: 16px;
      border-bottom: 2px solid var(--yw-primary);
    }
  }
}
</style>
