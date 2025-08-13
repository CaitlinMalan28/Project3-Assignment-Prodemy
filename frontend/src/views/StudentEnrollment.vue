<template>
  <div class="enrollment-form">
    <h2>Enroll in a Course</h2>
    <form @submit.prevent="submitEnrollment" class="form">
      <label for="firstName">First Name:</label>
      <input
          id="firstName"
          type="text"
          v-model="firstName"
          placeholder="Enter your first name"
          required
      />

      <label for="lastName">Last Name:</label>
      <input
          id="lastName"
          type="text"
          v-model="lastName"
          placeholder="Enter your last name"
          required
      />

      <label for="course">Select Course:</label>
      <select id="course" v-model="selectedCourseTitle" required>
        <option disabled value="">-- Please select a course --</option>
        <option
            v-for="course in courses"
            :key="course.id"
            :value="course.title"
        >
          {{ course.title }}
        </option>
      </select>

      <button
          type="submit"
          :disabled="loading || !firstName.trim() || !lastName.trim() || !selectedCourseTitle"
      >
        {{ loading ? 'Submitting...' : 'Enroll' }}
      </button>
    </form>

    <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const firstName = ref('')
const lastName = ref('')
const selectedCourseTitle = ref('')
const courses = ref([])
const loading = ref(false)
const message = ref('')
const success = ref(false)

async function fetchCourses() {
  try {
    const res = await axios.get('http://localhost:8080/courses/all')
    courses.value = res.data
  } catch (err) {
    message.value = 'Failed to load courses. Please refresh.'
    success.value = false
  }
}

async function submitEnrollment() {
  if (!firstName.value.trim() || !lastName.value.trim()) {
    message.value = 'Please enter both your first and last name.'
    success.value = false
    return
  }
  if (!selectedCourseTitle.value) {
    message.value = 'Please select a course.'
    success.value = false
    return
  }

  loading.value = true
  message.value = ''

  try {
    const payload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      courseName: selectedCourseTitle.value,
    }

    const res = await axios.post(
        'http://localhost:8080/api/enrollments/enroll',
        payload
    )

    message.value = res.data || 'Enrollment successful!'
    success.value = true

    // Clear form
    firstName.value = ''
    lastName.value = ''
    selectedCourseTitle.value = ''
  } catch (error) {
    if (error.response && error.response.data) {
      message.value = error.response.data
    } else {
      message.value = 'Network error. Please try again later.'
    }
    success.value = false
  } finally {
    loading.value = false
  }
}

onMounted(fetchCourses)
</script>

<style scoped>
.enrollment-form {
  max-width: 400px;
  margin: 50px auto;
  padding: 25px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: white;
  font-family: Arial, sans-serif;
}

.enrollment-form h2 {
  margin-bottom: 20px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: bold;
}

input,
select {
  padding: 8px;
  margin-bottom: 20px;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
}

button {
  padding: 10px;
  background-color: #00cc66;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #009944;
}

p.success {
  margin-top: 15px;
  color: #00cc66;
  text-align: center;
}

p.error {
  margin-top: 15px;
  color: #ff4d4d;
  text-align: center;
}
</style>
