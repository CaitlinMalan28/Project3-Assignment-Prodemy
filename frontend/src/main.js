// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// ✅ Create app and pinia
const app = createApp(App)
const pinia = createPinia()

// ✅ Register pinia and router *before* using any store
app.use(pinia)
app.use(router)

// ✅ Now it's safe to access Pinia stores
const auth = useAuthStore()
if (auth.user) {
    console.log('Restored session for:', auth.user.email)
}

// ✅ Set axios defaults
axios.defaults.headers.post['Content-Type'] = 'application/json'

// ✅ Mount the app last
app.mount('#app')
