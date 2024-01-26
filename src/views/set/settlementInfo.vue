<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { getViewPayeeAPI } from '@/api/set'
import type { getViewPayeeRes } from '@/types/set'
import AccountPopup from './components/AccountPopup.vue'
import SettlementInfo from './components/SettlementToInfo.vue'

const userStore = useUserStore()
const switchButton = ref(true)
const switchNone = ref(false)
const showDialogYW = ref()
const viewPayeeInfo = ref({
  id: null,
  countryId: null,
  userId: userStore.userInfo.userId,
  settleAccountId: '',
  bank: '',
  cardId: '',
  cardName: '',
  idNumber: '',
  mobile: '',
  defaultStatus: 0,
  userTypeId: 1,
  createTime: '',
  updateTime: ''
})
const viewPayee = ref<getViewPayeeRes>({
  userId: userStore.userInfo.userId,
  typeId: 1
})

// 添加结算资料
const addData = () => (switchButton.value = !switchButton.value)

// const editTo = (val: any) => {
//   ElMessageBox.confirm('修改银行卡需要先解绑，确认解绑吗?', '温馨提示').then(async () => {
//     const res = await delSettleAccountAPI({
//       settleAccountMember: {
//         createId: userStore.userInfo.userId,
//         settleAccountId: val.settleAccountId
//       }
//     })
//     if (res.code === 200) {
//       ElMessage.success('解绑成功，正在跳转添加页面')
//       addData()
//     }
//   })
// }

// 查看收款人
const getViewPayee = async () => {
  const res = await getViewPayeeAPI(viewPayee.value)
  viewPayeeInfo.value = res?.data
  if (res.data) switchNone.value = true
}
const addData1 = () => {
  switchButton.value = true
  getViewPayee()
}
const showDialogJK = (val: any) => showDialogYW.value.showDialog(val)

getViewPayee()
</script>

