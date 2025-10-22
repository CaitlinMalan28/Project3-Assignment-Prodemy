<template>
  <div class="quiz-page">

    <!-- Top bar -->
    <header class="topbar">
      <div class="brand-row">
        <div class="logo">
          <!-- simple SVG logo -->
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="2" y="2" width="20" height="20" rx="5" :fill="accent" />
            <path d="M7 12h10M7 16h6" stroke="#06221F" stroke-width="1.25" stroke-linecap="round" />
          </svg>
        </div>
        <div class="title">
          <h1>Prodemy — Quizzes</h1>
          <p class="subtitle">Admin panel — manage, preview and mark attempts</p>
        </div>
      </div>

      <div class="controls">
        <div class="search">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          <input v-model="searchQuery" placeholder="Search title, author, category..." />
        </div>

        <div class="btn-row">
          <button class="btn ghost" @click="showCreate = !showCreate">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            {{ showCreate ? 'Hide' : 'New Quiz' }}
          </button>
          <button class="btn primary" @click="fetchQuizzes">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            Refresh
          </button>
        </div>
      </div>
    </header>

    <main class="layout">
      <!-- Left column: quizzes -->
      <section class="left-col">
        <div v-if="loading" class="loading">Loading quizzes…</div>
        <div v-else>
          <div v-if="filteredQuizzes.length === 0" class="empty">No quizzes found.</div>

          <div class="grid">
            <article v-for="quiz in filteredQuizzes" :key="quiz.id" class="card">
              <div class="card-head">
                <h3 class="card-title">{{ quiz.quizTitle }}</h3>
                <div class="chip">{{ quiz.quizCategory }}</div>
              </div>

              <p class="card-desc">{{ quiz.quizDescription }}</p>

              <div class="meta">
                <div class="author">By <strong>{{ quiz.quizAuthor || 'Unknown' }}</strong></div>
                <div class="actions">
                  <button class="icon-btn" title="Preview" @click="viewQuiz(quiz)">Preview</button>
                  <button class="icon-btn warn" title="Edit" @click="openEditModal(quiz)">Edit</button>
                  <button class="icon-btn danger" title="Delete" @click="deleteQuiz(quiz)">Delete</button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Right column: attempts + create -->
      <aside class="right-col">
        <div class="panel attempts-panel">
          <div class="panel-head">
            <h4>Student Attempts</h4>
            <small class="muted">Review and mark submitted attempts</small>
          </div>

          <div v-if="attemptsLoading" class="loading">Loading attempts…</div>

          <div v-else-if="quizAttempts.length === 0" class="empty">No attempts yet.</div>

          <div v-else class="attempt-list">
            <div v-for="attempt in quizAttempts" :key="attempt.id" class="attempt">
              <div class="attempt-info">
                <div class="student">{{ attempt.studentName || attempt.studentId }}</div>
                <div class="attempt-meta"><small>{{ attempt.quizTitle }}</small></div>
              </div>
              <div class="attempt-actions">
                <div class="mark">
                  <template v-if="attempt.mark !== undefined && attempt.mark !== null">
                    <span class="score">{{ attempt.mark }}</span>
                  </template>
                  <template v-else>
                    <button class="btn small" @click="openMarkModal(attempt)">Mark</button>
                  </template>
                </div>
                <button class="btn ghost small" @click="openAttemptPreview(attempt)">View</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Create form (collapsible) -->
        <div class="panel create-panel" v-show="showCreate">
          <div class="panel-head">
            <h4>Create Quiz</h4>
            <small class="muted">Quick create — questions added below</small>
          </div>

          <form @submit.prevent="createQuiz" class="create-form">
            <input v-model="newQuiz.quizTitle" placeholder="Title" required />
            <input v-model="newQuiz.quizAuthor" placeholder="Author" required />
            <input v-model="newQuiz.quizCategory" placeholder="Category" required />
            <textarea v-model="newQuiz.quizDescription" placeholder="Short description" rows="3" required></textarea>

            <div class="questions" v-for="(q, idx) in newQuiz.questions" :key="idx">
              <div class="q-row">
                <input v-model="q.question" placeholder="Question text" required />
                <button type="button" class="small danger" @click="removeQuestion(idx)">Remove</button>
              </div>

              <div v-if="q.type === 'multiple_choice'" class="opts">
                <div v-for="(opt, oi) in q.options" :key="oi" class="opt-row">
                  <input v-model="q.options[oi]" placeholder="Option" required />
                  <button type="button" class="small" @click="removeOption(idx, oi)">x</button>
                </div>
                <button type="button" class="small" @click="addOption(idx)">Add option</button>
              </div>

              <div class="row small">
                <label>Type</label>
                <select v-model="q.type">
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True / False</option>
                  <option value="short_answer">Short Answer</option>
                </select>

                <label>Correct</label>
                <input v-model="q.correct" placeholder="Correct answer or index" />
              </div>

              <input v-model="q.explanation" placeholder="Explanation (optional)" />
            </div>

            <div class="form-actions">
              <button type="button" class="btn ghost" @click="addQuestion">Add Question</button>
              <button type="submit" class="btn primary">Create Quiz</button>
            </div>
          </form>
        </div>
      </aside>
    </main>

    <!-- Preview Modal -->
    <div v-if="selectedQuiz" class="modal" @click.self="selectedQuiz = null">
      <div class="modal-card">
        <header class="modal-head">
          <div>
            <h3>{{ selectedQuiz.quizTitle }}</h3>
            <small class="muted">By {{ selectedQuiz.quizAuthor || 'Unknown' }} • {{ selectedQuiz.quizCategory }}</small>
          </div>
          <button class="close-x" @click="selectedQuiz = null">✕</button>
        </header>

        <section class="modal-body">
          <div v-if="parsedQuestions.length">
            <div v-for="(q, qi) in parsedQuestions" :key="qi" class="preview-q">
              <div class="q-top">
                <div class="q-index">Q{{ qi+1 }}</div>
                <div class="q-text">{{ q.question }}</div>
              </div>

              <div v-if="q.type === 'multiple_choice'" class="preview-opts">
                <div v-for="(opt, oi) in q.options" :key="oi" :class="['preview-opt', { correct: isCorrectOption(q,opt) }]">
                  <span class="bullet">●</span>
                  <span>{{ opt }}</span>
                  <span v-if="isCorrectOption(q,opt)" class="badge">answer</span>
                </div>
              </div>

              <div v-else-if="q.type === 'true_false'" class="preview-opts">
                <div :class="['preview-opt', { correct: q.correct === 'true' || q.correct === true }]">True</div>
                <div :class="['preview-opt', { correct: q.correct === 'false' || q.correct === false }]">False</div>
              </div>

              <div v-else class="preview-opts">
                <div class="preview-short"><strong>Answer:</strong> {{ q.correct }}</div>
              </div>

              <div v-if="q.explanation" class="explain">
                <strong>Explanation:</strong> {{ q.explanation }}
              </div>
            </div>
          </div>

          <div v-else class="empty">No questions found for this quiz.</div>
        </section>
      </div>
    </div>

    <!-- Mark Modal -->
    <div v-if="markingAttempt" class="modal" @click.self="closeMarkModal">
      <div class="modal-card small" style="max-width:480px">
        <header class="modal-head">
          <div>
            <h3>Mark Attempt</h3>
            <small class="muted">{{ markingAttempt.studentName || markingAttempt.studentId }} — {{ markingAttempt.quizTitle }}</small>
          </div>
          <button class="close-x" @click="closeMarkModal">✕</button>
        </header>

        <section class="modal-body">
          <form @submit.prevent="submitMark" class="mark-form">
            <label>Score</label>
            <input v-model.number="markValue" type="number" min="0" max="100" required />

            <label>Feedback</label>
            <textarea v-model="markFeedback" rows="4"></textarea>

            <div class="form-actions" style="justify-content:flex-end">
              <button type="button" class="btn ghost" @click="closeMarkModal">Cancel</button>
              <button type="submit" class="btn primary">Submit</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const accent = '#00ff88';

