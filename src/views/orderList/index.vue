<script setup lang="ts">
import dayjs from 'dayjs'
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores'
import { message } from 'ant-design-vue'
import useClipboard from 'vue-clipboard3'
import { getViewPayeeAPI } from '@/api/set'
import drawer from './components/drawer.vue'
import { useRoute, useRouter } from 'vue-router'
import { beforeAvatarUpload } from '@/utils/rule'
import type { getViewPayeeRes } from '@/types/set'
import AddressDialog from './components/addressDialog.vue'
import SubmitAndPaste from './components/SubmitAndPaste.vue'
import { ElMessageBox, type FormInstance } from 'element-plus'
import type { getOrderlistRes, orderCountApi } from '@/types/order'
import { fileUploadAPI, getCatereAPI, getCatesellAPI } from '@/api/public'
import { SearchOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons-vue'
import {
  OrderlistAPI,
  cancelOrderAPI,
  mediaOrdersAPI,
  postQuestionAPI,
  getOrderCountAPI,
  applyExtensionAPI,
  orderRejectionAPI,
  orderStatusListAPI,
  postAgreeRefundAPI,
  sampleConfirmedAPI,
  questionAgreedRefundAPI,
orderrejectAPI
} from '@/api/orderList'

const total = ref(0)
const open = ref(false)
const rejectRef = ref()
const drawerTo1 = ref()
const luoli = ref(true)
const route = useRoute()
const addressRef = ref()
const dateValue = ref([])
const submitPaste = ref()
const router = useRouter()
const LoadingJK = ref(false)
const openReject = ref(false)
const tableData = ref<any>([])
const classNameTo = ref(false)
const catereInfo = ref<any>([])
const statusList = ref<any>([])
const catesellTo = ref<any>([])
const rejectLoading = ref(false)
const userStore = useUserStore()
const questionDialog = ref(false)
const ruleRef = ref<FormInstance>()
const noCollectionDialog = ref(false)
const { toClipboard } = useClipboard()
const questionRef = ref<FormInstance>()
const rejectForm = ref({
  id: undefined,
  status: undefined,
  totalAmount: '',
  orderSn: '',
  orderRejectionContent: ''
})
const ywOrderReject = ref({
  id: undefined,
  status: undefined,
  totalAmount: '',
  orderSn: ''
})
const viewPayee = reactive<getViewPayeeRes>({
  userId: userStore.userInfo.userId,
  typeId: 1
})
const orderStat = ref<orderCountApi>({
  waitingOrders: 0,
  toPosted: 0,
  inLogistics: 0,
  confirmOrder: 0,
  afterSales: 0,
  toPaid: 0
})
const paginationSize = ref<getOrderlistRes>({
  pageSize: 10,
  current: 1,
  startOrderTime: '',
  endOrderTime: '',
  sellId: '',
  promId: '',
  orderStatusList: [],
  resourceName: '',
  userId: userStore.userInfo.userId
})
const InQuestion = ref<any>({
  id: '',
  problemContent: '',
  problemPic: '',
  status: '',
  orderSn: ''
})
const leaveAMessageInfo = ref({
  id: undefined,
  orderItemId: undefined,
  content: '',
  userType: 1
})

// 订单驳回规则
const rejectRules = {
  orderRejectionContent: [{ required: true, message: '订单驳回理由不能为空', trigger: 'blur' }]
}

// 订单统计
const getOrderCount = async () => {
  const res = await getOrderCountAPI()
  orderStat.value = res.data
}
// 订单列表
const getList = async () => {
  luoli.value = true
  if (paginationSize.value.orderStatusList?.length === 0) {
    paginationSize.value.orderStatusList = undefined
  }
  ;(paginationSize.value.startOrderTime =
    dateValue.value.length === 0
      ? undefined
      : dayjs(dateValue.value[0]).format('YYYY-MM-DD 00:00:00')),
    (paginationSize.value.endOrderTime =
      dateValue.value.length === 0
        ? undefined
        : dayjs(dateValue.value[1]).format('YYYY-MM-DD 23:59:59')),
    (paginationSize.value.sellId =
      paginationSize.value.sellId === 'null'
        ? undefined
        : paginationSize.value.sellId),
    (paginationSize.value.promId =
      paginationSize.value.promId === 'null'
        ? undefined
        : paginationSize.value.promId)

  const res = await OrderlistAPI(paginationSize.value)
  if (res.code === 200) {
    tableData.value = res.data.records
    total.value = <number>res.data.total
    luoli.value = false
  }
}
if (route.query.status) {
  const yw: any = route.query.status
  paginationSize.value.orderStatusList = JSON.parse(yw).map((v: any) =>
    Number(v)
  )
}
// 刷新
const refresh = (formEl: FormInstance | undefined) => {
  classNameTo.value = true
  if (!formEl) return
  formEl.resetFields()
  paginationSize.value.orderStatusList = []
  if (route.query.status) {
    router.push({
      path: '/order/list'
    })
  }
  getList().then(() => {
    classNameTo.value = false
  })
  dateValue.value = []
}
// 获取订单分类
const catesell = async () => {
  const res = await getCatesellAPI()
  catesellTo.value = res.data
}
// 获取推广类型
const catere = async () => {
  const res = await getCatereAPI()
  catereInfo.value = res.data
}
// 获取订单状态
const orderStatus = async () => {
  const res = await orderStatusListAPI()
  statusList.value = res.data
}

// 根据id返回对应的订单状态
const getName = (id: any, idName: any, lableName: any) => {
  if (id || id == '0') {
    const index = statusList.value.findIndex((role: any) => role[idName] === id)
    return index >= 0 ? statusList.value[index][lableName] : undefined
  } else {
    return undefined
  }
}

// 搜索
const getSearch = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      paginationSize.value.pageSize = 10
      paginationSize.value.current = 1
      if (route.query.status) {
        router.push({
          path: '/order/list'
        })
      }
      getList()
    }
  })
}

