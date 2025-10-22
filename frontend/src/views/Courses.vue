<template>
  <div class="courses-page">
    <h1>Explore <span class="brand">Courses</span></h1>
    <p class="subtitle">Boost your skills with our curated productivity and tech tracks.</p>

    <div v-if="loading">Loading courses...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <img :src="getCourseImage(course.id)" :alt="course.title" class="course-image" />
        <h2>{{ course.title }}</h2>
        <p>{{ course.description }}</p>
        <button class="enroll-btn" @click="enroll(course)">Enroll Course</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()

const courses = ref([])
const loading = ref(true)
const error = ref(null)

// Build image URL from backend
const getCourseImage = (id) => `http://localhost:8080/courses/media/${id}`

// Navigate to enrollment page with user + course info
function enroll(course) {
  if (!auth.user) {
    alert('Please log in to enroll in a course.')
    router.push('/Login')
    return
  }

  router.push({
    name: 'StudentEnrollment',
    query: {
      courseId: course.id,
      courseTitle: course.title,
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
      email: auth.user.email,
    },
  })
}

// Fetch all courses from backend
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/courses/all')
    courses.value = res.data.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description
    }))
  } catch (err) {
    console.error('Failed to load courses', err)
    error.value = 'Failed to load courses. Please try again later.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.courses-page {
  max-width: 1100px;
  margin: 60px auto;
  padding: 20px;
  color: white;
  text-align: center;
}

.brand {
  color: #00ff88;
}

.subtitle {
  color: black;
  margin-bottom: 40px;
}

.courses-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.course-card {
  background-color: #1e1e1e;
  border: 1px solid #00ff88;
  border-radius: 8px;
  padding: 20px;
  width: 280px;
  text-align: left;
  transition: transform 0.3s, box-shadow 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px #00ff8855;
}

.enroll-btn {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #00ff88;
  color: #121212;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.enroll-btn:hover {
  background-color: #00cc66;
}

.course-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 0 10px #00000055;
}

.error {
  color: #ff6b6b;
  margin-bottom: 20px;
}
</style>
