<template>
  <div class="profile-container">
    <div class="profile-card">
      <h2>Profile Settings</h2>

      <form @submit.prevent="onSubmit">
        <div class="input-row">
          <div class="input-group">
            <label for="firstName">First name</label>
            <input id="firstName" v-model="form.firstName" type="text" placeholder="First name" />
          </div>

          <div class="input-group">
            <label for="lastName">Last name</label>
            <input id="lastName" v-model="form.lastName" type="text" placeholder="Last name" />
          </div>
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" placeholder="you@example.com" />
        </div>

        <div class="input-group">
          <label for="newPassword">New password</label>
          <input id="newPassword" v-model="form.newPassword" type="password" placeholder="••••••••" />
          <small v-if="passwordHelp" class="help">{{ passwordHelp }}</small>
        </div>

        <div class="input-group">
          <label for="role">Role</label>
          <select id="role" v-model="form.role" disabled>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Saving...' : 'Update Profile' }}
        </button>

        <p v-if="success" class="success">Profile updated successfully.</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const loading = ref(false)
const success = ref(false)
const error = ref('')
const passwordHelp = ref('Leave blank to keep your current password.')

const form = reactive({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  newPassword: '',
  role: '',
})

// ✅ Auto-assign user details from auth store
onMounted(() => {
  if (auth.user) {
    form.id = auth.user.id
    form.firstName = auth.user.firstName || ''
    form.lastName = auth.user.lastName || ''
    form.email = auth.user.email || ''
    form.role = auth.user.role || 'USER'
  } else {
    error.value = 'You must be logged in to view your profile.'
  }
})

async function onSubmit() {
  error.value = ''
  success.value = false

  if (!form.firstName || !form.lastName || !form.email) {
    error.value = 'First name, last name, and email are required.'
    return
  }

  const payload = {
    id: form.id,
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    role: form.role,
  }

  if (form.newPassword && form.newPassword.length >= 6) {
    payload.password = form.newPassword
  } else if (form.newPassword && form.newPassword.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }

  try {
    loading.value = true

    const base =
        form.role === 'ADMIN'
            ? 'http://localhost:8080/admins'
            : 'http://localhost:8080/customers'

    const res = await fetch(`${base}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error('Failed to update profile.')
    const updatedUser = await res.json()

    // ✅ Update store and localStorage
    auth.user = updatedUser
    localStorage.setItem('user', JSON.stringify(updatedUser))

    success.value = true
    form.newPassword = ''
  } catch (err) {
    console.error(err)
    error.value = err.message || 'Failed to update profile.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-card {
  background: rgba(31, 31, 31, 0.4);
  backdrop-filter: blur(60px);
  padding: 35px 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  max-width: 650px;
  margin: 50px auto;
  color: #fff;
}

.profile-card h2 {
  text-align: center;
  color: #00ff88;
  margin-bottom: 20px;
  font-weight: 600;
}

.input-row {
  display: flex;
  gap: 12px;
}

.input-group {
  margin-bottom: 16px;
  flex: 1;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  color: #aaa;
}

input,
select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #333;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 14px;
  transition: border 0.2s;
}

input:focus,
select:focus {
  border-color: #00ff88;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background-color: #00ff88;
  color: #121212;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success {
  margin-top: 12px;
  color: #7ef0a4;
}

.error {
  margin-top: 12px;
  color: #ff7b7b;
}

.help {
  display: block;
  margin-top: 6px;
  color: #888;
  font-size: 12px;
}
</style>
