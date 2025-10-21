<template>
  <div class="admin-page">
    <h1>Enrollment Dashboard</h1>
    <p>Track and manage all enrollments from here.</p>

    <!-- Status Messages -->
    <p v-if="message" :class="{ success: !error, error: error }">{{ message }}</p>

    <div class="enrollment-list" v-if="!loading && enrollments.length">
      <h2>All Enrolments</h2>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Student Name</th>
          <th>Course</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="enrollment in enrollments" :key="enrollment.id">
          <td>{{ enrollment.id }}</td>
          <td>{{ enrollment.customerName }}</td>
          <td>{{ enrollment.courseTitle }}</td>
          <td :class="`status-${enrollment.status.toLowerCase()}`">
            {{ enrollment.status }}
          </td>
          <td class="action-buttons">
            <div v-if="enrollment.status === 'PENDING'">
              <button
                  class="approve-btn"
                  @click="approveEnrollment(enrollment.id)"
                  :disabled="actionLoading === enrollment.id"
              >
                {{ actionLoading === enrollment.id ? 'Processing...' : 'Approve' }}
              </button>
              <button
                  class="reject-btn"
                  @click="rejectEnrollment(enrollment.id)"
                  :disabled="actionLoading === enrollment.id"
              >
                {{ actionLoading === enrollment.id ? 'Processing...' : 'Reject' }}
              </button>
            </div>
            <div v-else>
              <button
                  class="reset-btn"
                  @click="resetEnrollment(enrollment.id)"
                  :disabled="actionLoading === enrollment.id"
              >
                {{ actionLoading === enrollment.id ? 'Processing...' : 'Reset to Pending' }}
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="loading" class="loading">
      <p>Loading enrollments...</p>
    </div>

    <div v-else class="no-enrollments">
      <p>No enrollments found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const enrollments = ref([])
const loading = ref(false)
const actionLoading = ref(null) // Track which enrollment is being processed
const message = ref('')
const error = ref(false)

async function fetchEnrollments() {
  try {
    loading.value = true
    message.value = ''
    error.value = false

    const response = await axios.get('http://localhost:8080/api/enrollments')
    enrollments.value = response.data
  } catch (err) {
    console.error('Failed to fetch enrollments:', err)
    message.value = 'Failed to load enrollments: ' + (err.response?.data || err.message)
    error.value = true
  } finally {
    loading.value = false
  }
}

async function approveEnrollment(id) {
  await updateEnrollmentStatus(id, 'approve', 'approved')
}

async function rejectEnrollment(id) {
  await updateEnrollmentStatus(id, 'reject', 'rejected')
}

async function resetEnrollment(id) {
  await updateEnrollmentStatus(id, 'reset', 'reset to pending')
}

async function updateEnrollmentStatus(id, action, actionText) {
  if (!confirm(`Are you sure you want to ${actionText} this enrollment?`)) {
    return
  }

  try {
    actionLoading.value = id
    message.value = ''
    error.value = false

    let url
    if (action === 'approve') {
      url = `http://localhost:8080/api/enrollments/${id}/approve`
    } else if (action === 'reject') {
      url = `http://localhost:8080/api/enrollments/${id}/reject`
    } else if (action === 'reset') {
      url = `http://localhost:8080/api/enrollments/${id}/reset`
    }

    const response = await axios.put(url)

    if (response.status === 200) {
      message.value = `Enrollment successfully ${actionText}.`
      error.value = false

      // Update the local state immediately for better UX
      const enrollmentIndex = enrollments.value.findIndex(e => e.id === id)
      if (enrollmentIndex !== -1) {
        if (action === 'reset') {
          enrollments.value[enrollmentIndex].status = 'PENDING'
        } else if (action === 'approve') {
          enrollments.value[enrollmentIndex].status = 'APPROVED'
        } else if (action === 'reject') {
          enrollments.value[enrollmentIndex].status = 'REJECTED'
        }
      }

      // Also refresh from server to ensure consistency
      await fetchEnrollments()
    }
  } catch (err) {
    console.error(`Failed to ${action} enrollment ${id}:`, err)
    const errorMessage = err.response?.data || err.message || `Failed to ${action} enrollment`
    message.value = typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage
    error.value = true
  } finally {
    actionLoading.value = null
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
.action-buttons {
  display: flex;
  gap: 8px;
}

.approve-btn {
  background-color: #00cc66;
  color: white;
}

.reject-btn {
  background-color: #ff4d4d;
  color: white;
}

.reset-btn {
  background-color: #666;
  color: white;
}

.action-buttons button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
}

.action-buttons button:hover {
  opacity: 0.9;
}
</style>
