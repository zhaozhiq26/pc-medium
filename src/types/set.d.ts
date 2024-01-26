// 收货地址
export interface NewAddressRes {
  id?: number
  userId: string
  name: string
  mobile: string
  areaId?: string
  detailAddress: string
  defaultStatus: boolean | number
  userType: 0 | 1
}

// 查看收件人地址
export interface getShippingAddressRes {
  userId: string
  typeId: 0 | 1
}

// 修改默认选项
export interface postUpdateDefaultRes {
  oldId: number
  newId: number
}

// 查看收件人地址
export interface getShippingAddressRes {
  userId: string
  typeId: 0 | 1
}


export interface getShippingAddressApi {
  length: number
  id: number
  userId: string
  name: string
  mobile: string
  areaId?: any
  detailAddress: string
  defaultStatus: 0 | 1
  creator: string
  createTime: string
  updater: string
  updateTime: string
  deleted: boolean
  userType: 0 | 1

  find(param: (v) => boolean): any
}

// 修改默认选项
export interface postUpdateDefaultRes {
  oldId: number
  newId: number
}

// 查看收款人
export interface getViewPayeeRes {
  userId: string
  typeId: 0 | 1
}

// 新增或修改收款人信息
export interface addUserInfoRes {
  id?: number
  userId: string
  mobile?: string
  countryId: number
  idNumber?: string
  bank?: string
  cardName?: string
  cardId?: string
  defaultStatus: 0 | 1
  userTypeId: 0 | 1
}


export interface ChinaBankRes {
  settleAccountMember: {
    createId: string
    accountInfoParam: {
      cardId: string
      cardName: string
      certId: string
      telNo: string
    }
  }
}