import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // state
  const user = ref(JSON.parse(localStorage.getItem('user')))

  // getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => isAuthenticated.value && user.value?.role === 'ADMIN')
  const isCustomer = computed(() => isAuthenticated.value && user.value?.role === 'CUSTOMER')

  // actions
  function setAuthData(userData) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function clearAuthData() {
    user.value = null
    localStorage.removeItem('user')
  }

  async function login(email, password, role) {
    try {
      const endpoint = role === 'ADMIN'
          ? 'http://localhost:8080/admins/login'
          : 'http://localhost:8080/customers/login'

      const response = await axios.post(endpoint, { email, password })
      const userData = response.data

      // Set the role explicitly
      setAuthData({ ...userData, role })

      // Redirect based on role
      if (role === 'ADMIN') {
        router.push({ name: 'ReportAnalytics' })
      } else {
        router.push({ name: 'Dashboard' })
      }
    } catch (error) {
      clearAuthData()
      throw new Error('Login failed. Please check your credentials.')
    }
  }

  async function signup(payload) {
    try {
      const endpoint = payload.role === 'ADMIN'
          ? 'http://localhost:8080/admins/register'
          : 'http://localhost:8080/customers/register'

      await axios.post(endpoint, payload)
      router.push({ name: 'Login', query: { registered: 'true' } })
    } catch (error) {
      throw new Error('Registration failed. Please try again.')
    }
  }

  function logout() {
    clearAuthData()
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    isCustomer,
    login,
    signup,
    logout
  }
})