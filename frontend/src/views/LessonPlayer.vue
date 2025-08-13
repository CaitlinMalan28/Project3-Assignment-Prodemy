<template>
  <div class="lesson-player-page">
    <h1 class="page-title">Learn Coding <span class="brand">Mastery</span></h1>

    <div class="content">
      <div class="video-section">
        <h2 class="video-title">{{ currentLesson.title }}</h2>
        <div class="video-wrapper">
          <iframe
              :src="`https://www.youtube.com/embed/${currentLesson.videoId}`"
              frameborder="0"
              allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
        <p class="video-description">{{ currentLesson.description }}</p>
      </div>

      <div class="lessons-list">
        <h3>All Lessons</h3>
        <ul>
          <li v-for="lesson in lessons" :key="lesson.videoId" @click="selectLesson(lesson)">
            <div class="lesson-card">
              <div class="lesson-title">{{ lesson.title }}</div>
              <div class="lesson-desc">{{ lesson.description }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const lessons = [
  // Web Development
  { title: 'HTML Full Course', videoId: 'pQN-pnXPaVg', description: 'Learn HTML from scratch.' },
  { title: 'CSS Full Course', videoId: '1Rs2ND1ryYc', description: 'CSS tutorial for beginners.' },
  { title: 'JavaScript Tutorial for Beginners', videoId: 'W6NZfCO5SIk', description: 'JS basics explained.' },
  { title: 'JavaScript Full Course', videoId: 'PkZNo7MFNFg', description: 'From beginner to advanced JS.' },
  { title: 'Vue.js Crash Course', videoId: 'FXpIoQ_rT_c', description: 'Learn Vue.js basics quickly.' },
  { title: 'Vue 3 Full Course', videoId: 'qZXt1Aom3Cs', description: 'Complete Vue 3 guide.' },

  // Backend
  { title: 'Spring Boot Full Course', videoId: 'vtPkZShrvXQ', description: 'Learn Spring Boot from scratch.' },
  { title: 'Spring Boot REST API Tutorial', videoId: 'Hf4MJH0jDb4', description: 'Build REST APIs with Spring Boot.' },
  { title: 'Node.js Full Course', videoId: 'Oe421EPjeBE', description: 'Learn Node.js basics and advanced.' },
  { title: 'Express.js Crash Course', videoId: 'L72fhGm1tfE', description: 'Express.js tutorial for beginners.' },

  // Databases
  { title: 'MySQL Tutorial for Beginners', videoId: '7S_tz1z_5bA', description: 'Learn MySQL basics.' },
  { title: 'MongoDB Tutorial for Beginners', videoId: '-56x56UppqQ', description: 'Learn MongoDB step by step.' },

  // Full Stack
  { title: 'MERN Stack Full Course', videoId: '7CqJlxBYj-M', description: 'Full Stack JS with Mongo, Express, React, Node.' },
  { title: 'Spring Boot + Vue.js Full Stack Tutorial', videoId: '2wBD1Tgq5nI', description: 'Full Stack with Java and Vue.' },

  // Python
  { title: 'Python Full Course', videoId: '_uQrJ0TkZlc', description: 'Learn Python from scratch.' },
  { title: 'Python for Beginners - FreeCodeCamp', videoId: 'rfscVS0vtbw', description: 'Python programming basics.' },
]

const currentLesson = ref(lessons[0])

const selectLesson = (lesson) => {
  currentLesson.value = lesson
}
</script>

<style scoped>
.lesson-player-page {
  color: white;
  padding: 40px 20px;
  background: #121212;
  min-height: 100vh;
}

.page-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 40px;
}

.page-title .brand {
  color: #00ff88;
}

.content {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.video-section {
  flex: 2;
  min-width: 350px;
}

.video-title {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #00ff88;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 0 25px #00ff8855;
  margin: 20px 0;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.video-description {
  margin-top: 10px;
  font-size: 1rem;
  color: #ccc;
  line-height: 1.6;
}

.lessons-list {
  flex: 1;
  min-width: 250px;
  max-height: 650px;
  overflow-y: auto;
  background: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 15px #00ff8855;
}

.lessons-list h3 {
  margin-bottom: 15px;
  color: #00ff88;
  font-size: 1.2rem;
  text-align: center;
}

.lessons-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lessons-list li {
  margin-bottom: 12px;
}

.lesson-card {
  background: #2a2a2a;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.lesson-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 15px #00ff8844;
}

.lesson-title {
  font-weight: bold;
  color: #00ff88;
}

.lesson-desc {
  font-size: 0.9rem;
  color: #ccc;
  margin-top: 4px;
}
</style>