const toWaiting = (val: any) => {
  paginationSize.value.orderStatusList = val
  getList()
}

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  paginationSize.value.current = 1
  paginationSize.value.pageSize = 10
  paginationSize.value.orderStatusList = []
  dateValue.value = []
  if (route.query.status) {
    router.push({
      path: '/order/list'
    })
  }
  getList()
}

// ----------------------批量接单-----------------------------------
const handleSelectionChange = (val: any) => {
  console.log(val)
}
// ----------------------复制内容----------------------------------
const handle = async (val: any) => {
  const originalPriceMax = val.originalPriceMax ? val.originalPriceMax : ''
  const discountPriceMax = val.discountPriceMax ? val.discountPriceMax : ''
  const coupon = val.coupon ? val.coupon : ''
  const jsonString = `Product Name：${val.resourceTitle}\nOriginal Price：${val.originalPriceMin} - ${originalPriceMax}\nDiscount Price：${val.discountPriceMin} - ${discountPriceMax}\nDiscount：${val.preferentialRatio} + ${coupon}\nDiscount Code：${val.discountCode}\nCode Start Day：${val.startTime}\nCode End Day：${val.endTime}\nLink：${val.resourceUrl}`
  await toClipboard(jsonString)
  message.success('复制成功')
}

// ----------------------查看详情-----------------------------------
const drawerTo = (val: any) => drawerTo1.value.handleDrawer(val)

// -------------------------接单------------------------------------
const mediaOrders = async (val: any) => {
  val.jkLoading = true
  const res = await getViewPayeeAPI(viewPayee)
  if (!res.data) {
    val.jkLoading = false
    noCollectionDialog.value = !noCollectionDialog.value
    return
  } else {
    if (val.sellId === 2) {
      val.jkLoading = false
      await addressRef.value.Address(val)
    } else {
      await mediaOrdersAPI({
        id: val.id,
        orderType: val.orderType,
        status: val.status,
        orderSn: val.orderSn
      })
        .then(async () => {
          message.success('订单接取成功')
          await getList()
          val.jkLoading = false
        })
        .catch(async () => {
          val.jkLoading = false
          await getList()
        })
    }
  }
}
const addNoCollectionDialog = () => {
  noCollectionDialog.value = !noCollectionDialog.value
  location.href = '/set/settlement/info'
}

// ---------------------拒绝接单------------------------------------
const rejectOrder = (val: any) => {
  ywOrderReject.value.id = val.id
  ywOrderReject.value.status = val.status
  ywOrderReject.value.orderSn = val.orderSn
  ywOrderReject.value.totalAmount = val.totalAmount
  ElMessageBox.confirm('确认要拒绝接单吗？', '拒绝接单提醒')
    .then(async () => {
      await orderrejectAPI(ywOrderReject.value)
        .then(() => {
          message.success('拒绝订单成功')
          getList()
        })
    })
}

// ----------------------取消订单-----------------------------------
const cancelOrder = (val: any) => {
  ElMessageBox.confirm('确认要取消订单吗?', '温馨提示').then(async () => {
    await cancelOrderAPI({
      id: val.id,
      status: val.status,
      totalAmount: val.totalAmount,
      orderSn: val.orderSn,
      payMethod: val.payMethod
    })
      .then(async () => {
        message.success('订单取消成功')
        await getList()
      })
      .catch(async () => {
        await getList()
      })
  })
}

// ----------------------订单驳回-----------------------------------
const OrderRejection = (val: any) => {
  rejectForm.value.id = val.id
  rejectForm.value.status = val.status
  rejectForm.value.orderSn = val.orderSn
  rejectForm.value.totalAmount = val.totalAmount
  openReject.value = true
}

// 取消驳回
const rejectCancel = () => {
  rejectRef.value.resetFields()
}
// 确认驳回
const okReject = () => {
  rejectRef.value.validate()
    .then(async () => {
      rejectLoading.value = true
      await orderRejectionAPI(rejectForm.value)
        .then(() => {
          message.success('驳回订单成功')
          rejectRef.value.resetFields()
          getList()
          rejectLoading.value = false
          openReject.value = false
        })
        .catch(() => {
          rejectLoading.value = false
        })
    })
}

// -----------------------提交上贴----------------------------------
const getSubmitAndPaste = (val: any) => submitPaste.value.addDrawer(val, 0)

// -----------------------同意退款----------------------------------
const agreeRefund = (val: any) => {
  ElMessageBox.confirm('确认要退款吗?', '温馨提示').then(async () => {
    await postAgreeRefundAPI({
      id: val.id,
      status: val.status,
      totalAmount: val.totalAmount,
      orderSn: val.orderSn,
      payMethod: val.payMethod
    })
      .then(async () => {
        message.success('退款成功')
        await getList()
      })
      .catch(async () => {
        await getList()
      })
  })
}

// ----------------第二次上帖 拒绝退款------------------------------
const refuseRefundn = (val: any, num: number) =>
  submitPaste.value.addDrawer(val, num)

// -----------------------确认到样----------------------------------
const sampleConfirmed = async (val: any) => {
  val.jkLoading = true
  await sampleConfirmedAPI({
    id: val.id,
    status: val.status,
    orderSn: val.orderSn
  })
    .then(async () => {
      val.jkLoading = false
      message.success('确认到样成功')
      await getList()
    })
    .catch(async () => {
      val.jkLoading = false
      await getList()
    })
}

// ------------------------问题中-----------------------------------
const questionRules = reactive({
  problemContent: [
    { required: true, message: '请输入问题描述', trigger: 'blur' }
  ]
})

const questionDisp = (val: any) => {
  questionDialog.value = true
  InQuestion.value.id = val.id
  InQuestion.value.status = val.status
  InQuestion.value.orderSn = val.orderSn
}

