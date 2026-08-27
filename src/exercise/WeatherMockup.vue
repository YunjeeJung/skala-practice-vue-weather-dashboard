<script setup>
import { ref } from 'vue'

// 2일차 과제 - 가상 백엔드 데이터 배열 (v-for 및 :key 실습)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  //나만의 데이터
  { id: 'city_04', name: '대전', temp: 25, status: '흐림' },
])

//검색어 및 알림창 제어용 데이터 (v-model 한글 처리 및 이벤트 실습)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요')

//알림 대행 함수
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status} 상태입니다.]`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <h2>🌤️ 날씨 Mockup</h2>

    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <!-- input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력" / -->
      <input
        type="text"
        v-model="searchQuery"
        @input="searchQuery = $event.target.value"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!---div말고 article 사용 가능하다-->
      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button class="detail-button" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  max-width: 700px;
  padding: 20px;
  margin: 0 auto;
}

.search-box,
.list-box {
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
}

.search-box input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.weather-card {
  position: relative;
  padding: 14px;
  margin-bottom: 10px;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  cursor: pointer;
}

.weather-card:hover {
  background-color: #f8f9fa;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
}

.hot {
  background-color: #ff7675;
}

.cool {
  background-color: #74b9ff;
}

.detail-button {
  float: right;
}

.status-bar {
  padding: 12px;
  text-align: center;
  background-color: #e8f5e9;
  border-radius: 6px;
}
</style>
