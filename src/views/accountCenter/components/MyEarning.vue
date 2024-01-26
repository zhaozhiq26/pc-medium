<!--收入明细-->
<script lang="ts" setup>
import dayjs from 'dayjs'
import { useUserStore } from '@/stores'
import { accountStatement } from '@/enums'
import { getPayDetailAPI } from '@/api/user'
import { OrderlistIdAPI } from '@/api/orderList'
import type { toUserInfoRes } from '@/types/user'
import { SyncOutlined } from '@ant-design/icons-vue'
import type { getOrderlistApi } from '@/types/order'
import { onMounted, reactive, ref, toRaw } from 'vue'

const ruleRef = ref()
const tableData = ref()
const luoli = ref(true)
const dateValue = ref([])
const total = ref<any>(0)
const showInfoYWID = ref()
const classNameTo = ref(false)
const userStore = useUserStore()
const showInfoYW = ref<getOrderlistApi>()
const getUserInfo = reactive<toUserInfoRes>({
  pageNum: 1,
  pageSize: 10,
  startTime: undefined,
  endTime: undefined
})
const rules = {
  userDate: [{ required: true, message: '请选择时间日期', trigger: 'change' }]
}
const getPay = async () => {
  luoli.value = true
  const res = await getPayDetailAPI({
    ...getUserInfo,
    startTime:
      dateValue.value.length === 0
        ? undefined
        : dayjs(dateValue.value[0]).format('YYYY-MM-DD 00:00:00'),
    endTime:
      dateValue.value.length === 0
        ? undefined
        : dayjs(dateValue.value[1]).format('YYYY-MM-DD 23:59:59')
  })
  if (res.code === 200) {
    tableData.value = res.data.purseRecordWithdrawStatusVOList
    total.value = res.data.total
    luoli.value = false
  }
}
// 重置
const resetForm = () => {
  ruleRef.value.resetFields()
  getUserInfo.pageNum = 1
  getUserInfo.pageSize = 10
  dateValue.value = []
  getPay()
}
// 刷新
const refresh = () => {
  classNameTo.value = true
  ruleRef.value.resetFields()
  dateValue.value = []
  getUserInfo.pageNum = 1
  getUserInfo.pageSize = 10
  getPay().then(() => {
    classNameTo.value = false
  })
}

// 搜索
const handleAdd = () => {
  getUserInfo.pageNum = 1
  getUserInfo.pageSize = 10
  getPay()
}

const showInfo = async (val: any) => {
  showInfoYWID.value = val.status
  const res = await OrderlistIdAPI({
    id: val.orderId
  })
  let DataInfo: any = res.data.records
  showInfoYW.value = toRaw(DataInfo[0])
}

onMounted(() => {
  getPay()
})
defineExpose({
  getUserInfo,
  getPay
})
</script>

