import request from '@/utils/request'
import type { userNameInfoApi } from '@/types/user'
import type { EmRegisterRes, forgetPasswordRes, loginRes, registerApi, registerRes, wxLogin1Res, wxLoginRes } from '@/types/login'
// 登录
export const loginAPI = (data: loginRes) => request<registerApi>('/auth/webLogin', 'post', data)

// 微信登录
export const getQrCodeAPI = (type: any) => request<wxLoginRes>('/auth/getQrCode', 'get' , type)  // 获取验证码和ticket
export const checkStatusAPI = (code: any) => request<wxLogin1Res>('/auth/checkStatus', 'get', code) // 获取登录状态

// 获取用户信息
export const getUserInfoAPI = () => request<userNameInfoApi>('/media/getMediaInfo', 'get')

// 退出登录
export const logoutAPI = () => request('/auth/logout', 'delete')

// 获取手机验证码
export const phoneCode = (query: any) => request('/media/register/' + query, 'get')

// 获取注册邮箱验证码
export const emCode = (query: any) => request('/media/emailRegister/' + query, 'get')

// 媒体主邮箱发验证码
export const sendEmail = (query: any) => request('/system/medium/sendEmail/' + query, 'get')

// 手机号注册
export const registerAPI = (data: registerRes) => request('/auth/register', 'post', data)

// 邮箱注册
export const emailRegisterAPI = (data: EmRegisterRes) => request('/auth/emailRegister', 'post', data)

// 忘记密码
export const sendCodeAPI = (type: number, number: string) => request(`/media/sendCode/${type}/${number}`, 'get')
export const forgetPasswordAPI = (data: forgetPasswordRes) => request('/media/forgetPassword', 'post', data)
