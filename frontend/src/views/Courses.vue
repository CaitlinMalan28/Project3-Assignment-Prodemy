<template>
  <div class="courses-page">
    <h1>Explore <span class="brand">Courses</span></h1>
    <p class="subtitle">Boost your skills with our curated productivity and tech tracks.</p>

    <div v-if="loading">Loading courses...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div class="courses-grid" v-else>
      <div class="course-card" v-for="course in courses" :key="course.id">
        <img :src="course.imageUrl || placeholderImage" :alt="course.title" class="course-image" />
        <h2>{{ course.title }}</h2>
        <p>{{ course.description }}</p>
        <router-link :to="`/courses/${course.id}`" class="enroll-btn">View Course</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/courses/all')
    courses.value = res.data.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      image: c.imageUrl || 'fallback.jpg'
    }))
  } catch (e) {
    console.error('Failed to load courses', e)
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
  color: #ccc;
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
  text-decoration: none;
  font-weight: bold;
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
