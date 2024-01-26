<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
import { ref, reactive, toRefs } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { editingMediaRules, webUrl, beforeAvatarUpload } from '@/utils/rule'
import {
  fileUploadAPI,
  fileUploadAPI1,
  getCatesellAPI,
  getCountryAPI,
  getPlatformAPI
} from '@/api/public'
import {
  getByIdAPI,
  getCategoryListAPI,
  getCatestAPI,
  getClassificationListAPI,
  getPAPI,
  getTypeListAPI,
  mediaEmail,
  putMediaInfoAPI
} from '@/api/media'

const ywFan = ref()
const typeList = ref()
const route = useRoute()
const catereInfo = ref()
const countryInfo = ref()
const catesellInfo = ref()
const platformInfo = ref()
const categoryList = ref()
const disabledT = ref(false)
const forbidden = ref(false)
const FacebookYW = ref(true)
const priceName = ref('报价 ')
const dialogImageUrl = ref('')
const resourceTypeInfo = ref()
const codeDisabled = ref(false)
const exceedBoolean = ref(true)
const ClassificationList = ref()
const userStore = useUserStore()
const dialogVisible = ref(false)
const ruleRef = ref<FormInstance>()
const serverImg = ref<string[]>([])
const serverImage = ref<any>([])
const emits = defineEmits(['AddMedias1', 'AddMedias2'])
const props = defineProps({
  mediaInfo: Number
})
const { mediaInfo } = toRefs(props)
const ywForm = ref({
  createId: userStore.userInfo?.userId,
  countryId: undefined,
  sellId: undefined,
  promId: undefined,
  resourceTypeId: undefined,
  resourceName: '',
  resourceUrl: '',
  resourceFlow: '',
  flowUnit: 'k',
  flowAnalysis: '',
  averageView: '',
  viewUnit: 'k',
  mediaClassification: undefined,
  fan: '',
  fanUnit: 'k',
  averagePost: '',
  communityCreateTime: '',
  price: '',
  ghostwritingPrice: '',
  adId: '',
  mediaCategory: [],
  mediaType: [],
  platforms: [],
  sfId: undefined,
  adSize: '',
  mediaOwnerEmail: '',
  verificationCode: '',
  picUrl: '',
  serviceProviderPicUrl: '',
  grounding: 1,
  resourceDes: ''
})

const sms = reactive({
  disabled: false,
  total: 60,
  count: 0
})
// 返回
const YouWei = () => {
  emits('AddMedias1')
  ruleRef.value!.resetFields()
}
// 获取国家
const countryChange = async () => {
  const res = await getCountryAPI()
  countryInfo.value = res.data
}

// 根据国家id获取资源平台列表
const getPInfo = async () => {
  forbidden.value = false
  ywForm.value.promId = undefined
  ywForm.value.resourceTypeId = undefined
  const res = await getPAPI(ywForm.value.countryId!)
  resourceTypeInfo.value = res.data
}

// 获取资源分类
const catesell = async () => {
  const res = await getCatesellAPI()
  catesellInfo.value = res.data
}

// 根据媒体分类ID获取对应推广类别
const getSellId = async () => {
  ywForm.value.adSize = ''
  forbidden.value = false
  ywForm.value.promId = undefined
  const res = await getCatestAPI({
    pid: ywForm.value.sellId
  })
  catereInfo.value = res.data
}

// 获取购物平台
const addPlatform = async () => {
  const res = await getPlatformAPI()
  platformInfo.value = res.data
}

// 获取产品类别列表
const classification = async () => {
  const res = await getClassificationListAPI()
  ClassificationList.value = res.data
}

// 获取产品类目和类型
const product = async () => {
  const res = await getCategoryListAPI()
  categoryList.value = res.data
  const res2 = await getTypeListAPI()
  typeList.value = res2.data
}

// 判断当推广类别不为文章
const getPromId = async () => {
  forbidden.value = false
  ywForm.value.adId = ''
  ywForm.value.adSize = ''
  ywForm.value.mediaType = []
  ywForm.value.platforms = []
  ywForm.value.mediaCategory = []
  ywForm.value.mediaClassification = undefined
  if (ywForm.value.promId !== 3) {
    ywForm.value.price = ''
    ywForm.value.ghostwritingPrice = ''
    priceName.value = '报价 '
    if (ywForm.value.promId === 7) {
      promId7()
      wipeData()
      ywForm.value.platforms = []
      product()
    }
  } else {
    priceName.value = '报价（￥用户提供文章）'
  }
}

