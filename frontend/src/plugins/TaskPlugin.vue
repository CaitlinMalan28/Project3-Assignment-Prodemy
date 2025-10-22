<template>
  <div>
    <h3>✅ Tasks</h3>
    <ul>
      <li v-for="(task, index) in tasks" :key="index" class="task-item">
        <input type="checkbox" v-model="task.done" />
        <span :class="{ done: task.done }">{{ task.text }}</span>
      </li>
    </ul>
    <div class="task-input">
      <input v-model="newTask" placeholder="Add task..." @keyup.enter="addTask" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tasks = ref([{ text: 'study for least 3 hours', done: false }])
const newTask = ref('')

function addTask() {
  if (newTask.value.trim()) {
    tasks.value.push({ text: newTask.value, done: false })
    newTask.value = ''
  }
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}
.task-item span.done {
  text-decoration: line-through;
  color: #aaa;
}
.task-input input {
  width: 100%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #00ff88;
  background: #2a2a2a;
  color: white;
}
</style>
