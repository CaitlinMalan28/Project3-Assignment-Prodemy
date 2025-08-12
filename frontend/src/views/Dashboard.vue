<template>
  <div class="dashboard-page">
    <h1>Welcome back, {{ user.name }}!</h1>

    <!-- ADMIN VIEW -->
    <div v-if="user.role === 'ADMIN'" class="admin-section">
      <h2>📊 Admin Dashboard</h2>
      <p>Manage platform-wide content and oversee course engagement.</p>

      <!-- Admin Tools -->
      <div class="admin-tools">
        <div class="admin-tool">
          <h3>User Management</h3>
          <p>View, add, or manage users (students, instructors).</p>
          <button class="admin-btn" @click="goTo('/UserManagement')">Go to Users</button>
        </div>

        <div class="admin-tool">
          <h3>Course Management</h3>
          <p>Create, update, or remove courses and assign instructors.</p>
          <button class="admin-btn" @click="goTo('/CourseManagement')">Manage Courses</button>

        </div>

        <div class="admin-tool">
          <h3>Enrollment Control</h3>
          <p>Track who’s enrolled and approve or revoke access.</p>
          <button class="admin-btn" @click="goTo('/enrollment')">Enrollment Dashboard</button>
        </div>

        <div class="admin-tool">
          <h3>Reports & Analytics</h3>
          <p>Monitor student progress, engagement, and completion stats.</p>
          <button class="admin-btn" @click="goTo('/analytics')">View Reports</button>
        </div>
      </div>
    </div>


    <!-- CUSTOMER VIEW -->
    <div v-else class="courses-page">
      <h2>Explore <span class="brand">Courses</span></h2>
      <p class="subtitle">Boost your skills with our curated productivity and tech tracks.</p>

      <div class="courses-grid">
        <div class="course-card" v-for="course in courses" :key="course.id">
          <img :src="course.image" :alt="course.title" class="course-image" />
          <h3>{{ course.title }}</h3>
          <p>{{ course.description }}</p>
          <router-link :to="`/courses/${course.id}`" class="enroll-btn">View Course</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import productivityM from '@/assets/productivityM.jpg'
import webDevelopment from '@/assets/webDevelopment.jpg'
import time from '@/assets/time.jpg'
import python from '@/assets/python.jpg'
import application from '@/assets/application.jpg'
import professionalE from '@/assets/professionalE.jpg'

const router = useRouter()

const goTo = (path) => {
  router.push(path)
}

const user = {
  name: 'Philani',
  role: 'ADMIN'
}

const courses = [
  {
    id: 1,
    title: "Productivity Mastery",
    description: "Learn powerful strategies and tools to manage your time and tasks efficiently.",
    image: productivityM
  },
  {
    id: 2,
    title: "Web Development Essentials",
    description: "Master HTML, CSS, and JavaScript to build responsive and interactive websites.",
    image: webDevelopment
  },
  {
    id: 3,
    title: "Time Management Techniques",
    description: "Explore proven methods like Pomodoro, Eisenhower Matrix, and more.",
    image: time
  },
  {
    id: 4,
    title: "Introduction to Python",
    description: "Start coding with Python and build your foundation in programming.",
    image: python
  },
  {
    id: 5,
    title: "Introduction to Application Development",
    description: "Start learning ADP module and build your foundation in programming.",
    image: application
  },
  {
    id: 6,
    title: "Professional Essentials",
    description: "Start learning Professional to know everything about programming.",
    image: professionalE
  },
];
</script>


<style scoped>
.dashboard-page {
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
  border-radius: 12px;
  padding: 20px;
  width: 280px;
  text-align: left;
  transition: transform 0.3s, box-shadow 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px #00ff8855;
}

.course-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 0 10px #00000055;
}

.enroll-btn {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #00ff88;
  color: #121212;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}

.enroll-btn:hover {
  background-color: #00cc66;
}

.admin-section {
  background-color:  rgba(28, 28, 28, 0.5);
  padding: 30px;
  border-radius: 14px;
  border: 1px solid #00ff88;
  box-shadow: 0 0 15px #00ff8844;
}
.admin-tools {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
  text-align: left;
}

.admin-tool {
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #00ff88;
  box-shadow: 0 0 10px #00ff8822;
}

.admin-tool h3 {
  margin-bottom: 10px;
  color: #00ff88;
}

.admin-btn {
  margin-top: 15px;
  background-color: #00ff88;
  color: #121212;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.admin-btn:hover {
  background-color: #00cc66;
}

</style>