// 判断当推广类别为买家秀
const promId7 = () => {
  forbidden.value = true
  if (resourceTypeInfo.value) {
    ywForm.value.resourceTypeId = undefined
    const screenObj = resourceTypeInfo.value.find(
      (v: any) => v.name === '买家秀'
    )
    if (screenObj) {
      ywForm.value.resourceTypeId = screenObj.id
      FacebookYW.value = true
      ywForm.value.fan = ''
      ywForm.value.averagePost = ''
      ywForm.value.communityCreateTime = ''
    } else {
      ElMessage.warning('该国家地区暂无买家秀，请更换推广类别或国家地区')
    }
  }
}

// 判断当资源类型为Facebook
const screenTo = (id: any) => {
  const screenObj = resourceTypeInfo.value.find((v: any) => v.id === id)
  if (screenObj.name === 'Facebook') {
    FacebookYW.value = false
    ywForm.value.averageView = ''
    ywForm.value.resourceFlow = ''
    ywForm.value.flowAnalysis = ''
  } else {
    FacebookYW.value = true
    // ywForm.value.fan = ''
    ywForm.value.averagePost = ''
    ywForm.value.communityCreateTime = ''
  }
}
// 社群链接校验
const foEachTo = () => {
  const ywBlod = webUrl.some(i => ywForm.value.resourceUrl.includes(i))
  if (ywBlod) {
    exceedBoolean.value = false
    wipeData()
  } else {
    exceedBoolean.value = true
    wipeData()
  }
}

// 社群链接校验
const foEachTo1 = () => {
  const ywBlod = webUrl.some(i => ywForm.value.resourceUrl.includes(i))
  if (ywBlod) {
    exceedBoolean.value = false
  } else {
    exceedBoolean.value = true
  }
}

const wipeData = () => {
  ywForm.value.averageView = ''
  ywForm.value.fan = ''
  ywForm.value.resourceFlow = ''
  ywForm.value.flowAnalysis = ''
  ywForm.value.averagePost = ''
  ywForm.value.communityCreateTime = ''
}

// 身份发生改变清除数据
const conceal = () => {
  serverImg.value = []
  serverImage.value = []
  ywForm.value.serviceProviderPicUrl = ''
  ywForm.value.mediaOwnerEmail = ''
  ywForm.value.verificationCode = ''
}

// 计时器处理器
const timerHandler = () => {
  sms.count = sms.total
  sms.disabled = true
  let timer = setInterval(() => {
    if (sms.count > 1 && sms.count <= sms.total) {
      sms.count--
    } else {
      sms.disabled = false
      clearInterval(timer)
    }
  }, 1000)
}

// 获取邮箱验证码
const EMailBtn = () => {
  if (ywForm.value.mediaOwnerEmail === '') {
    ElMessage.error('邮箱地址不能为空!')
    return
  } else if (!/@/.test(<string>ywForm.value.mediaOwnerEmail)) {
    return
  }
  timerHandler()
  codeDisabled.value = false
  mediaEmail(ywForm.value.mediaOwnerEmail)
}

// 当邮箱发生改变时清空验证码
const codeNum = () => {
  ywForm.value.verificationCode = ''
  codeDisabled.value = false
}

// 定义超出3张照片的行为
const handleExceed = () => ElMessage.warning(`上传最大的照片为3张`)

const beforeUpload = async (options: any) => {
  new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.src = window.URL.createObjectURL(options.file)
    img.onload = async () => {
      if (img.width !== img.height) {
        ElMessage.warning('建议上传的图片长和宽相等')
        resolve()
      } else {
        resolve()
      }
      let formData = new FormData()
      formData.append('file', options.file)
      const res = await fileUploadAPI(formData)
      const url: any = {
        url: res.data.url.replace(/,/g, ''),
        uid: options.file.uid
      }
      serverImage.value.push(url)
      ywForm.value.serviceProviderPicUrl = serverImage.value
        .map((i: any) => {
          return i.url
        })
        .join(',')
    }
  })
}

// 删除上传的图片
const handleRemove1 = (file: any) => {
  serverImage.value.forEach((v: any, index: any) => {
    if (v.uid == file.uid) {
      serverImage.value.splice(index, 1)
    }
  })
  ywForm.value.serviceProviderPicUrl = serverImage.value
    .map((i: any) => {
      return i.url
    })
    .join(',')
}

