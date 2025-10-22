<template>
  <div>
    <h3>🔗 Quick Links</h3>
    <ul class="links">
      <li v-for="(link, index) in links" :key="index">
        <a :href="link.url" target="_blank">{{ link.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const links = [
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Courses', url: '/courses' },
  { name: 'Profile', url: '/profile' },
  { name: 'Support', url: '/support' }

]
</script>

<style scoped>
.links li {
  margin-bottom: 6px;
}
.links a {
  color: #00ff88;
  text-decoration: none;
}
.links a:hover {
  text-decoration: underline;
}
</style>
