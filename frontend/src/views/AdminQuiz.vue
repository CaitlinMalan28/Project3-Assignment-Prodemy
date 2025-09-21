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
            <button @click="openEditModal(quiz)" style="background:#ffaa00;">Edit</button>
            <button @click="deleteQuiz(quiz)" style="background:#ff5555;color:white;">Delete</button>

            <!-- Edit Quiz Modal -->
            <div v-if="editingQuiz" class="modal" style="z-index:1001;">
              <div class="modal-content" style="max-width:400px;">
                <span class="close" @click="closeEditModal">&times;</span>
                <h3>Edit Quiz</h3>
                <form @submit.prevent="submitEditQuiz">
                  <label>Title:</label>
                  <input v-model="editQuizData.quizTitle" required style="width:100%;margin-bottom:10px;" />
                  <label>Author:</label>
                  <input v-model="editQuizData.quizAuthor" required style="width:100%;margin-bottom:10px;" />
                  <label>Category:</label>
                  <input v-model="editQuizData.quizCategory" required style="width:100%;margin-bottom:10px;" />
                  <label>Description:</label>
                  <textarea v-model="editQuizData.quizDescription" required style="width:100%;margin-bottom:10px;"></textarea>
                  <div class="questions-section">
                    <h4>Edit Questions</h4>
                    <div v-for="(question, idx) in editQuizData.questions" :key="idx" class="question-block" style="border:1px solid #00ff88;padding:10px;margin-bottom:10px;border-radius:8px;background:#232323;">
                      <div style="display:flex;gap:10px;align-items:center;">
                        <span style="font-weight:bold;">Q{{ idx+1 }}.</span>
                        <input v-model="question.question" type="text" placeholder="Question text" style="flex:1;" required />
                        <button type="button" @click="removeEditQuestion(idx)" style="background:#ff5555;color:white;">Remove</button>
                      </div>
                      <div v-if="question.type === 'multiple_choice'">
                        <div v-for="(opt, oidx) in question.options" :key="oidx" class="option-block" style="display:flex;align-items:center;gap:8px;margin-top:5px;">
                          <input v-model="question.options[oidx]" type="text" placeholder="Option" style="flex:1;" required />
                          <button type="button" @click="removeEditOption(idx, oidx)" style="background:#ff8888;">x</button>
                        </div>
                        <button type="button" @click="addEditOption(idx)" style="margin-top:5px;">Add Option</button>
                      </div>
                      <div v-else-if="question.type === 'true_false'">
                        <label>Correct Answer:</label>
                        <select v-model="question.correct" required>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                      <div v-else-if="question.type === 'short_answer'">
                        <label>Correct Answer:</label>
                        <input v-model="question.correct" type="text" placeholder="Correct Answer" required />
                      </div>
                      <div style="margin-top:8px;">
                        <label>Explanation:</label>
                        <input v-model="question.explanation" type="text" placeholder="Explanation (optional)" style="width:100%;" />
                      </div>
                      <div style="margin-top:8px;">
                        <label>Type:</label>
                        <select v-model="question.type" required>
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="true_false">True/False</option>
                          <option value="short_answer">Short Answer</option>
                        </select>
                      </div>
                    </div>
                    <button type="button" @click="addEditQuestion" style="margin-top:10px;">Add Question</button>
                  </div>
                  function addEditQuestion() {
                  editQuizData.value.questions.push({
                  question: '',
                  options: ['', ''],
                  correct: '',
                  explanation: '',
                  type: 'multiple_choice'
                  });
                  }
                  function removeEditQuestion(idx) {
                  editQuizData.value.questions.splice(idx, 1);
                  }
                  <button type="submit">Save Changes</button>
                </form>
              </div>
            </div>

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
        <form v-if="parsedQuestions.length" @submit.prevent="submitAnswers">
          <div v-for="(q, qi) in parsedQuestions" :key="qi" class="customer-question-block">
            <div class="customer-question-text">Q{{ qi+1 }}. {{ q.question }}</div>
            <div v-if="q.options && q.options.length">
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
            <div v-else>
              <input v-model="customerAnswers[qi]" type="text" placeholder="Your answer" required class="customer-short-answer" />
            </div>
          </div>
          <button type="submit" class="submit-btn">Submit Answers</button>
        </form>
        <div v-else style="color:#ff8888;">No questions found in this quiz.</div>
      </div>
    </section>

    <!-- Admin Section: Create Quiz -->
    <section class="admin-section">
      <h2>Student Quiz Attempts</h2>
      <div v-if="attemptsLoading">Loading attempts...</div>
      <div v-else>
        <div v-if="quizAttempts.length === 0" style="color:#ff8888;">No quiz attempts found.</div>
        <div v-else>
          <table style="width:100%;margin-bottom:30px;background:#232323;color:#fff;border-radius:8px;overflow:hidden;">
            <thead style="background:#00ff88;color:#121212;">
            <tr>
              <th style="padding:8px;">Student</th>
              <th style="padding:8px;">Quiz Title</th>
              <th style="padding:8px;">Answers</th>
              <th style="padding:8px;">Mark</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="attempt in quizAttempts" :key="attempt.id">
              <td style="padding:8px;">{{ attempt.studentName || attempt.studentId }}</td>
              <td style="padding:8px;">{{ attempt.quizTitle }}</td>
              <td style="padding:8px;white-space:pre-wrap;">
                <div v-for="(ans, idx) in attempt.answers" :key="idx">
                  Q{{ idx+1 }}: {{ ans }}
                </div>
              </td>
              <td style="padding:8px;">
                <span v-if="attempt.mark !== undefined && attempt.mark !== null">{{ attempt.mark }}</span>
                <button v-else @click="openMarkModal(attempt)">Mark</button>
              </td>
            </tr>
            <!-- Marking Modal -->
            <div v-if="markingAttempt" class="modal" style="z-index:1001;">
              <div class="modal-content" style="max-width:400px;">
                <span class="close" @click="closeMarkModal">&times;</span>
                <h3>Mark Quiz Attempt</h3>
                <div><b>Student:</b> {{ markingAttempt.studentName || markingAttempt.studentId }}</div>
                <div><b>Quiz:</b> {{ markingAttempt.quizTitle }}</div>
                <form @submit.prevent="submitMark">
                  <label>Mark/Score:</label>
                  <input v-model="markValue" type="number" min="0" max="100" required style="width:100%;margin-bottom:10px;" />
                  <label>Feedback (optional):</label>
                  <textarea v-model="markFeedback" style="width:100%;margin-bottom:10px;"></textarea>
                  <button type="submit">Submit Mark</button>
                </form>
              </div>
            </div>
            // Marking state
            const markingAttempt = ref(null);
            const markValue = ref(0);
            const markFeedback = ref("");

            function openMarkModal(attempt) {
            markingAttempt.value = attempt;
            markValue.value = attempt.mark || 0;
            markFeedback.value = attempt.feedback || "";
            }
            function closeMarkModal() {
            markingAttempt.value = null;
            markValue.value = 0;
            markFeedback.value = "";
            }
            async function submitMark() {
            if (!markingAttempt.value) return;
            // PATCH or POST to backend to update mark/feedback
            try {
            await axios.patch(`http://localhost:8080/quiz-attempts/${markingAttempt.value.id}/mark`, {
            mark: markValue.value,
            feedback: markFeedback.value
            });
            // Update local state
            markingAttempt.value.mark = markValue.value;
            markingAttempt.value.feedback = markFeedback.value;
            closeMarkModal();
            // Optionally, refetch attempts
            fetchQuizAttempts();
            } catch (e) {
            alert('Failed to submit mark');
            }
            }
            </tbody>
          </table>
        </div>
      </div>
      <h2>Create New Quiz</h2>
      <form @submit.prevent="createQuiz">
        <input v-model="newQuiz.quizTitle" type="text" placeholder="Quiz Title" required />
        <input v-model="newQuiz.quizAuthor" type="text" placeholder="Author" required />
        <input v-model="newQuiz.quizCategory" type="text" placeholder="Category" required />
        <textarea v-model="newQuiz.quizDescription" placeholder="Description" required></textarea>

        <div class="questions-section">
          <h3>Questions</h3>
          <div class="bulk-import">
            <button type="button" @click="showPaste = !showPaste" class="toggle-paste-btn">
              {{ showPaste ? 'Hide' : 'Paste JSON to Add Many' }}
            </button>
            <div v-if="showPaste" class="paste-area">
              <textarea v-model="pasteJson" placeholder="Paste JSON quiz questions here" rows="6" style="width:100%;margin-bottom:10px;"></textarea>
              <button type="button" @click="parseJson" class="parse-btn">Parse JSON</button>
            </div>
          </div>
          <div v-for="(question, idx) in newQuiz.questions" :key="idx" class="question-block" style="border:1px solid #00ff88;padding:15px;margin-bottom:15px;border-radius:8px;background:#232323;">
            <div style="display:flex;gap:10px;align-items:center;">
              <span style="font-weight:bold;">Q{{ idx+1 }}.</span>
              <input v-model="question.question" type="text" placeholder="Question text" style="flex:1;" required />
              <button type="button" @click="removeQuestion(idx)" style="background:#ff5555;color:white;">Remove</button>
            </div>
            <div v-if="question.type === 'multiple_choice'">
              <div v-for="(opt, oidx) in question.options" :key="oidx" class="option-block" style="display:flex;align-items:center;gap:8px;margin-top:5px;">
                <input v-model="question.options[oidx]" type="text" placeholder="Option" style="flex:1;" required />
                <button type="button" @click="removeOption(idx, oidx)" style="background:#ff8888;">x</button>
              </div>
              <button type="button" @click="addOption(idx)" style="margin-top:5px;">Add Option</button>
            </div>
            <div v-else-if="question.type === 'true_false'">
              <label>Correct Answer:</label>
              <select v-model="question.correct" required>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div v-else-if="question.type === 'short_answer'">
              <label>Correct Answer:</label>
              <input v-model="question.correct" type="text" placeholder="Correct Answer" required />
            </div>
            <div style="margin-top:8px;">
              <label>Explanation:</label>
              <input v-model="question.explanation" type="text" placeholder="Explanation (optional)" style="width:100%;" />
            </div>
            <div style="margin-top:8px;">
              <label>Type:</label>
              <select v-model="question.type" required>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True/False</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>
          </div>
          <button type="button" @click="addQuestion" style="margin-top:10px;">Add Question</button>
        </div>

        <button type="submit">Create Quiz</button>
      </form>
    </section>
  </div>
