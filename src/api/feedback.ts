import request from '@/utils/request'
import type {feedbackRes} from '@/types/feedback'

// 新增修改反馈
export const postFeedback = (data: feedbackRes) => request('/system/feedback', 'post', data)

// 查看反馈
export const getFeedback = () => request('/system/feedback/1', 'get')
