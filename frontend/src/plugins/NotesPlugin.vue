<template>
  <div>
    <h3>📝 Notes</h3>
    <textarea
        v-model="note"
        placeholder="Write a quick note..."
        class="note-area"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const note = ref('')
</script>

<style scoped>
.note-area {
  width: 100%;
  height: 80px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #00ff88;
  background: #2a2a2a;
  color: white;
}
</style>