</template>

<script setup>
// --- Quiz Edit/Delete State and Methods ---
const editingQuiz = ref(null);
const editQuizData = ref({ quizTitle: '', quizAuthor: '', quizCategory: '', quizDescription: '', questions: [] });

function openEditModal(quiz) {
  editingQuiz.value = quiz;
  let questions = [];
  try {
    if (Array.isArray(quiz.quizContent)) {
      questions = JSON.parse(JSON.stringify(quiz.quizContent));
    } else if (typeof quiz.quizContent === 'string') {
      questions = JSON.parse(quiz.quizContent);
    }
  } catch { questions = []; }
  editQuizData.value = {
    quizTitle: quiz.quizTitle,
    quizAuthor: quiz.quizAuthor,
    quizCategory: quiz.quizCategory,
    quizDescription: quiz.quizDescription,
    questions: questions
  };
}
function closeEditModal() {
  editingQuiz.value = null;
}
function addEditQuestion() {
  editQuizData.value.questions.push({
    question: '',
    options: ['', ''],
    correct: '',
    explanation: '',
    type: 'multiple_choice'
  });
}
function removeEditQuestion(idx) {
  editQuizData.value.questions.splice(idx, 1);
}
function addEditOption(qIdx) {
  editQuizData.value.questions[qIdx].options.push('');
}
function removeEditOption(qIdx, oIdx) {
  editQuizData.value.questions[qIdx].options.splice(oIdx, 1);
}
async function submitEditQuiz() {
  if (!editingQuiz.value) return;
  try {
    const payload = {
      quizTitle: editQuizData.value.quizTitle,
      quizAuthor: editQuizData.value.quizAuthor,
      quizCategory: editQuizData.value.quizCategory,
      quizDescription: editQuizData.value.quizDescription,
      quizContent: JSON.stringify(editQuizData.value.questions)
    };
    await axios.patch(`http://localhost:8080/quizzes/${editingQuiz.value.id}`, payload);
    // Update local state
    Object.assign(editingQuiz.value, editQuizData.value);
    closeEditModal();
  } catch (e) {
    alert('Failed to update quiz');
  }
}
async function deleteQuiz(quiz) {
  if (!confirm(`Delete quiz '${quiz.quizTitle}'?`)) return;
  try {
    await axios.delete(`http://localhost:8080/quizzes/${quiz.id}`);
    quizzes.value = quizzes.value.filter(q => q.id !== quiz.id);
  } catch (e) {
    alert('Failed to delete quiz');
  }
}

