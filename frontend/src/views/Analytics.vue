<template>
  <div class="analytics-page">
    <h1>Platform <span class="brand">Analytics</span></h1>
    <p class="subtitle">Track platform activity and usage at a glance.</p>

    <div v-if="loading">Loading analytics...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div class="analytics-grid" v-else>
      <div class="analytics-card">
        <h2>👤 Total Users</h2>
        <p>{{ analytics.totalUsers }}</p>
      </div>
      <div class="analytics-card">
        <h2>🛠️ Total Admins</h2>
        <p>{{ analytics.totalAdmins }}</p>
      </div>
      <div class="analytics-card">
        <h2>📚 Total Courses</h2>
        <p>{{ analytics.totalCourses }}</p>
      </div>
      <div class="analytics-card">
        <h2>📝 Total Quizzes</h2>
        <p>{{ analytics.totalQuizzes }}</p>
      </div>
      <div class="analytics-card">
        <h2>📩 Support Messages</h2>
        <p>{{ analytics.totalContactSupportMessages }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const analytics = ref({})
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/analytics')
    analytics.value = res.data
  } catch (err) {
    error.value = 'Failed to load analytics'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.analytics-page {
  max-width: 1000px;
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

.analytics-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.analytics-card {
  background-color: #1e1e1e;
  border: 1px solid #00ff88;
  border-radius: 8px;
  padding: 20px;
  width: 280px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.analytics-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px #00ff8855;
}

.analytics-card h2 {
  margin-bottom: 10px;
}

.analytics-card p {
  font-size: 2rem;
  color: #00ff88;
}

.error {
  color: #ff6b6b;
  margin-bottom: 20px;
}
</style>