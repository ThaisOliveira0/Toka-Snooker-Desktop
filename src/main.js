import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '@/assets/toast.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)
app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,

})
app.mount('#app')





