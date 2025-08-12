<template>
  <div class="admin-page">
    <h1>Enrollment Dashboard</h1>
    <p>Track and manage all enrollments from here.</p>

    <div class="enrollment-list" v-if="enrollments.length">
      <h2>All Enrollments</h2>
      <table>
        <thead>
        <tr>
          <th>Student Name</th>
          <th>Course</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="enrollment in enrollments" :key="enrollment.id">
          <td>{{ enrollment.customerName }}</td>
          <td>{{ enrollment.courseTitle }}</td>
          <td>{{ enrollment.status }}</td>
          <td>
            <button
                v-if="enrollment.status === 'PENDING'"
                @click="approveEnrollment(enrollment.id)"
            >
              Approve
            </button>
            <button
                v-if="enrollment.status === 'APPROVED'"
                @click="rejectEnrollment(enrollment.id)"
            >
              Reject
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <p>No enrollments found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const enrollments = ref([])

async function fetchEnrollments() {
  try {
    const { data } = await axios.get('http://localhost:8080/api/enrollments')
    enrollments.value = data
  } catch (err) {
    console.error('Failed to fetch enrollments:', err)
  }
}

async function approveEnrollment(id) {
  try {
    await axios.put(`http://localhost:8080/api/enrollments/${id}/approve`)
    await fetchEnrollments()
  } catch (err) {
    console.error(`Failed to approve enrollment ${id}:`, err)
  }
}

async function rejectEnrollment(id) {
  try {
    await axios.put(`http://localhost:8080/api/enrollments/${id}/reject`)
    await fetchEnrollments()
  } catch (err) {
    console.error(`Failed to reject enrollment ${id}:`, err)
  }
}

onMounted(fetchEnrollments)
</script>

<style scoped>
.admin-page {
  padding: 40px;
  max-width: 800px;
  margin: 60px auto;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  color: white;
}

.enrollment-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.enrollment-list th,
.enrollment-list td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.enrollment-list th {
  background-color: #444;
  color: white;
}

.enrollment-list button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.enrollment-list button:first-of-type {
  background-color: #00cc66;
  color: white;
}

.enrollment-list button:last-of-type {
  background-color: #ff4d4d;
  color: white;
}
</style>