const quizzes = ref([]);
const loading = ref(true);
const selectedQuiz = ref(null);

const editingQuiz = ref(null);
const editQuizData = ref({ quizTitle:'', quizAuthor:'', quizCategory:'', quizDescription:'', questions:[] });

const quizAttempts = ref([]);
const attemptsLoading = ref(true);

const markingAttempt = ref(null);
const markValue = ref(0);
const markFeedback = ref('');

const newQuiz = ref({ quizTitle:'', quizAuthor:'', quizCategory:'', quizDescription:'', questions:[] });

const pasteJson = ref('');
const showPaste = ref(false);
const showCreate = ref(true);

// search
const searchQuery = ref('');

async function fetchQuizzes() {
  loading.value = true;
  try {
    const res = await axios.get('http://localhost:8080/quizzes/all');
    quizzes.value = res.data || [];
  } catch (e) {
    console.error(e);
    quizzes.value = [];
  } finally {
    loading.value = false;
  }
}

async function fetchQuizAttempts() {
  attemptsLoading.value = true;
  try {
    const res = await axios.get('http://localhost:8080/quiz-attempts');
    quizAttempts.value = res.data || [];
  } catch (e) {
    console.error(e);
    quizAttempts.value = [];
  } finally {
    attemptsLoading.value = false;
  }
}

