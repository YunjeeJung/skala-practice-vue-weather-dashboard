<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section>
    <h2>💡 날씨별 생활 팁</h2>

    <ul>
      <li>비가 오면 우산을 준비하세요.</li>
      <li>기온이 높으면 물을 자주 마시세요.</li>
      <li>바람이 강하면 얇은 겉옷을 준비하세요.</li>
    </ul>

    <RouterLink to="/"> 날씨 대시보드로 돌아가기 </RouterLink>
  </section>
</template>
