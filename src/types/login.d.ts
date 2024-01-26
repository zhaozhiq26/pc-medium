// 登录
export interface loginRes {
  username: string
  password: string
  type: 0 | 1
}

export interface registerApi {
  access_token: string
  expires_in: number
}

// 微信登录
export interface wxLoginRes {
  code: string
  ticket: string
  url: string
}

export interface wxLogin1Res {
  access_token: string
}

// 手机注册
export interface registerRes {
  countryId: string | undefined
  code: string
  username?: string
  email?: string
  password: string
  confirmPassword: string
  type: 0 | 1
}

// 邮箱注册
export interface EmRegisterRes {
  countryId: string
  code: string
  email: string
  password: string
  confirmPassword: string
  userId?: string
  type: 0 | 1
}

// 忘记密码
export interface forgetPasswordRes {
  code: string
  number: string
  password: string
  type: number
}
