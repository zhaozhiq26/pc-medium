// 开票

export interface listByMediaIdRes {
    pageNum: number
    pageSize: number
    status: number
    userId?: string | undefined
    startTime?: string | undefined
    endTime?: string | undefined
}

export interface listByMediaIdReq {
    createId: number // 媒体媒体创建人id
    createTime: string // 创建时间
    file: string // 发票文件
    id: number
    money: number // 金额
    orderId: string
    orderItemId: string
    remark: string // 驳回备注
    status: 0 | 1 | 2 // 0-已开票,1-开票中,2-驳回
    titleAddress: string // 地址
    titleBank: string // 银行名称
    titleCard: string // 银行卡号
    titleCompanyName: string // 企业名称
    titleEmail: string // 邮箱
    titleId: number // 抬头id
    titleIdNumber: string // 身份证号
    titlePhone: string // 手机号
    titleSucc: string // 社会统一信用代码
    titleType: 0 | 1 // 抬头类型,0-个人,1-企业
    titleTypeName: string // 抬头类型名称
    titleUserName: string // 个人抬头名称
    tradeId: string
    type: 0 | 1 // 0-电子,1-纸质
    updateTime: string // 修改时间
    userId: string // 用户id
}

// 编辑开票
export interface updateByMediaIdRes {
    id: number
    file?: string | null
    status: 0 | 1 | 2 // 0-已开票,1-开票中,2-驳回
    remark?: string | null
}
