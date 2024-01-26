<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import type { getOrderlistApi } from '@/types/order'

const { toClipboard } = useClipboard()
const drawer = ref(false)
let drawerInfo = reactive<getOrderlistApi>({
  id: '',
  memberId: '',
  orderSn: '',
  createTime: '',
  totalAmount: 0,
  status: 0,
  note: '',
  coupon: '',
  screenshot: '',
  completeLink: '',
  secondScreenshot: '',
  secondCompleteLink: '',
  resourceId: 0,
  appointmentReleaseTime: '',
  orderType: 0,
  feedbackNotes: '',
  secondFeedbackNotes: '',
  resourceName: '',
  resourceTitle: '',
  resourceUrl: '',
  picUrl: '',
  resourceDes: '',
  avatar: '',
  sellName: '',
  sellId: 0,
  history: [],
  price: '',
  sfId: 0,
  sfName: '',
  startTime: '',
  endTime: '',
  completeLinkList: [],
  secondCompleteLinkList: [],
  countryName: '',
  countryPic: '',
  platformsName: '',
  platformsPic: '',
  unit: '',
  payStatus: 0,
  promId: 0,
  articleType: 0,
  promotionName: '',
  banner: '',
  pic: '',
  remark: '',
  discountCode: '',
  variableBody: '',
  handAmount: '',
  articleContent: '',
  couponNote: '',
  code: ''
})

// 复制
const handle = (v: any) => {
  toClipboard(v)
  ElMessage.success('复制成功')
}

const handleClose = () => (drawer.value = false)

const handleDrawer = (val: any) => {
  drawer.value = true
  if (val.completeLink) {
    val.completeLink =
      val.completeLink.substr(0, 8).toLowerCase() == 'https://'
        ? val.completeLink
        : 'https://' + val.completeLink
  } else if (val.secondCompleteLink) {
    val.secondCompleteLink =
      val.secondCompleteLink.substr(0, 8).toLowerCase() == 'https://'
        ? val.secondCompleteLink
        : 'https://' + val.secondCompleteLink
  }
  drawerInfo = {
    ...val,
    banner: val.banner.split(',')
  }
}
defineExpose({
  handleDrawer
})
</script>

