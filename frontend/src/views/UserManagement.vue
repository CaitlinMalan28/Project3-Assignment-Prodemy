<template>
  <div class="admin-page">
    <h1>User Management</h1>
    <p>This is where you will manage all users (students and instructors).</p>

    <!-- Add User Form -->
    <div class="add-user-form">
      <h2>Add New User</h2>
      <form @submit.prevent="addUser">
        <input v-model="newUser.name" type="text" placeholder="Name" required />
        <input v-model="newUser.email" type="email" placeholder="Email" required />
        <select v-model="newUser.role" required>
          <option value="" disabled>Select Role</option>
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
        </select>
        <button type="submit">Add User</button>
      </form>
    </div>

    <!-- User List -->
    <div class="user-list">
      <h2>All Users</h2>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
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
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'STUDENT' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'INSTRUCTOR' },
])

const newUser = ref({ name: '', email: '', role: '' })

function addUser() {
  if (newUser.value.name && newUser.value.email && newUser.value.role) {
    const id = users.value.length + 1
    users.value.push({ id, ...newUser.value })
    newUser.value = { name: '', email: '', role: '' }
  }
}

function editUser(user) {
  const index = users.value.findIndex((u) => u.id === user.id)
  if (index !== -1) {
    const updatedName = prompt('Edit Name:', user.name)
    const updatedEmail = prompt('Edit Email:', user.email)
    const updatedRole = prompt('Edit Role (STUDENT/INSTRUCTOR):', user.role)
    if (updatedName && updatedEmail && updatedRole) {
      users.value[index] = { ...user, name: updatedName, email: updatedEmail, role: updatedRole }
    }
  }
}

function deleteUser(id) {
  users.value = users.value.filter((user) => user.id !== id)
}
</script>

<style scoped>
.admin-page {
  padding: 40px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  max-width: 800px;
  margin: 60px auto;
}

.add-user-form {
  margin-bottom: 30px;
}

.add-user-form form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.add-user-form input,
.add-user-form select,
.add-user-form button {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.user-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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