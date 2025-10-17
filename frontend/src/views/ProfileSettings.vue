<template>
  <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
  />

  <div class="profile-settings">
    <h1>Profile Settings</h1>
    <form @submit.prevent="updateProfile">
      <input
          type="text"
          v-model="currentUser.firstName"
          placeholder="First Name"
      />
      <input
          type="text"
          v-model="currentUser.lastName"
          placeholder="Last Name"
      />
      <input
          type="email"
          v-model="currentUser.email"
          placeholder="Email"
      />

      <div class="password-field">
        <input
            :type="showPassword ? 'text' : 'password'"
            v-model="currentUser.password"
            placeholder="New Password"
        />
        <i
            class="fa-solid"
            :class="showPassword ? 'fa-eye-slash active' : 'fa-eye'"
            @click="togglePassword"
        ></i>
      </div>

      <button type="submit">Update</button>
      <button type="submit">Log Out</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const showPassword = ref(false)
const togglePassword = () => (showPassword.value = !showPassword.value)

const currentUser = ref({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: ''
})

// Fetch current user from backend/database
onMounted(async () => {
  try {
    const userId = '1'
    const res = await axios.get(`http://localhost:8080/admins/current/${userId}`)
    currentUser.value = res.data
  } catch (e) {
    console.error('Failed to fetch current user:', e)
  }
})


// Update profile
const updateProfile = async () => {
  try {
    const res = await axios.post('http://localhost:8080/admins/update', currentUser.value)
    alert('Profile updated!')
    currentUser.value = res.data
    localStorage.setItem('currentUser', JSON.stringify(res.data))
  } catch (e) {
    console.error('Failed to update profile', e)
    alert('Update failed')
  }
}

//Still in working-progress
const logout = async () => {
  try {
    await axios.post('http://localhost:8080/admins/logout')
    alert('Logged out!')
    window.location.href = '/login'
  } catch (e) {
    console.error('Logout failed', e)
  }
}

</script>

<style scoped>
.profile-settings {
  color: white;
  padding: 20px;
  max-width: 500px;
  margin: auto;
}

input,
button {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  background: #2a2a2a;
  color: white;
  border: 1px solid #00ff88;
  border-radius: 4px;
  font-size: 16px;
}

.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field input {
  flex: 1;
}

.password-field i {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #00ff88;
  transition: all 0.3s ease;
  font-size: 18px;
}

.password-field i:hover {
  color: #121212;
}

.password-field i.active {
  color: #00ff88;
}

button {
  background-color: #00ff88;
  color: #121212;
  cursor: pointer;
  padding: 10px;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #00cc70;
}
</style>
