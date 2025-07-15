<template>
  <div class="lesson-player">
    <h1>{{ lesson.title }}</h1>

    <div class="video-wrapper">
      <iframe
          :src="videoUrl"
          frameborder="0"
          allowfullscreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>

    <p>{{ lesson.description }}</p>
  </div>
</template>

<script setup>
const lesson = {
  title: 'Understanding Coding',
  originalUrl: 'https://www.youtube.com/watch?v=RzjWJHwFL-E',
  description: 'What is coding.',
  videoId: 'RzjWJHwFL-E'
}

const videoUrl = `https://www.youtube.com/embed/${lesson.videoId}`
</script>

<style scoped>
.lesson-player {
  color: white;
  padding: 20px;
  text-align: center;
}

.video-wrapper {
  position: relative;
  padding-bottom: 26.25%;
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 0 20px #00ff8844;
  margin: 20px auto;
  max-width: 900px;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
