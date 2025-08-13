<template>
  <div class="quiz-page">
    <!-- Hero Section -->
    <section class="hero">
      <h1>Quizzes on <span class="brand">Prodemy</span></h1>
      <p>Challenge yourself, test your knowledge, and grow with curated quizzes.</p>
    </section>

    <!-- Quiz List Section -->
    <section class="quiz-list">
      <div v-if="loading">Loading quizzes...</div>
      <div v-else>
        <div v-if="quizzes.length === 0" class="no-quiz">No quizzes available.</div>
        <div class="quiz-cards">
          <div v-for="quiz in quizzes" :key="quiz.id" class="quiz-card">
            <h2>{{ quiz.quizTitle }}</h2>
            <p><strong>Author:</strong> {{ quiz.quizAuthor }}</p>
            <p><strong>Category:</strong> {{ quiz.quizCategory }}</p>
            <p>{{ quiz.quizDescription }}</p>
            <button @click="viewQuiz(quiz)">View Quiz</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal to view quiz -->
    <section v-if="selectedQuiz" class="modal">
      <div class="modal-content">
        <span class="close" @click="selectedQuiz = null">&times;</span>
        <h2>{{ selectedQuiz.quizTitle }}</h2>
        <p><strong>Author:</strong> {{ selectedQuiz.quizAuthor }}</p>
        <p><strong>Category:</strong> {{ selectedQuiz.quizCategory }}</p>
        <p>{{ selectedQuiz.quizContent }}</p>
      </div>
    </section>

    <!-- Admin Section: Create Quiz -->
    <section class="admin-section">
      <h2>Create New Quiz</h2>
      <form @submit.prevent="createQuiz">
        <input v-model="newQuiz.quizTitle" type="text" placeholder="Quiz Title" required />
        <input v-model="newQuiz.quizAuthor" type="text" placeholder="Author" required />
        <input v-model="newQuiz.quizCategory" type="text" placeholder="Category" required />
        <textarea v-model="newQuiz.quizDescription" placeholder="Description" required></textarea>
        <textarea v-model="newQuiz.quizContent" placeholder="Quiz Content" required></textarea>
        <button type="submit">Create Quiz</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const quizzes = ref([]);
const loading = ref(true);
const selectedQuiz = ref(null);

const newQuiz = ref({
  quizTitle: '',
  quizAuthor: '',
  quizCategory: '',
  quizDescription: '',
  quizContent: ''
});

async function fetchQuizzes() {
  try {
    const response = await axios.get('http://localhost:8080/quizzes/all'); // Replace with your backend endpoint
    quizzes.value = response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
  } finally {
    loading.value = false;
  }
}

function viewQuiz(quiz) {
  selectedQuiz.value = quiz;
}

async function createQuiz() {
  try {
    const response = await axios.post('http://localhost:8080/quizzes/create', newQuiz.value); // Backend POST endpoint
    quizzes.value.push(response.data); // add the new quiz to the list
    // Reset form
    newQuiz.value = {
      quizTitle: '',
      quizAuthor: '',
      quizCategory: '',
      quizDescription: '',
      quizContent: ''
    };
    alert('Quiz created successfully!');
  } catch (error) {
    console.error('Error creating quiz:', error);
    alert('Failed to create quiz.');
  }
}

onMounted(fetchQuizzes);
</script>

<style scoped>
.quiz-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  color: white;
}

/* Hero */
.hero {
  text-align: center;
  max-width: 800px;
  margin-bottom: 50px;
}
.hero h1 { font-size: 2.5rem; margin-bottom: 10px; }
.hero .brand { color: #00ff88; }
.hero p { font-size: 1.2rem; color: #ccc; }

/* Quiz List */
.quiz-list { max-width: 1000px; width: 100%; display: flex; flex-direction: column; align-items: center; }
.quiz-cards { display: flex; flex-wrap: wrap; justify-content: center; gap: 30px; width: 100%; }
.quiz-card {
  background-color: #1e1e1e;
  border: 1px solid #00ff88;
  border-radius: 8px;
  padding: 20px;
  width: 280px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}
.quiz-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px #00ff8855;
}
button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #00ff88;
  color: #121212;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}
button:hover { background-color: #00cc66; }

/* Modal */
.modal {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
}
.modal-content {
  background-color: #1e1e1e;
  padding: 30px;
  border-radius: 8px;
  width: 500px;
  max-height: 80%;
  overflow-y: auto;
  color: white;
}
.close { float: right; font-size: 24px; cursor: pointer; }

/* Admin Section */
.admin-section {
  margin-top: 50px;
  max-width: 600px;
  width: 100%;
  text-align: left;
}
.admin-section h2 { margin-bottom: 20px; color: #00ff88; }
.admin-section form { display: flex; flex-direction: column; gap: 15px; }
.admin-section input,
.admin-section textarea {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #00ff88;
  background-color: #1e1e1e;
  color: white;
  font-size: 1rem;
  resize: none;
}
.admin-section input:focus,
.admin-section textarea:focus { outline: none; border-color: #00cc66; }
</style>
