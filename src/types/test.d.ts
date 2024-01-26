export type ApiReq<T> = {
  code: number
  msg: string
  data: T
}

export type ApiRes<T> = {
  countId: number | null
  current: number | null
  maxLimit: string | null
  optimizeCountSql: boolean
  orders: []
  pages: number | null
  records: T
  searchCount: boolean
  size: number | null
  total: number | null
}

export type ApiReq2<T> = {
  mediumRankListVOS: T
  pages: number | null
  total: number | null
}

export type ApiRes3<T> = {
  purseRecordWithdrawStatusVOList: T
  pages: number | null
  total: number | null
}