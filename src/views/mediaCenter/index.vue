<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores'
import { postMediaSearchAPI } from '@/api/media'
import MediaBody from './components/mediaBody.vue'
import MediaHeader from './components/mediaHeader.vue'

const total = ref(0)
const infoList = ref()
const activeKey = ref(1)
const showCard = ref(true)
const showCard1 = ref(true)
const modifyPriceTo = ref()
const ModifyMediaInfo = ref()
const userStore = useUserStore()

const ywFrom = reactive({
  createId: userStore.userInfo.userId,
  countryId: undefined,
  resourceTypeId: undefined,
  sfId: undefined,
  resourceName: '',
  grounding: 1,
  checkStatus: 1,
  pageSize: 14,
  pageNum: 1
})

// 查看所有媒体
const getMediaInfo = async () => {
  const res = await postMediaSearchAPI({
    ...ywFrom,
    grounding: activeKey.value === 3 ? 0 : 1,
    sfId: ywFrom.sfId === 'null' ? undefined : ywFrom.sfId,
    checkStatus: activeKey.value === 3 ? undefined : activeKey.value,
    countryId: ywFrom.countryId === 'null' ? undefined : ywFrom.countryId,
    resourceName: ywFrom.resourceName === '' ? undefined : ywFrom.resourceName,
    resourceTypeId:
      ywFrom.resourceTypeId === 'null' ? undefined : ywFrom.resourceTypeId
  })
  infoList.value = res.data.mediumRankListVOS.map((i: any) => {
    return {
      ...i,
      platforms: i.platforms.split(','),
      price: Number(i.price).toFixed(2).toString()
    }
  })
  total.value = <number>res.data.total
}

// 切换tab栏
const ywTab = (val: number) => {
  activeKey.value = val
  ywFrom.sfId = undefined
  ywFrom.resourceName = ''
  ywFrom.countryId = undefined
  ywFrom.resourceTypeId = undefined
  getMediaInfo()
}

// 搜索 / 重置 / 刷新
const YouWeiXJ = (val: any) => {
  infoList.value = []
  ywFrom.pageNum = 1
  ywFrom.pageSize = 14
  ywFrom.sfId = val.sfId
  ywFrom.countryId = val.countryId
  ywFrom.resourceName = val.resourceName
  ywFrom.resourceTypeId = val.resourceTypeId
  getMediaInfo()
}

// 添加资源
const AddResource = () => {
  showCard.value = true
  getMediaInfo()
}
const addResourceYw = () => (showCard.value = false)

// 批量修改价格
const modifyPrice = () => {
  modifyPriceTo.value.modifyPriceTo()
}

// 修改资源
const AddResource1 = () => {
  showCard1.value = !showCard1.value
}
const AddResourceT = () => {
  showCard1.value = true
  ywFrom.sfId = undefined
  ywFrom.resourceName = ''
  ywFrom.countryId = undefined
  ywFrom.resourceTypeId = undefined
  getMediaInfo()
}

// 编辑
const ModifyMedia1 = (val: any) => {
  ModifyMediaInfo.value = val
  AddResource1()
}

const AddResource2 = () => {
  showCard1.value = true
  getMediaInfo()
}

getMediaInfo()
</script>

<template>
  <div v-if="showCard1">
    <div v-if="showCard" class="media_page yw_box">
      <ul class="media_ul">
        <li :class="{ active: activeKey === 1 }" @click="ywTab(1)">已上架</li>
        <li :class="{ active: activeKey === 2 }" @click="ywTab(2)">待审核</li>
        <li :class="{ active: activeKey === 0 }" @click="ywTab(0)">
          审核不通过
        </li>
        <li :class="{ active: activeKey === 3 }" @click="ywTab(3)">已下架</li>
      </ul>
      <media-header
        :father="activeKey"
        @YouWeiXJSon="YouWeiXJ"
        @addMediaYWSon="addResourceYw"
        @modifyPriceYWSon="modifyPrice"
      />
      <!-- 表格 -->
      <media-body
        ref="modifyPriceTo"
        :tableData="infoList"
        @ModifyMedia="ModifyMedia1"
        @refreshData="getMediaInfo"
      />
      <pagination
        :total="total"
        @pagination="getMediaInfo"
        v-model:page="ywFrom.pageNum"
        v-model:limit="ywFrom.pageSize"
        :pageSizes="['14', '20', '30', '50']"
      />
    </div>
    <add-media v-if="!showCard" @AddMedias="AddResource" />
  </div>
  <editing-media
    v-if="!showCard1"
    :mediaInfo="ModifyMediaInfo"
    @AddMedias1="AddResourceT"
    @AddMedias2="AddResource2"
  />
</template>

<style lang="scss" scoped>
.media_page {
  padding: 18px 21px 10px;
  box-sizing: border-box;
  .media_ul {
    display: flex;
    list-style: none;
    font-size: 14px;
    padding-left: 33px;
    border-bottom: 1px solid var(--yw-bg-ebedf0);
    li {
      cursor: pointer;
      margin-right: 40px;
      &:hover {
        color: var(--yw-primary-hover);
      }
    }
    .active {
      color: var(--yw-primary);
      padding-bottom: 16px;
      border-bottom: 2px solid var(--yw-primary);
    }
  }
}
</style>
