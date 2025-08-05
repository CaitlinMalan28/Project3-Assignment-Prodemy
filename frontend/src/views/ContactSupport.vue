<template>
  <div class="contact-support">
    <h1>Contact Support</h1>
    <form @submit.prevent="handleSubmit">
      <input type="text" v-model="firstName" placeholder="Your Name" />
      <input type="email" v-model="email" placeholder="Your Email" />
      <textarea v-model="message" placeholder="How can we help?" rows="5"></textarea>
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
.contact-support {
  color: white;
  padding: 20px;
  max-width: 600px;
  margin: auto;
}
input, textarea, button {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  background: #2a2a2a;
  color: white;
  border: none;
  border-radius: 4px;
}
button {
  background-color: #00ff88;
  color: #121212;
  cursor: pointer;
}
</style>
