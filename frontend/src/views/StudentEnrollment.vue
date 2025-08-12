<template>
  <div class="enrollment-form">
    <h2>Enroll in a Course</h2>
    <form @submit.prevent="submitEnrollment" class="form">
      <label for="course">Select Course:</label>
      <select id="course" v-model="selectedCourseId" required>
        <option disabled value="">-- Please select a course --</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Submitting...' : 'Enroll' }}
      </button>
    </form>

    <p v-if="message" :class="{'success': success, 'error': !success}">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses = ref([])
const selectedCourseId = ref('')
const message = ref('')
const success = ref(false)
const loading = ref(false)

// Replace with the actual logged-in student ID dynamically, hardcoded here for example
const studentId = 5

async function fetchCourses() {
  try {
    const { data } = await axios.get('http://localhost:8080/courses/all')
    courses.value = data
  } catch (err) {
    console.error('Error fetching courses:', err)
    message.value = 'Failed to load courses. Please try again later.'
    success.value = false
  }
}

async function submitEnrollment() {
  if (!selectedCourseId.value) {
    message.value = 'Please select a course before submitting.'
    success.value = false
    return
  }

  loading.value = true
  message.value = ''

  try {
    const payload = {
      customer: { id: studentId },
      course: { id: selectedCourseId.value },
      status: 'PENDING'
    }

    await axios.post('http://localhost:8080/api/enrollments', payload)

    message.value = 'Enrollment request submitted successfully!'
    success.value = true
    selectedCourseId.value = ''
  } catch (err) {
    console.error('Error submitting enrollment:', err)
    message.value = 'Failed to submit enrollment. Please try again.'
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
  background-color: rgba(0,0,0,0.3);
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
