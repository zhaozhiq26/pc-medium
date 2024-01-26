import { createRouter, createWebHistory } from 'vue-router'
import layout from '@/layout/index.vue'

export const routes: any = [
  {
    path: '/',
    component: layout,
    redirect: '/index',
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/add/media',
    component: () => import('@/components/addMedia/index.vue'),
    meta: {
        title: '添加媒体'
    }
  },
  {
    path: '/',
    component: layout,
    children: [
        {
            path: '/order/list',
            name: 'orderList',
            component: () => import('@/views/orderList/index.vue'),
            meta: {
                title: '订单列表'
            }
        }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
        {
            path: '/account/center',
            name: 'account',
            component: () => import('@/views/accountCenter/index.vue'),
            meta: {
                title: '账户中心'
            }
        }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
        {
            path: '/media/center',
            name: 'media',
            component: () => import('@/views/mediaCenter/index.vue'),
            meta: {
                title: '媒体中心'
            }
        }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
        {
            path: '/feedback/center',
            name: 'FeedbackCenter',
            component: () => import('@/views/feedbackCenter/index.vue'),
            meta: {
                title: '反馈中心'
            }
        }
    ]
},
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    },
    hidden: true
  },
  {
    path: '/user/agreement',
    component: () => import('@/views/user/userAgreement.vue'),
    meta: {
      title: '用户协议'
    }
  },
  {
    path: '/user/privacy',
    component: () => import('@/views/user/privacyPolicy.vue'),
    meta: {
      title: '隐私协议'
    }
  },
  {
    path: '/',
    component: layout,
    children: [
        {
            path: '/bill',
            name: 'bill',
            component: () => import('@/views/bill/index.vue'),
            meta: {
                title: '开票'
            }
        }
    ]
  },
  {
    path: '/set',
    component: layout,
    children: [
        {
          path: '/set/settlement/info',
          name: 'settlementInfo',
          component: () => import('@/views/set/settlementInfo.vue'),
          meta: {
              title: '结算信息'
          }
        },
        {
          path: '/set/shipping/address',
          name: 'shippingAddress',
          component: () => import('@/views/set/shippingAddress.vue'),
          meta: {
              title: '收货地址'
          }
        },
        {
          path: '/set/user/info',
          name: 'userInfo',
          component: () => import('@/views/set/userInfo.vue'),
          meta: {
              title: '个人信息'
          }
        },
        {
              path: '/set/security/center',
              name: 'securityCenter',
              component: () => import('@/views/set/securityCenter.vue'),
              meta: {
                  title: '安全中心'
              }
        }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
