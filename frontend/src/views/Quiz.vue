<template>
  <div class="quiz-page">
    <section class="hero">
      <h1>Quizzes on <span class="brand">Prodemy</span></h1>
      <p>Challenge yourself, test your knowledge, and grow with curated quizzes.</p>
    </section>

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

    <section v-if="selectedQuiz" class="modal">
      <div class="modal-content">
        <span class="close" @click="selectedQuiz = null">&times;</span>
        <h2>{{ selectedQuiz.quizTitle }}</h2>
        <p><strong>Author:</strong> {{ selectedQuiz.quizAuthor }}</p>
        <p><strong>Category:</strong> {{ selectedQuiz.quizCategory }}</p>
        <form v-if="parsedQuestions.length" @submit.prevent="submitAnswers">
          <div v-for="(q, qi) in parsedQuestions" :key="qi" class="customer-question-block">
            <div class="customer-question-text">Q{{ qi + 1 }}. {{ q.question }}</div>
            <div v-if="q.type === 'multiple_choice'">
              <div v-for="(opt, oi) in q.options" :key="oi" class="customer-option-row">
                <label>
                  <input type="radio" :name="'q' + qi" v-model="customerAnswers[qi]" :value="opt" required />
                  {{ opt }}
                </label>
              </div>
            </div>
            <div v-else-if="q.type === 'true_false'">
              <label><input type="radio" :name="'q' + qi" v-model="customerAnswers[qi]" value="true" required /> True</label>
              <label><input type="radio" :name="'q' + qi" v-model="customerAnswers[qi]" value="false" required /> False</label>
            </div>
            <div v-else-if="q.type === 'short_answer'">
              <input v-model="customerAnswers[qi]" type="text" placeholder="Your answer" required class="customer-short-answer" />
            </div>
          </div>
          <button type="submit" class="submit-btn">Submit Answers</button>
        </form>
        <div v-else style="color:#ff8888;">No questions found in this quiz.</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const quizzes = ref([]);
const loading = ref(true);
const selectedQuiz = ref(null);
const customerAnswers = ref([]);

const parsedQuestions = computed(() => {
  if (!selectedQuiz.value || !selectedQuiz.value.quizContent) return [];
  try {
    let content = selectedQuiz.value.quizContent;
    // Parse the JSON string
    let parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    console.error('Error parsing quiz content:', e);
    return [];
  }
});

async function fetchQuizzes() {
  try {
    const response = await axios.get('http://localhost:8080/quizzes/all');
    quizzes.value = response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
  } finally {
    loading.value = false;
  }
}

function viewQuiz(quiz) {
  selectedQuiz.value = quiz;
  customerAnswers.value = new Array(parsedQuestions.value.length).fill(null); // Initialize answers array
}

function submitAnswers() {
  alert('Your answers: ' + JSON.stringify(customerAnswers.value));
  selectedQuiz.value = null;
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

.hero {
  text-align: center;
  max-width: 800px;
  margin-bottom: 50px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.hero .brand {
  color: #00ff88;
}

.hero p {
  font-size: 1.2rem;
  color: #ccc;
}

.quiz-list {
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quiz-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  width: 100%;
}

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

button:hover {
  background-color: #00cc66;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
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

.close {
  float: right;
  font-size: 24px;
  cursor: pointer;
}

/* Customer Quiz Modal UI */
.customer-question-block {
  margin-bottom: 22px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
}

.customer-question-text {
  font-weight: bold;
  margin-bottom: 8px;
}

.customer-option-row {
  margin-bottom: 6px;
}

.customer-short-answer {
  width: 100%;
  padding: 7px;
  border-radius: 4px;
  border: 1px solid #00ff88;
  background: #232323;
  color: #fff;
}

.submit-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #00ff88;
  color: #121212;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background-color: #00cc66;
}
</style>