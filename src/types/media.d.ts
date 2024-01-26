// 媒体中心搜索查看
export interface mediaSearchApi {
  createId: string
  resourceName?: string
  sfId?: string
  countryId?: string
  resourceTypeId?: string
  grounding?: number
  checkStatus?: number
  pageNum: number
  pageSize: number
}

// 根据国家id获取资源平台列表
export interface getPApi {
  id: number
  pid: number
  name: string
  pic: string
  createTime: string
  updateTime: string
  sort: number
  remark: string
  url: string
}

// 获取所有推广类别
export interface catereIDApi {
  id: number
  name: string
  parentId: number
}

// 添加媒体
export interface addMediaRes {
  id?: number
  countryId?: number
  sellId?: number
  promId?: number
  resourceTypeId?: number
  resourceName: string
  resourceUrl: string
  resourceFlow?: number
  flowUnit?: 'K' | 'M'
  flowAnalysis?: string
  averageView?: number
  viewUnit: 'K' | 'M'
  fan?: number
  fanUnit: 'K' | 'M'
  averagePost?: string
  communityCreateTime?: string
  price?: number
  ghostwritingPrice?: number
  adId?: number
  adSize?: string
  platforms: string
  sfId?: number
  picUrl: string
  grounding?: string
  resourceDes?: string
  serviceProviderPicUrl: string
  mediaOwnerEmail: string
  verificationCode: string
  createId: string
}

// 获取所有推广类别
export interface getCategoryListApi {
  id: number
  name: string
  sort: number
}

// 批量修改价格
export interface putUpdateMRes {
  type: string
  money: string
  ids: []
}
