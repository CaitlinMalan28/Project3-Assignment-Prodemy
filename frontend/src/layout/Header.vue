<template>
  <header class="header">
    <h1 class="logo">Prodemy</h1>
    <nav class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/courses">Courses</router-link>
      <router-link to="/about-us">About Us</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/analytics">Analytics</router-link>

      <div class="account-dropdown">
        <span>Account ▾</span>
        <div class="dropdown-menu">
          <router-link to="/dashboard">Dashboard</router-link>
          <router-link to="/CourseManagement">Manage Courses</router-link>
          <router-link to="/lesson/1">Lesson Player (sample)</router-link>
          <router-link to="/profile">Profile / Settings</router-link>
          <router-link to="/contact">Support</router-link>
          <router-link to="/login">Login</router-link>
          <router-link to="/signup">Signup</router-link>
          <router-link to="/StudentEnrollment">Student Enrollment</router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// Simulated authentication state
const isAuthenticated = ref(false)
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
  font-size: 2.0rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
}

.nav-links a {
  color: lawngreen;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #00ff88;
}

.account-dropdown {
  position: relative;
  cursor: pointer;
  color: lawngreen;
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
</style>
