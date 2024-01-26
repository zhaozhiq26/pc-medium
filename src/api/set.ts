import request from '@/utils/request'
import type { ChinaBankRes, NewAddressRes, addUserInfoRes, getShippingAddressApi, getShippingAddressRes, getViewPayeeRes, postUpdateDefaultRes } from '@/types/set'

// 新增或修收件人地址
export const NewAddressAPI = (data: NewAddressRes) => request('/system/address', 'post', data)
export const NewAddressToAPI = (data: NewAddressRes) => request('/system/address', 'put', data)

// 查看收件人地址
export const getAddressInfoAPI = (data: getShippingAddressRes) => request<getShippingAddressApi>('/system/address', 'get', data)

// 删除收件人
export const deleteAddressAPI = (id: number) => request(`/system/address/${id}`, 'delete')

// 修改默认
export const postUpdateDefaultAPI = (data: postUpdateDefaultRes) => request('/system/address/updateDefault', 'get', data)

// 查看收款人
export const getViewPayeeAPI = (data: getViewPayeeRes) => request<any>('/system/payee', 'get', data)

// 新增国内收款人信息
export const NewPayeeAPI = (data: ChinaBankRes) => request('/pay/settleAccount', 'post', data)

// 修改收款人信息
export const putNewPayeeAPI = (data: addUserInfoRes) => request('/system/payee', 'put', data)

// 新增国外收款人信息
export const ToNewPayeeAPI = (data: addUserInfoRes) => request('/system/payee', 'post', data)