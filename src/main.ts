import 'ant-design-vue/dist/reset.css'
import 'element-plus/dist/index.css'
import '@/assets/style/main.css'
import { createApp } from 'vue'
import '@/permission'
import App from './App.vue'
import '@/styles/index.scss'
import pinia from './stores'
import router from './router'
import 'virtual:svg-icons-register'
import '@/assets/icons/iconfont.css'
import ElementPlus from 'element-plus'
import SvgIcon from '@/components/SvgIcon/index.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(pinia)
app.component('SvgIcon', SvgIcon)
app.use(router).mount('#app')
