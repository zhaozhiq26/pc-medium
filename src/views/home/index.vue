<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getTime } from '@/utils/date'
import { useUserStore } from '@/stores'
import { getPayPurse } from '@/api/user'
import { ElMessage } from 'element-plus'
import type { revenueApi } from '@/types/user'
import type { orderCountApi } from '@/types/order'
import { getOrderCountAPI } from '@/api/orderList'
import WebMoreInfo from './components/webMoreInfo.vue'
import type { startOrdersDateRes } from '@/types/home'
import { postMediaSearchAPI, putMediaInfoAPI } from '@/api/media'
import { ref, onMounted, nextTick, toRaw, onUnmounted } from 'vue'
import {
  getBulletinBoardAPI,
  getWebAllianceAPI,
  updateInfo1API
} from '@/api/home'

const refInput = ref()
const tableData = ref()
const priceInput = ref()
const hoursTip = ref('')
const currentTime = ref()
const WebAlliance = ref()
const newDateInfo = ref()
const loading = ref(true)
const showCard = ref(true)
const router = useRouter()
const showCard1 = ref(true)
const bulletinBoard = ref()
const ModifyMediaInfo = ref()
const webMoreCard = ref(true)
const userStore = useUserStore()
const tableRowEditId = ref(null)
const tableColumnEditIndex = ref(null)
const revenueInfo = ref<revenueApi>({
  id: 0,
  userId: '',
  userTypeId: 1,
  income: '0',
  balance: '0',
  createTime: '',
  updateTime: ''
})
const MyOrder = ref<orderCountApi>({
  waitingOrders: 0,
  toPosted: 0,
  inLogistics: 0,
  confirmOrder: 0,
  afterSales: 0,
  toPaid: 0
})
const form = ref({
  userId: userStore.userInfo?.userId,
  startTakingOrders: 1,
  startOrdersDate: []
})
// 修改个人信息
const skip = () => (location.href = '/set/user/info')
// 获取当前时间
const getMycount = () => {
  let date = new Date()
  if (date.getHours() >= 0 && date.getHours() < 12) {
    hoursTip.value = '上午好'
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    hoursTip.value = '下午好'
  } else {
    hoursTip.value = '晚上好'
  }
}
const newTp = () => (newDateInfo.value = getTime(new Date().getTime()))
onMounted(() => {
  currentTime.value = setInterval(() => {
    newTp()
  }, 1000)
  getMycount()
})

onUnmounted(() => {
  clearInterval(currentTime.value)
  currentTime.value = NaN
})

// 订单统计
const getOrderCount = async () => {
  const res = await getOrderCountAPI()
  MyOrder.value = res.data
}

// 跳转订单页面
const toWaiting = (val: any) => {
  router.push({
    path: '/order/list',
    query: {
      status: JSON.stringify(val)
    }
  })
}

// 我的收入
const getPayPurseTo = async () => {
  const res = await getPayPurse()
  revenueInfo.value = res.data
}
const incomeTwo = () => (location.href = '/account/center')

// 跳转媒体中心
const viewMore = () => (location.href = '/media/center')
// 查看所有媒体
const mediaInfo = async () => {
  await postMediaSearchAPI({
    createId: userStore.userInfo?.userId,
    pageSize: 99,
    pageNum: 1
  }).then(res => {
    if (res.data.total === 0) {
      location.href = '/add/media'
    } else {
      tableData.value = res.data.mediumRankListVOS.map((v: any) => {
        return {
          ...v,
          platforms: v.platforms.split(','),
          price: Number(v.price).toFixed(2).toString()
        }
      })
    }
  })
  loading.value = false
}

// 添加资源
const AddResource = () => {
  showCard.value = !showCard.value
  if (showCard.value) {
    mediaInfo()
  }
}

// 修改价格
const handleCellClick = async (row: any, column: any, event: any) => {
  tableRowEditId.value = row.id
  tableColumnEditIndex.value = column.id
  if (row.price == true) {
    await nextTick(() => {
      refInput.value.focus()
    })
  }
}

