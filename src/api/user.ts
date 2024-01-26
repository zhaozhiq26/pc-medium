import request from '@/utils/request'
import type { ApiRes3 } from '@/types/test'
import type { AccountCenterApi, PasswordRes, revenueApi, toUserInfoRes } from '@/types/user'

// 修改个人信息
export const updateInfoAPI = (data: object | undefined) => request('/media/updateInfo', 'put', data)

// 查看收入与余额
export const getPayPurse = () => request<revenueApi>('/pay/purse', 'get')

// 修改密码
export const putPassWordAPI = (data: PasswordRes) => request('/media', 'put', data)

// 查看流水
export const getPayDetailAPI = (data: toUserInfoRes) => request<ApiRes3<AccountCenterApi[]>>('/pay/purse/search', 'post', data)

// 提现
export const withdrawAPI = (data: any) => request('/pay/purse/withdraw', 'post', data)