<template>
  <div v-if="switchButton" class="yw_box settlement_info">
    <a-alert
      message=" 温馨提示：中国用户填写结算信息，非中国地区填写提现账户信息"
    />
    <div
      v-if="userStore.userInfo.countryId === 99999"
      class="settlement_info_body"
    >
      <div class="settlement_info_title">
        结算资料
        <span
          class="settlement_info_icon_img"
          @click="addData"
          v-if="!switchNone"
        >
          <i class="iconfont icon-redact" />
        </span>
      </div>
      <div
        v-if="viewPayeeInfo?.cardName"
        class="settlement_info_content settlement_info_bottom_box"
      >
        <div style="margin-right: 14px">
          <div class="settlement_info_box">
            <div class="settlement_info_box_icon">
              <img
                alt=""
                class="Pay"
                src="@/assets/img/pay/UnionPayQuickPass.png"
              />
            </div>
            <div class="settlement_info_box_num">
              {{
                viewPayeeInfo.cardId.replace(
                  /(.{0}).*(.{4})/,
                  '$1**** **** **** $2'
                )
              }}
            </div>
            <div class="settlement_info_box_name">
              {{ viewPayeeInfo.cardName }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="settlement_info_bottom">
      <div class="settlement_info_title">
        提现账号设置
        <span
          class="settlement_info_icon"
          @click="showDialogJK(0)"
          v-if="!switchNone"
        >
          + 添加
        </span>
      </div>
      <div class="settlement_info_content settlement_info_bottom_box">
        <div
          v-if="viewPayeeInfo?.bank === 'paypal'"
          class="settlement_info_box settlement_info_box1"
        >
          <div class="settlement_info_xbox">
            <div class="settlement_info_box_icon1">
              <img alt="" src="@/assets/img/pay/PayPal.png" />
            </div>
            <i
              class="iconfont icon-redact"
              @click="showDialogJK(viewPayeeInfo)"
            />
          </div>
          <div class="settlement_info_box_num">
            {{
              viewPayeeInfo.cardId.replace(
                /(.{0}).*(.{3})/,
                '$1**** **** **** $2'
              )
            }}
          </div>
        </div>
        <div
          v-else-if="viewPayeeInfo?.bank === 'Payonner'"
          class="settlement_info_box settlement_info_box1"
        >
          <div class="settlement_info_xbox">
            <div class="settlement_info_box_icon1">
              <img alt="" src="@/assets/img/pay/Payoneer.png" />
            </div>
            <i
              class="iconfont icon-redact"
              @click="showDialogJK(viewPayeeInfo)"
            />
          </div>
          <div class="settlement_info_box_num">
            {{
              viewPayeeInfo.cardId.replace(
                /(.{0}).*(.{4})/,
                '$1**** **** **** $2'
              )
            }}
          </div>
        </div>
        <div
          v-else-if="viewPayeeInfo?.bank === 'WMZ'"
          class="settlement_info_box settlement_info_box1"
        >
          <div class="settlement_info_xbox">
            <div class="settlement_info_box_icon1">
              <img alt="" src="@/assets/img/pay/WebMoney.png" />
            </div>
            <i
              class="iconfont icon-redact"
              @click="showDialogJK(viewPayeeInfo)"
            />
          </div>
          <div class="settlement_info_box_num">
            {{
              viewPayeeInfo.cardId.replace(
                /(.{0}).*(.{4})/,
                '$1**** **** **** $2'
              )
            }}
          </div>
        </div>
        <div
          v-else-if="viewPayeeInfo?.bank === 'USDT TRC'"
          class="settlement_info_box settlement_info_box1"
        >
          <div class="settlement_info_xbox">
            <div class="settlement_info_box_icon1">
              <img alt="" src="@/assets/img/pay/tether.png" />
            </div>
            <i
              class="iconfont icon-redact"
              @click="showDialogJK(viewPayeeInfo)"
            />
          </div>
          <div class="settlement_info_box_num">
            {{
              viewPayeeInfo.cardId.replace(
                /(.{0}).*(.{4})/,
                '$1**** **** **** $2'
              )
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--弹窗-->
  <settlement-info v-if="!switchButton" @addDataTo="addData1" />
  <account-popup ref="showDialogYW" @getViewPayeeYW="getViewPayee" />
</template>

<style lang="scss" scoped>
.settlement_info {
  padding: 25px;
  font-size: 14px;
  box-sizing: border-box;
  .ant-alert {
    border: none;
    color: var(--yw-text-ef6706);
    background-color: var(--yw-bg-fefbea);
  }

  .settlement_info_body {
    margin-top: 42px;
    margin-left: 20px;

    .settlement_info_title {
      font-weight: 400;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
  }

  .settlement_info_icon_img {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-bottom: 6px;
    margin-left: 8px;
    cursor: pointer;
  }
  .icon-redact {
    font-size: 12px;
    color: var(--yw-primary);
  }

  .settlement_info_content {
    .settlement_info_box {
      width: 192px;
      height: 79px;
      background: var(--yw-bg-fff);
      border-radius: 4px 4px 4px 4px;
      border: 1px solid var(--yw-bg-dcdee0);
      padding-left: 14px;

      &:first-child {
        margin-left: 0;
      }

      .settlement_info_box_icon {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .Pay {
          width: 32px;
          height: 20px;
          margin: 10px 0;
        }

        .edit {
          width: 12px;
          height: 12px;
          cursor: pointer;
          margin: 0 10px;
        }
      }

      .settlement_info_box_icon1 {
        width: 90px;
        height: 20px;
        margin: 10px 0;
      }

      .settlement_info_box_num {
        font-size: 14px;
        font-weight: 400;
        color: var(--yw-text-000);
      }

      .settlement_info_box_name {
        font-size: 12px;
        color: var(--yw-text-555);
        font-weight: 400;
      }
    }
  }

  .settlement_info_bottom_box {
    display: flex;
  }

  .settlement_info_xbox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .settlement_info_box1 {
    padding-right: 14px;
    padding-top: 10px;
  }

  .settlement_info_bottom {
    margin-top: 45px;
    margin-left: 20px;

    .settlement_info_title {
      margin-bottom: 26px;

      .settlement_info_icon {
        color: var(--yw-primary);
        margin-left: 18px;
        cursor: pointer;
      }
    }
  }
}
</style>
