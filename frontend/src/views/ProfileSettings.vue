<template>
  <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
  />

  <div class="profile-settings">
    <h1>Profile Settings</h1>
    <form>
      <input type="text" placeholder="Full Name" />
      <input type="email" placeholder="Email" />

      <div class="password-field">
        <input
            :type="showSignupPassword ? 'text' : 'password'"
            placeholder="New Password"
        />
        <i
            class="fa-solid"
            :class="showSignupPassword ? 'fa-eye-slash active' : 'fa-eye'"
            @click="togglePassword"
        ></i>
      </div>

      <button type="submit">Update</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showSignupPassword = ref(false)

const togglePassword = () => {
  showSignupPassword.value = !showSignupPassword.value
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
  border: none;
  border-radius: 4px;
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