onMounted(() => {
  fetchQuizzes();
  fetchQuizAttempts();
});

// filter
const filteredQuizzes = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase();
  if (!q) return quizzes.value;
  return quizzes.value.filter(item => {
    return (item.quizTitle || '').toLowerCase().includes(q) ||
        (item.quizAuthor || '').toLowerCase().includes(q) ||
        (item.quizCategory || '').toLowerCase().includes(q);
  });
});

const parsedQuestions = computed(() => {
  if (!selectedQuiz.value || !selectedQuiz.value.quizContent) return [];
  const content = selectedQuiz.value.quizContent;
  if (Array.isArray(content)) return content;
  try {
    let parsed = content;
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
    }
    if (Array.isArray(parsed)) return parsed;
  } catch (e) { console.error(e); }
  return [];
});

function viewQuiz(quiz) {
  selectedQuiz.value = quiz;
}

function openAttemptPreview(attempt) {
  // small helper: load the quiz for preview if found
  const q = quizzes.value.find(x => x.id === attempt.quizId);
  if (q) {
    selectedQuiz.value = q;
  } else {
    alert('Quiz data not available for preview.');
  }
}

function isCorrectOption(question, option) {
  if (!question) return false;
  const corr = question.correct;
  if (corr == null) return false;
  if (typeof corr === 'number') return option === question.options[corr];
  return String(option).trim() === String(corr).trim();
}

// create flows (kept simple)
function addQuestion() {
  newQuiz.value.questions.push({ question:'', options:['',''], correct:'', explanation:'', type:'multiple_choice' });
}
function removeQuestion(idx) { newQuiz.value.questions.splice(idx,1); }
function addOption(qIdx) { newQuiz.value.questions[qIdx].options.push(''); }
function removeOption(qIdx,oIdx) { newQuiz.value.questions[qIdx].options.splice(oIdx,1); }

async function createQuiz() {
  try {
    const payload = {
      quizTitle: newQuiz.value.quizTitle,
      quizAuthor: newQuiz.value.quizAuthor,
      quizCategory: newQuiz.value.quizCategory,
      quizDescription: newQuiz.value.quizDescription,
      quizContent: JSON.stringify(newQuiz.value.questions)
    };
    const res = await axios.post('http://localhost:8080/quizzes/create', payload);
    quizzes.value.unshift(res.data);
    newQuiz.value = { quizTitle:'', quizAuthor:'', quizCategory:'', quizDescription:'', questions:[] };
    showCreate.value = false;
  } catch (e) {
    console.error(e);
    alert('Failed to create quiz');
  }
}

// edit / delete / mark (unchanged)
function openEditModal(quiz) {
  editingQuiz.value = quiz;
  let questions = [];
  try {
    if (Array.isArray(quiz.quizContent)) questions = JSON.parse(JSON.stringify(quiz.quizContent));
    else if (typeof quiz.quizContent === 'string') {
      const parsed = JSON.parse(quiz.quizContent);
      questions = Array.isArray(parsed) ? parsed : [];
    }
  } catch { questions = []; }
  editQuizData.value = { quizTitle: quiz.quizTitle, quizAuthor: quiz.quizAuthor, quizCategory: quiz.quizCategory, quizDescription: quiz.quizDescription, questions };
}
function closeEditModal() { editingQuiz.value = null; editQuizData.value = { quizTitle:'', quizAuthor:'', quizCategory:'', quizDescription:'', questions:[] }; }
async function submitEditQuiz() {
  if (!editingQuiz.value) return;
  try {
    const payload = { id: editingQuiz.value.id, quizTitle: editQuizData.value.quizTitle, quizAuthor: editQuizData.value.quizAuthor, quizCategory: editQuizData.value.quizCategory, quizDescription: editQuizData.value.quizDescription, quizContent: JSON.stringify(editQuizData.value.questions) };
    await axios.post('http://localhost:8080/quizzes/update', payload);
    Object.assign(editingQuiz.value, { quizTitle: editQuizData.value.quizTitle, quizAuthor: editQuizData.value.quizAuthor, quizCategory: editQuizData.value.quizCategory, quizDescription: editQuizData.value.quizDescription, quizContent: payload.quizContent });
    closeEditModal();
    fetchQuizzes();
  } catch (e) { console.error(e); alert('Failed to update quiz'); }
}