<template>
  <div class="my_earning_box">
    <div class="my_earning_header">
      <a-form ref="ruleRef" :model="dateValue" :rules="rules" layout="inline">
        <a-form-item>
          <a-button type="text" @click="refresh" class="YWBtn">
            <template #icon>
              <SyncOutlined :class="{ rotateIcon: classNameTo }" />
            </template>
            刷新
          </a-button>
        </a-form-item>
        <a-form-item style="width: 226px" prop="dateValue">
          <a-range-picker
            v-model:value="dateValue"
            :allowClear="false"
            valueFormat="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <a-form-item>
          <a-button ghost @click="handleAdd" class="YWBtn"> 搜索 </a-button>
          <a-button type="text" @click="resetForm" class="resetForm">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="my_earning_body">
      <el-table
        v-loading="luoli"
        :data="tableData"
        height="640"
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="交易时间" prop="createTime" width="200" />
        <el-table-column label="收款账户" prop="cardNumber" width="200" />
        <div class="productTitle">
          <el-table-column label="产品标题" width="140">
            <template #default="{ row }">
              <div class="product_title">
                {{ row.cardNumber }}
              </div>
            </template>
          </el-table-column>
        </div>
        <el-table-column label="订单" prop="orderId" width="200" />
        <el-table-column label="对方" prop="customerName" width="130" />
        <el-table-column label="交易号" prop="tradeId" width="200" />
        <el-table-column label="金额 | 明细" width="200">
          <template #default="{ row }">
            <div class="moeny_box">
              <div v-if="row.money" class="money_titel">
                {{ row.asType }} {{ row.money }}
              </div>
              <el-popover
                :width="600"
                trigger="hover"
                v-if="row.orderId"
                placement="right"
                @before-enter="showInfo(row)"
              >
                <template #reference>
                  <i class="iconfont icon-viewDetails" />
                </template>
                <div class="popover_box">
                  <div class="popover_box_title">
                    <span>交易明细</span>
                  </div>
                  <div class="popover_box_body">
                    <div class="popover_box_body_title">
                      <span>{{ accountStatement[showInfoYWID] }}</span>
                    </div>

                    <div class="popover_box_body_top">
                      <i class="popover_box_body_top_left" />
                      <span class="popover_box_body_top_right">订单详情</span>
                    </div>

                    <div class="popover_box_body_content">
                      <div class="popover_box_body_top1">
                        <div>
                          <span class="popover_box_body_label">国家/地区</span>
                          <span class="popover_box_body_right_top_img">
                            <img :src="showInfoYW?.countryPic" alt="" />
                            <span class="popover_box_body_content">{{
                              showInfoYW?.countryName
                            }}</span>
                          </span>
                        </div>
                        <div>
                          <span class="popover_box_body_label">购物平台</span>
                          <span class="popover_box_body_right_top_img">
                            <img
                              :src="showInfoYW?.platformsPic"
                              alt=""
                              class="platform_icon"
                            />
                            <span class="popover_box_body_content">{{
                              showInfoYW?.platformsName
                            }}</span>
                          </span>
                        </div>
                      </div>

                      <div class="popover_box_body_box">
                        <span class="popover_box_body_label">标题</span>
                        <span class="popover_box_body_content">{{
                          showInfoYW?.resourceTitle
                        }}</span>
                      </div>

                      <div class="popover_box_body_box">
                        <span class="popover_box_body_label">链接</span>
                        <span class="popover_box_body_content">{{
                          showInfoYW?.resourceUrl
                        }}</span>
                      </div>

                      <div
                        class="popover_box_body_box"
                        v-if="showInfoYW?.promId === 4"
                      >
                        <span class="popover_box_body_label">价格</span>
                        <span class="popover_box_body_content">
                          <span
                            v-if="showInfoYW?.discountPriceMin"
                            class="product_price_top"
                          >
                            {{ showInfoYW?.unit }}
                            {{ showInfoYW?.discountPriceMin }}
                            <span
                              v-if="
                                showInfoYW?.discountPriceMin &&
                                showInfoYW?.discountPriceMax
                              "
                            >
                              -
                            </span>
                            <span v-if="showInfoYW?.discountPriceMax">
                              {{ showInfoYW?.unit }}
                              {{ showInfoYW?.discountPriceMax }}
                            </span>
                          </span>
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          <span
                            v-if="showInfoYW?.originalPriceMin"
                            class="em_box"
                          >
                            {{ showInfoYW?.unit }}
                            {{ showInfoYW?.originalPriceMin }}
                            <span
                              v-if="
                                showInfoYW?.originalPriceMin &&
                                showInfoYW?.originalPriceMax
                              "
                            >
                              -
                            </span>
                            <span v-if="showInfoYW?.originalPriceMax">
                              {{ showInfoYW?.unit }}
                              {{ showInfoYW?.originalPriceMax }}
                            </span>
                          </span>
                        </span>
                      </div>

                      <div class="popover_box_body_box">
                        <span class="popover_box_body_label">折扣码</span>
                        <span class="popover_box_body_content">
                          {{ showInfoYW?.discountCode }}
                        </span>
                      </div>

                      <div class="popover_box_body_box">
                        <span class="popover_box_body_label">优惠比例</span>
                        <span
                          v-if="showInfoYW?.preferentialRatio"
                          class="popover_box_body_content"
                        >
                          {{ showInfoYW?.preferentialRatio }}%OFF
                        </span>
                      </div>

                      <div class="popover_box_body_box">
                        <span class="popover_box_body_label">coupon</span>
                        <span
                          v-if="showInfoYW?.coupon"
                          class="popover_box_body_content"
                        >
                          {{ showInfoYW?.coupon }}Coupon
                        </span>
                      </div>

                      <div class="popover_box_body_box">
                        <span class="popover_box_body_label">可用变量</span>
                        <span class="popover_box_body_content">{{
                          showInfoYW?.variableBody
                        }}</span>
                      </div>

                      <div class="popover_box_body_box">
                        <span class="popover_box_body_label">折扣有效时间</span>
                        <span class="popover_box_body_content">
                          {{ showInfoYW?.startTime }}
                          <span
                            v-if="showInfoYW?.startTime && showInfoYW?.endTime"
                          >
                            -
                          </span>
                          {{ showInfoYW?.endTime }}
                        </span>
                      </div>
                      <div class="popover_box_body_box1">
                        <div class="popover_box_body_box">
                          <span class="popover_box_body_label">订单费用</span>
                          <span class="popover_box_body_content">
                            ￥&nbsp;{{ showInfoYW?.totalAmount }}
                          </span>
                        </div>
                        <div class="popover_box_body_box">
                          <span class="popover_box_body_label">到手价格</span>
                          <span class="popover_box_body_content">
                            ￥&nbsp;{{ showInfoYW?.handAmount }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="userStore.userInfo.countryId !== 99999"
          label="账户余额"
          width="140"
        >
          <template #default="{ row }">
            {{ row.balanceAfter }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <div class="tag_title">
              {{ accountStatement[row.status] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template #default="{ row }">
            <div v-if="row.remark" class="tag_title tag_title1">
              {{ row.remark }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :total="total"
      v-model:page="getUserInfo.pageNum"
      v-model:limit="getUserInfo.pageSize"
      @pagination="getPay"
    />
  </div>
</template>

<style lang="scss" scoped>
.my_earning_box {
  padding-right: 13px;

  .my_earning_header {
    width: 100%;
    height: 56px;
    background: var(--yw-bg-color);
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 25px;

    .el_col_left {
      padding-right: 41px;
    }

    .YWBtn {
      color: var(--yw-primary);
      background-color: var(--yw-bg-card);
      border-color: var(--yw-primary);
    }

    .resetForm {
      margin-left: 10px;
      color: var(--yw-primary);
    }

    .rotateIcon {
      animation: rotate 1s linear infinite;
    }
  }

  .my_earning_body {
    :deep(.el-table) {
      .productTitle {
        display: none;
      }
      .product_title {
        width: 130px;
        cursor: default;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .money_titel {
        width: 120px;
        cursor: default;
        text-align: right;
        display: inline-block;
      }
    }
  }
}

:deep(.ant-picker-active-bar) {
  display: none;
}

.popover_box_body_box1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popover_box {
  font-size: 16px;
  font-weight: 400;
  box-sizing: border-box;

  .popover_box_title {
    height: 30px;
    border-bottom: 1px solid var(--yw-bg-d7d7d7);

    span {
      margin-left: 20px;
    }
  }

  .popover_box_body {
    padding: 20px;

    .popover_box_body_title {
      color: var(--yw-primary);
    }

    .popover_box_body_top {
      margin-top: 10px;

      .popover_box_body_top_left {
        display: inline-block;
        width: 2px;
        height: 13px;
        background: var(--yw-primary);
      }

      .popover_box_body_top_right {
        font-size: 14px;
        font-weight: 500;
        margin-left: 8px;
      }
    }

    .popover_box_body_content {
      .popover_box_body_top1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .popover_box_body_label {
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

      .popover_box_body_right_top_img {
        font-size: 14px;

        img {
          width: 25px;
          height: 16px;
          margin-bottom: -4px;
          margin-right: 5px;
        }

        .platform_icon {
          width: 18px;
          height: 18px;
        }
      }

      .popover_box_body_box {
        display: flex;
        align-items: baseline;
        margin-top: 5px;
      }

      .popover_box_body_content {
        display: inline-block;
        font-size: 14px;
        font-weight: 400;

        em {
          margin-left: 30px;
        }

        .em_box {
          text-decoration: line-through;
        }
      }

      .popover_box_body_content_icon {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
  }
}

.moeny_box {
  display: flex;
  align-items: center;

  i {
    margin-left: 10px;
    color: var(--yw-primary);
    cursor: pointer;
  }
}

:deep(.el-table th.el-table__cell) {
  background: var(--yw-bg-color);
  height: 56px;
}

:deep(.el-table tr) {
  height: 56px;
}

:deep(.el-table__inner-wrapper) {
  &::before {
    display: none;
  }
}

.tag_title {
  height: 21px;
  font-size: 14px;
  font-weight: 400;
  color: var(--yw-primary);
  line-height: 16px;
}

.tag_title1 {
  color: var(--yw-text-f00);
}
</style>
