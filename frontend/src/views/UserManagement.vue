<template>
  <div class="admin-page">
    <h1>User Management</h1>

    <p v-if="message" :class="{ success: !error, error: error }">{{ message }}</p>

    <!-- Add / Edit User Form -->
    <form @submit.prevent="submitUser" class="form">
      <input v-model="userForm.firstName" type="text" placeholder="First Name" required />
      <input v-model="userForm.lastName" type="text" placeholder="Last Name" required />
      <input v-model="userForm.email" type="email" placeholder="Email" required />
      <input v-model="userForm.password" type="password" placeholder="Password" :required="!userForm.id" />
      <select v-model="userForm.role" required>
        <option value="" disabled>Select Role</option>
        <option value="STUDENT">Student</option>
        <option value="INSTRUCTOR">Instructor</option>
      </select>
      <button type="submit" :disabled="loading">
        {{ loading ? (userForm.id ? 'Updating...' : 'Creating...') : (userForm.id ? 'Update User' : 'Create User') }}
      </button>
      <button v-if="userForm.id" type="button" @click="resetForm">Cancel</button>
    </form>

    <!-- User List -->
    <div class="user-list">
      <h2>All Users</h2>
      <table>
        <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="editUser(user)">Edit</button>
            <button @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const loading = ref(false)
const message = ref('')
const error = ref(false)

// Form data
const userForm = ref({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: ''
})

async function fetchUsers() {
  try {
    loading.value = true
    const res = await axios.get('http://localhost:8080/customers/all')
    users.value = res.data
  } catch {
    message.value = 'Failed to load users.'
    error.value = true
  } finally {
    loading.value = false
  }
}

function resetForm() {
  userForm.value = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  }
  message.value = ''
  error.value = false
}

async function submitUser() {
  // Basic validation
  if (!userForm.value.firstName.trim() ||
      !userForm.value.lastName.trim() ||
      !userForm.value.email.trim() ||
      !userForm.value.role ||
      (!userForm.value.id && !userForm.value.password)
  ) {
    message.value = 'Please fill all required fields.'
    error.value = true
    return
  }

  loading.value = true
  message.value = ''
  error.value = false

  try {
    if (userForm.value.id) {
      // Update user
      // If password is empty string on update, exclude it from payload (to avoid overwriting)
      const payload = {
        id: userForm.value.id,
        firstName: userForm.value.firstName.trim(),
        lastName: userForm.value.lastName.trim(),
        email: userForm.value.email.trim(),
        role: userForm.value.role
      }
      if (userForm.value.password.trim()) {
        payload.password = userForm.value.password
      }

      await axios.put(`http://localhost:8080/customers/update`, payload)
      message.value = 'User updated successfully.'
    } else {
      // Create user
      await axios.post('http://localhost:8080/customers/register', {
        id: 0,
        firstName: userForm.value.firstName.trim(),
        lastName: userForm.value.lastName.trim(),
        email: userForm.value.email.trim(),
        password: userForm.value.password,
        role: userForm.value.role
      })
      message.value = 'User created successfully.'
    }
    await fetchUsers()
    resetForm()
  } catch (err) {
    message.value = err.response?.data || 'Operation failed.'
    error.value = true
  } finally {
    loading.value = false
  }
}

function editUser(user) {
  userForm.value = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: '', // Clear password on edit; user can enter a new one if needed
    role: user.role
  }
  message.value = ''
  error.value = false
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return
  loading.value = true
  message.value = ''
  error.value = false
  try {
    await axios.delete(`http://localhost:8080/customers/delete/${id}`)
    users.value = users.value.filter(u => u.id !== id)
    message.value = 'User deleted successfully.'
  } catch {
    message.value = 'Failed to delete user.'
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.admin-page {
  max-width: 800px;
  margin: 60px auto;
  padding: 30px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: white;
  font-family: Arial, sans-serif;
}

form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

input,
select,
button {
  padding: 10px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
}

input,
select {
  flex: 1 1 150px;
  min-width: 150px;
}

button {
  background-color: #00cc66;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 120px;
}

button:disabled {
  background-color: #777;
  cursor: not-allowed;
}

button[type='button'] {
  background-color: #ff4d4d;
  margin-left: 10px;
}

p.success {
  color: #00cc66;
  margin-bottom: 15px;
  text-align: center;
}

p.error {
  color: #ff4d4d;
  margin-bottom: 15px;
  text-align: center;
}

.user-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.user-list th,
.user-list td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.user-list th {
  background-color: #444;
  color: white;
}

.user-list button {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.user-list button:first-of-type {
  background-color: #00cc66;
  color: white;
}

.user-list button:last-of-type {
  background-color: #ff4d4d;
  color: white;
}
</style>