async function deleteQuiz(quiz) {
  if (!confirm(`Delete quiz '${quiz.quizTitle}'?`)) return;
  try {
    await axios.delete(`http://localhost:8080/quizzes/delete/${quiz.id}`);
    quizzes.value = quizzes.value.filter(q => q.id !== quiz.id);
  } catch (e) { console.error(e); alert('Failed to delete quiz'); }
}

function openMarkModal(attempt) {
  markingAttempt.value = attempt;
  markValue.value = attempt.mark || 0;
  markFeedback.value = attempt.feedback || '';
}
function closeMarkModal() { markingAttempt.value = null; markValue.value = 0; markFeedback.value = ''; }
async function submitMark() {
  if (!markingAttempt.value) return;
  try {
    await axios.patch(`http://localhost:8080/quiz-attempts/${markingAttempt.value.id}/mark`, { mark: markValue.value, feedback: markFeedback.value });
    markingAttempt.value.mark = markValue.value;
    markingAttempt.value.feedback = markFeedback.value;
    closeMarkModal();
    fetchQuizAttempts();
  } catch (e) { console.error(e); alert('Failed to submit mark'); }
}
</script>

<style scoped>
:root {
  --bg: #0b0f10;
  --card: rgba(255,255,255,0.04);
  --muted: #98a7a0;
  --accent: #00ff88;
  --glass: rgba(255,255,255,0.03);
  --danger: #ff5c5c;
  --warn: #ffb547;
  --radius: 12px;
  --shadow: 0 8px 24px rgba(2,6,8,0.6);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

.quiz-page {
  min-height:100vh;
  background: linear-gradient(180deg,#071017 0%, #071c1a 60%);
  color: #eaf6ee;
  padding: 22px;
}

/* topbar */
.topbar {
  display:flex;
  justify-content:space-between;
  gap:18px;
  align-items:center;
  padding:14px;
  margin-bottom:20px;
  background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-radius: 14px;
  box-shadow: var(--shadow);
  border: 1px solid rgba(255,255,255,0.03);
}
.brand-row { display:flex; gap:12px; align-items:center; }
.logo { display:flex; align-items:center; justify-content:center; }
.title h1 { margin:0; font-size:18px; letter-spacing:0.2px; }
.subtitle { margin:0; font-size:12px; color:var(--muted); }

/* controls */
.controls { display:flex; gap:12px; align-items:center; }
.search { display:flex; align-items:center; gap:8px; background:var(--glass); padding:8px 12px; border-radius:999px; border:1px solid rgba(255,255,255,0.03); min-width:260px; }
.search svg { width:16px; height:16px; color:var(--muted); }
.search input { background:transparent; border:none; outline:none; color:inherit; font-size:13px; min-width:160px; }
.btn-row { display:flex; gap:8px; align-items:center; }
.btn { display:inline-flex; gap:8px; align-items:center; padding:8px 12px; border-radius:10px; border: none; cursor:pointer; font-weight:600; background:transparent; color:inherit; }
.btn svg { width:16px; height:16px; }
.btn.primary { background: linear-gradient(90deg,var(--accent), #00cc6a); color:#04241f; box-shadow: 0 6px 18px rgba(0,204,136,0.08); }
.btn.ghost { border:1px solid rgba(255,255,255,0.04); background:transparent; }
.btn.small { padding:6px 8px; font-size:13px; border-radius:8px; }
.btn.danger { background:var(--danger); color:#081010; }
.btn.warn { background:var(--warn); color:#081010; }

/* layout */
.layout { display:grid; grid-template-columns: 1fr 360px; gap:22px; align-items:start; margin-top:14px; }
@media (max-width:1100px) { .layout { grid-template-columns: 1fr; } .right-col { order:2 } .left-col { order:1 } }

/* left cards */
.left-col { display:flex; flex-direction:column; gap:12px; }
.grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap:14px; }
.card { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:12px; padding:16px; border: 1px solid rgba(255,255,255,0.03); box-shadow: 0 6px 20px rgba(2,6,8,0.6); transition: transform .18s ease, box-shadow .18s ease; }
.card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(2,6,8,0.65); }
.card-head { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px; }
.card-title { margin:0; font-size:16px; }
.chip { background: rgba(0,0,0,0.35); padding:6px 10px; border-radius:999px; border:1px solid rgba(255,255,255,0.03); font-size:12px; color:var(--muted); }
.card-desc { color: #cfe9d6; font-size:13px; margin-bottom:12px; min-height:44px; }
.meta { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.author { color:var(--muted); font-size:13px; }
.actions { display:flex; gap:8px; }

/* right column */
.right-col { display:flex; flex-direction:column; gap:14px; }
.panel { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:12px; padding:14px; border: 1px solid rgba(255,255,255,0.03); box-shadow: var(--shadow); }
.panel-head h4 { margin:0; }
.muted { color:var(--muted); font-size:12px; }

/* attempts list */
.attempt-list { display:flex; flex-direction:column; gap:10px; margin-top:10px; }
.attempt { display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px; border-radius:8px; background: rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.02); }
.attempt .student { font-weight:700; }
.attempt .score { background: rgba(0,255,136,0.12); padding:6px 10px; border-radius:8px; color:var(--accent); font-weight:700; }

/* create form */
.create-form { display:flex; flex-direction:column; gap:10px; margin-top:10px; }
.create-form input, .create-form textarea, .create-form select { background: rgba(0,0,0,0.25); border: none; padding:10px; border-radius:8px; color:inherit; outline: none; border:1px solid rgba(255,255,255,0.03); }
.questions { margin-top:8px; display:flex; flex-direction:column; gap:8px; }
.q-row { display:flex; gap:8px; align-items:center; }
.opt-row { display:flex; gap:8px; align-items:center; }

/* modal */
.modal { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background: linear-gradient(rgba(2,6,8,0.6), rgba(2,6,8,0.6)); z-index:50; padding:20px; }
.modal-card { width:820px; max-width:95%; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:14px; padding:18px; box-shadow: 0 28px 80px rgba(2,6,8,0.7); border:1px solid rgba(255,255,255,0.03); color:inherit; }
.modal-card.small { width:560px; }
.modal-head { display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px; }
.close-x { background:transparent; border:none; font-size:18px; cursor:pointer; color:var(--muted); }

/* preview content */
.preview-q { padding:12px; border-radius:10px; background: rgba(0,0,0,0.14); margin-bottom:10px; border:1px solid rgba(255,255,255,0.02); }
.q-top { display:flex; gap:12px; align-items:start; margin-bottom:8px; }
.q-index { width:42px; height:42px; background:linear-gradient(180deg,#071b17,#04221f); display:flex; align-items:center; justify-content:center; border-radius:8px; font-weight:800; color:var(--accent); border:1px solid rgba(0,255,136,0.06); }
.q-text { font-weight:700; }
.preview-opts { display:flex; flex-direction:column; gap:8px; margin-top:6px; }
.preview-opt { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px; background: rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.02); }
.preview-opt.correct { background: linear-gradient(90deg, rgba(0,255,136,0.06), rgba(0,255,136,0.02)); border-color: rgba(0,255,136,0.12); color: #bfffc6; font-weight:700; }
.bullet { color:var(--muted); margin-right:6px; }
.badge { margin-left:auto; background: rgba(255,255,255,0.02); padding:4px 8px; border-radius:999px; font-size:12px; color:var(--muted); }

/* small utilities */
.loading { color:var(--muted); padding:10px; }
.empty { color:#ffdfdf; padding:12px; background: rgba(255,255,255,0.02); border-radius:10px; text-align:center; }
.form-actions { display:flex; justify-content:space-between; gap:8px; margin-top:12px; }
.small { font-size:13px; padding:6px 8px; border-radius:8px; }
.danger { background:var(--danger); color:#fff; }

/* responsive adjustments */
@media (max-width:600px) {
  .controls { flex-direction:column; align-items:flex-start; gap:10px; }
  .search { min-width:160px; }
  .btn-row { width:100%; justify-content:space-between; }
}
</style>
