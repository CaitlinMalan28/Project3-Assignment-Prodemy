<template>
  <div class="course-manager">
    <h1>Course Management</h1>

    <!-- Status Messages -->
    <p v-if="message" :class="{ success: !error, error: error }">{{ message }}</p>

    <form @submit.prevent="handleSubmit">
      <input v-model="form.title" type="text" placeholder="Course Title" required />
      <textarea v-model="form.description" placeholder="Course Description" required></textarea>

      <div class="file-input-section">
        <label for="course-file">Course File (Image/Video/PDF):</label>
        <input
            id="course-file"
            type="file"
            @change="handleFileChange"
            accept="image/*,video/*,.pdf"
            :required="!editing"
        />
        <small v-if="editing && !form.image">
          Leave empty to keep current file
        </small>
        <small v-if="form.image">
          Selected file: {{ form.image.name }} ({{ formatFileSize(form.image.size) }})
        </small>
      </div>

      <div class="form-buttons">
        <button type="submit" :disabled="loading">
          {{ loading ? 'Processing...' : (editing ? 'Update Course' : 'Create Course') }}
        </button>
        <button v-if="editing" type="button" @click="resetForm" class="cancel-btn">
          Cancel Edit
        </button>
      </div>
    </form>

    <div class="course-list">
      <h2>Available Courses ({{ courses.length }})</h2>

      <div v-if="loading && courses.length === 0" class="loading">
        Loading courses...
      </div>

      <div v-else-if="courses.length === 0" class="no-courses">
        No courses available. Create your first course!
      </div>

      <div v-else class="courses-grid">
        <div v-for="course in courses" :key="course.id" class="course-card">
          <div class="media-preview">
            <img v-if="course.contentType && course.contentType.startsWith('image/')"
                 :src="getImageUrl(course.id)"
                 :alt="course.title"
                 class="course-media"
                 @error="handleImageError" />
            <video v-else-if="course.contentType && course.contentType.startsWith('video/')"
                   controls
                   :src="getImageUrl(course.id)"
                   class="course-media" />
            <div v-else class="file-preview">
              <div class="file-icon">📄</div>
              <a :href="getImageUrl(course.id)" target="_blank" class="file-link">
                View Document
              </a>
            </div>
          </div>

          <div class="course-info">
            <h3>{{ course.title }}</h3>
            <p class="description">{{ course.description }}</p>
            <p class="course-id">ID: {{ course.id }}</p>
          </div>

          <div class="actions">
            <button @click="editCourse(course)" class="edit-btn" :disabled="loading">
              Edit
            </button>
            <button @click="deleteCourse(course.id)" class="delete-btn" :disabled="loading">
              Delete
            </button>
          </div>
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
const loading = ref(false)
const message = ref('')
const error = ref(false)
const backendUrl = 'http://localhost:8080/courses'

const fetchCourses = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${backendUrl}/all`)
    courses.value = response.data
    showMessage(`Loaded ${courses.value.length} courses`)
  } catch (err) {
    console.error('Failed to fetch courses:', err)
    showMessage('Failed to load courses: ' + (err.response?.data || err.message), true)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  // Validation
  if (!form.value.title.trim() || !form.value.description.trim()) {
    showMessage('Please fill in all required fields', true)
    return
  }

  if (!editing.value && !form.value.image) {
    showMessage('Please select a file for the course', true)
    return
  }

  try {
    loading.value = true
    const formData = new FormData()
    formData.append('title', form.value.title.trim())
    formData.append('description', form.value.description.trim())

    if (form.value.image) {
      formData.append('image', form.value.image)
    }

    if (editing.value) {
      formData.append('id', form.value.id)
      const response = await axios.put(`${backendUrl}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      showMessage('Course updated successfully!')
    } else {
      const response = await axios.post(`${backendUrl}/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      showMessage('Course created successfully!')
    }

    resetForm()
    await fetchCourses()
  } catch (err) {
    console.error('Failed to submit course:', err)
    const errorMsg = err.response?.data || err.message || 'Failed to submit course'
    showMessage(errorMsg, true)
  } finally {
    loading.value = false
  }
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) {
    form.value.image = null
    return
  }

  // Validate file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    showMessage('File size must be less than 10MB', true)
    e.target.value = ''
    form.value.image = null
    return
  }

  form.value.image = file
}

const deleteCourse = async (id) => {
  if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
    return
  }

  try {
    loading.value = true
    const response = await axios.delete(`${backendUrl}/delete/${id}`)
    showMessage('Course deleted successfully!')
    await fetchCourses()
  } catch (err) {
    console.error('Failed to delete course:', err)
    const errorMsg = err.response?.data || err.message || 'Failed to delete course'

    // Check if it's a constraint violation
    if (errorMsg.includes('enrollments') || errorMsg.includes('constraint')) {
      showMessage('Cannot delete course. There are existing enrollments. Delete enrollments first.', true)
    } else {
      showMessage(errorMsg, true)
    }
  } finally {
    loading.value = false
  }
}

const editCourse = (course) => {
  form.value = {
    id: course.id,
    title: course.title,
    description: course.description,
    image: null // Reset file input
  }
  editing.value = true
  showMessage(`Editing course: ${course.title}`)

  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetForm = () => {
  form.value = {
    id: null,
    title: '',
    description: '',
    image: null
  }
  editing.value = false
  message.value = ''
  error.value = false

  // Reset file input
  const fileInput = document.getElementById('course-file')
  if (fileInput) fileInput.value = ''
}

const showMessage = (msg, isError = false) => {
  message.value = msg
  error.value = isError

  // Auto-clear success messages after 5 seconds
  if (!isError) {
    setTimeout(() => {
      if (message.value === msg) {
        message.value = ''
      }
    }, 5000)
  }
}

const getImageUrl = (id) => `${backendUrl}/media/${id}`

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
}

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