// 查看图片
const handlePictureCard = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 上传照片
const httpAvatarUpload = async (options: any) => {
  new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.src = window.URL.createObjectURL(options.file)
    img.onload = async () => {
      if (img.width !== img.height) {
        ElMessage.warning('建议上传的图片长和宽相等')
        resolve()
      } else {
        resolve()
      }
      const res = await fileUploadAPI1(options.file)
      ywForm.value.picUrl = res.data.url
    }
  })
}

// 提交审核
const submitYW = async () => {
  disabledT.value = true
  if (ywForm.value.mediaType) {
    ywForm.value.mediaType =
      ywForm.value.mediaType.length > 0
        ? ywForm.value.mediaType.join(',')
        : (null as any)
  }
  if (ywForm.value.mediaCategory) {
    ywForm.value.mediaCategory =
      ywForm.value.mediaCategory.length > 0
        ? ywForm.value.mediaCategory.join(',')
        : (null as any)
  }
  await putMediaInfoAPI(<any>{
    ...ywForm.value,
    platforms: ywForm.value.platforms.join(','),
    serviceProviderPicUrl:
      ywForm.value.serviceProviderPicUrl === ''
        ? null
        : ywForm.value.serviceProviderPicUrl,
    resourceUrl: ywForm.value.resourceUrl.endsWith('/')
      ? ywForm.value.resourceUrl
      : ywForm.value.resourceUrl + '/'
  })
    .then(() => {
      ElMessage.success('媒体资源修改成功')
      disabledT.value = false
      serverImg.value = []
      ywForm.value.adSize = ''
      ywForm.value.promId = undefined
      ywForm.value.serviceProviderPicUrl = ''
      ruleRef.value!.resetFields()
      // debugger
      emits('AddMedias2')
    })
    .catch(() => {
      disabledT.value = false
    })
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (ywForm.value.picUrl !== '') {
      if (valid) {
        if (ywForm.value.promId) {
          if (ywForm.value.sfId === 3) {
            if (ywForm.value.serviceProviderPicUrl) {
              submitYW()
            } else {
              ElMessage.error('验证图片不能为空')
              return false
            }
          } else {
            submitYW()
          }
        } else {
          ElMessage.error('推广类别不能为空')
        }
      }
    } else {
      ElMessage.error('资源主图不能为空')
    }
  })
}

// 取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  ywForm.value.promId = undefined
  emits('AddMedias1')
}

// 粘贴资源主图
const handlePaste = async (e: any) => {
  let clipboardData = e.clipboardData // IE
  if (!clipboardData) {
    clipboardData = e.originalEvent.clipboardData
  }
  const items = (e.clipboardData || e.originalEvent.clipboardData).items
  let file: any = null
  if (!items || items.length === 0) {
    ElMessage.error('当前浏览器不支持粘贴本地图片，请打开图片复制后再粘贴！')
    return
  }
  // 搜索剪切板items
  for (let i = 0; i < items.length; i++) {
    // 限制上传文件类型
    if (items[i].type.indexOf('image') !== -1) {
      file = items[i].getAsFile()
      break
    }
  }
  if (file) {
    const types = ['image/jpg', 'image/png', 'image/jpeg']
    const isJPG = types.includes(file.type)
    const isLt800K = file.size / 1024 < 800
    if (isJPG) {
      if (!isLt800K) {
        ElMessage.error('上传的图片大小不能超过 800KB!')
        return false
      }
      new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.src = window.URL.createObjectURL(file)
        img.onload = async () => {
          if (img.width !== img.height) {
            ElMessage.warning('建议上传的图片长和宽相等')
            resolve()
          } else {
            resolve()
          }
          const res = await fileUploadAPI1(file)
          ywForm.value.picUrl = res.data.url
        }
      })
    } else {
      ElMessage.error('上传格式只能为JPG/PNG!')
      return false
    }
  }
}
const getMedia = async (val: any) => {
  catesell()
  countryChange()
  const res = await getByIdAPI(val)
  ywForm.value = res.data
  ywFan.value = res.data.fan
  ywForm.value.platforms = res.data.platforms
    .split(',')
    .map((v: any) => Number(v))
  if (res.data.mediaCategory) {
    ywForm.value.mediaCategory = res.data.mediaCategory
      .split(',')
      .map((v: any) => Number(v))
  }
  if (res.data.mediaType) {
    ywForm.value.mediaType = res.data.mediaType
      .split(',')
      .map((v: any) => Number(v))
  }
  if (ywForm.value.verificationCode) {
    codeDisabled.value = true
  }
  if (ywForm.value.countryId) {
    const res = await getPAPI(ywForm.value.countryId!)
    resourceTypeInfo.value = res.data
    const res2 = await getCatestAPI({
      pid: ywForm.value.sellId
    })
    catereInfo.value = res2.data
    if (ywForm.value.promId === 7) {
      product()
      classification()
      forbidden.value = true
    } else {
      foEachTo1()
    }
  }
  ywForm.value.promId = res.data.promId
  ywForm.value.resourceTypeId = res.data.resourceTypeId
  if (ywForm.value.serviceProviderPicUrl) {
    const urlImg = ywForm.value.serviceProviderPicUrl.split(',')
    const ArrImg = ref<any[]>([])
    for (let i = <any>1; i < urlImg.length + 1; i++) {
      ArrImg.value.push(i)
    }
    serverImg.value = <any>ArrImg.value.map((v, i) => {
      return {
        uid: v,
        url: urlImg[i]
      }
    })
    serverImage.value = serverImg.value
  }
  screenTo(ywForm.value.resourceTypeId)
  ywForm.value.fan = ywFan.value
}
getMedia(mediaInfo?.value)
addPlatform()
</script>

