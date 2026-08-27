<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found">
    <div class="icon">🌞❓</div>

    <h2>페이지를 찾을 수 없습니다.</h2>

    <p>요청하신 주소가 존재하지 않거나 아직 개발되지 않았습니다.</p>

    <RouterLink to="/"> 날씨 메인으로 이동 </RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  padding: 60px 20px;
  text-align: center;
}

.icon {
  font-size: 70px;
}
</style>
