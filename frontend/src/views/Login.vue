<template>
  <div class="login-container">
    <div class="form-section">
      <h2>Welcome Back</h2>
      <p>Login to continue learning and growing with Prodemy</p>

      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email address" required />
        <input v-model="password" type="password" placeholder="Password" required />

        <select v-model="role" required>
          <option value="" disabled selected>Select your role</option>
          <option value="USER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit">Login</button>
      </form>

      <div class="divider"><span>OR</span></div>

      <div class="social-login">
        <button class="google">Sign in with Google</button>
        <button class="apple">Sign in with Apple</button>
      </div>

      <p class="signup-link">
        Don't have an account? <router-link to="/signup">Create one</router-link>
      </p>
    </div>

    <div class="graphic-section">
      <img :src="logo" alt="Prodemy Login Graphic" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import logo from '@/assets/logo.png'

const email = ref('')
const password = ref('')
const role = ref('')
const router = useRouter()

const handleLogin = async () => {
  if (!email.value || !password.value || !role.value) {
    alert('Please fill in all fields including role')
    return
  }

  let endpoint = ''
  if (role.value === 'ADMIN') {
    endpoint = 'http://localhost:8080/admins/login'
  } else if (role.value === 'USER') {
    endpoint = 'http://localhost:8080/customers/login'
  } else {
    alert('Invalid role selected')
    return
  }

  try {
    const response = await axios.post(endpoint, {
      email: email.value,
      password: password.value,
    })

    const user = response.data
    console.log('Login success:', user)

    // ✅ Save logged-in user
    localStorage.setItem('currentUser', JSON.stringify(user))

    alert('Login successful!')

    // ✅ Redirect by role
    if (user.role === 'ADMIN') {
      router.push({ name: 'Dashboard' })
    } else if (user.role === 'USER') {
      router.push({ name: 'Home' })
    } else {
      router.push({ name: 'Home' })
    }

  } catch (error) {
    console.error('Login failed:', error)
    alert('Login failed. Please check your credentials.')
  }
}
</script>

<style scoped>
/* same styling as you had */
.login-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: #0d0d0d;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border-radius: 20px;
  overflow: hidden;
}

.form-section {
  flex: 1;
  padding: 60px;
  background-color: #9eff80;
  color: #121212;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;
  border-radius: 20px 0 0 20px;
}

/* rest of your existing styles */
</style>
