<template>
  <div
      class="layout"
      :style="backgroundStyle"
  >
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
import bgImage from '@/assets/background.jpg'

const backgroundStyle = {
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  color: 'white'
}
</script>

<style scoped>
main {
  padding: 20px;
}
</style>
