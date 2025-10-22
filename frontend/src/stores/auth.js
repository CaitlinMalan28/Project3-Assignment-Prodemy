import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
    // state
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)

    // getters
    const isAuthenticated = computed(() => !!user.value)
    const isAdmin = computed(() => user.value?.role === 'ADMIN')
    const isUser = computed(() => user.value?.role === 'USER')

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
            const endpoint =
                role === 'ADMIN'
                    ? 'http://localhost:8080/admins/login'
                    : 'http://localhost:8080/customers/login'

            const { data } = await axios.post(endpoint, { email, password })

            const userData = { ...data, role, loggedIn: true }

            // Save to localStorage
            setAuthData(userData)

            // Redirect
            if (role === 'ADMIN') {
                router.push({ name: 'Dashboard' })
            } else {
                router.push({ name: 'Home' })
            }
        } catch (error) {
            clearAuthData()
            throw new Error('Login failed. Check your credentials.')
        }
    }

    async function signup(payload) {
        try {
            const endpoint =
                payload.role === 'ADMIN'
                    ? 'http://localhost:8080/admins/register'
                    : 'http://localhost:8080/customers/register'

            const { data } = await axios.post(endpoint, payload)

            // Automatically log in after signup
            const userData = { ...data, loggedIn: true }
            setAuthData(userData)

            router.push({ name: userData.role === 'ADMIN' ? 'Dashboard' : 'Home' })
        } catch (error) {
            throw new Error('Registration failed. Try again.')
        }
    }

    function logout() {
        clearAuthData()
        router.push({ name: 'Login' })
    }

    // Optional: refresh persistence
    window.addEventListener('beforeunload', () => {
        if (user.value) {
            localStorage.setItem('user', JSON.stringify(user.value))
        }
    })

    return {
        user,
        isAuthenticated,
        isAdmin,
        isUser,
        login,
        signup,
        logout
    }
})
