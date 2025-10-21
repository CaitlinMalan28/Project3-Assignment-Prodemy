<template>
  <div class="layout" :style="backgroundStyle">
    <Header />

    <div class="app-body">
      <!-- Main Content -->
      <main class="main-content">
        <router-view />
      </main>

      <!-- Plugin Panel -->
      <aside class="plugin-panel">
        <h2 class="plugin-title">✨ Tools</h2>
        <component
            v-for="(plugin, index) in activePlugins"
            :is="plugin.component"
            :key="index"
            class="plugin-card"
        />
      </aside>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
import bgImage from '@/assets/Background2.jpg'

// Import Plugins
import WeatherPlugin from '@/plugins/WeatherPlugin.vue'
import NotesPlugin from '@/plugins/NotesPlugin.vue'
import TaskPlugin from '@/plugins/TaskPlugin.vue'
import ClockPlugin from '@/plugins/ClockPlugin.vue'

const backgroundStyle = {
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  color: 'white'
}

const activePlugins = [
  { name: 'Weather', component: WeatherPlugin },
  { name: 'Notes', component: NotesPlugin },
  { name: 'Tasks', component: TaskPlugin },
  { name: 'Clock', component: ClockPlugin },
]
</script>

<style scoped>
.app-body {
  display: flex;
  min-height: calc(100vh - 120px); /* minus header+footer */
}

.main-content {
  flex: 1;
  padding: 20px;
}

.plugin-panel {
  width: 280px;
  background: rgba(31, 31, 31, 0.4);
  backdrop-filter: blur(60px);
  border-left: 1px solid #00ff88;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 16px; /* rounded corners */
  overflow: hidden; /* keeps inner content aligned with the curve */
}


.plugin-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #00ff88;
  margin-bottom: 10px;
}

.plugin-card {
  background: rgba(31, 31, 31, 0.4);
  backdrop-filter: blur(60px);
  border: 1px solid #00ff88;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 0 10px #00ff8855;
}
</style>
