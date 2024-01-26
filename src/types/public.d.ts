// 获取国家
export interface countryAPI {
  id: number
  pid: number
  name: string
  pic: string
  url: string
  createTime: null
  updateTime: string
  sort: number
  unit: string
  remark: string
}

// 获取所有营销分类
export interface catesellInfoApi {
  id: number
  name: string
}

// 获取所有推广类别
export interface catereInfoApi {
  id: number
  name: string
}

// 上传文件返回参数
export interface fileUploadApi {
  name: string
  url: string
}

// 获取所有购物平台
export interface platformInfoApi {
  id: number
  name: string
  pic: string
  picUrl: string
  url: string
}
