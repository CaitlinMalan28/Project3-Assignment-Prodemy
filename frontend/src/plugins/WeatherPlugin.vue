<template>
  <div>
    <h3>🌤 Weather</h3>
    <p v-if="weather">{{ weather }}</p>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const weather = ref(null)

onMounted(async () => {
  const res = await fetch('https://wttr.in/Cape Town?format=3')
  weather.value = await res.text()
})
</script>
