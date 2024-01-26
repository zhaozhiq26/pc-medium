import request from '@/utils/request'
import type {listByMediaIdReq, listByMediaIdRes, updateByMediaIdRes} from '@/types/bill'
import type {ApiRes} from '@/types/test'

// 获取所有开票数据
export const listByMediaIdAPI = (data: listByMediaIdRes) => request<ApiRes<listByMediaIdReq[]>>('/system/invoice/listByMediaId', 'post', data)

// 编辑开票
export const updateByMediaAPI = (data: updateByMediaIdRes) => request<any>('/system/invoice/updateByMedia', 'post', data)
