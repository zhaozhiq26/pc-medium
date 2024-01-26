// 查看公告栏
export interface BulletinBoardApi {
  id: number
  title: string
  content: string
  picName: string
  picUrl: string
  createTime: string
  updateTime: string
  sort: string
  position: number
}

// 查看网站联盟
export interface webAllianceApi {
  id: number
  name: string
  picName: string
  picUrl: string
  des: string
  industry: string
  defaultCommission: string
  averageCommission: string
  sort: string
}

// 修改工作时间
export interface startOrdersDateRes {
  userId: string
  startTakingOrders: 0 | 1
  startOrdersDate: string
}