<template>
  <div class="drawer_box">
    <el-drawer
      v-model="drawer"
      :before-close="handleClose"
      close-on-click-modal
    >
      <div class="drawer_body">
        <div class="drawer_title">
          <span class="drawer_title_left"></span>
          <span class="drawer_title_right">订单信息</span>
        </div>
        <div class="drawer_content">
          <div class="drawer_content_box">
            <span class="drawer_content_left">资源名称</span>
            <span class="drawer_content_right">{{
              drawerInfo.resourceName
            }}</span>
          </div>
          <div class="drawer_content_xbox">
            <div class="drawer_content_box">
              <span class="drawer_content_left">国家/地区</span>
              <span class="drawer_content_right drawer_content_right1">
                <img :src="drawerInfo.countryPic" alt="" />
                <span>{{ drawerInfo.countryName }}</span>
              </span>
            </div>

            <div class="drawer_content_box">
              <span class="drawer_content_left">购物平台</span>
              <div class="drawer_content_right drawer_content_right1">
                <img :src="drawerInfo.platformsPic" alt="" />
                <span class="drawer_content_right">{{
                  drawerInfo.platformsName
                }}</span>
              </div>
            </div>
          </div>
          <div class="drawer_content_box">
            <span class="drawer_content_left">营销分类</span>
            <span class="drawer_content_right"
              >{{ drawerInfo.sellName }}/{{ drawerInfo.promotionName }}</span
            >
          </div>
          <div v-if="drawerInfo.promId === 3" class="drawer_content_box">
            <span class="drawer_content_left">文章类型</span>
            <span
              v-if="drawerInfo.articleType === 1"
              class="drawer_content_right"
              >媒体代写</span
            >
            <span v-else class="drawer_content_right">自己提供</span>
          </div>
          <div class="drawer_content_box">
            <span class="drawer_content_left">标题</span>
            <span class="drawer_content_right">{{
              drawerInfo.resourceTitle
            }}</span>
          </div>
          <div class="drawer_content_box">
            <span class="drawer_content_left">链接</span>
            <span class="drawer_content_right">{{
              drawerInfo.resourceUrl
            }}</span>
          </div>
          <div v-if="drawerInfo.promId === 4" class="drawer_content_box">
            <span class="drawer_content_left">价格</span>
            <span class="drawer_content_right_content">
              {{ drawerInfo.unit }}{{ drawerInfo.discountPriceMin }}
              <span
                v-if="
                  drawerInfo.discountPriceMin && drawerInfo.discountPriceMax
                "
              >
                -
              </span>
              {{ drawerInfo.discountPriceMax }}
              <em class="em_box">
                {{ drawerInfo.unit }}{{ drawerInfo.originalPriceMin }}
                <span
                  v-if="
                    drawerInfo.originalPriceMin && drawerInfo.originalPriceMax
                  "
                >
                  -
                </span>
                {{ drawerInfo.originalPriceMax }}
              </em>
            </span>
          </div>
          <div v-if="drawerInfo.promId === 4" class="drawer_content_box">
            <span class="drawer_content_left">折扣码</span>
            <span class="drawer_content_right_content">
              {{ drawerInfo.discountCode }}
              <el-icon
                v-if="drawerInfo.discountCode"
                class="drawer_content_right_icon"
                @click="handle(drawerInfo.discountCode)"
              >
                <CopyDocument />
              </el-icon>
            </span>
          </div>
          <div v-if="drawerInfo.promId === 4" class="drawer_content_box">
            <span class="drawer_content_left">优惠比例</span>
            <span class="drawer_content_right_content">
              <span v-if="drawerInfo.preferentialRatio">
                {{ drawerInfo.preferentialRatio }}%OFF
              </span>
            </span>
          </div>
          <div v-if="drawerInfo.promId === 4" class="drawer_content_box">
            <span class="drawer_content_left">coupon</span>
            <span class="drawer_content_right">
              {{ drawerInfo.coupon }}
            </span>
          </div>
          <div v-if="drawerInfo.sellId === 2" class="drawer_content_box">
            <span class="drawer_content_left">可用变量</span>
            <span class="drawer_content_right">{{
              drawerInfo.variableBody
            }}</span>
          </div>
          <div v-if="drawerInfo.promId !== 6" class="drawer_content_box">
            <span class="drawer_content_left">折扣有效时间</span>
            <span class="drawer_content_right"
              >{{ drawerInfo.startTime }}
              <span v-if="drawerInfo.startTime && drawerInfo.endTime"> - </span>
              {{ drawerInfo.endTime }}</span
            >
          </div>
          <div class="drawer_content_box">
            <span class="drawer_content_left">预约发布时间</span>
            <span class="drawer_content_right">{{
              drawerInfo.appointmentReleaseTime
            }}</span>
          </div>
          <div class="drawer_content_box">
            <span class="drawer_content_left">订单创建时间</span>
            <span class="drawer_content_right">{{
              drawerInfo.createTime
            }}</span>
          </div>
          <div class="drawer_content_box">
            <span class="drawer_content_left">订单金额</span>
            <span class="drawer_content_right"
              >￥&nbsp;{{ drawerInfo.totalAmount }}</span
            >
          </div>
          <div class="drawer_content_box">
            <span class="drawer_content_left">到手价格</span>
            <span class="drawer_content_right"
              >￥&nbsp;{{ drawerInfo.handAmount }}</span
            >
          </div>
          <div v-if="drawerInfo.promId === 3" class="drawer_content_box">
            <span class="drawer_content_left">文章内容</span>
            <span class="drawer_content_right drawer_content_right_box">
              <i class="iconfont icon-article" />
              <el-link
                :href="drawerInfo.articleContent"
                :underline="false"
                target="_blank"
                >点击查看</el-link
              >
            </span>
          </div>
          <div v-if="drawerInfo.promId === 6" class="drawer_content_box">
            <span class="drawer_content_left">可用变量</span>
            <span class="drawer_content_right">{{
              drawerInfo.variableBody
            }}</span>
          </div>
          <div
            v-if="drawerInfo.promId === 3 || drawerInfo.promId === 6"
            class="drawer_content_box"
          >
            <span class="drawer_content_left">自定义广告图</span>
            <span v-if="drawerInfo.picUrl" class="drawer_content_right">
              <span class="banner_img">
                <el-image
                  :src="drawerInfo.picUrl"
                  :preview-src-list="drawerInfo.picUrl"
                  fit="cover"
                />
              </span>
            </span>
          </div>
          <div v-if="drawerInfo.promId === 5" class="drawer_content_box">
            <span class="drawer_content_left">banner</span>
            <div v-if="drawerInfo.banner" class="drawer_content_right">
              <span
                v-for="(v, index) in drawerInfo.banner"
                :key="index"
                class="banner_img"
              >
                <el-image
                  :src="v"
                  :preview-src-list="drawerInfo.banner"
                  fit="cover"
                />
              </span>
            </div>
          </div>
          <div v-if="drawerInfo.promId === 7" class="drawer_content_box">
            <span class="drawer_content_left">备注</span>
            <span class="drawer_content_right remark_box">{{
              drawerInfo.remark
            }}</span>
          </div>
          <div v-if="drawerInfo.couponNote" class="drawer_content_box">
            <span class="drawer_content_left">code</span>
            <span class="drawer_content_right remark_box">{{
              drawerInfo.code
            }}</span>
          </div>
          <div v-if="drawerInfo.couponNote" class="drawer_content_box">
            <span class="drawer_content_left">code备注</span>
            <span class="drawer_content_right remark_box">{{
              drawerInfo.couponNote
            }}</span>
          </div>
        </div>
        <el-divider />
        <div class="drawer_title">
          <span class="drawer_title_left"></span>
          <span class="drawer_title_right">反馈信息</span>
        </div>
        <div class="drawer_content">
          <div class="drawer_content_box">
            <span class="drawer_content_left">上贴链接</span>
            <a
              v-if="drawerInfo.secondCompleteLink"
              :href="drawerInfo.secondCompleteLink"
              :underline="false"
              target="_blank"
            >
              <span class="drawer_content_right">{{
                drawerInfo.secondCompleteLink
              }}</span>
            </a>
            <a
              v-else-if="drawerInfo.completeLink"
              :href="drawerInfo.completeLink"
              :underline="false"
              target="_blank"
            >
              <span class="drawer_content_right">{{
                drawerInfo.completeLink
              }}</span>
            </a>
            <span v-else />
          </div>
          <div class="drawer_content_box">
            <span class="drawer_content_left">上贴截图</span>
            <span class="drawer_content_right">
              <el-image
                v-if="drawerInfo.secondScreenshot"
                style="width: 100px; height: 100px"
                :src="drawerInfo.secondScreenshot"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[drawerInfo.secondScreenshot]"
                :initial-index="4"
                fit="cover"
              />
              <el-image
                v-else-if="drawerInfo.screenshot"
                style="width: 100px; height: 100px"
                :src="drawerInfo.screenshot"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[drawerInfo.screenshot]"
                :initial-index="4"
                fit="cover"
              />
              <span v-else />
            </span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.drawer_box {
  :deep(.el-drawer) {
    width: 906px !important;

    .el-drawer__header {
      margin-bottom: 0;
    }

    .el-drawer__body {
      padding: 0 38px;

      .drawer_title {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        .drawer_title_left {
          display: inline-block;
          width: 2px;
          height: 13px;
          background: var(--yw-primary);
        }

        .drawer_title_right {
          margin-left: 7px;
          font-weight: 500;
        }
      }

      .drawer_content {
        font-size: 14px;
        font-weight: 400;

        .drawer_content_box {
          margin-bottom: 22px;
          display: flex;

          .drawer_content_left {
            display: inline-block;
            width: 86px;
            color: var(--yw-text-555);
            margin-right: 22px;
            text-align: right;
          }
          .remark_box {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .drawer_content_right {
            display: inline-block;
            width: 630px;
            color: var(--yw-text-111);

            .banner_img {
              display: inline-block;
              width: 120px !important;
              height: 100px !important;
              margin-right: 5px;
              .el-image {
                width: 100%;
                height: 100%;
              }
            }
          }
          .drawer_content_right_icon {
            margin-left: 10px;
            cursor: pointer;
          }

          .drawer_content_right_content {
            display: inline-block;
            width: 630px;
            font-size: 14px;
            font-weight: 400;

            em {
              margin-left: 30px;
            }

            .em_box {
              text-decoration: line-through;
            }
          }

          .drawer_content_right_box {
            color: var(--yw-text-8a9ce8);
            cursor: pointer;
            display: flex;
            align-items: center;

            i {
              font-size: 22px;
            }

            .el-link__inner {
              color: var(--yw-text-8a9ce8);
            }
          }
        }

        .drawer_content_xbox {
          display: flex;
          .drawer_content_right {
            display: flex;
            align-items: center;
            max-width: 150px;

            img {
              width: 20px;
              height: 18px;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
