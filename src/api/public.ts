import request from "@/utils/request"
import type { countryAPI, catesellInfoApi, fileUploadApi, platformInfoApi, catereInfoApi } from "@/types/public"

// 获取国家
export const getCountryAPI = () => request<countryAPI>('/system/country/getCountry', 'get')

// 获取所有营销分类
export const getCatesellAPI = () => request<catesellInfoApi>('/system/catesell/getAll', 'get')

// 获取所有推广类别
export const getCatereAPI = () => request<catereInfoApi>('/system/catere', 'get')

// 获取所有购物平台
export const getPlatformAPI = () => request<platformInfoApi>('/system/platform/getAll', 'get')

// 上传文件
export const fileUploadAPI = (file: any) =>
request<fileUploadApi>('/file/upload', 'post', file, {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
})
export const fileUploadAPI1 = (file: any) =>
request<fileUploadApi>('/file/upload', 'post', {file, type: 1}, {
  'Content-Type': 'multipart/form-data'
})