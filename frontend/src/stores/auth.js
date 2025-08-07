import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // state: Load user data from localStorage to keep them logged in across browser sessions
  const user = ref(JSON.parse(localStorage.getItem('user')))
  const token = ref(localStorage.getItem('token'))

  // getters: Computed properties to easily check auth status and roles
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => isAuthenticated.value && user.value?.role === 'ADMIN')
  const isUser = computed(() => isAuthenticated.value && user.value?.role === 'USER')

  // actions
  function setAuthData(userData, userToken) {
    user.value = userData
    token.value = userToken
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
  }

  function clearAuthData() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  async function login(email, password, role) {
    // API endpoint logic remains here as requested
    const endpoint = role === 'ADMIN' ? 'http://localhost:8080/admins/login' : 'http://localhost:8080/customers/login'
    const response = await axios.post(endpoint, { email, password })

    // Assuming backend returns { token: '...', user: { ... } }
    // We manually add the role to the user object for consistency
    const { token: userToken, user: userData } = response.data
    setAuthData({ ...userData, role }, userToken)

    // Redirect based on role after successful login
    if (role === 'ADMIN') {
      router.push({ name: 'ReportAnalytics' }) // Or your main admin dashboard
    } else {
      router.push({ name: 'Dashboard' })
    }
  }

  async function signup(payload) {
    const endpoint = payload.role === 'ADMIN' ? 'http://localhost:8080/admins/register' : 'http://localhost:8080/customers/register'
    await axios.post(endpoint, payload)

    // After successful signup, redirect to login page with a success message
    router.push({ name: 'Login', query: { registered: 'true' } })
  }

  function logout() {
    clearAuthData()
    router.push('/login')
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    signup,
    logout,
  }
})