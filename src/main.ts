import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import { createLogger } from 'vue-logger-plugin'

const isProduction = process.env.NODE_ENV === 'production'

const options = {
    level: isProduction ? 'error' : 'debug'
}

createApp(App)
	.use(router)
	.use(Antd)
	.use(createLogger(options))
	.mount('#app')
