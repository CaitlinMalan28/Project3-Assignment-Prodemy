<template>
  <div class="enrollment-card">
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

      <label for="email">Email:</label>
      <input
          id="email"
          type="email"
          v-model="email"
          placeholder="Enter your email"
          required
      />

      <label for="course">Course:</label>
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
          :disabled="loading || !firstName.trim() || !lastName.trim() || !email.trim() || !selectedCourseTitle"
      >
        {{ loading ? 'Submitting...' : 'Enroll' }}
      </button>
    </form>

    <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// User details
const firstName = ref('')
const lastName = ref('')
const email = ref('')

// Course selection
const selectedCourseTitle = ref('')
const courses = ref([])

const loading = ref(false)
const message = ref('')
const success = ref(false)

// Get query params from Courses.vue (if coming from course selection)
const route = useRoute()

onMounted(() => {
  // Prefill user details if available in query params
  if (route.query.firstName) firstName.value = route.query.firstName
  if (route.query.lastName) lastName.value = route.query.lastName
  if (route.query.email) email.value = route.query.email
  if (route.query.courseTitle) selectedCourseTitle.value = route.query.courseTitle

  fetchCourses()
})

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
  if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !selectedCourseTitle.value) {
    message.value = 'All fields are required.'
    success.value = false
    return
  }

  loading.value = true
  message.value = ''

  try {
    const payload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      courseName: selectedCourseTitle.value
    }

    const res = await axios.post(
        'http://localhost:8080/api/enrollments/enroll',
        payload
    )

    message.value = res.data || 'Enrollment successful!'
    success.value = true

    // Optionally clear form
    firstName.value = ''
    lastName.value = ''
    email.value = ''
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
</script>

<style scoped>
.enrollment-card {
  background: rgba(31, 31, 31, 0.4);
  backdrop-filter: blur(60px);
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  margin: 40px auto;
  color: #fff;
  transition: transform 0.2s;
}

.enrollment-card:hover {
  transform: translateY(-3px);
}

.enrollment-card h2 {
  text-align: center;
  color: #00ff88;
  margin-bottom: 25px;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-size: 14px;
  color: #aaa;
}

input,
select {
  padding: 12px 14px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #333;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 14px;
  transition: border 0.3s, box-shadow 0.3s;
}

input:focus,
select:focus {
  border-color: #00ff88;
  outline: none;
  box-shadow: 0 0 6px rgba(0, 255, 136, 0.5);
}

button {
  padding: 14px;
  border-radius: 10px;
  border: none;
  background-color: #00ff88;
  color: #121212;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #00cc66;
  transform: translateY(-2px);
}

p.success {
  margin-top: 15px;
  color: #00ff88;
  text-align: center;
}

p.error {
  margin-top: 15px;
  color: #ff4d4d;
  text-align: center;
}
</style>