const handlePaste = async (e: any) => {
  let clipboardData = e.clipboardData // IE
  if (!clipboardData) {
    clipboardData = e.originalEvent.clipboardData
  }
  const items = (e.clipboardData || e.originalEvent.clipboardData).items
  let file = null
  if (!items || items.length === 0) {
    message.error('当前浏览器不支持粘贴本地图片，请打开图片复制后再粘贴！')
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
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      if (file.size / 1024 > 800) {
        message.error('上传的图片大小不能超过 800KB!')
        return false
      }
      let formData = new FormData()
      formData.append('file', file)
      const res = await fileUploadAPI(formData)
      InQuestion.value.problemPic = res.data.url
    } else {
      message.error('上传格式只能为JPG/PNG!')
      return false
    }
  }
}

const httpAvatarUpload = async (options: any) => {
  let formData = new FormData()
  formData.append('file', options.file)
  const res = await fileUploadAPI(formData)
  InQuestion.value.problemPic = res.data.url
}

// 取消
const questionReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  InQuestion.value.problemPic = ''
  questionDialog.value = false
  getList()
}

// 确定
const questionSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  LoadingJK.value = true
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await postQuestionAPI(InQuestion.value)
        .then(async () => {
          LoadingJK.value = false
          message.success('问题提交成功')
          formEl.resetFields()
          InQuestion.value.problemPic = ''
          questionDialog.value = false
          await getList()
        })
        .catch(() => {
          LoadingJK.value = false
        })
    } else {
      message.error('请填写描述问题')
      LoadingJK.value = false
    }
  })
}

// -------------------问题中同意退款--------------------------------
const agreeRefundTwo = async (val: any) => {
  val.jkLoading = true
  await questionAgreedRefundAPI({
    id: val.id,
    status: val.status,
    totalAmount: val.totalAmount,
    orderSn: val.orderSn,
    payMethod: val.payMethod
  })
    .then(async () => {
      message.success('退款成功')
      await getList()
      val.jkLoading = false
    })
    .catch(async () => {
      val.jkLoading = false
      await getList()
    })
}

// --------------------申请延长上贴---------------------------------
const ExtensionSticker = (val: any, num: number) => {
  ElMessageBox.confirm(`确认申请延长${num}天上贴时间吗？`, '温馨提示').then(
    async () => {
      await applyExtensionAPI({
        id: val.id,
        status: val.status,
        orderSn: val.orderSn,
        extendPostingTime: num
      })
        .then(async () => {
          message.success('申请延长上贴成功')
          await getList()
        })
        .catch(async () => {
          await getList()
        })
    }
  )
}

getList()
orderStatus()
getOrderCount()
</script>