const blurValueInput = async (row: { [x: string]: boolean }, column: any) => {
  tableRowEditId.value = null
  tableColumnEditIndex.value = null
  if (!priceInput.value) {
    ElMessage.error('修改价格不能为空')
    return false
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
    if (priceInput.value > 0) {
      await putMediaInfoAPI(blurValue).then(async () => {
        priceInput.value = ''
        ElMessage.success('价格修改成功')
        await mediaInfo()
      })
    } else {
      priceInput.value = ''
    }
  }
}

// 修改资源
const ModifyMedia = (val: any) => {
  showCard1.value = !showCard1.value
  ModifyMediaInfo.value = val
}
const AddResource1 = () => (showCard1.value = !showCard1.value)
const AddResource2 = () => {
  mediaInfo()
  showCard1.value = true
}
// 查看公告栏
const bulletinBoardInfo = async () => {
  const res = await getBulletinBoardAPI()
  bulletinBoard.value = res.data
}
// 查看网站联盟
const WebAllianceInfo = async () => {
  const res = await getWebAllianceAPI()
  WebAlliance.value = res.data
}

// 跳转更多网站联盟
const webClick = () => (webMoreCard.value = !webMoreCard.value)

// 接单开关
const takeOrders = async () => {
  await updateInfo1API(<startOrdersDateRes>{
    ...form.value,
    userId: userStore.userInfo.userId,
    startOrdersDate: form.value.startOrdersDate.toString()
  }).then(async () => {
    ElMessage.success('接单状态修改成功')
    await userStore.setUserInfo()
  })
}
const sayHello = () => {
  mediaInfo()
  getPayPurseTo()
  getOrderCount()
  WebAllianceInfo()
  bulletinBoardInfo()
  if (userStore.userInfo.startOrdersDate) {
    form.value.startOrdersDate = userStore.userInfo.startOrdersDate.split(',')
    form.value.startTakingOrders = userStore.userInfo.startTakingOrders
  }
}
const gather = async () => {
  if (userStore.loginInfo) {
    await userStore.setUserInfo().then(() => sayHello())
  } else {
    location.href = '/login'
  }
}
gather()
</script>

