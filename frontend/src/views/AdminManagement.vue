<template>
  <div class="admin-users">
    <h1>Manage Users</h1>

    <div v-if="loading">Loading users...</div>
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
        <td>{{ user.firstName }}</td>
        <td>{{ user.lastName }}</td>
        <td>{{ user.email }}</td>
        <td>
          <select v-model="user.role">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </td>
        <td>
          <button @click="updateUser(user)">Update</button>
          <button @click="deleteUser(user.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const loading = ref(true)
const error = ref('')

const backendUrl = 'http://localhost:8080/admins/all' // Replace with your API endpoint

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get(`http://localhost:8080/admins/all`)
    users.value = res.data
  } catch (e) {
    console.error('Failed to load users', e)
    error.value = 'Failed to load users.'
  } finally {
    loading.value = false
  }
}

const updateUser = async (user) => {
  try {
    await axios.put(`http://localhost:8080/admins/update`, user)
    alert(`User ${user.id} updated!`)
  } catch (e) {
    console.error('Failed to update user', e)
    alert('Failed to update user')
  }
}

const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  try {
    await axios.delete(`http://localhost:8080/admins/read/${id}`)
    alert('User deleted!')
    fetchUsers()
  } catch (e) {
    console.error('Failed to delete user', e)
    alert('Failed to delete user')
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
}

.users-table th {
  background: #1e1e1e;
}

.users-table select {
  background: #2a2a2a;
  color: white;
  border: 1px solid #00ff88;
  border-radius: 4px;
  padding: 5px;
}

button {
  margin-right: 5px;
  padding: 5px 10px;
  background: #00ff88;
  border: none;
  border-radius: 4px;
  color: #121212;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #00cc66;
}

.error {
  color: #ff6b6b;
}
</style>
