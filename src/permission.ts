import router from '@/router'
import { useUserStore } from '@/stores'
import { logoutAPI } from './api/login'
// import { notification } from 'ant-design-vue'

// 前置守卫
const whiteList = ['/login', '/user/agreement', '/user/privacy']
router.beforeEach(async (to, form, next) => {
  const userStore = useUserStore()
  // 判断是不是白名单
  if (whiteList.includes(to.path)) {
    if (userStore.loginInfo && to.path === '/login') {
      next('/')
    } else {
      // 在里面就直接放行
      next()
    }
  } else {
    // 不在白名单里 - 有没有token
    if (userStore.loginInfo) {
      //   if (userStore.userInfo?.bindEmail) {
      //     await logoutAPI().then(() => {
      //       window.localStorage.clear()
      //       location.href = '/'
      //     })
      //   } else {
          next()
      // }
    } else {
      // 打回登录页，先弹出提示
      // notification.warning({
      //   message: '登录过期提醒',
      //   description:'请重新登录'
      // })
      window.localStorage.clear()
      next('/login')
    }
  }
})

// 后置守卫
router.afterEach((to, form) => {
  document.title = '微企传媒-' + to.meta.title
})
