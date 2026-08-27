<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/weather/UnitToggler.vue'
</script>

<template>
  <div class="app-wrapper">
    <header class="app-header">
      <h1>🌦️ 실시간 지역 날씨 대시보드</h1>

      <nav class="navigation-bar">
        <div class="navigation-links">
          <RouterLink to="/"> 🌦️ 날씨 대시보드 </RouterLink>

          <RouterLink to="/about"> ℹ️ 서비스 소개 </RouterLink>

          <RouterLink to="/tips"> 💡 날씨 생활 팁 </RouterLink>
        </div>

        <UnitToggler />
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-wrapper {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.app-header h1 {
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #dfe6e9;
}

.navigation-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 8px;
}

.navigation-links {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.navigation-links a {
  color: #636e72;
  text-decoration: none;
}

.navigation-links a:hover {
  color: #0984e3;
}

.navigation-links a.router-link-active {
  color: #0984e3;
  font-weight: bold;
  border-bottom: 2px solid #0984e3;
}

.main-content {
  width: 100%;
}
</style>