<template>
  <div class="order_list_page yw_box">
    <div class="order_list_top_box">
      <div class="order_list_top_bottom">
        <div class="order_list_top_title">待接单</div>
        <div class="order_list_top_num" @click="toWaiting([2])">
          {{ orderStat.waitingOrders }}
        </div>
      </div>
      <div class="order_list_top_bottom">
        <div class="order_list_top_title">进行中</div>
        <div class="order_list_top_num" @click="toWaiting([6])">
          {{ orderStat.toPosted }}
        </div>
      </div>
      <div class="order_list_top_bottom">
        <div class="order_list_top_title">物流中</div>
        <div class="order_list_top_num" @click="toWaiting([4])">
          {{ orderStat.inLogistics }}
        </div>
      </div>
      <div class="order_list_top_bottom">
        <div class="order_list_top_title">已完成</div>
        <div class="order_list_top_num" @click="toWaiting([10])">
          {{ orderStat.confirmOrder }}
        </div>
      </div>
      <div class="order_list_top_bottom">
        <div class="order_list_top_title">售后中</div>
        <div class="order_list_top_num" @click="toWaiting([11, 19, 14])">
          {{ orderStat.afterSales }}
        </div>
      </div>
      <div class="order_list_top_bottom">
        <div class="order_list_top_title">待付款</div>
        <div class="order_list_top_num" @click="toWaiting([1])">
          {{ orderStat.toPaid }}
        </div>
      </div>
    </div>
    <div class="order_list_header_box">
      <el-form ref="ruleRef" :model="paginationSize" :inline="true">
        <el-form-item>
          <el-button
            class="YWBtn"
            plain
            type="primary"
            @click="refresh(ruleRef)"
          >
            <i-ep-refresh :class="{ rotateIcon: classNameTo }" />
            &nbsp;刷新
          </el-button>
        </el-form-item>

        <el-form-item prop="sellId">
          <el-select
            v-model="paginationSize.sellId"
            placeholder="请选择订单"
            @focus="catesell"
          >
            <el-option label="全部订单" value="null" />
            <el-option
              v-for="i in catesellTo"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="status">
          <el-select
            v-model="paginationSize.orderStatusList"
            multiple
            clearable
            collapse-tags
            placeholder="请选择订单状态"
            @focus="orderStatus"
            @change="getSearch(ruleRef)"
          >
            <el-option
              v-for="i in statusList"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="promId">
          <el-select
            v-model="paginationSize.promId"
            placeholder="请选择推广类型"
            @focus="catere"
          >
            <el-option label="全部推广类型" value="null" />
            <el-option
              v-for="i in catereInfo"
              :key="i.id"
              :label="i.name"
              :value="i.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="date_box" prop="startOrderTime">
          <a-range-picker
            v-model:value="dateValue"
            :allowClear="false"
            valueFormat="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item prop="resourceName">
          <a-input
            v-model:value="paginationSize.resourceName"
            placeholder="资源名称"
            autocomplete="off"
            allowClear
            @pressEnter="getSearch(ruleRef)"
          >
            <template #suffix>
              <SearchOutlined :style="{ color: '#bcbec4' }" />
            </template>
          </a-input>
        </el-form-item>

        <el-form-item class="btn_box">
          <el-button plain type="primary" @click="getSearch(ruleRef)">
            搜索
          </el-button>
          <el-button plain text type="primary" @click="resetForm(ruleRef)">
            重置
          </el-button>
          <!-- <el-button type="primary">批量接单</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="order_list_table_box">
      <div class="yw_table" v-loading="luoli">
        <div class="table_header">
          <span></span>
          <span class="product_name">产品名称</span>
          <span class="resource_name">资源名称</span>
          <span class="discount_priceMin">产品售价</span>
          <span class="create_time">预约发布时间/创建时间</span>
          <span class="remaining_time">剩余时间</span>
          <span class="state">状态</span>
          <span class="total_amount">费用</span>
          <span class="operate">操作</span>
        </div>
        <el-scrollbar height="670px">
          <div v-for="(i, v) in tableData" :key="v">
            <div class="table_content">
              <!-- 产品名称 -->
              <div class="name_box">
                <el-popover placement="right" :width="228" trigger="click">
                  <template #reference>
                    <el-image
                      style="width: 60px; height: 60px"
                      :src="i.picUrl"
                      fit="fill"
                    />
                  </template>
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="i.picUrl"
                    fit="fill"
                  />
                </el-popover>

                <div class="name_left_box">
                  <div class="name_left_title">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      placement="top-start"
                    >
                      <span>{{ i.resourceTitle }}</span>
                      <template #content>
                        <div style="max-width: 180px; font-size: 16px">
                          {{ i.resourceTitle }}
                        </div>
                      </template>
                    </el-tooltip>
                  </div>
                  <div class="name_left_nation">
                    <span class="name_left_nation_title">
                      <span class="nation_icon_img">
                        <img :src="i.countryPic" alt="" />
                      </span>
                      {{ i.countryName }}
                    </span>
                    <span class="name_left_img">
                      <el-tooltip
                        :content="i.platformsName"
                        class="box-item"
                        effect="dark"
                        placement="top-start"
                      >
                        <img :src="i.platformsPic" alt="" />
                      </el-tooltip>
                    </span>
                  </div>
                </div>
                <!-- 资源名称 -->
                <div class="name_centre_box">
                  <div class="name_centre_title">
                    <el-popover :width="300" placement="right" trigger="hover">
                      <template #default>
                        <div class="popover_box">
                          <div class="popover_box_img">
                            <img :src="i.mediaPic" alt="" />
                          </div>
                          <div class="popover_box_title">
                            <el-scrollbar height="200px">
                              <p>{{ i.resourceName }}</p>
                            </el-scrollbar>
                          </div>
                        </div>
                      </template>
                      <template #reference>
                        <el-link
                          :href="i.resourceUrl"
                          :underline="false"
                          target="_blank"
                        >
                          <span class="resourceName">{{ i.resourceName }}</span>
                        </el-link>
                      </template>
                    </el-popover>
                  </div>
                  <div class="name_centre_type">
                    {{ i.promotionName }}
                  </div>
                </div>

                <div class="name_right_box">
                  <div class="name_right_box_title">
                    <span class="discount_coupon">
                      {{ i.discountCode }}
                    </span>
                    <div v-if="i.promId === 4" class="name_right_icon">
                      <i-ep-copy-document
                        class="name_right_title_icon"
                        @click="handle(i)"
                      />
                    </div>
                  </div>
                  <div class="name_right_box_type">
                    <span v-if="i.preferentialRatio">
                      {{ i.preferentialRatio }}%OFF
                    </span>
                    <span v-if="i.preferentialRatio && i.coupon">+</span>
                    <span v-if="i.coupon"> {{ i.coupon }}Coupon </span>
                  </div>
                </div>
              </div>
              <!-- 产品售价 -->
              <div class="discount_priceMin_box">
                <div v-if="i.promId !== 3">
                  <div v-if="!i.discountPriceMin" />
                  <div v-if="i.discountPriceMin">
                    <span v-if="i.discountPriceMin">
                      {{ i.unit }}{{ i.discountPriceMin }}
                    </span>
                    <span v-if="i.discountPriceMin && i.discountPriceMax">
                      -
                    </span>
                    <span v-if="i.discountPriceMax">
                      {{ i.unit }}{{ i.discountPriceMax }}
                    </span>
                  </div>
                  <div
                    v-if="!i.originalPriceMin"
                    class="product_price_bottom"
                  />
                  <div v-if="i.originalPriceMin" class="product_price_bottom">
                    <span v-if="i.originalPriceMin">
                      {{ i.unit }}{{ i.originalPriceMin }}
                    </span>
                    <span v-if="i.originalPriceMin && i.originalPriceMax">
                      -
                    </span>
                    <span v-if="i.originalPriceMax">
                      {{ i.unit }}{{ i.originalPriceMax }}
                    </span>
                  </div>
                </div>
                <div v-else>
                  <span v-if="i.articleType === 1">媒体代写</span>
                  <span v-else>自己提供</span>
                </div>
              </div>
              <!-- 预约发布时间/创建时间 -->
              <div class="create_time_box">
                <div class="appointment_time_box">
                  {{ i.appointmentReleaseTime }}
                  <el-tooltip
                    class="box-item"
                    content="预约上贴时间"
                    effect="dark"
                    placement="top-start"
                  >
                    <svg-icon icon-class="Appointment" />
                  </el-tooltip>
                </div>
                <div>{{ i.createTime }}</div>
              </div>
              <!-- 剩余时间 -->
              <div class="remaining_time_box">
                <!-- 剩余上贴时间 -->
                <div
                  v-if="i.remainingTimeOrderPending"
                  class="time_remaining_box"
                >
                  <div class="time_remaining_top">
                    <span>剩余上贴时间</span>
                    <el-popover
                      :width="280"
                      content="倒计时结束未上贴订单自动取消并退款"
                      placement="top-start"
                      title="剩余上贴时间"
                      trigger="hover"
                    >
                      <template #reference>
                        <span class="time_remaining_top_right">?</span>
                      </template>
                    </el-popover>
                  </div>
                  <div class="product_price_body">
                    <el-countdown
                      :value="Date.now() + i.remainingTimeOrderPending"
                      format="DD [天] HH:mm:ss"
                    />
                  </div>
                </div>
                <!-- 剩余接单时间 -->
                <div v-if="i.remainingTimePost" class="time_remaining_box">
                  <div class="time_remaining_top">
                    <span>剩余接单时间</span>
                    <el-popover
                      :width="280"
                      content="倒计时结束未接单订单自动取消并退款"
                      placement="top-start"
                      title="剩余接单时间"
                      trigger="hover"
                    >
                      <template #reference>
                        <span class="time_remaining_top_right">?</span>
                      </template>
                    </el-popover>
                  </div>
                  <div class="product_price_body_1">
                    <el-countdown
                      :value="Date.now() + i.remainingTimePost"
                      format="DD [天] HH:mm:ss"
                    />
                  </div>
                </div>
              </div>
              <!-- 状态 -->
              <div class="yw_state_box">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <div class="yw_logistics" v-if="i.status === 4">
                    <a :href="i.address" target="_blank">查看物流</a>
                  </div>
                  <div
                    class="state_box"
                    :class="{
                      negativeNumber: i.status === 11,
                      stateBox1: i.status === 4
                    }"
                  >
                    <el-popover :width="210" placement="left" trigger="hover">
                      <div class="popover_steps_box">
                        <el-timeline>
                          <el-timeline-item
                            v-for="j in i.history"
                            :key="j.id"
                            :timestamp="j.createTime"
                            hollow
                            type="primary"
                          >
                            {{ j.statusName }}
                          </el-timeline-item>
                        </el-timeline>
                      </div>
                      <template #reference>
                        <div class="state_top_title">
                          <span v-if="i.status === 11" class="dispute">
                            {{ getName(i.status, 'id', 'name') }}
                          </span>
                          <span v-else-if="i.status === 17" class="dispute1">
                            {{ getName(i.status, 'id', 'name') }}
                          </span>
                          <span v-else style="cursor: default">
                            {{ getName(i.status, 'id', 'name') }}
                          </span>
                        </div>
                      </template>
                    </el-popover>
                    <!-- <div class="state_bottom_img" @click="getViewChatInfo(i)"> -->
                    <div class="state_bottom_img">
                      <el-avatar :size="30" :src="i.avatar" />
                      <!-- <div v-if="newInfo" class="state_top_icon">
                        <img src="@/assets/img/Frame.png" alt="" class="state_top_icon_img"/>
                      </div> -->
                    </div>
                  </div>
                  <div
                    class="yw_dispute"
                    v-if="i.status === 11 && i.requestContent"
                  >
                    {{ i.requestContent }}
                  </div>
                  <!-- <div class="yw_dispute" v-if="i.status === 11 && i.rejectionContent">
                    {{ i.rejectionContent }}
                </div> -->
                </div>
              </div>
              <!-- 费用 -->
              <div class="total_amount_box">
                <span>￥&nbsp;{{ i.totalAmount }}</span>
              </div>
              <!-- 操作 -->
              <div class="operate_box">
                <!-- 接单 -->
                <div v-if="i.status === 2" class="child_footer">
                  <el-button
                    @click="mediaOrders(i)"
                    :loading="i.jkLoading"
                    v-if="i.status === 2"
                    class="button_JK"
                    type="primary"
                    text
                  >
                    接单&nbsp;&nbsp;&nbsp;<i-ep-arrow-down />
                  </el-button>
                  <div class="select-box">
                    <el-button
                      class="button_JK button_JK1"
                      text
                      type="primary"
                      @click="rejectOrder(i)"
                    >
                      拒绝接单
                    </el-button>
                  </div>
                </div>

                <!--图文订单-->
                <div v-if="i.sellId === 1">
                  <!-- 进行中、待上贴 -->
                  <div v-if="i.status === 6" class="child_footer">
                    <el-button
                      class="button_JK"
                      type="primary"
                      text
                      @click="getSubmitAndPaste(i)"
                    >
                      提交反馈<i-ep-arrow-down />
                    </el-button>
                    <div class="select-box">
                      <el-button
                        class="button_JK button_JK1"
                        text
                        type="danger"
                        @click="OrderRejection(i)"
                      >
                        订单驳回
                      </el-button>
                    </div>
                  </div>
                  <!-- 待确认 -->
                  <div v-if="i.status === 11" class="child_footer">
                    <el-button
                      :loading="i.jkLoading"
                      class="button_JK"
                      text
                      type="primary"
                      @click="agreeRefund(i)"
                    >
                      同意退款<i-ep-arrow-down />
                    </el-button>
                    <div class="select-box">
                      <el-button
                        class="button_JK button_JK1"
                        text
                        type="danger"
                        @click="refuseRefundn(i, 1)"
                      >
                        拒绝退款
                      </el-button>
                    </div>
                  </div>
                </div>

                <!--开箱评测-->
                <div v-if="i.sellId === 2">
                  <!-- 接单 -->
                  <!-- <div v-if="i.status === 2" class="child_footer">
                  <el-button
                    @click="mediaOrders(i)"
                    :loading="i.jkLoading"
                    v-if="i.status === 2"
                    class="button_JK"
                    type="primary"
                    text
                  >
                    接单 <i-ep-arrow-down />
                  </el-button>
                  <div class="select-box">
                      <el-button
                        class="button_JK button_JK1"
                        text
                        type="primary"
                        @click="rejectOrder(i)"
                      >
                        拒绝接单
                      </el-button>
                    </div>
                  </div> -->
                  <!-- 确认到样 -->
                  <div v-if="i.status === 4" class="child_footer">
                    <el-button
                      @click="sampleConfirmed(i)"
                      :loading="i.jkLoading"
                      class="button_JK"
                      type="primary"
                      text
                    >
                      确认到样 <i-ep-arrow-down />
                    </el-button>
                    <div class="select-box">
                      <el-button
                        class="button_JK button_JK1"
                        text
                        type="primary"
                        @click="questionDisp(i)"
                      >
                        问题中
                      </el-button>
                    </div>
                  </div>
                  <!-- 问题中 -->
                  <el-button
                    @click="agreeRefundTwo(i)"
                    :loading="i.jkLoading"
                    v-if="i.status === 20"
                    class="button_JK"
                    type="primary"
                    text
                  >
                    同意退款
                  </el-button>
                  <!-- 进行中、待上贴 -->
                  <div v-if="i.status === 6" class="child_footer">
                    <el-dropdown class="child_bottom">
                      <span class="button_JK" @click="getSubmitAndPaste(i)">
                        提交反馈<i-ep-arrow-down />
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="a" @click="OrderRejection(i)">
                            订单驳回
                          </el-dropdown-item>
                          <el-dropdown-item
                            command="b"
                            @click="ExtensionSticker(i, 5)"
                          >
                            延长5天
                          </el-dropdown-item>
                          <el-dropdown-item
                            command="c"
                            @click="ExtensionSticker(i, 10)"
                          >
                            延长10天
                          </el-dropdown-item>
                          <el-dropdown-item
                            command="d"
                            @click="ExtensionSticker(i, 15)"
                          >
                            延长15天
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                  <!-- 同意延长上贴 -->
                  <!-- 拒绝延长上贴 -->
                  <div
                    v-if="i.status === 7 || i.status === 8 || i.status === 9"
                    class="child_footer"
                  >
                    <el-button
                      @click="getSubmitAndPaste(i)"
                      :loading="i.jkLoading"
                      class="button_JK"
                      type="primary"
                      text
                    >
                      提交反馈 <i-ep-arrow-down />
                    </el-button>
                    <div class="select-box">
                      <el-button
                        class="button_JK"
                        text
                        style="color: #f00;"
                        type="primary"
                        @click="OrderRejection(i)"
                      >
                        订单驳回
                      </el-button>
                    </div>
                  </div>
                  <!-- 待确认 -->
                  <div v-if="i.status === 11" class="child_footer">
                    <el-button
                      :loading="i.jkLoading"
                      class="button_JK"
                      text
                      type="primary"
                      @click="agreeRefund(i)"
                    >
                      同意退款 <i-ep-arrow-down />
                    </el-button>
                    <div class="select-box">
                      <el-button
                        class="button_JK button_JK1"
                        text
                        type="danger"
                        @click="refuseRefundn(i, 1)"
                      >
                        拒绝退款
                      </el-button>
                    </div>
                  </div>
                </div>

                <div @click="drawerTo(i)" class="details">
                  <span>详情</span>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <pagination
        :total="total"
        v-model:page="paginationSize.current"
        v-model:limit="paginationSize.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
  <!-- 订单信息 -->
  <drawer ref="drawerTo1" />
  <!-- 无收款信息弹窗 -->
  <div class="no_collection_info">
    <el-dialog
      v-model="noCollectionDialog"
      :close-on-click-modal="false"
      :show-close="false"
      align-center
      width="400"
    >
      <div>
        <span>当前未设置收款信息，请您先设置后在接单</span>
        <div class="btn">
          <el-button @click="noCollectionDialog = false">取消</el-button>
          <el-button type="primary" @click="addNoCollectionDialog">
            去设置
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
  <!-- 地址 -->
  <address-dialog ref="addressRef" @refreshData="getList" />
  <!-- 提交上贴 -->
  <submit-and-paste ref="submitPaste" @refreshPage="getList" />
  <!-- 问题中 -->
  <div class="question_core">
    <el-dialog
      v-model="questionDialog"
      :close-on-click-modal="false"
      align-center
      width="554"
    >
      <div class="dialog_head">
        <i-ep-close @click="questionReset(questionRef)" />
      </div>
      <div class="dialog_body">
        <el-form
          ref="questionRef"
          :model="InQuestion"
          :rules="questionRules"
          label-width="100px"
          @paste="handlePaste"
        >
          <el-form-item label="请描述问题" prop="problemContent">
            <el-input
              v-model="InQuestion.problemContent"
              placeholder="请输入描述问题"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
              drag
              action=""
              class="avatar-uploader"
              :show-file-list="false"
              accept=".jpeg,.png,.jpg"
              :http-request="httpAvatarUpload"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="InQuestion.problemPic"
                :src="InQuestion.problemPic"
                alt=""
                class="avatar"
              />
              <i-ep-upload-filled
                v-if="!InQuestion.problemPic"
                class="el-icon--upload"
              />
              <div v-if="!InQuestion.problemPic" class="uploader_code">
                点击上传
              </div>
              <div v-if="!InQuestion.problemPic" class="uploader_code1">
                CTRL+V或
              </div>
              <div v-if="!InQuestion.problemPic" class="uploader_code2">
                拖动图片到这里
              </div>
              <template #tip>
                <div class="el-upload__tip">支持jpg、png格式</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button
          :loading="LoadingJK"
          type="primary"
          @click="questionSubmit(questionRef)"
        >
          确定
        </el-button>
        <el-button class="res_btn" @click="questionReset(questionRef)">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
  <!-- 留言 -->
  <div class="leaveAMessage">
    <a-drawer
    v-model:open="open"
    width="583"
    placement="right"
    :closable="false"
    :maskClosable="false"
  >
    <CloseOutlined style="float: right; cursor: pointer;" />
    <div class="leaveAMessage_title">
      <span class="i_title"></span>留言
    </div>
    <p>
      <div class="leaveAMessage_box">
        <div class="left">
          <a-avatar :size="40" src="">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <div class="left_right">
            <div class="top">我的code已过期，新的code为xxxxx，如未上贴请使用新的code</div>
            <span>23-10-10 10:00</span>
          </div>
        </div>
        <div class="right">
          <div class="right_left">
            <div class="top">我的code已过期，新的code为xxxxx，如未上贴请使用新的code</div>
            <span>23-10-10 10:00</span>
          </div>
          <a-avatar :size="40" src="">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </div>
      </div>
    </p>
    <div class="leaveAMessage_btn">
      <a-input v-model:value="leaveAMessageInfo.content" placeholder="输入你想说的话" />
      <a-button type="primary">发送</a-button>
    </div>
  </a-drawer>
  </div>
  <!-- 订单驳回 -->
  <div class="orderReject">
    <a-modal
      v-model:open="openReject"
      centered
      title="订单驳回"
      :maskClosable="false"
      @ok="okReject"
      :confirm-loading="rejectLoading"
      @cancel="rejectCancel"
      >
      <a-form
        ref="rejectRef"
        layout="vertical"
        :model="rejectForm"
        :rules="rejectRules"
        :label-col="{span: 6}"
      >
        <a-form-item label="请输入驳回理由" name="orderRejectionContent">
          <a-textarea
            v-model:value="rejectForm.orderRejectionContent"
            placeholder="请输入驳回理由"
            show-count
            style="height: 100px;"
            :maxlength="50"
            />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>

