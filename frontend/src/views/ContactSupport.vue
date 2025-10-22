<template>
  <div class="contact-card">
    <h2>Contact Support</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <label for="name">Your Name</label>
      <input
          id="name"
          type="text"
          v-model="firstName"
          placeholder="Your Name"
          required
      />

      <label for="email">Your Email</label>
      <input
          id="email"
          type="email"
          v-model="email"
          placeholder="Your Email"
          required
      />

      <label for="message">Message</label>
      <textarea
          id="message"
          v-model="message"
          placeholder="How can we help?"
          rows="5"
          required
      ></textarea>

      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const firstName = ref('')
const email = ref('')
const message = ref('')

const handleSubmit = async () => {
  try {
    const payload = {
      firstName: firstName.value,
      email: email.value,
      message: message.value,
    }

    await axios.post('http://localhost:8080/api/contact-support', payload)

    alert('Message sent successfully!')

    firstName.value = ''
    email.value = ''
    message.value = ''
  } catch (error) {
    console.error('Submission error:', error)
    alert('Error: ' + error.message)
  }
}
</script>

<style scoped>
.contact-card {
  background: rgba(31, 31, 31, 0.4); /* semi-transparent dark layer */
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  margin: 50px auto;
  color: #fff;
  backdrop-filter: blur(60px); /* frosted-glass effect */
  border: 1px solid rgba(255, 255, 255, 0.15); /* soft translucent border */
  transition: transform 0.2s, background 0.3s;
}


.contact-card:hover {
  transform: translateY(-3px);
}

.contact-card h2 {
  text-align: center;
  color: #00ff88;
  margin-bottom: 30px;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-size: 14px;
  color: #aaa;
}

input,
textarea {
  padding: 12px 14px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid #333;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 14px;
  transition: border 0.3s, box-shadow 0.3s;
}

input:focus,
textarea:focus {
  border-color: #00ff88;
  outline: none;
  box-shadow: 0 0 6px rgba(0, 255, 136, 0.5);
}

button {
  padding: 14px;
  border-radius: 12px;
  border: none;
  background-color: #00ff88;
  color: #121212;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

button:hover {
  background-color: #00cc66;
  transform: translateY(-2px);
}
</style>
