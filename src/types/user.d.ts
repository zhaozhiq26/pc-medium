// 根据用户名获取用户信息
export interface userNameInfoApi {
  avatar: string
  bindEmail: boolean
  bindIphone: boolean
  bindWx: boolean
  chatTool: string
  chatToolId: string
  countryId: number
  countryName: string
  createBy: string
  createTime: string
  delFlag: string
  email: string
  loginDate: string
  loginIp: string
  loginType: string
  nickName: string
  openId: string
  password: string
  phonenumber: string
  remark: string
  sex: string
  startOrdersDate: string
  startTakingOrders: string
  status: string
  updateBy: string
  updateTime: string
  userId: string
  userName: string
  userType: string
}

// 查看流水
export interface toUserInfoRes {
  pageNum: number
  pageSize: number
  startTime?: string | undefined
  endTime?: string | undefined
}

// 账户流水
export interface AccountCenterApi {
  asType: string
  balanceBefore?: string
  balanceAfter?: string
  cardNumber?: string
  createTime: string
  customerName: string
  id: number
  incomeBefore: string
  incomeAfter: string
  money: string
  orderId: string
  remark?: string
  status: number
  statusName?: string
  tradeId: string
  type: number
  updateTime: string
  userId: string
  userTypeId: 0 | 1
}

// 我的收入
export interface revenueApi{
  id: number,
  userId: string,
  userTypeId: number,
  income: string,
  balance: string,
  createTime: string,
  updateTime: string
}

// 个人信息
export interface UserInfoRes {
  userId: number
  avatar: string | null
  userName: string
  nickName: string | null
  email: string | null
  sex: string | null
  phonenumber: string | null
  chatToolId: string | null
  chatTool: string
}

// 安全中心-修改密码
export interface PasswordRes {
  userId: number
  password: string
  newPassWord: string
  confirmPassWord: string
}