.order_list_page {
  padding: 27px 14px 0 36px;

  .order_list_top_box {
    width: 620px;
    display: flex;
    margin-left: 23px;
    margin-bottom: 40px;
    align-items: center;
    justify-content: space-between;
    .order_list_top_bottom {
      display: flex;
      align-items: center;
      flex-direction: column;
      .order_list_top_num {
        color: var(--yw-primary);
        margin-top: 10px;
        cursor: pointer;
        font-weight: bold;
      }
    }
  }
  .order_list_header_box {
    width: 100%;
    height: 56px;
    padding: 12px 15px;
    margin-bottom: 18px;
    background: var(--yw-bg-color);
    :deep(.el-form--inline .el-form-item) {
      margin-right: 10px;
    }
    :deep(.el-date-editor) {
      width: 214px !important;
    }
    :deep(.el-select) {
      width: 224px;
    }
    :deep(.ant-picker-range) {
      width: 224px;
      .ant-picker-active-bar {
        display: none;
      }
    }
  }

  .rotateIcon {
    animation: rotate 1s linear infinite;
  }

  .order_list_table_box {
    .yw_table {
      .table_header {
        width: 100%;
        height: 56px;
        color: var(--yw-text-111);
        display: flex;
        font-size: 14px;
        font-weight: 600;
        align-items: center;
        background: var(--yw-bg-color);
        .product_name {
          width: 272px;
          padding: 0 12px;
        }
        .resource_name {
          width: 388px;
          padding: 0 12px;
        }
        .discount_priceMin {
          width: 200px;
          padding: 0 12px;
        }
        .create_time {
          width: 180px;
          padding: 0 12px;
        }
        .remaining_time {
          width: 130px;
          text-align: center;
        }
        .state {
          width: 148px;
          text-align: center;
        }
        .total_amount {
          width: 128px;
          text-align: center;
        }
        .operate {
          width: 160px;
          text-align: center;
        }
      }
      .table_content {
        width: 100%;
        height: 82px;
        display: flex;
        padding: 8px 0;
        font-size: 14px;
        align-items: center;
        border-bottom: 1px solid var(--yw-bg-ebeef5);
        .name_box {
          display: flex;
          padding: 0 12px;
          align-items: center;
          .name_left_box {
            width: 184px;
            margin-left: 8px;
            margin-right: 20px;
            .name_left_title {
              :deep(.el-tooltip__trigger) {
                height: 21px;
                cursor: default;
                max-width: 184px;
                overflow: hidden;
                white-space: nowrap;
                display: inline-block;
                text-overflow: ellipsis;
              }
            }
            .name_left_nation {
              margin-top: 14px;
              display: flex;
              align-items: center;

              .name_left_nation_title {
                height: 16px;
                display: flex;
                cursor: default;
                margin-right: 5px;
                align-items: center;
                .nation_icon_img {
                  width: 16px;
                  height: 16px;
                  margin-right: 5px;
                  display: inline-block;
                }
              }
              .name_left_img {
                width: 16px;
                height: 16px;
                display: inline-block;
              }
            }
          }
          .name_centre_box {
            margin-right: 20px;

            .name_centre_title {
              width: 152px;
              height: 21px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .name_centre_type {
              color: var(--yw-text-111);
              cursor: default;
              margin-top: 14px;
            }
          }
          .name_right_box {
            .name_right_box_title {
              display: flex;
              align-items: center;
              .name_right_icon {
                margin-left: 13px;
                svg {
                  width: 1em;
                  height: 1em;
                  cursor: pointer;
                  color: var(--yw-text-555);
                }
              }
            }
            .name_right_box_type {
              width: 190px;
              margin-top: 14px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              span {
                font-size: 14px;
              }
            }
          }
        }
        .discount_priceMin_box {
          width: 200px;
          padding: 0 12px;
          .product_price_bottom {
            color: var(--yw-text-555);
            font-size: 13px;
            margin-top: 13px;
            text-decoration: line-through;
          }
        }
        .create_time_box {
          width: 180px;
          padding: 0 12px;
          .appointment_time_box {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            .svg-icon {
              margin-left: 2px;
            }
          }
        }
        .remaining_time_box {
          width: 148px;
          padding: 0 12px;
          text-align: center;
          .time_remaining_box {
            .time_remaining_top_right {
              width: 15px;
              height: 15px;
              color: var(--yw-text-666);
              font-size: 12px;
              cursor: pointer;
              margin-left: 5px;
              line-height: 15px;
              text-align: center;
              border-radius: 50%;
              display: inline-block;
              border: 1px solid var(--yw-text-666);
            }
            //倒计时
            .product_price_body {
              margin-top: 14px;
              :deep(.el-statistic__number) {
                color: var(--yw-text-f3294d);
                margin-top: 14px;
                margin-left: 5px;
                font-size: 14px;
              }
            }
            .product_price_body_1 {
              margin-top: 14px;
              :deep(.el-statistic__number) {
                color: var(--yw-text-ef6706);
                margin-top: 14px;
                margin-left: 5px;
                font-size: 14px;
              }
            }
          }
        }
        .yw_state_box {
          padding: 0 12px;
          min-width: 147px;

          .yw_logistics {
            cursor: pointer;
            font-size: 14px;
            color: var(--yw-text-4460ee);
            margin-left: -190px;
          }
          .state_box {
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            .state_top_title {
              .dispute {
                width: 42px;
                color: var(--yw-text-f00);
                cursor: default;
                display: inline-block;
              }
              .dispute1 {
                cursor: default;
                color: var(--yw-text-4460ee);
                display: inline-block;
              }
            }
            .state_bottom_img {
              margin-top: 10px;
              position: relative;
              .state_top_icon {
                width: 30px;
                height: 30px;
                .state_top_icon_img {
                  position: absolute;
                  top: -3px;
                  right: -8px;
                  width: 16px;
                  height: 16px;
                }
              }
            }
          }
          .stateBox1 {
            margin-left: 130px;
          }
          .yw_dispute {
            color: var(--yw-text-f00);
            cursor: default;
            margin-left: 18px;
          }
          .negativeNumber {
            margin-left: -190px;
          }
        }
        .total_amount_box {
          width: 130px;
          padding: 0 12px;
          text-align: center;
          span {
            color: var(--yw-text-111);
          }
        }
        .operate_box {
          width: 160px;
          display: flex;
          justify-content: center;
          padding: 0 12px;
          .button_JK {
            width: 94px;
            height: 32px;
            border: none;
            background: var(--yw-bg-f0f7f0);
            border-radius: 4px 4px 4px 4px;
            svg {
              width: 1em;
              height: 1em;
              margin-left: 5px;
            }

            &:hover {
              background: var(--yw-bg-color);
            }
          }
          .child_footer {
            position: relative;
            .select-box {
              display: none;
              position: absolute;
              border-radius: 4px;
              background-color: var(--yw-bg-fff);
              box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
              .button_JK1 {
                border: none;
              }
            }

            .child_bottom {
              width: 100%;
              height: 100%;
              background: var(--yw-bg-fff);
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 4px;

              span {
                display: inline-block;
                line-height: 32px;
                text-align: center;
                font-size: 14px;
                color: var(--yw-primary);
                cursor: pointer;
                svg {
                  margin-bottom: -3px;
                }
              }
            }
          }
          .child_footer:hover .select-box {
            display: block;
            z-index: 99999;
          }
          .details {
            width: 30px;
            height: 32px;
            cursor: pointer;
            margin-left: 5px;
            line-height: 32px;
            text-align: center;
            span {
              color: var(--yw-text-4460ee);
            }
          }
        }
      }
    }
    .popover_steps_box {
      :deep(.el-timeline-item__tail) {
        border-color: var(--yw-primary);
        left: 3px;
      }

      :deep(.el-timeline-item__node) {
        width: 9px;
        height: 9px;
      }
    }
  }

  .resourceName {
    display: inline-block;
    max-width: 152px;
    height: 23px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.popover_box {
  display: flex;

  .popover_box_img {
    width: 150px;
  }

  .popover_box_title {
    width: 130px;
    color: var(--yw-text-111);
    font-size: 16px;
    margin-left: 10px;
    font-weight: bold;
  }
}
:deep(.el-timeline) {
  text-align: left !important;
  margin-left: -30px !important;
}
// 无收款信息弹窗
.no_collection_info {
  text-align: center;

  :deep(.el-dialog) {
    .el-dialog__header {
      display: none;
    }

    .btn {
      margin-top: 30px;
    }
  }
}
// 问题中
.question_core {
  :deep(.el-dialog) {
    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      padding: 0 20px;

      .dialog_head {
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: right;
        margin-top: 10px;
      }

      .dialog_body {
        .el-form {
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
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: right;
    margin-bottom: 30px;

    .res_btn {
      border: 1px solid var(--yw-primary);
      color: var(--yw-primary);
    }
  }
}

// 留言
.leaveAMessage_title {
  display: flex;
  font-size: 16px;
  align-items: center;
  margin-bottom: 40px;
  .i_title {
    width: 2px;
    height: 13px;
    display: inline-block;
    margin-right: 7px;
    background: var(--yw-primary);
  }
}
.leaveAMessage_box {
  .ant-avatar {
    margin-top: -5px;
  }
  .left {
    float: left;
    display: flex;
    margin-bottom: 47px;
    .left_right {
      margin-left: 5px;
      .top {
        color: var(--yw-text-111);
        padding: 9px;
        font-size: 14px;
        max-width: 418px;
        border-radius: 2px;
        margin-bottom: 10px;
        background: var(--yw-bg-f4f4f4);
      }
    }
  }
  
  .right {
    display: flex;
    float: right;
    margin-bottom: 47px;
    .right_left {
      margin-right: 5px;
      .top {
        color: var(--yw-text-111);
        padding: 9px;
        font-size: 14px;
        max-width: 418px;
        border-radius: 2px;
        margin-bottom: 10px;
        background: var(--yw-primary);
      }
      span {
        display: inline-block;
        width: 418px;
        text-align: right;
      }
    }
  }

}

.leaveAMessage_btn {
  position: absolute;
  display: flex;
  bottom: 70px;
  left: 62px;
  .ant-input {
    width: 368px;
    margin-right: 20px;
  }
  .ant-btn {
    width: 96px;
  }
}
</style>
