// 프로젝트 공통 CSS
import './assets/main.css'

// Vue 앱 생성 기능
import { createApp } from 'vue'

// Pinia 상태 관리
import { createPinia } from 'pinia'

// Element Plus와 Element Plus 기본 CSS
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 최상위 컴포넌트와 Router
import App from './App.vue'
import router from './router'

// 1. Vue 앱 생성
const app = createApp(App)

// 2. 필요한 기능 연결
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 3. 모든 기능을 연결한 다음 마지막에 화면 표시
app.mount('#app')
