<template>
  <div class="agent-page">
    <header class="header">
      <h1>🎓 Meet Your <span class="highlight">Prodemy Agent</span></h1>
      <p class="subtitle">
        Your personal study buddy. Ask questions, get tips, and make learning easier.
      </p>
    </header>

    <div class="chat-container">
      <!-- Chat Messages -->
      <div class="chat-box">
        <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.sender]"
        >
          <div class="bubble">{{ msg.text }}</div>
        </div>
      </div>

      <!-- Input Field -->
      <div class="input-area">
        <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type your question here..."
        />
        <button @click="sendMessage" :disabled="!userInput.trim()">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userInput = ref('')
const messages = ref([
  { sender: 'agent', text: 'Hi there! How can I help you with your studies today?' }
])

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  const question = userInput.value
  messages.value.push({ sender: 'user', text: question })
  userInput.value = ''

  messages.value.push({ sender: 'agent', text: 'I’m working on your answer… 📚' })

  try {
    const response = await fetch('http://localhost:8080/api/chat/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question })
    })

    const data = await response.json()

    // Replace "thinking" with AI answer
    messages.value.pop()
    messages.value.push({ sender: 'agent', text: data.reply })
  } catch (err) {
    messages.value.pop()
    messages.value.push({ sender: 'agent', text: '❌ Something went wrong. Please try again.' })
    console.error(err)


  }
}
</script>


<style scoped>
.agent-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  color: #1e1e1e;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.highlight {
  color: limegreen;
}

.subtitle {
  color: #555;
  font-size: 1rem;
}

.chat-container {
  background: rgba(31, 31, 31, 0.4);
  backdrop-filter: blur(60px);
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 600px;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  display: flex;
}

.message.agent {
  justify-content: flex-start;
}

.message.user {
  justify-content: flex-end;
}

.bubble {
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 70%;
  font-size: 0.95rem;
  line-height: 1.4;
}

.message.agent .bubble {
  background-color: #e0f2fe;
  color: #1e40af;
}

.message.user .bubble {
  background-color: #2563eb;
  color: white;
}

.input-area {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.input-area input {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  outline: none;
  font-size: 0.95rem;
}

.input-area input:focus {
  border-color: #2563eb;
}

.input-area button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.input-area button:hover {
  background-color: #1e40af;
}

.input-area button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>
