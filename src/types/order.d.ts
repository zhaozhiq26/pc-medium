// 订单统计
export interface orderCountApi {
  waitingOrders: number
  toPosted: number
  inLogistics: number
  confirmOrder: number
  afterSales: number
  toPaid: number
}

// 获取订单列表

export interface getOrderlistRes {
  pageSize: number
  current: number
  startOrderTime: string | undefined
  endOrderTime: string | undefined
  sellId: string | undefined
  promId: string | undefined
  orderStatusList: any
  resourceName?: string
  userId: string
}

// 订单详情
export interface getOrderlistApi {
  id: string
  memberId: string
  orderSn: string
  createTime: string
  totalAmount: number
  status: number
  note: string
  coupon: string
  screenshot: string
  completeLink: string
  secondScreenshot: string
  secondCompleteLink: string
  address?: any
  problemPic?: any
  problemContent?: any
  extendPostingTime?: any
  resourceId: number
  appointmentReleaseTime: string
  orderType: number
  feedbackNotes: string
  secondFeedbackNotes: string
  resourceName: string
  resourceTitle: string
  resourceUrl: string
  picUrl: string
  resourceDes: string
  avatar: string
  sellName: string
  sellId: number | null
  progressList?: any
  history: {
      id: number
      orderItemId: number
      status: number
      createTime: string
      statusName: string
  }[]
  price: string
  sfId: number
  sfName: string
  remainingTimePost?: any
  remainingTimeOrderPending?: any
  startTime: string
  endTime: string
  completeLinkList: string[]
  secondCompleteLinkList: string[]
  originalPriceMin?: string
  originalPriceMax?: string
  discountPriceMin?: string
  discountPriceMax?: string
  preferentialRatio?: any
  countryName: string
  countryPic: string
  platformsName: string
  platformsPic: string
  unit: string
  payStatus: number
  promId: number
  articleType: number
  promotionName: string
  banner: string
  pic: string
  discountCode: string
  variableBody: string
  handAmount: string
  articleContent: string
  remark: string
  couponNote: string
  code: string
}

// 媒体接单
export interface mediaOrderRes {
  id: string
  orderType: string
  addressId?: string
  status: string
  orderSn: string
}

// 取消订单
export interface cancelOrderRes {
  id: string
  status: string
  totalAmount: string
  orderSn: string
  payMethod: string
}

// 第一次上贴
export interface toPostedRes {
  id: string
  screenshot: string
  completeLink: string
  status: string
  orderSn: string
}

// 第二次上帖 拒绝退款
export interface postRefuseRefundRes {
  id: string
  secondScreenshot: string
  secondCompleteLink: string
  status: string
  orderSn: string
  rejectionId: string
}

// 同意退款
export interface postAgreeRefundRes {
  id: string
  status: string
  totalAmount: string
  orderSn: string
  payMethod: string
}

// 确认到样
export interface sampleConfirmedRes {
  id: string
  status: string
  orderSn: string
}

// 申请延长上贴
export interface applyExtensionRes {
  id: string
  status: string
  extendPostingTime: number
  orderSn: string
}

// 问题中
export interface postQuestionRes {
  id: string
  problemPic: string
  problemContent: string
  status: string
}