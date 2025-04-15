import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import install from './package/index'

const app = createApp(App)

install(app)
app.use(createPinia())

app.mount('#app')
