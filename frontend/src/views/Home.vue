<template>
  <div class="home">
    <section class="hero">
      <h1>Welcome to <span class="brand">Prodemy</span></h1>
      <p>Your space to grow, learn, and build skills that actually matter.</p>
      <router-link to="/signup" class="cta">Get Started</router-link>
    </section>

    <section class="intro">
      <p>
        You don’t need more motivation — you need structure. Prodemy combines focused learning with practical tools
        that help you stay consistent. Whether you're studying part-time, coding after hours, or juggling work and class —
        we've built this for you.
      </p>

      <p>
        Here you’ll find courses built for momentum, not confusion. A community that helps, not distracts.
        And projects that prepare you for the real world — not just final exams.
      </p>

      <p>
        This isn’t just another platform. This is where progress becomes a habit.
      </p>
    </section>

    <section class="features">
      <div class="feature-card">
        <h2>📚 Courses</h2>
        <p>Curated paths in productivity, web development, Python, and more — built with clarity and purpose.</p>
      </div>
      <div class="feature-card">
        <h2>👥 Community</h2>
        <p>Get support, share ideas, and grow with other students and developers walking the same road.</p>
      </div>
      <div class="feature-card">
        <h2>🚀 Projects</h2>
        <p>Build actual projects that help you learn faster and showcase your skills — not just theory.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
// No logic needed yet
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  color: white;
}

.hero {
  text-align: center;
  max-width: 800px;
  margin-bottom: 50px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.hero .brand {
  color: #00ff88;
}

.hero p {
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 20px;
}

.cta {
  padding: 10px 20px;
  background-color: #00ff88;
  color: #121212;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}

.cta:hover {
  background-color: #00cc66;
}

.intro {
  max-width: 800px;
  margin-bottom: 60px;
  font-size: 1.1rem;
  color: #ccc;
  line-height: 1.8;
  text-align: left;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  max-width: 1000px;
  width: 100%;
}

.feature-card {
  background-color: #1e1e1e;
  border: 1px solid #00ff88;
  border-radius: 8px;
  padding: 20px;
  width: 280px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px #00ff8855;
}
</style>
