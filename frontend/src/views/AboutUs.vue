<template>
  <div class="about">
    <h1>About <span class="brand">Prodemy</span></h1>

    <p class="intro">
      Prodemy didn’t start in a boardroom. It started in a dorm room, where students were overwhelmed by theory-heavy courses that didn’t translate to real skills.
      Our founder, who was tutoring classmates while juggling his own ICT studies, noticed something simple but important: people weren’t struggling because they were lazy — they just didn’t have the right structure or support.
    </p>

    <p class="intro">
      So Prodemy was built from the ground up to be practical. Focused. Real. It’s for students balancing jobs and deadlines.
      For developers tired of tutorials that go nowhere. And for anyone who wants to grow without wasting time.
    </p>

    <p class="intro">
      We combine productivity frameworks with hands-on tech learning to give you momentum — not just certificates.
      This platform is built for progress you can feel.
    </p>

    <div class="cards">
      <div class="card">
        <h2>🌱 Our Mission</h2>
        <p>
          To help people take control of their growth with actionable skills and clear learning paths — built for real life, not textbooks.
        </p>
      </div>

      <div class="card">
        <h2>💡 Our Vision</h2>
        <p>
          A world where learning is practical, focused, and built around you — not hype. Where anyone can gain momentum, regardless of background.
        </p>
      </div>

      <div class="card">
        <h2>🤝 Our Values</h2>
        <p>
          Clarity over noise. Community over competition. Consistent effort over quick wins. And always — learners first.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// No logic needed here for now
</script>

<style scoped>
.about {
  max-width: 1000px;
  margin: 60px auto;
  padding: 20px;
  color: white;
  text-align: center;
}

.brand {
  color: #00ff88;
}

.intro {
  font-size: 1.1rem;
  color: #ccc;
  margin: 20px auto;
  max-width: 800px;
  line-height: 1.8;
  text-align: left;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  margin-top: 40px;
}

.card {
  background-color: #1e1e1e;
  border: 1px solid #00ff88;
  border-radius: 10px;
  padding: 24px;
  width: 300px;
  text-align: left;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 0 15px #00ff8877;
}

.card h2 {
  font-size: 1.3rem;
  color: #ffffff;
  margin-bottom: 10px;
}

.card p {
  font-size: 1rem;
  color: #ccc;
  line-height: 1.5;
}
</style>
