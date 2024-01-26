import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 添加媒体规则校验
export const addMediaRules = reactive({
  countryId: [{ required: true, message: '请选择国家', trigger: 'change' }],
  sellId: [{ required: true, message: '请选择媒体类别', trigger: 'change' }],
  promId: [{ required: true, message: '请选择推广类型', trigger: 'change' }],
  resourceTypeId: [
    { required: true, message: '请选择资源类型', trigger: 'change' }
  ],
  resourceName: [
    { required: true, message: '请填写资源名称', trigger: 'blur' }
  ],
  resourceUrl: [
    { required: true, message: '请填写资源地址', trigger: 'blur' },
    {
      pattern:
        /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
      message: '请填写正确的资源地址',
      trigger: 'blur'
    }
  ],
  resourceFlow: [
    { required: true, message: '请填写资源流量', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{0,2})?$/,
      message: '输入的资源流量只能为数字或两位小数',
      trigger: 'blur'
    }
  ],
  flowAnalysis: [
    { required: true, message: '请填写流量分析', trigger: 'blur' },
    {
      pattern:
        /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
      message: '请填写正确的流量分析',
      trigger: 'blur'
    }
  ],
  averageView: [
    { required: true, message: '请填写平均观看量', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{0,2})?$/,
      message: '输入的平均观看量只能为数字或两位小数',
      trigger: 'blur'
    }
  ],
  fan: [
    { required: true, message: '请填写粉丝量', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{0,2})?$/,
      message: '输入的粉丝量只能为数字或两位小数',
      trigger: 'blur'
    }
  ],
  averagePost: [
    { required: true, message: '请填写日均发帖量', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{0,7}$/,
      message: '输入的日均发帖量只能为正整数',
      trigger: 'blur'
    }
  ],
  communityCreateTime: [
    { required: true, message: '请填写社群创建时间', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{0,7}$/,
      message: '输入的社群创建时间只能为正整数',
      trigger: 'blur'
    }
  ],
  mediaClassification: [{ required: true, message: '请选择类别', trigger: 'change' }],
  price: [
    { required: true, message: '请填写报价', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{0,7}$/,
      message: '输入的报价只能为整数',
      trigger: 'blur'
    }
  ],
  ghostwritingPrice: [
    { required: true, message: '请填写报价', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{0,7}$/,
      message: '输入的报价只能为整数',
      trigger: 'blur'
    }
  ],
  adId: [{ required: true, message: '请填写广告位ID', trigger: 'blur' }],
  adSize: [{ required: true, message: '请填写广告位尺寸', trigger: 'blur' }],
  mediaCategory: [{ required: true, message: '请选择产品类目', trigger: 'change' }],
  mediaType: [{ required: true, message: '请选择类型', trigger: 'change' }],
  platforms: [{ required: true, message: '请选择购物平台', trigger: 'change' }],
  sfId: [{ required: true, message: '请选择身份', trigger: 'change' }],
  mediaOwnerEmail: [
    { required: true, message: '请填写邮箱地址', trigger: 'blur' },
    { pattern: /@/, message: '输入正确的邮箱地址', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请填写验证码', trigger: 'blur' },
    {
      pattern: /^\d+$/,
      message: '输入的验证码只能为数字',
      trigger: 'blur'
    }
  ],
  picUrl: [{ required: true, message: '', trigger: 'blur' }],
  grounding: [{ required: true, message: '请选择是否上架', trigger: 'blur' }],
  resourceDes: [{ required: true, message: '请输入资源描述', trigger: 'blur' }]
})
export const editingMediaRules = reactive({
  countryId: [{ required: true, message: '请选择国家', trigger: 'change' }],
  sellId: [{ required: true, message: '请选择媒体类别', trigger: 'change' }],
  promId: [{ required: true, message: '请选择推广类型', trigger: 'change' }],
  resourceTypeId: [
    { required: true, message: '请选择资源类型', trigger: 'change' }
  ],
  resourceName: [
    { required: true, message: '请填写资源名称', trigger: 'blur' }
  ],
  resourceUrl: [
    { required: true, message: '请填写资源地址', trigger: 'blur' },
    {
      pattern:
        /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
      message: '请填写正确的资源地址',
      trigger: 'blur'
    }
  ],
  resourceFlow: [
    { required: true, message: '请填写资源流量', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{0,2})?$/,
      message: '输入的资源流量只能为数字或两位小数',
      trigger: 'blur'
    }
  ],
  flowAnalysis: [
    { required: true, message: '请填写流量分析', trigger: 'blur' },
    {
      pattern:
        /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
      message: '请填写正确的流量分析',
      trigger: 'blur'
    }
  ],
  averageView: [
    { required: true, message: '请填写平均观看量', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{0,2})?$/,
      message: '输入的平均观看量只能为数字或两位小数',
      trigger: 'blur'
    }
  ],
  fan: [
    { required: true, message: '请填写粉丝量', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{0,2})?$/,
      message: '输入的粉丝量只能为数字或两位小数',
      trigger: 'blur'
    }
  ],
  averagePost: [
    { required: true, message: '请填写日均发帖量', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{0,7}$/,
      message: '输入的日均发帖量只能为正整数',
      trigger: 'blur'
    }
  ],
  communityCreateTime: [
    { required: true, message: '请填写社群创建时间', trigger: 'blur' },
    {
      pattern: /^[1-9]\d{0,7}$/,
      message: '输入的社群创建时间只能为正整数',
      trigger: 'blur'
    }
  ],
  mediaClassification: [{ required: true, message: '请选择类别', trigger: 'change' }],
  price: [
    { required: true, message: '请填写报价', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{0,2})?$/,
      message: '输入的报价为数字或两位小数',
      trigger: 'blur'
    }
  ],
  ghostwritingPrice: [
    { required: true, message: '请填写报价', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{0,2})?$/,
      message: '输入的报价为数字或两位小数',
      trigger: 'blur'
    }
  ],
  adId: [{ required: true, message: '请填写广告位ID', trigger: 'blur' }],
  adSize: [{ required: true, message: '请填写广告位尺寸', trigger: 'blur' }],
  mediaCategory: [{ required: true, message: '请选择产品类目', trigger: 'change' }],
  mediaType: [{ required: true, message: '请选择类型', trigger: 'change' }],
  platforms: [{ required: true, message: '请选择购物平台', trigger: 'change' }],
  sfId: [{ required: true, message: '请选择身份', trigger: 'change' }],
  mediaOwnerEmail: [
    { required: true, message: '请填写邮箱地址', trigger: 'blur' },
    { pattern: /@/, message: '输入正确的邮箱地址', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请填写验证码', trigger: 'blur' },
    {
      pattern: /^\d+$/,
      message: '输入的验证码只能为数字',
      trigger: 'blur'
    }
  ],
  picUrl: [{ required: true, message: '', trigger: 'blur' }],
  grounding: [{ required: true, message: '请选择是否上架', trigger: 'blur' }],
  resourceDes: [{ required: true, message: '请输入资源描述', trigger: 'blur' }]
})

// 社群校验
export const webUrl = [
  'https://www.facebook.com',
  'http://www.facebook.com',
  'https://vk.com',
  'http://vk.com',
  'https://t.me',
  'http://t.me',
  'https://chat.whatsapp.com',
  'http://chat.whatsapp.com',
  'https://www.youtube.com',
  'http://www.youtube.com',
  'https://www.tiktok.com',
  'http://www.tiktok.com',
  'https://m.kwai.com',
  'http://m.kwai.com',
  'https://www.pinterest.com',
  'http://www.pinterest.com',
  'https://www.instagram.com',
  'http://www.instagram.com'
]

// 上传图片限制
export const beforeAvatarUpload = (file: any) => {
  const types = ["image/jpg", "image/png", "image/jpeg"]
  const isJPG = types.includes(file.type)
  const isLt800K = file.size / 1024 < 800
  if (!isJPG) {
    ElMessage.error('上传图片格式仅支持JPG/PNG!');
    return false
  }
  if (!isLt800K) {
    ElMessage.error('上传图片大小不能超过 800KB!');
    return false
  }
}