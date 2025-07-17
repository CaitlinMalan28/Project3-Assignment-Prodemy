<template>
  <div class="dashboard">
    <h1>Welcome back, {{ user.name }} 👋</h1>

    <section class="progress-section">
      <h2>Your Progress</h2>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: user.progress + '%' }"></div>
      </div>
      <p>{{ user.progress }}% completed</p>
    </section>

    <section class="courses-section">
      <h2>Enrolled Courses</h2>
      <div v-if="courses.length" class="courses-grid">
      </div>
      <p v-else>You haven’t enrolled in any courses yet.</p>
    </section>
  </div>
</template>

<script setup>

const user = {
  name: 'Philani',
  progress: 45 // Example static value
}

const courses = [
  {
    id: 1,
    title: 'Web Development Essentials',
    description: 'Learn HTML, CSS, and JavaScript.',
    image: '@/assets/webDevelopment.jpg'
  },
  {
    id: 2,
    title: 'Introduction to Python',
    description: 'Start your Python journey.',
    image: '@/assets/python.jpg'
  }
]
</script>

<style scoped>
.dashboard {
  color: white;
  padding: 20px;
  max-width: 1000px;
  margin: auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 30px;
}

.progress-section {
  margin-bottom: 50px;
}

.progress-bar {
  background-color: #333;
  border-radius: 8px;
  height: 20px;
  width: 100%;
  overflow: hidden;
  margin-top: 10px;
}

.progress-fill {
  height: 100%;
  background-color: #00ff88;
  transition: width 0.3s ease-in-out;
}

.courses-section h2 {
  margin-bottom: 20px;
}

.courses-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
