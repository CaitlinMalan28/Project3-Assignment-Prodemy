<template>
  <div class="course-manager">
    <h1>Course Management</h1>

    <form @submit.prevent="handleSubmit">
      <input v-model="form.title" type="text" placeholder="Course Title" required />
      <textarea v-model="form.description" placeholder="Course Description" required></textarea>
      <input type="file" @change="handleFileChange" accept="image/*,video/*,.pdf" />

      <button type="submit">{{ editing ? 'Update' : 'Add' }} Course</button>
    </form>

    <div class="course-list">
      <h2>Available Courses</h2>
      <div v-if="courses.length === 0">No courses available.</div>

      <div v-for="course in courses" :key="course.id" class="course-card">
        <h3>{{ course.title }}</h3>
        <p>{{ course.description }}</p>

        <div v-if="course.image" class="media-preview">
          <img v-if="isImage(course.imageType)" :src="getImageUrl(course.id)" alt="Course Image" />
          <video v-else-if="isVideo(course.imageType)" controls :src="getImageUrl(course.id)" />
          <a v-else :href="getImageUrl(course.id)" target="_blank">View PDF</a>
        </div>

        <div class="actions">
          <button @click="editCourse(course)">Edit</button>
          <button @click="deleteCourse(course.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const form = ref({
  id: null,
  title: '',
  description: '',
  image: null
})

const courses = ref([])
const editing = ref(false)
const backendUrl = 'http://localhost:8080/courses'

const fetchCourses = async () => {
  const response = await axios.get(`${backendUrl}/all`)
  courses.value = response.data
}

const handleSubmit = async () => {
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('description', form.value.description)
    if (form.value.image) {
      formData.append('image', form.value.image)
    }

    if (editing.value) {
      formData.append('id', form.value.id)
      await axios.put(`${backendUrl}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      await axios.post(`${backendUrl}/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    resetForm()
    fetchCourses()
  } catch (err) {
    console.error('Failed to submit course:', err.response?.data || err.message)
    alert('Failed to submit course')
  }
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.value.image = file
}

const deleteCourse = async (id) => {
  await axios.delete(`${backendUrl}/delete/${id}`)
  fetchCourses()
}

const editCourse = (course) => {
  form.value = {
    id: course.id,
    title: course.title,
    description: course.description,
    image: null // Must re-upload file if editing
  }
  editing.value = true
}

const resetForm = () => {
  form.value = {
    id: null,
    title: '',
    description: '',
    image: null
  }
  editing.value = false
}

// Helper to detect media types
const isImage = (type) => type && type.startsWith('image')
const isVideo = (type) => type && type.startsWith('video')

// Use a backend endpoint to serve images (needs to be created)
const getImageUrl = (id) => `${backendUrl}/media/${id}`

onMounted(fetchCourses)
</script>

<style scoped>
.course-manager {
  padding: 20px;
  max-width: 800px;
  margin: auto;
  color: white;
  background: #121212;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

form {
  margin-bottom: 30px;
}

input[type="text"],
textarea,
input[type="file"] {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  background: #2a2a2a;
  color: white;
  border: none;
  border-radius: 4px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

button {
  padding: 10px 20px;
  background: #00ff88;
  border: none;
  border-radius: 4px;
  color: #121212;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #00e67a;
}

.course-list {
  margin-top: 30px;
}

.course-card {
  background: #1e1e1e;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 6px;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
}

.course-card h3 {
  margin: 0 0 10px 0;
}

.course-card p {
  margin-bottom: 10px;
  color: #ccc;
}

.media-preview img,
.media-preview video {
  max-width: 100%;
  border-radius: 4px;
  margin-bottom: 10px;
}

.media-preview a {
  color: #00ff88;
  text-decoration: underline;
}

.actions button {
  margin-right: 10px;
}
</style>
