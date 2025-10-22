<template>
  <div>
    <h3>🕒 Clock</h3>
    <p class="clock">{{ time }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref(new Date().toLocaleTimeString())

let timer
onMounted(() => {
  timer = setInterval(() => {
    time.value = new Date().toLocaleTimeString()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.clock {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff88;
}
</style>