<template>
  <div v-if="showCard1">
    <div v-if="showCard">
      <div class="home_page" v-if="webMoreCard">
        <div class="home_header">
          <div class="header_left">
            <div class="header_left_top">
              <span class="header_title">个人信息</span>
              <i class="iconfont icon-redact" @click="skip" />
            </div>
            <div class="time_date">
              <div class="header-left-day">
                {{ newDateInfo }}
              </div>
              <div class="header-left-content">
                Hi！<span class="main_max">
                  {{ userStore.userInfo?.nickName }},
                </span>
                {{ hoursTip }}！
              </div>
              <div class="header-left-bottom">
                <i class="iconfont icon-position" />
                <span class="header-content-title">
                  {{ userStore.userInfo?.countryName }}
                </span>
                <span>ID:&nbsp;&nbsp;</span>
                <span>{{ userStore.userInfo?.userId }}</span>
              </div>
            </div>
          </div>
          <i class="header_line" />
          <div class="header_middle">
            <span class="header_middle_title">我的订单</span>
            <div class="header_middle_box">
              <div class="header_centre_bottom">
                <div class="header_centre_title">待接单</div>
                <div class="header_centre_num" @click="toWaiting([2])">
                  {{ MyOrder.waitingOrders }}
                </div>
              </div>
              <div class="header_centre_bottom">
                <div class="header_centre_title">进行中</div>
                <div class="header_centre_num" @click="toWaiting([6])">
                  {{ MyOrder.toPosted }}
                </div>
              </div>
              <div class="header_centre_bottom">
                <div class="header_centre_title">物流中</div>
                <div class="header_centre_num" @click="toWaiting([4])">
                  {{ MyOrder.inLogistics }}
                </div>
              </div>
              <div class="header_centre_bottom">
                <div class="header_centre_title">已完成</div>
                <div class="header_centre_num" @click="toWaiting([10])">
                  {{ MyOrder.confirmOrder }}
                </div>
              </div>
              <div class="header_centre_bottom">
                <div class="header_centre_title">售后中</div>
                <div class="header_centre_num" @click="toWaiting([11, 19, 14])">
                  {{ MyOrder.afterSales }}
                </div>
              </div>
            </div>
          </div>
          <i class="header_line" />
          <div class="header_middle header_right">
            <span class="header_middle_title">我的收入</span>
            <div class="header_middle_box">
              <div class="header_centre_bottom">
                <div class="header_centre_title">总收入</div>
                <div class="header_centre_num" @click="incomeTwo">
                  ￥{{ Number(revenueInfo.income).toFixed(2).toString() }}
                </div>
              </div>
              <div class="header_centre_bottom">
                <div class="header_centre_title">可提现余额</div>
                <div class="header_centre_num" @click="incomeTwo">
                  ￥{{ Number(revenueInfo.balance).toFixed(2).toString() }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="home_middle">
          <div class="middle_left">
            <div class="middle_left_top">
              <div class="middle_left_top_left">
                <span class="middle_left_title">资源预览</span>
                <el-button plain type="primary" @click="AddResource">
                  + 添加资源
                </el-button>
              </div>
              <div class="middle_left_top_right" @click="viewMore">
                <span class="middle_left_title">查看更多</span>
                <i-ep-arrow-right />
              </div>
            </div>
            <div class="middle_left_table">
              <el-table
                height="245"
                :data="tableData"
                style="width: 100%"
                :header-cell-style="{
                  background: 'rgba(9, 141, 114, 0.05)',
                  height: '34px',
                  color: '#111'
                }"
                @cell-click="handleCellClick"
              >
                <el-table-column label="资源名称" width="370">
                  <template #default="{ row }">
                    <div class="middle_left_table-cell">
                      <el-tooltip effect="dark" placement="top-start">
                        <span class="blacken_box1">{{ row.resourceName }}</span>
                        <template #content>
                          <div>资源名称</div>
                          <div class="tooltip-box">{{ row.resourceName }}</div>
                        </template>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="购物平台" width="147">
                  <template #default="{ row }">
                    <el-tooltip effect="dark" placement="top-end">
                      <template #content>
                        <div>购物平台</div>
                        <div class="tooltip-box1">
                          <span v-for="v in row.platformsList" :key="v.id">
                            {{ v.name }} &nbsp;
                          </span>
                        </div>
                      </template>
                      <div class="middle_header_img">
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
                <el-table-column label="流量/粉丝量" prop="flow" width="140">
                  <template #default="{ row }">
                    <div
                      v-show="row.resourceFlow !== null"
                      class="middle_header_cell"
                    >
                      <i class="iconfont icon-a-flow" />
                      <span class="svg_left">
                        {{ row.resourceFlow }}{{ row.flowUnit }}
                      </span>
                    </div>
                    <div v-show="row.fan !== null" class="middle_header_cell">
                      <i class="iconfont icon-a-fans" />
                      <span class="svg_left">
                        {{ row.fan }}{{ row.fanUnit }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="价格" width="140">
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
                        maxlength="7"
                        onkeyup="value=value.replace(/\D/g,'').replace(/^0+/g,'')"
                        @blur="blurValueInput(row, column)"
                        @keyup.enter="blurValueInput(row, column)"
                      />
                      <span v-else class="price_title_icon">
                        {{ row.price }}
                      </span>
                      <i class="iconfont icon-redact" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="身份" width="125">
                  <template #default="{ row }">
                    <span v-show="row.sfId === 1" class="public_sf media_owner">
                      媒体主
                    </span>
                    <span
                      v-show="row.sfId === 2"
                      class="public_sf self_support"
                    >
                      自营
                    </span>
                    <span
                      v-show="row.sfId === 3"
                      class="public_sf service_provider"
                    >
                      服务商
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="审核状态" width="125">
                  <template #default="{ row }">
                    <div v-show="row.checkStatus === 0" class="no_pass">
                      <div class="public_state no_pass_span">审核不通过</div>
                      <el-tooltip effect="dark" placement="top-start">
                        <template #content>
                          <div>审核不通过</div>
                          <div class="tooltip-box">{{ row.checkReason }}</div>
                        </template>
                        <div class="no_pass_icon">?</div>
                      </el-tooltip>
                    </div>
                    <span
                      v-show="row.checkStatus === 1"
                      class="public_state approve"
                    >
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
                <el-table-column label="时间" prop="createTime" width="170px">
                  <template #default="{ row }">
                    <span class="createTime">{{ row.createTime }}</span>
                  </template>
                </el-table-column>
                >
                <el-table-column label="操作" prop="operation" width="60px">
                  <template #default="{ row }">
                    <i
                      class="iconfont icon-redact"
                      @click="ModifyMedia(row.id)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="middle_right">
            <span class="middle_right_title">公告栏</span>
            <div class="middle_right_body">
              <el-scrollbar height="280px">
                <div
                  v-for="i in bulletinBoard"
                  :key="i.id"
                  class="middle_right_box"
                >
                  <div class="middle_right_box_title">
                    {{ i.content }}
                  </div>
                  <div class="middle_right_box_time">
                    {{ i.createTime }}
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="home_bottom">
          <div class="bottom_left">
            <div class="bottom_left_top">
              <div class="bottom_left_top_title">网站联盟</div>
              <!-- <div class="bottom_left_top_right" @click="webClick">
              <span class="bottom_left_top_right_name">查看更多 </span>
              <i-ep-arrow-right />
            </div> -->
            </div>
            <div class="bottom_left_bottom">
              <el-scrollbar>
                <div class="bottom_left_bottom_box">
                  <div
                    v-for="i in WebAlliance"
                    :key="i.id"
                    class="bottom_left_bottom_card"
                  >
                    <div class="bottom_left_bottom_card_img">
                      <img :alt="i.picName" :src="i.picUrl" />
                    </div>
                    <div class="bottom_left_bottom_card_title">
                      {{ i.name }}
                    </div>
                    <div class="bottom_left_bottom_card_title card_p">
                      {{ i.des }}
                    </div>
                    <div class="bottom_left_bottom_card_field">
                      <div class="bottom_left_bottom_card_field1">行业名称</div>
                      <div class="bottom_left_bottom_card_field1">
                        {{ i.industry }}
                      </div>
                    </div>
                    <div class="bottom_left_bottom_card_bottom">
                      <div class="bottom_left_bottom-box">
                        <div class="left-bottom-box-top">
                          {{ i.defaultCommission }}
                        </div>
                        <div
                          :class="{
                            leftBottomTop1: i.defaultCommission === null
                          }"
                        ></div>
                        <div class="left-bottom-box-content">默认佣金</div>
                      </div>
                      <div class="bottom_left_bottom-box">
                        <div class="left-bottom-box-top">
                          {{ i.averageCommission }}
                        </div>
                        <div
                          :class="{
                            leftBottomTop1: i.averageCommission === null
                          }"
                        ></div>
                        <div class="left-bottom-box-content">平均佣金</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div class="bottom_right">
            <span class="bottom_right_title">接单时间设置</span>
            <div class="bottom_right_top">
              开启接单
              <el-switch
                v-model="form.startTakingOrders"
                :active-value="1"
                :inactive-value="0"
                size="small"
                @change="takeOrders"
              />
            </div>
            <div class="bottom_right_bottom">
              <el-checkbox-group
                v-model="form.startOrdersDate"
                :disabled="!form.startTakingOrders"
                @change="takeOrders"
              >
                <el-checkbox label="1">周一</el-checkbox>
                <el-checkbox label="2">周二</el-checkbox>
                <el-checkbox label="3">周三</el-checkbox>
                <el-checkbox label="4">周四</el-checkbox>
                <el-checkbox label="5">周五</el-checkbox>
                <el-checkbox label="6">周六</el-checkbox>
                <el-checkbox label="7">周日</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <add-media v-if="!showCard" @AddMedias="AddResource" />
  <web-more-info v-if="!webMoreCard" @webMoreYW="webClick" />
  <editing-media
    v-if="!showCard1"
    :mediaInfo="ModifyMediaInfo"
    @AddMedias1="AddResource1"
    @AddMedias2="AddResource2"
  />
