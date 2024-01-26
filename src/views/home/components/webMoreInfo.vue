<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getWebAllianceAPI } from '@/api/home'

const WebAlliance = ref()
const emit = defineEmits(['webMoreYW'])
onMounted(() => {
  WebAllianceInfo()
})
// 查看网站联盟
const WebAllianceInfo = async () => {
  const res = await getWebAllianceAPI()
  WebAlliance.value = res.data
}
const indexYW = () => {
  emit('webMoreYW')
}
</script>

<template>
  <div class="web_more_box yw_box">
    <span class="web_more_header_top" @click="indexYW">
      <i-ep-arrow-left />返回首页
    </span>
    <div class="web_more_header_bottom">网站联盟</div>
    <div class="web_more_body">
      <el-scrollbar height="850px">
        <div class="bottom_left_bottom_box">
          <div
            v-for="i in WebAlliance"
            :key="i.id"
            class="bottom_left_bottom_card"
          >
            <div class="bottom_left_bottom_card_img">
              <img :alt="i.picName" :src="i.picUrl" />
            </div>
            <div class="bottom_left_bottom_card_title">{{ i.name }}</div>
            <div class="bottom_left_bottom_card_title card_p">{{ i.des }}</div>
            <div class="bottom_left_bottom_card_field">
              <div class="bottom_left_bottom_card_field1">行业名称</div>
              <div class="bottom_left_bottom_card_field1">
                {{ i.industry }}
              </div>
            </div>
            <div class="bottom_left_bottom_card_bottom">
              <div class="bottom_left_bottom-box">
                <div class="left-bottom-box-top">
                  {{ i.defaultCommission }}
                </div>
                <div
                  :class="{ leftBottomTop1: i.defaultCommission === null }"
                ></div>
                <div class="left-bottom-box-content">默认佣金</div>
              </div>
              <div class="bottom_left_bottom-box">
                <div class="left-bottom-box-top">
                  {{ i.averageCommission }}
                </div>
                <div
                  :class="{
                    leftBottomTop1: i.averageCommission === null
                  }"
                ></div>
                <div class="left-bottom-box-content">平均佣金</div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.web_more_box {
  height: 971px;
  overflow: hidden;
  background: var(--yw-bg-fff);
  border-radius: 5px;
  box-sizing: border-box;
  padding: 20px 20px 20px;
  border-left: 1px solid var(--yw-bg-f0f0f0);

  .web_more_header_top {
    width: 92px;
    display: flex;
    cursor: pointer;
    margin-left: 10px;
    align-items: center;
  }

  .web_more_header_bottom {
    margin-top: 10px;
    margin-left: 10px;
    font-weight: bold;
  }

  .web_more_body {
    display: flex;
    font-size: 14px;
    margin-top: 20px;

    .bottom_left_bottom_box {
      display: flex;
      flex-wrap: wrap;
      margin-left: 18px;
      align-items: center;
      .bottom_left_bottom_card {
        width: 180px;
        height: 290px;
        box-sizing: border-box;
        margin: 2px 16px 2px 3px;
        margin-bottom: 10px !important;
        box-shadow: rgba(0, 0, 0, 0.12) 0 0 12px 0;
        .bottom_left_bottom_card_img {
          width: 100%;
          height: 115px;
          margin-bottom: 20px;
          img {
            border-radius: 4px 4px 0 0;
          }
        }
        .bottom_left_bottom_card_title {
          color: var(--yw-text-111);
          cursor: default;
          max-width: 170px;
          overflow: hidden;
          padding-left: 5px;
          margin-bottom: 10px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .card_p {
          color: var(--yw-text-555);
        }
        .bottom_left_bottom_card_field {
          width: 176px;
          display: flex;
          padding: 0 1px;
          margin-top: 10px;
          align-items: center;
          justify-content: space-between;
          .bottom_left_bottom_card_field1 {
            width: 85px;
            height: 30px;
            padding-top: 7px;
            text-align: center;
            box-sizing: border-box;
            border: 1px solid var(--yw-primary);
            border-radius: 4px 4px 4px 4px;
          }
        }
        .bottom_left_bottom_card_bottom {
          display: flex;
          padding: 0 10px;
          margin-top: 14px;
          align-items: center;
          justify-content: space-between;
          .bottom_left_bottom-box {
            display: flex;
            align-items: center;
            flex-direction: column;
            .left-bottom-box-content {
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
