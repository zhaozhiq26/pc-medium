import request from '@/utils/request'
import type { ApiRes } from '@/types/test'
import type { applyExtensionRes, cancelOrderRes, getOrderlistApi, mediaOrderRes, orderCountApi, postAgreeRefundRes, postQuestionRes, postRefuseRefundRes, sampleConfirmedRes, toPostedRes } from '@/types/order'

// 订单统计
export const getOrderCountAPI = () => request<orderCountApi>('/order/omsOrder/orderCount', 'post')

// 订单列表
export const OrderlistAPI = (data: any) => request<ApiRes<getOrderlistApi>>('/order/omsOrder/listMediaPage', 'post', data)

// 订单详情
export const OrderlistIdAPI = (data: any) => request<ApiRes<getOrderlistApi>>('/order/omsOrder/listMediaPage', 'post', data)

// 订单状态列表 
export const orderStatusListAPI = () => request<{ id: number, name: string }[]>('/order/omsOrder/orderStatusList', 'get')

// 媒体接单
export const mediaOrdersAPI = (data: mediaOrderRes) => request('/order/omsOrder/mediaOrders', 'post', data)

// 取消订单
export const cancelOrderAPI = (data: cancelOrderRes) => request('/order/omsOrder/cancelled', 'post', data)

// 查看拒绝理由
export const efundReasonAPI = (data: any) => request('/order/reject', 'get', data)

// 第一次上帖
export const toPostedAPI = (data: toPostedRes) => request('/order/omsOrder/toPosted', 'post', data)

// 第二次上帖 拒绝退款
export const refuseRefundnAPI = (data: postRefuseRefundRes) => request('/order/omsOrder/refuseRefund', 'post', data)

// 同意退款
export const postAgreeRefundAPI = (data: postAgreeRefundRes) => request('/order/omsOrder/agreeRefund', 'post', data)

// 确认到样
export const sampleConfirmedAPI = (data: sampleConfirmedRes) => request('/order/omsOrder/confirmTheSample', 'post', data)

// 问题订单同意退款
export const questionAgreedRefundAPI = (data: postAgreeRefundRes) => request('/order/omsOrder/questionAgreedRefund', 'post', data)

// 申请延长上帖
export const applyExtensionAPI = (data: applyExtensionRes) => request('/order/omsOrder/applyExtension', 'post', data)

// 问题中
export const postQuestionAPI = (data: postQuestionRes) => request('/order/omsOrder/question', 'post', data)

// 订单驳回
export const orderRejectionAPI = (data: any) => request('/order/omsOrder/orderRejection', 'post', data)

// 拒绝接单
export const orderrejectAPI = (data:any) => request('/order/omsOrder/rejectTheOrder', 'post', data)