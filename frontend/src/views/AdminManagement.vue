<template>
  <div class="admin-users">
    <h1>Manage Users</h1>

    <div v-if="loading" class="status">Loading users...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else class="users-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>
          <input
              v-model="user.firstName"
              :disabled="isProcessing(user.id)"
              class="small-input"
          />
        </td>
        <td>
          <input
              v-model="user.lastName"
              :disabled="isProcessing(user.id)"
              class="small-input"
          />
        </td>
        <td>
          <input
              v-model="user.email"
              :disabled="isProcessing(user.id)"
              class="small-input"
          />
        </td>
        <td>
          <select v-model="user.role" :disabled="isProcessing(user.id)">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </td>
        <td class="actions">
          <button
              @click="updateUser(user)"
              :disabled="isProcessing(user.id)"
              class="btn"
          >
            {{ isProcessing(user.id) ? 'Updating...' : 'Update' }}
          </button>

          <button
              @click="deleteUser(user.id)"
              :disabled="isProcessing(user.id)"
              class="btn danger"
          >
            {{ isProcessing(user.id) ? 'Deleting...' : 'Delete' }}
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const loading = ref(true)
const error = ref('')
const successMessage = ref('')

// base URL for admin endpoints
const BASE = 'http://localhost:8080/admins'

// tracks per-row processing state (by id)
const processing = reactive({})

function setProcessing(id, val) {
  if (id == null) return
  processing[id] = !!val
}

function isProcessing(id) {
  return !!processing[id]
}

const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  try {
    const res = await axios.get(`${BASE}/all`)
    users.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error('Failed to load users', e)
    error.value = 'Failed to load users. Check backend or network.'
  } finally {
    loading.value = false
  }
}

const updateUser = async (user) => {
  if (!user || !user.id) return
  error.value = ''
  successMessage.value = ''
  setProcessing(user.id, true)

  try {
    // backend expects POST /admins/update with Admin object
    const res = await axios.post(`${BASE}/update`, user)

    // replace the user record with returned object (if backend returns updated entity)
    if (res?.data) {
      const idx = users.value.findIndex(u => u.id === res.data.id)
      if (idx !== -1) users.value.splice(idx, 1, res.data)
    }

    successMessage.value = `User ${user.id} updated successfully.`
  } catch (e) {
    console.error('Failed to update user', e)
    // try to show backend message when available
    error.value =
        e?.response?.data?.message ||
        e?.response?.data ||
        'Failed to update user. Check console for details.'
  } finally {
    setProcessing(user.id, false)
    // clear success message after a short while
    setTimeout(() => (successMessage.value = ''), 3000)
  }
}

const deleteUser = async (id) => {
  if (!id) return
  if (!confirm('Are you sure you want to delete this user?')) return

  error.value = ''
  successMessage.value = ''
  setProcessing(id, true)

  try {
    // backend expects DELETE /admins/delete/{id}
    await axios.delete(`${BASE}/delete/${id}`)

    // remove from users list locally
    users.value = users.value.filter(u => u.id !== id)
    successMessage.value = `User ${id} deleted.`
  } catch (e) {
    console.error('Failed to delete user', e)
    error.value =
        e?.response?.data?.message ||
        e?.response?.data ||
        'Failed to delete user. Check console for details.'
  } finally {
    setProcessing(id, false)
    setTimeout(() => (successMessage.value = ''), 3000)
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.admin-users {
  max-width: 1000px;
  margin: 50px auto;
  color: white;
  padding: 20px;
  background: #121212;
  border-radius: 8px;
}

.status {
  color: #ddd;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.users-table th,
.users-table td {
  border: 1px solid #00ff88;
  padding: 10px;
  text-align: left;
  vertical-align: middle;
}

.users-table th {
  background: #1e1e1e;
}

.small-input {
  width: 100%;
  padding: 6px 8px;
  background: #2a2a2a;
  color: #fff;
  border: 1px solid #333;
  border-radius: 4px;
}

.users-table select {
  background: #2a2a2a;
  color: white;
  border: 1px solid #00ff88;
  border-radius: 4px;
  padding: 5px;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 10px;
  background: #00ff88;
  border: none;
  border-radius: 4px;
  color: #121212;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover:not(:disabled) {
  background: #00cc66;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn.danger {
  background: #ff6b6b;
  color: #121212;
}

.btn.danger:hover:not(:disabled) {
  background: #ff4d4d;
}

.error {
  color: #ff6b6b;
  margin-top: 12px;
}

.success {
  color: #7ef0a4;
  margin-top: 12px;
}
</style>
