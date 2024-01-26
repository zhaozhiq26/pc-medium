<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { getPayPurse } from '@/api/user'
import type { revenueApi } from '@/types/user'
import MyEarning from './components/MyEarning.vue'
import MyWithdrawal from './components/MyWithdrawal.vue'

const payeeTo = ref()
const myEarningTo = ref()
const activeName = ref('first')
const userStore = useUserStore()
const getPayPurseInfo = ref<revenueApi>({
  id: 0,
  userId: '',
  userTypeId: 1,
  income: '0',
  balance: '0',
  createTime: '',
  updateTime: ''
})
const getPayPurseTo = async () => {
  const res = await getPayPurse()
  getPayPurseInfo.value = res.data
}
const handleClick = (tab: any) => {
  if (tab.props.name === 'first') {
    myEarningTo.value.getUserInfo.pageNum = 1
    myEarningTo.value.getUserInfo.pageSize = 10
    myEarningTo.value.getPay()
  } else {
    payeeTo.value.getViewPayee()
  }
}
getPayPurseTo()
</script>

<template>
  <div class="earning_page yw_box">
    <div class="earning_top_box">
      <div class="earning_top_centre">
        <div class="earning_top_centre_title">总收入</div>
        <div class="earning_top_centre_num">
          ￥{{ Number(getPayPurseInfo.income).toFixed(2).toString() }}
        </div>
      </div>
      <div class="earning_top_centre">
        <div class="earning_top_centre_title">可提现余额</div>
        <div class="earning_top_centre_num">
          ￥{{ Number(getPayPurseInfo.balance).toFixed(2).toString() }}
        </div>
      </div>
    </div>
    <div class="earning_header_box">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="交易明细" name="first">
          <my-earning ref="myEarningTo" />
        </el-tab-pane>
        <el-tab-pane
          v-if="userStore.userInfo.countryId !== 99999"
          label="提现"
          name="second"
        >
          <my-withdrawal ref="payeeTo" @refresh="getPayPurseTo" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.earning_page {
  padding-left: 36px;
  padding-top: 15px;

  .earning_top_box {
    width: 240px;
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .earning_top_centre {
      display: flex;
      font-size: 16px;
      align-items: center;
      flex-direction: column;
      .earning_top_centre_title {
        color: var(--yw-text-111);
        cursor: default;
      }
      .earning_top_centre_num {
        color: var(--yw-primary);
        cursor: pointer;
        margin-top: 15px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
      }
    }
  }

  .earning_header_box {
    margin-top: 30px;
  }
}
</style>
