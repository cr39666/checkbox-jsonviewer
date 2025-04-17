import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// import '../dist/checkbox-jsonviewer.css'
// import checkboxJsonviewer from 'checkbox-jsonviewer'

const app = createApp(App)

// checkboxJsonviewer(app)

app.use(createPinia())

app.mount('#app')
