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
    alert('Login successful!')

    // Role-based redirection
    if (user.role === 'ADMIN') {
      router.push({ name: 'Dashboard' })
    } else if (user.role === 'USER') {
      router.push({ name: 'Home' })
    } else {
      alert('Unknown role, redirecting to Home')
      router.push({ name: 'Home' })
    }

  } catch (error) {
    console.error('Login failed:', error)
    alert('Login failed. Please check your credentials.')
  }
}
</script>



<style scoped>
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

.form-section h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #1e1e1e;
}

.form-section p {
  margin-bottom: 30px;
  font-weight: 500;
  color: #2b2b2b;
  font-size: 1rem;
}

form input,
form select {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 14px;
  font-size: 1rem;
  background-color: #f6f6f6;
  color: #121212;
  transition: all 0.25s ease;
}

form select:focus,
form input:focus {
  outline: none;
  border-color: #5cae29;
  box-shadow: 0 0 6px #5cae2966;
  background-color: #fff;
}

form select:hover,
form input:hover {
  border-color: #5cae29;
}

form input::placeholder {
  color: #777;
}

button {
  background-color: #5cae29;
  color: white;
  border: none;
  padding: 14px;
  width: 100%;
  border-radius: 14px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #489c1f;
  transform: translateY(-1px);
}

.divider {
  text-align: center;
  margin: 30px 0 20px;
  position: relative;
  font-weight: 600;
  color: #444;
  font-size: 0.9rem;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  height: 1px;
  background-color: #bbb;
  top: 50%;
  width: 40%;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  padding: 0 10px;
  background: #9eff80;
  z-index: 1;
  position: relative;
  border-radius: 12px;
}

.social-login button {
  width: 100%;
  margin-bottom: 10px;
  padding: 12px;
  font-weight: bold;
  font-size: 0.95rem;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.google {
  background-color: white;
  color: #333;
}

.google:hover {
  background-color: #e5e5e5;
}

.apple {
  background-color: #000;
  color: white;
}

.apple:hover {
  background-color: #333;
}

.signup-link {
  text-align: center;
  margin-top: 25px;
  font-size: 0.95rem;
  color: #333;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.signup-link a:hover {
  text-decoration: underline;
}

.graphic-section {
  flex: 1;
  background-color: #0d0d0d;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 0 20px 20px 0;
}

.graphic-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 0 20px 20px 0;
}
</style>