import { ref, onMounted, computed } from 'vue';
import axios from 'axios';


const quizzes = ref([]);
const loading = ref(true);
const selectedQuiz = ref(null);
onMounted(fetchQuizzes);
const quizAttempts = ref([]);
const attemptsLoading = ref(true);

async function fetchQuizAttempts() {
  try {
    const response = await axios.get('http://localhost:8080/quiz-attempts');
    quizAttempts.value = response.data;
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
  } finally {
    attemptsLoading.value = false;
  }
}

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

onMounted(() => {
  fetchQuizzes();
  fetchQuizAttempts();
});

const parsedQuestions = computed(() => {
  if (!selectedQuiz.value) return [];
  let content = selectedQuiz.value.quizContent;
  if (!content) return [];
  // If content is already an array, return as is
  if (Array.isArray(content)) return content;
  // If content is a string, try to parse
  try {
    if (typeof content === 'string') {
      // Try parsing once
      let parsed = JSON.parse(content);
      // If still a string, parse again (handles double-encoded)
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch {
    return [];
  }
});
const customerAnswers = ref([]);

const newQuiz = ref({
  quizTitle: '',
  quizAuthor: '',
  quizCategory: '',
  quizDescription: '',
  quizContent: '',
  questions: []
});

const pasteJson = ref('');
const showPaste = ref(false);

function addQuestion() {
  newQuiz.value.questions.push({
    question: '',
    options: ['', ''],
    correct: '',
    explanation: '',
    type: 'multiple_choice'
  });
}
function removeQuestion(idx) {
  newQuiz.value.questions.splice(idx, 1);
}
function addOption(qIdx) {
  newQuiz.value.questions[qIdx].options.push('');
}
function removeOption(qIdx, oIdx) {
  newQuiz.value.questions[qIdx].options.splice(oIdx, 1);
}

function parseJson() {
  try {
    const arr = JSON.parse(pasteJson.value);
    if (Array.isArray(arr)) {
      for (const q of arr) {
        let type = 'multiple_choice';
        let options = Array.isArray(q.options) ? q.options : undefined;
        let correct = q.correct || q.answer || '';
        // Detect true/false
        if (
            options &&
            options.length === 2 &&
            ["true", "false", "True", "False"].includes(options[0]) &&
            ["true", "false", "True", "False"].includes(options[1])
        ) {
          type = 'true_false';
          // Normalize correct to string 'true' or 'false'
          if (typeof correct === 'boolean') correct = correct ? 'true' : 'false';
          if (correct === true) correct = 'true';
          if (correct === false) correct = 'false';
          if (!['true','false','True','False'].includes(correct)) correct = '';
        } else if (!options) {
          // Short answer
          type = 'short_answer';
          options = [];
          correct = '';
        } else {
          // Multiple choice: if correct is not in options, leave blank
          if (!options.includes(correct)) correct = '';
        }
        newQuiz.value.questions.push({
          question: q.question || '',
          options,
          correct,
          explanation: q.explanation || '',
          type: q.type || type
        });
      }
      pasteJson.value = '';
      showPaste.value = false;
    } else {
      alert('Invalid JSON: must be an array of questions');
    }
  } catch (e) {
    alert('Invalid JSON');
  }
}

function viewQuiz(quiz) {
  selectedQuiz.value = quiz;
  customerAnswers.value = [];
}

function submitAnswers() {
  alert('Your answers: ' + JSON.stringify(customerAnswers.value));
  selectedQuiz.value = null;
}

async function createQuiz() {
  try {
    // Prepare payload for backend: questions as JSON string in quizContent
    const payload = {
      quizTitle: newQuiz.value.quizTitle,
      quizAuthor: newQuiz.value.quizAuthor,
      quizCategory: newQuiz.value.quizCategory,
      quizDescription: newQuiz.value.quizDescription,
      quizContent: JSON.stringify(newQuiz.value.questions)
    };
    const response = await axios.post('http://localhost:8080/quizzes/create', payload);
    quizzes.value.push(response.data);
    // Reset form
    newQuiz.value = {
      quizTitle: '',
      quizAuthor: '',
      quizCategory: '',
      quizDescription: '',
      questions: []
    };
    alert('Quiz created successfully!');
  } catch (error) {
    console.error('Error creating quiz:', error);
    alert('Failed to create quiz.');
  }
}

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
</style>
