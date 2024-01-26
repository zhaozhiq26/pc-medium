import request from '@/utils/request'
import type { BulletinBoardApi, startOrdersDateRes, webAllianceApi } from '@/types/home'

// 查看公告栏
export const getBulletinBoardAPI = () => request<BulletinBoardApi>('/media/bulletinBoard/1', 'get')

// 查看网站联盟
export const getWebAllianceAPI = () => request<webAllianceApi>('/media/websiteAlliance', 'get')

// 修改工作时间
export const updateInfo1API = (data: startOrdersDateRes) => request<any>('/media/updateInfo', 'put', data)