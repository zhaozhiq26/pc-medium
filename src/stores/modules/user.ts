import { ref } from 'vue'
import { defineStore } from 'pinia'
import { checkStatusAPI, getUserInfoAPI, loginAPI } from '@/api/login'
import type { loginRes } from '@/types/login'

export const useUserStore = defineStore(
  'user',
  () => {
    // 存储登录信息
    const loginInfo = ref()
    const userInfo = ref()
    // 登录
    const Userlogin = async (loginForm: loginRes) => {
      const res = await loginAPI(loginForm)
      loginInfo.value = res.data
    }
    const wxLogin = async (code: any) => {
      const res = await checkStatusAPI(code)
      loginInfo.value = res.data
    }
    // 存储用户信息
    const setUserInfo = async () => {
      const res = await getUserInfoAPI()
      userInfo.value = {
        ...res.data,
        startOrdersDate: res.data.startOrdersDate
      }
    }
    return {
      Userlogin,
      loginInfo,
      wxLogin,
      userInfo,
      setUserInfo
    }
  },
  {
    persist: {
      paths: ['loginInfo', 'userInfo']
    }
  }
)