<template>
  <div
    class="add_media yw_box"
    :class="{ background: route.path === '/add/media' }"
  >
    <div class="add_media_top">
      <span class="add_media_top_left" @click="YouWei">
        <i-ep-arrow-left />编辑媒体资源
      </span>
    </div>
    <div class="add_media_bottom">
      <el-scrollbar height="840px">
        <el-form
          @paste.enter="handlePaste"
          :rules="editingMediaRules"
          style="width: 1183px"
          label-position="top"
          label-width="100px"
          :model="ywForm"
          :inline="true"
          ref="ruleRef"
        >
          <el-form-item label="国家/地区" prop="countryId">
            <el-select
              v-model="ywForm.countryId"
              placeholder="请选择国家/地区"
              @change="getPInfo"
              @focus="countryChange"
            >
              <el-option
                v-for="i in countryInfo"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="资源分类&推广类别" prop="sellId">
            <el-select
              v-model="ywForm.sellId"
              placeholder="请选择媒体类别"
              @change="getSellId"
              @focus="catesell"
            >
              <el-option
                v-for="i in catesellInfo"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
            <el-select
              v-model="ywForm.promId"
              class="select_right"
              placeholder="请选择推广类别"
              @change="getPromId"
            >
              <el-option
                v-for="i in catereInfo"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="资源类型" prop="resourceTypeId">
            <el-select
              :disabled="forbidden"
              @change="screenTo(ywForm.resourceTypeId)"
              v-model="ywForm.resourceTypeId"
              placeholder="请选择资源类型"
            >
              <el-option
                v-for="i in resourceTypeInfo"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="资源名称" prop="resourceName">
            <el-input
              v-model="ywForm.resourceName"
              placeholder="请填写资源名称"
            />
          </el-form-item>

          <el-form-item
            label="资源链接Url"
            v-if="ywForm.promId !== 7"
            prop="resourceUrl"
          >
            <el-input
              v-model.trim="ywForm.resourceUrl"
              placeholder="示例 https://www.amazon.com"
              @change="foEachTo"
              @blur="foEachTo"
            />
          </el-form-item>
          <el-form-item label="资源链接Url" v-else prop="resourceUrl">
            <el-input
              v-model.trim="ywForm.resourceUrl"
              placeholder="示例 https://www.amazon.com"
            />
          </el-form-item>

          <el-form-item>
            <div style="width: 368px; height: 32px" />
          </el-form-item>

          <div v-if="FacebookYW">
            <div v-if="ywForm.promId !== 7">
              <el-form-item
                label="资源流量"
                prop="resourceFlow"
                v-if="exceedBoolean"
              >
                <el-input
                  v-model="ywForm.resourceFlow"
                  placeholder="请填写资源流量"
                >
                  <template #append>
                    <el-select v-model="ywForm.flowUnit" style="width: 60px">
                      <el-option label="k" value="k" />
                      <el-option label="M" value="M" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <div v-if="FacebookYW">
            <div v-if="ywForm.promId !== 7">
              <el-form-item
                label="流量分析"
                prop="flowAnalysis"
                v-if="exceedBoolean"
              >
                <el-input
                  v-model.trim="ywForm.flowAnalysis"
                  placeholder="填写媒体在similarweb链接"
                />
              </el-form-item>
            </div>
          </div>

          <div v-if="FacebookYW">
            <div v-if="ywForm.promId !== 7">
              <el-form-item
                label="平均观看量"
                prop="averageView"
                v-if="!exceedBoolean"
              >
                <el-input
                  v-model="ywForm.averageView"
                  placeholder="请填写平均观看量"
                >
                  <template #append>
                    <el-select v-model="ywForm.viewUnit" style="width: 60px">
                      <el-option label="k" value="k" />
                      <el-option label="M" value="M" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <div v-if="FacebookYW">
            <div v-if="ywForm.promId !== 7">
              <el-form-item label="粉丝量" prop="fan" v-if="!exceedBoolean">
                <el-input v-model="ywForm.fan" placeholder="请填写粉丝量">
                  <template #append>
                    <el-select v-model="ywForm.fanUnit" style="width: 60px">
                      <el-option label="k" value="k" />
                      <el-option label="M" value="M" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <el-form-item
            label="类别"
            prop="mediaClassification"
            v-if="ywForm.promId === 7"
          >
            <el-select
              v-model="ywForm.mediaClassification"
              placeholder="请选择类别"
              @focus="classification"
            >
              <el-option
                v-for="i in ClassificationList"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>

          <!-- 当为买家秀只显示粉丝量 -->
          <el-form-item
            label="粉丝量"
            prop="fan"
            v-if="ywForm.promId === 7 || !FacebookYW"
          >
            <el-input v-model="ywForm.fan" placeholder="请填写粉丝量">
              <template #append>
                <el-select v-model="ywForm.fanUnit" style="width: 60px">
                  <el-option label="k" value="k" />
                  <el-option label="M" value="M" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item
            label="日均发帖量"
            prop="averagePost"
            v-if="!FacebookYW"
          >
            <el-input
              style="width: 358px"
              v-model="ywForm.averagePost"
              placeholder="请填写日均发帖量"
            >
              <template #append> 贴 </template>
            </el-input>
          </el-form-item>

          <el-form-item
            label="社群创建时间"
            prop="communityCreateTime"
            v-if="!FacebookYW"
          >
            <el-input
              style="width: 358px"
              v-model="ywForm.communityCreateTime"
              placeholder="请填写社群创建时间"
            >
              <template #append> 年 </template>
            </el-input>
          </el-form-item>

          <div class="home_price_box">
            <el-form-item :label="priceName" prop="price">
              <el-input
                :maxlength="11"
                onkeyup="value=value.replace(/^0+/g,'')"
                v-model="ywForm.price"
                placeholder="请填写报价"
              />
            </el-form-item>
          </div>

          <div class="home_price_box" v-if="ywForm.promId === 3">
            <el-form-item label="报价（￥编辑代写）" prop="ghostwritingPrice">
              <el-input
                :maxlength="11"
                onkeyup="value=value.replace(/^0+/g,'')"
                v-model="ywForm.ghostwritingPrice"
                placeholder="请填写报价"
              />
            </el-form-item>
          </div>

          <el-form-item v-if="ywForm.promId === 5">
            <div style="width: 368px; height: 32px" />
          </el-form-item>

          <el-form-item
            label="广告栏所在位置 "
            prop="adId"
            v-if="ywForm.promId === 5"
          >
            <el-select v-model="ywForm.adId" placeholder="请选择广告栏所在位置">
              <el-option :value="1" label="背景板" />
              <el-option :value="2" label="顶部栏" />
              <el-option :value="3" label="侧边栏" />
              <el-option :value="4" label="腰部栏" />
              <el-option :value="5" label="移动端横幅" />
              <el-option :value="6" label="网站弹窗" />
            </el-select>
          </el-form-item>

          <el-form-item label="广告栏尺寸（长*宽）" v-if="ywForm.promId === 5">
            <el-input
              v-model="ywForm.adSize"
              placeholder="请填写广告栏尺寸（长*宽）"
            />
          </el-form-item>

          <div class="platforms_box" v-if="ywForm.promId === 7">
            <el-form-item
              label="产品类目(可多选、注：最多显示5个 请选择最符合自己的类目)"
              prop="mediaCategory"
            >
              <el-checkbox-group v-model="ywForm.mediaCategory">
                <el-checkbox
                  v-for="(i, index) in categoryList"
                  :key="index"
                  :label="i.id"
                  name="mediaCategory"
                >
                  {{ i.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <div class="platforms_box" v-if="ywForm.promId === 7">
            <el-form-item
              label="类型(可多选、注：最多显示5个   请选择最符合自己的类目)"
              prop="mediaType"
            >
              <el-checkbox-group v-model="ywForm.mediaType">
                <el-checkbox
                  v-for="(i, index) in typeList"
                  :key="index"
                  :label="i.id"
                  name="mediaType"
                >
                  {{ i.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <div class="platforms_box" v-if="ywForm.promId !== 7">
            <el-form-item
              class="paltfoems_box"
              label="支持的购物平台（多选）"
              prop="platforms"
            >
              <el-checkbox-group v-model="ywForm.platforms">
                <el-checkbox
                  v-for="(i, index) in platformInfo"
                  :key="index"
                  :label="i.id"
                  name="platforms"
                >
                  <span class="e_commerce_icon">
                    <img :src="i.pic" alt="" />
                  </span>
                  &nbsp;&nbsp;{{ i.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <div class="platforms_box" v-if="ywForm.promId === 7">
            <el-form-item
              class="paltfoems_box"
              label="支持的购物平台（多选）"
              prop="platforms"
            >
              <el-checkbox-group :min="0" :max="3" v-model="ywForm.platforms">
                <el-checkbox
                  v-for="(i, index) in platformInfo"
                  :key="index"
                  :label="i.id"
                  name="platforms"
                >
                  <span class="e_commerce_icon">
                    <img :src="i.pic" alt="" />
                  </span>
                  &nbsp;&nbsp;{{ i.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <el-form-item label="选择身份" prop="sfId">
            <el-select
              v-model="ywForm.sfId"
              placeholder="请选择身份"
              @change="conceal"
            >
              <el-option :value="1" label="媒体主" />
              <el-option :value="2" label="自营" />
              <el-option :value="3" label="服务商" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="官方邮箱"
            prop="mediaOwnerEmail"
            v-if="ywForm.sfId === 1"
          >
            <el-input
              style="width: 358px"
              @change="codeNum"
              v-model="ywForm.mediaOwnerEmail"
              placeholder="请输入官方邮箱"
            >
              <template #suffix>
                <el-button
                  v-if="!sms.disabled"
                  class="e_mail_btn e_mail_btn_1"
                  text
                  type="primary"
                  @click="EMailBtn"
                >
                  获取验证码
                </el-button>
                <el-button
                  v-else
                  class="e_mail_btn e_mail_btn_1"
                  disabled
                  text
                  type="primary"
                >
                  {{ sms.count }} 秒后重新发送
                </el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item
            label="验证码"
            prop="verificationCode"
            v-if="ywForm.sfId === 1"
          >
            <el-input
              style="width: 358px"
              :disabled="codeDisabled"
              v-model="ywForm.verificationCode"
              placeholder="请输入验证码"
            />
          </el-form-item>

          <el-form-item v-if="ywForm.sfId !== 1">
            <div style="width: 668px; height: 32px" />
          </el-form-item>

          <div class="platforms_box" v-if="ywForm.sfId === 3">
            <el-form-item>
              <el-upload
                drag
                multiple
                action=""
                :limit="3"
                class="upload-sfId"
                list-type="picture-card"
                accept=".jpeg,.png,.jpg"
                :on-exceed="handleExceed"
                :on-remove="handleRemove1"
                :http-request="beforeUpload"
                v-model:file-list="serverImg"
                :on-preview="handlePictureCard"
                :before-upload="beforeAvatarUpload"
              >
                <div class="sfid_tetx_title">支持 JPG 或 PNG 格式</div>
                <div class="el-upload__text sfid_tetx">
                  <i
                    v-if="!ywForm.serviceProviderPicUrl"
                    class="iconfont icon-shangchuan sfid_icon"
                  />
                  <em>点击上传</em>，拖动图片到这里
                </div>
              </el-upload>
              <el-dialog v-model="dialogVisible" width="300">
                <img :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </div>

          <el-form-item label="资源主图（1张）" prop="picUrl">
            <el-upload
              drag
              action=""
              class="avatar-uploader"
              :show-file-list="false"
              accept=".jpeg,.png,.jpg"
              :http-request="httpAvatarUpload"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="ywForm.picUrl"
                :src="ywForm.picUrl"
                alt=""
                class="avatar"
              />
              <div class="uploader_box">
                <i v-if="!ywForm.picUrl" class="iconfont icon-shangchuan" />
                <div v-if="!ywForm.picUrl" class="uploader_code">点击上传</div>
                <div v-if="!ywForm.picUrl" class="uploader_code1">CTRL+V或</div>
                <div v-if="!ywForm.picUrl">拖动图片到这里</div>
              </div>
              <template #tip>
                <div class="el-upload__tip">支持jpg、png格式</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <div style="width: 868px; height: 32px" />
          </el-form-item>

          <el-form-item class="grounding_box" label="是否上架" prop="grounding">
            <el-radio-group v-model="ywForm.grounding">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <div style="width: 868px; height: 32px" />
          </el-form-item>

          <el-form-item label="资源描述" prop="resourceDes">
            <el-input
              v-model="ywForm.resourceDes"
              maxlength="2550"
              show-word-limit
              class="textarea_box"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <div class="Fixed">
      <el-button
        :disabled="disabledT"
        type="primary"
        @click="onSubmit(ruleRef)"
      >
        保存
      </el-button>
      <el-button @click="resetForm(ruleRef)">取消</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.background {
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0 12px 0;
}
.add_media {
  margin: 0 auto;
  position: relative;
  padding: 15px 30px 0;
  .add_media_top {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    .add_media_top_left {
      width: 105px;
      display: flex;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      align-items: center;
      svg {
        width: 1em;
        height: 1em;
      }
    }
    .add_media_top_right {
      margin-left: 10px;
      font-weight: bold;
      color: var(--yw-text-f00);
    }
  }
  .add_media_bottom {
    :deep(.el-form) {
      .el-form-item__label {
        font-weight: normal;
        color: var(--yw-text-111);
      }

      .el-select,
      .el-input {
        width: 368px;
        height: 32px;
      }
      .el-input-group__append {
        width: 60px;

        .el-input {
          width: 60px;
          height: 32px;
        }
        .el-input__wrapper {
          box-shadow: none;
        }
      }
      .platforms_box {
        width: 1183px;

        .e_commerce_icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-bottom: -5px;
        }
      }
      .e_mail_btn {
        height: 30px;
        margin-right: -9px;
      }
    }
    .upload-sfId {
      height: 120px;
      box-sizing: border-box;

      :deep(.el-upload-list) {
        height: 100%;

        .el-upload {
          width: 300px;
          height: 100%;

          .el-upload-dragger {
            padding: 27px 0;
            border: none;

            .sfid_tetx_title {
              font-size: 14px;
              font-weight: 400;
              color: var(--yw-text-555);
            }

            .sfid_tetx {
              display: flex;
              align-items: center;
              justify-content: center;

              .sfid_icon {
                font-size: 16px;
                color: var(--yw-primary);
                margin-right: 5px;
              }
            }
          }
        }

        .el-upload-list__item {
          width: 120px;
          height: 120px;
          margin-bottom: 0;
        }
      }
    }
    :deep(.el-upload-list__item .el-icon--close-tip) {
      display: none !important;
    }
    .avatar-uploader {
      font-size: 12px;
      line-height: 12px;

      :deep(.el-upload) {
        border: 2px solid var(--yw-bg-dcdee0);
        width: 110px;
        height: 110px;
        border-radius: 4px;

        .el-upload-dragger {
          padding: 0;
          background: var(--yw-bg-f8f8f8);
          width: 100%;
          height: 100%;
          border: none;

          .uploader_box {
            margin-top: 15px;

            .icon-shangchuan {
              font-size: 20px;
              line-height: 20px;
              color: var(--yw-primary);
            }

            .uploader_code {
              margin: 5px 0;
              color: var(--yw-primary);
            }

            .uploader_code1 {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
    .grounding_box {
      display: flex;
      align-items: center;

      :deep(.el-form-item__label) {
        margin-bottom: 0;
      }
    }
    .textarea_box {
      width: 1183px;
      height: 120px;

      :deep(.el-textarea__inner) {
        height: 120px;
      }
    }
    .home_price_box {
      :deep(label) {
        &::after {
          content: '报价包含3%的服务费';
          color: var(--yw-text-f3294d);
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
  }
  .Fixed {
    position: absolute;
    left: 65px;
    bottom: 15px;

    .el-button {
      width: 119px;
      height: 32px;
    }
  }
}
</style>
