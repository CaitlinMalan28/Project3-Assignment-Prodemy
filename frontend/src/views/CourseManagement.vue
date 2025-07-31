<template>
  <div class="course-management">
    <h1>Manage Courses</h1>

    <section class="new-course">
      <h2>Create / Edit Course</h2>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label>Title</label>
          <input v-model="title" type="text" placeholder="Course title" required />
        </div>

        <div class="field">
          <label>Description</label>
          <textarea v-model="description" placeholder="Course description" rows="3" required></textarea>
        </div>

        <div class="field">
          <label>File (image / PDF / video)</label>
          <input ref="fileInput" type="file" @change="onFileChange" />
        </div>

        <button type="submit">{{ editing ? 'Update Course' : 'Create Course' }}</button>
        <button v-if="editing" type="button" class="cancel" @click="resetForm">Cancel</button>
      </form>
    </section>

    <section class="existing-courses">
      <h2>Existing Courses</h2>
      <div v-if="loading" class="status">Loading courses...</div>
      <div v-if="error" class="status error">{{ error }}</div>
      <div class="courses-grid" v-if="courses.length">
        <div class="course-card" v-for="course in courses" :key="course.id">
          <div class="info">
            <h3 contenteditable="false">{{ course.title }}</h3>
            <p>{{ course.description }}</p>
          </div>
          <div class="actions">
            <button @click="populateEdit(course)">Edit</button>
            <button class="delete" @click="deleteCourse(course.id)">Delete</button>
          </div>
          <div class="preview" v-if="courseHasFile(course)">
            <template v-if="isImage(course)">
              <img :src="`${backendBase}/courses/${course.id}/image`" alt="course image" />
            </template>
            <template v-else-if="isPdf(course)">
              <a :href="`${backendBase}/courses/${course.id}/file`" target="_blank">View PDF</a>
            </template>
            <template v-else-if="isVideo(course)">
              <video controls :src="`${backendBase}/courses/${course.id}/file`" />
            </template>
          </div>
        </div>
      </div>
      <div v-else class="status">No courses available.</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// base URL, adjust if you used a different port or path
const backendBase = 'http://localhost:8080/courses/all'

const courses = ref([])
const loading = ref(false)
const error = ref('')

const title = ref('')
const description = ref('')
const file = ref(null)
const editing = ref(false)
const editId = ref(null)

const fetchCourses = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get(`${backendBase}/courses/all`)
    courses.value = res.data
  } catch (e) {
    error.value = 'Failed to load courses'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCourses)

const onFileChange = (e) => {
  file.value = e.target.files[0]
}

const resetForm = () => {
  title.value = ''
  description.value = ''
  file.value = null
  editing.value = false
  editId.value = null
  if (refs.fileInput) refs.fileInput.value = ''
}

const handleSubmit = async () => {
  if (!title.value || !description.value) {
    alert('Title and description required')
    return
  }

  const metadata = {
    title: title.value,
    description: description.value,
  }

  const formData = new FormData()
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
  if (file.value) {
    formData.append('image', file.value) // adapt key name if backend expects different
  }

  try {
    if (editing.value && editId.value) {
      // for simplicity, treat edit as create (backend would need update endpoint)
      await axios.post(`${backendBase}/courses/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      await axios.post(`${backendBase}/courses/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    alert('Saved successfully')
    resetForm()
    await fetchCourses()
  } catch (e) {
    console.error(e)
    alert('Failed to save course')
  }
}

const deleteCourse = async (id) => {
  if (!confirm('Delete this course?')) return
  try {
    await axios.delete(`${backendBase}/courses/${id}`)
    await fetchCourses()
  } catch (e) {
    console.error(e)
    alert('Failed to delete')
  }
}

const populateEdit = (course) => {
  title.value = course.title
  description.value = course.description
  editing.value = true
  editId.value = course.id
}

const courseHasFile = (course) => {
  // naive: assume if course has any non-null binary field; adjust if you have metadata about file types
  return true
}

// heuristics based on extension stored separately if available
const isImage = (course) => true // stub, refine if you store mime/type
const isPdf = (course) => false
const isVideo = (course) => false
</script>

<style scoped>
.course-management {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  color: white;
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

h2 {
  margin-top: 30px;
  margin-bottom: 15px;
}

.new-course,
.existing-courses {
  background: #1f1f1f;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.field {
  margin-bottom: 12px;
}

.field label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.field input,
.field textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #0d0d0d;
  color: white;
}

button {
  background: #00ff88;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 5px;
}

button.cancel {
  background: #888;
}

.courses-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.course-card {
  background: #0f0f0f;
  border: 1px solid #00ff88;
  padding: 16px;
  border-radius: 10px;
  width: 260px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.course-card h3 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 6px;
}

.actions button {
  flex: 1;
  font-size: 0.8rem;
}

.delete {
  background: #ff4d4f;
  color: white;
}

.preview img {
  width: 100%;
  border-radius: 6px;
  margin-top: 6px;
  object-fit: cover;
}

.preview video {
  width: 100%;
  margin-top: 6px;
  border-radius: 6px;
}

.status {
  padding: 12px;
  margin-bottom: 12px;
}

.error {
  background: #822;
}
</style>
