<template>
  <header class="header">
    <h1 class="logo">Prodemy</h1>
    <nav class="nav-links">
      <!-- Always visible -->
      <router-link to="/">Home</router-link>
      <router-link to="/about-us">About Us</router-link>
      <router-link to="/contact">Contact</router-link>

      <!-- 🔹 Visible only when logged in -->
      <template v-if="auth.user">
        <router-link to="/Prodemy_Agent">Prodemy Agent</router-link>
        <router-link to="/courses">Courses</router-link>
      </template>

      <!-- 🔹 Show account dropdown if logged in -->
      <div v-if="auth.user" class="account-dropdown">
        <span>{{ auth.user.firstName }} ▾</span>
        <div class="dropdown-menu">
          <router-link to="/lesson/1">Lesson Player</router-link>
          <router-link to="/profile">Profile Settings</router-link>
          <router-link to="/contact">Support</router-link>
          <router-link to="/StudentEnrollment">Student Enrollment</router-link>
          <router-link to="/Quiz">Quiz</router-link>
          <a href="#" @click.prevent="logout">Log Out</a>
        </div>
      </div>

      <!-- 🔹 Show Login button when not logged in -->
      <div v-else>
        <router-link to="/login" class="login-btn">Login</router-link>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background-color: transparent;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.logo {
  color: #00ff88;
  font-weight: bold;
  font-size: 2rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
}

.nav-links a {
  color: greenyellow;
  text-decoration: none;
  transition: color 0.2s;
  font-weight: bold;
  font-size: 1.1rem;
}

.nav-links a:hover {
  color: #00ff88;
  font-weight: bold;
}

.account-dropdown {
  position: relative;
  cursor: pointer;
  color: greenyellow;
}

.account-dropdown:hover .dropdown-menu {
  display: flex;
  flex-direction: column;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 25px;
  right: 0;
  background-color: #2a2a2a;
  border: 1px solid #00ff88;
  border-radius: 4px;
  min-width: 200px;
  z-index: 10;
}

.dropdown-menu a {
  padding: 10px;
  color: lawngreen;
  text-decoration: none;
}

.dropdown-menu a:hover {
  background-color: #00ff88;
  color: black;
}

.login-btn {
  background-color: #00ff88;
  color: black;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  transition: background 0.2s;
}

.login-btn:hover {
  background-color: #5affb5;
}
</style>
