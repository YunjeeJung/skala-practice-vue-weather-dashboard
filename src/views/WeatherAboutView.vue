<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section>
    <h2>ℹ️ 서비스 소개</h2>

    <p>이 앱은 Vue 3와 Vue Router로 만든 지역별 날씨 관측 대시보드입니다.</p>

    <ul>
      <li>도시 이름 검색</li>
      <li>도시별 기온과 날씨 상태 확인</li>
      <li>동적 주소를 이용한 상세 날씨 확인</li>
    </ul>

    <RouterLink to="/"> 대시보드 홈으로 이동 </RouterLink>
  </section>
</template>
