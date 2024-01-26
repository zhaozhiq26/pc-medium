import request from '@/utils/request'
import type { ApiReq2 } from '@/types/test'
import type { addMediaRes, catereIDApi, getCategoryListApi, getPApi, mediaSearchApi, putUpdateMRes } from '@/types/media'

// 媒体中心搜索查看
export const postMediaSearchAPI = (data: mediaSearchApi) => request<ApiReq2<any>>('/system/medium/search', 'post', data)

// 根据id获取单个资源
export const getByIdAPI = (id: number) => request<any>(`/system/medium/getById/${id}`, 'get')

// 更改媒体价格
export const putMediaInfoAPI = (data: any) => request('/system/medium', 'put', data)

// 根据国家id获取资源平台列表
export const getPAPI = (id: number) => request<getPApi[]>(`/system/country/getP/${id}`, 'get')

// 根据媒体分类ID获取对应推广类别
export const getCatestAPI = (data: any) => request<catereIDApi>('/system/catest', 'get', data)

// 媒体主邮箱发验证码
export const mediaEmail = (query: any) => request('/system/medium/sendEmail/' + query, 'get')

// 添加媒体
export const postMediumAPI = (data: addMediaRes) => request('/system/medium', 'post', data)

// 获取产品类目列表
export const getCategoryListAPI = () => request<getCategoryListApi>('/system/mediaCategory/getCategoryList', 'get')

// 获取产品类型列表
export const getTypeListAPI = () => request<getCategoryListApi>('/system/mediaCategory/getTypeList', 'get')

// 获取产品类别列表
export const getClassificationListAPI = () => request<getCategoryListApi>('/system/mediaCategory/getClassificationList', 'get')

// 批量修改价格
export const putUpdateMAPI = (data: putUpdateMRes) => request('/system/medium/updateM', 'put', data)