</template>

<style lang="scss" scoped>
.home_page {
  height: 971px;
  width: 1651px;
  margin-left: 22px;
  .home_header {
    width: 100%;
    display: flex;
    height: 204px;
    border-radius: 0 4px 4px 0;
    padding: 32px 80px;
    background: var(--yw-bg-fff);
    align-items: center;
    margin-bottom: 20px;
    .header_left {
      width: 300px;
      text-align: center;
      .header_left_top {
        font-size: 16px;
        margin-bottom: 18px;
        .header_title {
          cursor: default;
          font-weight: bold;
          margin-right: 10px;
        }
        .icon-redact {
          cursor: pointer;
          color: var(--yw-primary);
        }
      }
      .time_date {
        font-size: 14px;
        line-height: 14px;
        .header-left-day {
          color: var(--yw-text-555);
          cursor: default;
        }
        .header-left-content {
          margin: 18px 0;
          cursor: default;
          .main_max {
            margin-right: 5px;
          }
        }
        .header-left-bottom {
          cursor: default;
          .header-content-title {
            color: var(--yw-text-555);
            margin-left: 5px;
            margin-right: 10px;
          }
        }
      }
    }
    .header_line {
      width: 0;
      height: 100%;
      opacity: 1;
      border: 1px solid var(--yw-bg2-color);
      margin: 0 48px;
    }
    .header_middle {
      width: 667px;
      .header_middle_title {
        cursor: default;
        font-weight: bold;
        margin-bottom: 26px;
        display: inline-block;
      }
      .header_middle_box {
        padding-left: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .header_centre_bottom {
          font-size: 14px;
          .header_centre_title {
            color: var(--yw-text-111);
            cursor: default;
          }
          .header_centre_num {
            color: var(--yw-primary);
            cursor: pointer;
            margin-top: 25px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
          }
        }
      }
    }
    .header_right {
      width: 300px;
    }
  }
  .home_middle {
    width: 100%;
    height: 353px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .middle_left {
      height: 100%;
      width: 1322px;
      padding: 22px 15px;
      border-radius: 0 4px 4px 0;
      background: var(--yw-bg-fff);
      .middle_left_top {
        display: flex;
        margin-bottom: 22px;
        align-items: center;
        justify-content: space-between;
        .middle_left_top_left {
          font-size: 14px;
          .middle_left_title {
            cursor: default;
            font-weight: bold;
            margin-right: 25px;
          }
          .el-button {
            width: 94px;
            height: 30px;
          }
        }
        .middle_left_top_right {
          display: flex;
          cursor: pointer;
          font-size: 14px;
          align-items: center;
          svg {
            margin-left: 5px;
          }
        }
      }
      .middle_left_table {
        .middle_left_table-cell {
          :deep(.el-tooltip__trigger) {
            color: var(--yw-text-000);
            cursor: default;
            max-width: 313px;
            overflow: hidden;
            white-space: nowrap;
            display: inline-block;
            text-overflow: ellipsis;
          }
        }
        :deep(.el-table__inner-wrapper::before) {
          display: none;
        }
        .middle_header_img {
          max-width: 137px;
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
          text-overflow: ellipsis;

          img {
            width: 16px;
            height: 16px;
            margin-top: 7px;
            margin-right: 8px;
          }
        }
        .middle_header_cell {
          color: var(--yw-text-000);
          overflow: hidden;
          max-width: 313px;
          white-space: nowrap;
          text-overflow: ellipsis;
          .svg_left {
            margin-left: 5px;
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

        .icon-redact {
          color: var(--yw-primary);
          margin-left: 5px;
        }

        .createTime {
          color: var(--yw-text-000);
          cursor: default;
        }
      }
    }
    .middle_right {
      width: 314px;
      height: 100%;
      padding: 16px;
      font-size: 14px;
      line-height: 14px;
      margin-left: 16px;
      border-radius: 4px;
      background: var(--yw-bg-fff);
      .middle_right_title {
        font-weight: bold;
      }
      .middle_right_body {
        margin-top: 22px;
      }
      .middle_right_box {
        margin-bottom: 10px;
        border-bottom: 1px solid var(--yw-bg-ccc);
        .middle_right_box_title {
          cursor: default;
          max-width: 260px;
          overflow: hidden;
          padding-left: 5px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .middle_right_box_time {
          color: var(--yw-text-555);
          cursor: default;
          padding-left: 5px;
          margin: 10px 0 5px;
        }
      }
    }
  }
  .home_bottom {
    width: 100%;
    height: 374px;
    display: flex;
    font-size: 14px;
    line-height: 14px;
    align-items: center;
    .bottom_left {
      height: 100%;
      width: 1322px;
      padding: 22px;
      border-radius: 4px;
      background: var(--yw-bg-fff);
      .bottom_left_top {
        display: flex;
        margin-bottom: 22px;
        align-items: center;
        justify-content: space-between;
        .bottom_left_top_title {
          color: var(--yw-text-111);
          cursor: default;
          font-weight: bold;
        }
        .bottom_left_top_right {
          display: flex;
          cursor: pointer;
          font-size: 14px;
          align-items: center;
          svg {
            margin-left: 5px;
          }
        }
      }
      .bottom_left_bottom {
        width: 100%;
        .bottom_left_bottom_box {
          display: flex;
          align-items: center;
          .bottom_left_bottom_card {
            width: 180px;
            height: 285px;
            box-sizing: border-box;
            margin: 2px 12px 2px 3px;
            .bottom_left_bottom_card_img {
              width: 100%;
              height: 115px;
              margin-bottom: 20px;
              img {
                border-radius: 4px 4px 0 0;
              }
            }
            .bottom_left_bottom_card_title {
              color: var(--yw-text-111);
              cursor: default;
              max-width: 170px;
              overflow: hidden;
              padding-left: 5px;
              margin-bottom: 10px;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .card_p {
              color: var(--yw-text-555);
            }
            .bottom_left_bottom_card_field {
              width: 176px;
              display: flex;
              padding: 0 1px;
              margin-top: 10px;
              align-items: center;
              justify-content: space-between;
              .bottom_left_bottom_card_field1 {
                width: 85px;
                height: 30px;
                padding-top: 7px;
                text-align: center;
                box-sizing: border-box;
                border: 1px solid var(--yw-primary);
                border-radius: 4px 4px 4px 4px;
              }
            }
            .bottom_left_bottom_card_bottom {
              display: flex;
              margin-top: 14px;
              padding: 0 10px;
              align-items: center;
              justify-content: space-between;
              .bottom_left_bottom-box {
                display: flex;
                align-items: center;
                flex-direction: column;
                .left-bottom-box-content {
                  margin-top: 10px;
                }
              }
            }
          }
        }
      }
    }
    .bottom_right {
      height: 100%;
      width: 316px;
      padding: 16px;
      margin-left: 16px;
      border-radius: 0 4px 4px 0;
      background: var(--yw-bg-fff);
      .bottom_right_title {
        font-weight: bold;
        margin-bottom: 17px;
        display: inline-block;
      }
      .bottom_right_top {
        color: var(--yw-text-111);
        padding-left: 5px;
        margin-bottom: 10px;
      }
      .bottom_right_bottom {
        padding-left: 10px;
        .el-checkbox-group {
          display: flex;
          flex-direction: column;
          .el-checkbox {
            height: 30px;
          }
        }
      }
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
.tooltip-box1 {
  font-size: 14px;
  margin-top: 8px;
  overflow: hidden;
  max-width: 130px;
  font-weight: 400;
  color: var(--yw-text-fff);
  line-height: 16px;
  margin-bottom: 8px;
  text-overflow: ellipsis;
}
</style>
